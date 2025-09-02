import { type DashboardStats } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Car } from "lucide-react";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

      
    </div>
  );
}
