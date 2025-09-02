import { type Incident } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock, AlertTriangle, Car, User, Star, TrendingUp, Shield, Map, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IncidentsListProps {
  accidents: Incident[];
  shoulderIncidents: Incident[];
}

export default function IncidentsList({ accidents, shoulderIncidents }: IncidentsListProps) {
  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800';
      case 'Clearing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWazeMapUrl = (lat: number, lng: number) => {
    return `https://www.waze.com/live-map/directions?to=ll.${lat},${lng}`;
  };

  const getWazeAppUrl = (lat: number, lng: number) => {
    return `https://ul.waze.com/ul?ll=${lat},${lng}&navigate=no&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Accidents Column */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">Accidents</h3>
          <Badge variant="destructive" className="bg-destructive/10 text-destructive" data-testid="badge-accident-count">
            {accidents.length}
          </Badge>
        </div>

        {accidents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No accidents reported</p>
            </CardContent>
          </Card>
        ) : (
          accidents.map((accident) => (
            <Card key={accident.id} className="shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-300" data-testid={`card-accident-${accident.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-destructive/10 text-destructive">ACCIDENT</Badge>
                      {accident.severity && (
                        <Badge variant="outline" className={getSeverityColor(accident.severity)}>
                          {accident.severity} Severity
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-foreground mb-1" data-testid={`text-accident-title-${accident.id}`}>
                      {accident.title}
                    </h4>
                    {accident.description && (
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-accident-description-${accident.id}`}>
                        {accident.description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {accident.latitude.toFixed(4)}, {accident.longitude.toFixed(4)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(accident.reportedTime)}
                      </span>
                      {accident.reporter && (
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {accident.reporter}
                        </span>
                      )}
                      <span className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {accident.confidence || 0}% confident
                      </span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {accident.rating || 0} rating
                      </span>
                      <span className="flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Reliability: {accident.reliability || 0}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getWazeMapUrl(accident.latitude, accident.longitude), '_blank')}
                        className="flex items-center gap-1 text-xs"
                        data-testid={`button-map-${accident.id}`}
                      >
                        <Map className="w-3 h-3" />
                        View Map
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getWazeAppUrl(accident.latitude, accident.longitude), '_blank')}
                        className="flex items-center gap-1 text-xs"
                        data-testid={`button-navigate-${accident.id}`}
                      >
                        <Navigation className="w-3 h-3" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="text-xs text-muted-foreground">#{accident.id.slice(-6)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Cars on Shoulder Column */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Car className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Cars on Shoulder</h3>
          <Badge variant="outline" className="bg-warning/10 text-warning" data-testid="badge-shoulder-count">
            {shoulderIncidents.length}
          </Badge>
        </div>

        {shoulderIncidents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No shoulder incidents reported</p>
            </CardContent>
          </Card>
        ) : (
          shoulderIncidents.map((incident) => (
            <Card key={incident.id} className="shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-300" data-testid={`card-shoulder-${incident.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-warning/10 text-warning">SHOULDER</Badge>
                      {incident.status && (
                        <Badge variant="outline" className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-foreground mb-1" data-testid={`text-shoulder-title-${incident.id}`}>
                      {incident.title}
                    </h4>
                    {incident.description && (
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-shoulder-description-${incident.id}`}>
                        {incident.description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(incident.reportedTime)}
                      </span>
                      {incident.reporter && (
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {incident.reporter}
                        </span>
                      )}
                      <span className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {incident.confidence || 0}% confident
                      </span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {incident.rating || 0} rating
                      </span>
                      <span className="flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Reliability: {incident.reliability || 0}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getWazeMapUrl(incident.latitude, incident.longitude), '_blank')}
                        className="flex items-center gap-1 text-xs"
                        data-testid={`button-map-${incident.id}`}
                      >
                        <Map className="w-3 h-3" />
                        View Map
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getWazeAppUrl(incident.latitude, incident.longitude), '_blank')}
                        className="flex items-center gap-1 text-xs"
                        data-testid={`button-navigate-${incident.id}`}
                      >
                        <Navigation className="w-3 h-3" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="text-xs text-muted-foreground">#{incident.id.slice(-6)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
