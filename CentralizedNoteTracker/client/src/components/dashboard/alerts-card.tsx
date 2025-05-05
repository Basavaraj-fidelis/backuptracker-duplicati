import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Alert {
  id: number;
  deviceId?: number;
  title: string;
  message: string;
  severity: string;
  time: string;
  isRead: boolean;
  device?: {
    hostname: string;
    ip: string;
  };
}

export function AlertsCard() {
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/recent-alerts'],
  });

  const formatTimeAgo = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return "ri-error-warning-line";
      case 'warning':
        return "ri-alert-line";
      default:
        return "ri-information-line";
    }
  };

  const getAlertIconClass = (severity: string) => {
    switch (severity) {
      case 'error':
        return "bg-error-light/20 text-error";
      case 'warning':
        return "bg-warning-light/20 text-warning";
      default:
        return "bg-neutral-200 text-neutral-700";
    }
  };

  return (
    <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="border-b border-neutral-200 px-4 py-3 bg-neutral-50 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-neutral-800">Recent Alerts</CardTitle>
        <Button 
          variant="link" 
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View All
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-xs text-neutral-500">Loading alerts...</p>
            </div>
          </div>
        ) : alerts && alerts.length > 0 ? (
          <ul className="divide-y divide-neutral-200">
            {alerts.map((alert) => (
              <li key={alert.id} className="px-4 py-3 hover:bg-neutral-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${getAlertIconClass(alert.severity)}`}>
                      <i className={`${getAlertIcon(alert.severity)} text-lg`}></i>
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-900">{alert.title}</p>
                      <p className="text-xs text-neutral-500">{formatTimeAgo(alert.time)}</p>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">{alert.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center text-neutral-500">
            <p>No recent alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
