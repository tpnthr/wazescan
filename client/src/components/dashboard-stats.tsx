import { type DashboardStats } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Car, Clock, Signal } from "lucide-react";

interface DashboardStatsProps {
  stats: DashboardStats;
  countdown: number;
  isRefreshing: boolean;
}

export default function DashboardStatsComponent({ stats, countdown, isRefreshing }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="bg-destructive/10 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Accidents</p>
              <p className="text-2xl font-bold text-foreground" data-testid="stat-total-accidents">
                {stats.totalAccidents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="bg-warning/10 p-3 rounded-lg">
              <Car className="w-6 h-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Cars on Shoulder</p>
              <p className="text-2xl font-bold text-foreground" data-testid="stat-cars-shoulder">
                {stats.carsOnShoulder}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Next Refresh</p>
              <p className="text-2xl font-bold text-foreground" data-testid="stat-countdown">
                {isRefreshing ? 'Now' : `${countdown}s`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stats.apiStatus === 'Online' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Signal className={`w-6 h-6 ${stats.apiStatus === 'Online' ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">API Status</p>
              <p className={`text-lg font-semibold ${stats.apiStatus === 'Online' ? 'text-green-600' : 'text-red-600'}`} data-testid="stat-api-status">
                {stats.apiStatus}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
