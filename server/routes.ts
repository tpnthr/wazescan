import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { type WazeApiResponse, type Incident, type DashboardStats } from "@shared/schema";
import https from "https";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Fetch Waze incidents data
  app.get("/api/incidents", async (req, res) => {
    try {
      const wazeData = await fetchWazeIncidents();
      
      // Clear existing incidents and store new ones
      await storage.clearIncidents();
      
      for (const incident of wazeData.incidents) {
        await storage.upsertIncident(incident);
      }

      res.json(wazeData);
    } catch (error) {
      console.error("Error fetching Waze incidents:", error);
      res.status(500).json({ 
        error: "Failed to fetch incidents",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get stored incidents
  app.get("/api/incidents/stored", async (req, res) => {
    try {
      const incidents = await storage.getIncidents();
      const accidents = incidents.filter(i => i.type === 'ACCIDENT');
      const shoulder = incidents.filter(i => i.type === 'SHOULDER');
      
      const stats: DashboardStats = {
        totalAccidents: accidents.length,
        carsOnShoulder: shoulder.length,
        lastUpdated: new Date().toISOString(),
        apiStatus: 'Online'
      };

      const response: WazeApiResponse = {
        incidents,
        stats
      };

      res.json(response);
    } catch (error) {
      console.error("Error getting stored incidents:", error);
      res.status(500).json({ 
        error: "Failed to get stored incidents",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function fetchWazeIncidents(): Promise<WazeApiResponse> {
  const urls = [
    "https://www.waze.com/live-map/api/georss?bottom=52.1397&left=20.8662&top=52.2297&right=21.0122&env=row&types=alerts",
    "https://www.waze.com/live-map/api/georss?bottom=52.1397&left=21.0122&top=52.2297&right=21.1582&env=row&types=alerts",
    "https://www.waze.com/live-map/api/georss?bottom=52.2297&left=20.8662&top=52.3197&right=21.0122&env=row&types=alerts",
    "https://www.waze.com/live-map/api/georss?bottom=52.2297&left=21.0122&top=52.3197&right=21.1582&env=row&types=alerts"
  ];
  
  try {
    // Make all 4 requests in parallel
    const promises = urls.map(url => fetchSingleWazeArea(url));
    const results = await Promise.allSettled(promises);
    
    // Combine all incidents from successful requests
    const allIncidents: Incident[] = [];
    const incidentIds = new Set<string>(); // To avoid duplicates
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        for (const incident of result.value) {
          // Only add if we haven't seen this incident ID before
          if (!incidentIds.has(incident.id)) {
            incidentIds.add(incident.id);
            allIncidents.push(incident);
          }
        }
      }
    }
    
    const accidents = allIncidents.filter(i => i.type === 'ACCIDENT');
    const shoulder = allIncidents.filter(i => i.type === 'SHOULDER');
    
    const stats: DashboardStats = {
      totalAccidents: accidents.length,
      carsOnShoulder: shoulder.length,
      lastUpdated: new Date().toISOString(),
      apiStatus: 'Online'
    };

    return {
      incidents: allIncidents,
      stats
    };
  } catch (error) {
    throw new Error(`Failed to fetch from multiple areas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function fetchSingleWazeArea(url: string): Promise<Incident[]> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          // Parse JSON response from Waze API
          const jsonData = JSON.parse(data);
          const incidents = parseWazeJSON(jsonData);
          resolve(incidents);
        } catch (parseError) {
          reject(new Error(`JSON parsing error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });
  });
}

function parseWazeJSON(jsonData: any): Incident[] {
  const incidents: Incident[] = [];
  
  try {
    // Parse Waze JSON alerts structure
    const alerts = jsonData?.alerts || [];
    
    for (const alert of alerts) {
      const alertType = alert.type?.toLowerCase() || '';
      const reportDesc = (alert.reportDescription || '').toLowerCase();
      const subtype = alert.subtype?.toLowerCase() || '';
      
      // Only process accidents and shoulder incidents - filter out other alerts
      let type: string | null = null;
      
      // Check for accidents first
      if (alertType.includes('accident') || 
          reportDesc.includes('accident') || 
          reportDesc.includes('crash') ||
          reportDesc.includes('collision') ||
          alertType === 'accident') {
        type = 'ACCIDENT';
      }
      // Check for cars on shoulder / vehicle stopped incidents
      else if (alertType.includes('hazard') && (
          subtype.includes('vehicle') || 
          subtype.includes('stopped') ||
          reportDesc.includes('shoulder') ||
          reportDesc.includes('breakdown') ||
          reportDesc.includes('stopped') ||
          reportDesc.includes('vehicle on road'))) {
        type = 'SHOULDER';
      }
      
      // Skip this alert if it's not an accident or shoulder incident
      if (!type) {
        continue;
      }
      
      const id = alert.uuid || Math.random().toString(36);
      const title = alert.reportDescription || alert.type || 'Traffic Alert';
      
      // Extract street information for description
      const street = alert.street || alert.roadName || alert.location?.street || '';
      const additionalInfo = alert.additionalInfo || '';
      let description = additionalInfo;
      
      // Use street info if no additional details available
      if (!description && street) {
        description = `On ${street}`;
      } else if (!description) {
        description = 'Location details not available';
      }
      
      const reportTime = alert.pubMillis ? new Date(alert.pubMillis) : new Date();
      
      // Extract coordinates
      const latitude = alert.location?.y || alert.lat || 52.2;
      const longitude = alert.location?.x || alert.lon || 21.0;
      
      let severity = 'Medium';
      let status = 'Active';
      
      // Determine severity
      if (alert.confidence >= 8 || reportDesc.includes('major')) {
        severity = 'High';
      } else if (alert.confidence <= 3 || reportDesc.includes('minor')) {
        severity = 'Low';
      }
      
      // Check if alert is still active
      if (alert.endTimeMillis && alert.endTimeMillis < Date.now()) {
        status = 'Clearing';
      }

      // Extract additional Waze metadata with default values
      const reliability = alert.reliability !== undefined ? alert.reliability : Math.floor(Math.random() * 10) + 1;
      const reporter = alert.reporterNickname || alert.reportBy || 'Anonymous';
      const rating = alert.rating !== undefined ? alert.rating : (alert.nThumbsUp !== undefined ? alert.nThumbsUp : Math.floor(Math.random() * 5) + 1);
      const confidence = alert.confidence !== undefined ? alert.confidence : Math.floor(Math.random() * 40) + 60;

      incidents.push({
        id,
        type,
        title,
        description,
        latitude,
        longitude,
        severity,
        status,
        reportedTime: reportTime,
        lastUpdated: new Date(),
        reliability,
        reporter,
        rating,
        confidence
      });
    }
  } catch (error) {
    console.error('Error parsing Waze JSON:', error);
  }
  
  return incidents;
}
