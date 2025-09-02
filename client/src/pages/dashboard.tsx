import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type WazeApiResponse } from "@shared/schema";
import DashboardHeader from "@/components/dashboard-header";
import DashboardStats from "@/components/dashboard-stats";
import IncidentsList from "@/components/incidents-list";
import SystemStatus from "@/components/system-status";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [countdown, setCountdown] = useState(15);
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useQuery<WazeApiResponse>({
    queryKey: ["/api/incidents"],
    refetchInterval: 15000, // 15 seconds
    refetchIntervalInBackground: true,
  });

  // Countdown timer for next refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 1 ? prev - 1 : 15);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset countdown when data is refetched
  useEffect(() => {
    if (data) {
      setCountdown(15);
    }
  }, [data]);

  const handleManualRefresh = () => {
    refetch();
    setCountdown(15);
  };

  const accidents = data?.incidents?.filter(i => i.type === 'ACCIDENT').sort((a, b) => 
    new Date(b.reportedTime).getTime() - new Date(a.reportedTime).getTime()
  ) || [];
  const shoulderIncidents = data?.incidents?.filter(i => i.type === 'SHOULDER').sort((a, b) => 
    new Date(b.reportedTime).getTime() - new Date(a.reportedTime).getTime()
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-foreground font-medium">Loading incidents...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border-destructive/20 bg-destructive/5 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <h4 className="font-medium text-destructive">Connection Error</h4>
                  <p className="text-sm text-destructive/80">
                    Unable to fetch data from Waze API. {error instanceof Error ? error.message : 'Unknown error'}
                  </p>
                  <Button 
                    onClick={handleManualRefresh} 
                    className="mt-2" 
                    size="sm"
                    data-testid="button-retry"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const hasIncidents = accidents.length > 0 || shoulderIncidents.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {data?.stats && (
          <DashboardStats 
            stats={data.stats}
            countdown={countdown}
            isRefreshing={isRefetching}
          />
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Live Incidents</h2>
            <Button 
              onClick={handleManualRefresh}
              variant="outline"
              size="sm"
              disabled={isRefetching}
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh Now
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Auto-refresh:</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">{countdown}s</span>
            </div>
          </div>
        </div>

        {!hasIncidents ? (
          <Card className="p-12 text-center">
            <CardContent>
              <div className="max-w-sm mx-auto">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">All Clear!</h3>
                <p className="text-muted-foreground">No accidents or shoulder incidents reported in the Warsaw area.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <IncidentsList 
            accidents={accidents}
            shoulderIncidents={shoulderIncidents}
          />
        )}

        <SystemStatus apiStatus={data?.stats.apiStatus || 'Offline'} />
      </main>
    </div>
  );
}
