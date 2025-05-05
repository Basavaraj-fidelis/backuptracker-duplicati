import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Device {
  id: number;
  hostname: string;
  ip: string;
  deviceType: string;
}

interface BackupReport {
  id: number;
  deviceId: number;
  status: string;
  time: string;
  size: string;
  duration?: number;
  fileCount?: number;
}

export default function DeviceDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [match, params] = useRoute("/devices/:id");
  const deviceId = match ? parseInt(params.id) : null;
  const [trendData, setTrendData] = useState([]);

  const { data: device, isLoading: deviceLoading } = useQuery<Device>({
    queryKey: [`/api/devices/${deviceId}`],
    enabled: !!deviceId,
  });

  const { data: backupReports, isLoading: reportsLoading } = useQuery<BackupReport[]>({
    queryKey: [`/api/devices/${deviceId}/backup-reports`],
    enabled: !!deviceId,
  });

  useEffect(() => {
    if (backupReports && backupReports.length > 0) {
      // Generate trend data from backup reports
      const data = backupReports.slice(0, 10).map(report => ({
        date: format(new Date(report.time), 'MMM dd'),
        size: parseInt(report.size) || 0,
      })).reverse();
      
      setTrendData(data);
    }
  }, [backupReports]);

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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getLatestReport = () => {
    if (!backupReports || backupReports.length === 0) return null;
    return backupReports[0];
  };

  const latestReport = getLatestReport();

  const columns = [
    {
      key: "time",
      title: "Date",
      render: (report: BackupReport) => (
        <span className="text-sm text-neutral-900">{formatDateTime(report.time)}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (report: BackupReport) => <StatusBadge status={report.status as any} />,
    },
    {
      key: "size",
      title: "Size",
      render: (report: BackupReport) => (
        <span className="text-sm text-neutral-900">{report.size}</span>
      ),
    },
    {
      key: "duration",
      title: "Duration",
      render: (report: BackupReport) => (
        <span className="text-sm text-neutral-900">{formatDuration(report.duration)}</span>
      ),
    },
    {
      key: "fileCount",
      title: "Files",
      render: (report: BackupReport) => (
        <span className="text-sm text-neutral-900">
          {report.fileCount ? report.fileCount.toLocaleString() : 'N/A'}
        </span>
      ),
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isLoading = deviceLoading || reportsLoading;

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
          {/* Device Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              {deviceLoading ? (
                <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-neutral-800">
                    Device: {device?.hostname}
                  </h1>
                  <p className="text-neutral-500 mt-1">
                    {device?.deviceType === "server" ? "Server" : "Workstation"} • {device?.ip}
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <Button>
                <i className="ri-refresh-line mr-2"></i>
                Run Backup Now
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-xs text-neutral-500">Loading device details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Device Status Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-neutral-500 mb-1">Status</p>
                  <div className="flex items-center">
                    {latestReport && (
                      <StatusBadge status={latestReport.status as any} />
                    )}
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-neutral-500 mb-1">
                    Last Successful Backup
                  </p>
                  {latestReport ? (
                    <>
                      <p className="text-sm font-semibold">{formatDateTime(latestReport.time)}</p>
                      <p className={`text-xs ${latestReport.status === 'success' ? 'text-success' : 'text-neutral-500'}`}>
                        {formatTimeAgo(latestReport.time)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-500">No backups recorded</p>
                  )}
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-neutral-500 mb-1">
                    Latest Backup Size
                  </p>
                  <p className="text-sm font-semibold">
                    {latestReport ? latestReport.size : 'N/A'}
                  </p>
                  {latestReport && (
                    <p className="text-xs text-neutral-500">
                      Files: {latestReport.fileCount?.toLocaleString() || 'N/A'}
                    </p>
                  )}
                </div>
              </div>

              {/* Backup History */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Backup History</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={backupReports || []}
                    columns={columns}
                    isLoading={reportsLoading}
                  />
                </CardContent>
              </Card>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Backup Size Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="size" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Backup Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Average Speed</span>
                          <span className="text-sm font-medium">45 MB/s</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: "70%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Compression Ratio</span>
                          <span className="text-sm font-medium">1.8:1</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-success rounded-full h-2" style={{ width: "65%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Average Duration</span>
                          <span className="text-sm font-medium">37 minutes</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
