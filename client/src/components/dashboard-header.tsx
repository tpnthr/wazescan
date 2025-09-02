import { formatDistanceToNow, parseISO } from "date-fns";

interface DashboardHeaderProps {
  lastUpdated: string;
  isConnected: boolean;
}

export default function DashboardHeader({ lastUpdated, isConnected }: DashboardHeaderProps) {
  const formatLastUpdated = (timestamp: string) => {
    if (timestamp === 'Never' || timestamp === 'Loading...' || timestamp === 'Error occurred') {
      return timestamp;
    }
    
    try {
      return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Waze Incidents Dashboard</h1>
              <p className="text-sm text-muted-foreground">Warsaw Area Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2" data-testid="connection-status">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">{isConnected ? 'Live' : 'Offline'}</span>
            </div>
            <div className="text-sm text-muted-foreground" data-testid="text-last-updated">
              Last updated: <span>{formatLastUpdated(lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
