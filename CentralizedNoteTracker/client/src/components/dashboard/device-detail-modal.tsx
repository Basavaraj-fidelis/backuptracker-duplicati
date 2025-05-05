import { useState, useEffect } from "react";
import { format, formatDistance } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DeviceDetailModalProps {
  deviceId: number | null;
  open: boolean;
  onClose: () => void;
}

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

export function DeviceDetailModal({ deviceId, open, onClose }: DeviceDetailModalProps) {
  const [trendData, setTrendData] = useState([]);

  const { data: device, isLoading: deviceLoading } = useQuery<Device>({
    queryKey: [`/api/devices/${deviceId}`],
    enabled: !!deviceId && open,
  });

  const { data: backupReports, isLoading: reportsLoading } = useQuery<BackupReport[]>({
    queryKey: [`/api/devices/${deviceId}/backup-reports`],
    enabled: !!deviceId && open,
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

  const isLoading = deviceLoading || reportsLoading;

  if (!deviceId) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="bg-neutral-50 border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-neutral-800">
            Device Details: {device?.hostname || "Loading..."}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-xs text-neutral-500">Loading device details...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto p-6 flex-grow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <p className="text-sm font-medium text-neutral-500 mb-1">Status</p>
                <div className="flex items-center">
                  {latestReport && (
                    <StatusBadge status={latestReport.status as any} />
                  )}
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
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

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <p className="text-sm font-medium text-neutral-500 mb-1">
                  Device Information
                </p>
                <p className="text-sm">IP: {device?.ip}</p>
                <p className="text-sm">Type: {device?.deviceType === 'server' ? 'Server' : 'Workstation'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Backup History</h3>
              <DataTable
                data={backupReports || []}
                columns={columns}
                isLoading={reportsLoading}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Backup Size Trend</h3>
                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <div className="w-full h-40">
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
                  <div className="flex justify-between mt-2 text-xs text-neutral-500">
                    {trendData.length > 0 && (
                      <>
                        <span>{trendData[0].date}</span>
                        <span>{trendData[Math.floor(trendData.length / 2)].date}</span>
                        <span>{trendData[trendData.length - 1].date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Backup Performance</h3>
                <div className="bg-white border border-neutral-200 rounded-lg p-4">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Speed</span>
                      <span className="text-sm font-medium">45 MB/s</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: "70%" }}></div>
                    </div>
                  </div>

                  <div className="mb-4">
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
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-neutral-200 px-6 py-4 bg-neutral-50">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button>
            Run Backup Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
