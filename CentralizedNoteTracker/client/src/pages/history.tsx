import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { FilterControls } from "@/components/dashboard/filter-controls";
import { format, formatDistance } from "date-fns";

interface BackupReport {
  id: number;
  deviceId: number;
  status: string;
  time: string;
  size: string;
  duration?: number;
  fileCount?: number;
  device?: {
    id: number;
    hostname: string;
    ip: string;
    deviceType: string;
  };
}

export default function History() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "24h",
    deviceType: "all",
  });

  const { data: backupReports, isLoading } = useQuery<BackupReport[]>({
    queryKey: ['/api/backup-reports'],
  });

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

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

  const columns = [
    {
      key: "device",
      title: "Device",
      render: (report: BackupReport) => (
        <div className="flex items-center">
          <i className={`${report.device?.deviceType === 'server' ? 'ri-server-line' : 'ri-computer-line'} text-lg text-neutral-400 mr-2`}></i>
          <div>
            <div className="text-sm font-medium text-neutral-900">{report.device?.hostname || 'Unknown'}</div>
            <div className="text-xs text-neutral-500">{report.device?.ip || 'N/A'}</div>
          </div>
        </div>
      ),
    },
    {
      key: "time",
      title: "Backup Date",
      render: (report: BackupReport) => (
        <div>
          <div className="text-sm text-neutral-900">{formatDateTime(report.time)}</div>
          <div className="text-xs text-neutral-500">{formatTimeAgo(report.time)}</div>
        </div>
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
    {
      key: "actions",
      title: "Actions",
      render: (report: BackupReport) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
            <i className="ri-eye-line"></i>
          </Button>
          <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-700">
            <i className="ri-download-2-line"></i>
          </Button>
        </div>
      ),
    },
  ];

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
              <h1 className="text-2xl font-bold text-neutral-800">Backup History</h1>
              <p className="text-neutral-500 mt-1">View all backup reports across all devices</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center">
                <i className="ri-calendar-line mr-2"></i>
                Export Reports
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <FilterControls onFilterChange={setFilters} />

          {/* Backup Reports Table */}
          <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <CardHeader className="border-b border-neutral-200 px-6 py-4 bg-neutral-50 flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-neutral-800">Backup Reports</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-sm">
                  <i className="ri-filter-3-line mr-1"></i> Filter
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <i className="ri-sort-desc mr-1"></i> Sort
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                data={backupReports || []}
                columns={columns}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}