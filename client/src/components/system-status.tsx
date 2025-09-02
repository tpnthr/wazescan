import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SystemStatusProps {
  apiStatus: string;
}

export default function SystemStatus({ apiStatus }: SystemStatusProps) {
  return (
    <Card className="mt-8 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Endpoint</span>
              <Badge variant={apiStatus === 'Online' ? 'default' : 'destructive'} className="bg-green-100 text-green-800">
                {apiStatus === 'Online' ? 'Healthy' : 'Error'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground break-all">waze.com/live-map/api/georss</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Coverage Area</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">Extended Warsaw</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              52.1397°N - 52.3197°N<br/>
              20.8662°E - 21.1582°E<br/>
              <span className="text-primary">4 API zones</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Freshness</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">Real-time</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Updated every 15 seconds</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
