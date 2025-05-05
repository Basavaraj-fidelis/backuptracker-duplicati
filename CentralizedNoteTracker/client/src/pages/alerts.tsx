import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, formatDistance } from "date-fns";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
    deviceType: string;
  };
}

export default function Alerts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      const res = await apiRequest("PATCH", `/api/alerts/${alertId}/read`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent-alerts'] });
      toast({
        title: "Alert marked as read",
        description: "The alert has been marked as read successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Operation failed",
        description: "Could not mark the alert as read. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      return dateTimeStr;
    }
  };

  const formatTimeAgo = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMarkAsRead = (alertId: number) => {
    markAsReadMutation.mutate(alertId);
  };

  const filteredAlerts = alerts
    ? filterType === "all"
      ? alerts
      : filterType === "unread"
        ? alerts.filter(alert => !alert.isRead)
        : alerts.filter(alert => alert.severity === filterType)
    : [];

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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block absolute md:relative z-10 h-full md:h-auto`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-auto bg-neutral-50 p-4 md:p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">Alerts</h1>
              <p className="text-neutral-500 mt-1">System notifications and backup alerts</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <div className="flex rounded-md shadow-sm">
                <Button 
                  variant={filterType === "all" ? "default" : "outline"} 
                  className="rounded-l-md rounded-r-none"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button 
                  variant={filterType === "unread" ? "default" : "outline"} 
                  className="rounded-none border-l-0 border-r-0"
                  onClick={() => setFilterType("unread")}
                >
                  Unread
                </Button>
                <Button 
                  variant={filterType === "error" ? "default" : "outline"} 
                  className="rounded-none border-r-0"
                  onClick={() => setFilterType("error")}
                >
                  Errors
                </Button>
                <Button 
                  variant={filterType === "warning" ? "default" : "outline"} 
                  className="rounded-r-md rounded-l-none"
                  onClick={() => setFilterType("warning")}
                >
                  Warnings
                </Button>
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <CardHeader className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
              <CardTitle className="text-lg font-semibold text-neutral-800">
                {filterType === "all" 
                  ? "All Alerts" 
                  : filterType === "unread" 
                    ? "Unread Alerts" 
                    : filterType === "error" 
                      ? "Error Alerts" 
                      : "Warning Alerts"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-xs text-neutral-500">Loading alerts...</p>
                  </div>
                </div>
              ) : filteredAlerts.length > 0 ? (
                <ul className="divide-y divide-neutral-200">
                  {filteredAlerts.map((alert) => (
                    <li 
                      key={alert.id} 
                      className={`px-6 py-4 hover:bg-neutral-50 ${!alert.isRead ? 'bg-primary-light/5' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${getAlertIconClass(alert.severity)}`}>
                            <i className={`${getAlertIcon(alert.severity)} text-xl`}></i>
                          </span>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!alert.isRead ? 'text-neutral-900 font-semibold' : 'text-neutral-700'}`}>
                              {alert.title}
                            </p>
                            <p className="text-xs text-neutral-500">{formatTimeAgo(alert.time)}</p>
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">{alert.message}</p>
                          
                          {alert.device && (
                            <div className="mt-2 text-xs text-neutral-500 flex items-center">
                              <i className={`${alert.device.deviceType === 'server' ? 'ri-server-line' : 'ri-computer-line'} mr-1`}></i>
                              <span>{alert.device.hostname} ({alert.device.ip})</span>
                            </div>
                          )}

                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-xs text-neutral-500">{formatDateTime(alert.time)}</p>
                            {!alert.isRead && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-8"
                                onClick={() => handleMarkAsRead(alert.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center text-neutral-500">
                  <p>No alerts found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}