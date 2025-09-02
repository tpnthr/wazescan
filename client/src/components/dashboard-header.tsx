import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  lastUpdated: number;
}

export default function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    setSecondsElapsed(Math.floor((Date.now() - lastUpdated) / 1000));
    const interval = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - lastUpdated) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img
              src="https://autowola.com/wp-content/uploads/2025/08/Logo.svg"
              alt="AutoWola logo"
              className="h-8 w-8"
            />
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            Refreshed {secondsElapsed}s ago
          </span>
        </div>
      </div>
    </header>
  );
}

