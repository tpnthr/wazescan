import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const REFRESH_INTERVAL = 15;
  const [refreshIn, setRefreshIn] = useState(REFRESH_INTERVAL);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(prev => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img
              src="https://autowola.com/wp-content/uploads/2025/08/Logo.svg"
              alt="AutoWola logo"
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>
          <div className="text-sm text-muted-foreground">Refresh in: {refreshIn}s</div>
        </div>
      </div>
    </header>
  );
}

