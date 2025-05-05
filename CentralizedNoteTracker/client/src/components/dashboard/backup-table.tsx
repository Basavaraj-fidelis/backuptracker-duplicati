import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistance } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BackupTableProps {
  filters: {
    status: string;
    dateRange: string;
    deviceType: string;
  };
}

interface BackupReport {
  id: number;
  deviceId: number;
  status: string;
  time: string;
  size: string;
  device?: {
    id: number;
    hostname: string;
    ip: string;
    deviceType: string;
  };
}

export function BackupTable({ filters }: BackupTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { data: backupReports, isLoading } = useQuery<BackupReport[]>({
    queryKey: ['/api/latest-backups'],
  });

  const [filteredReports, setFilteredReports] = useState<BackupReport[]>([]);

  useEffect(() => {
    if (!backupReports) return;

    let reports = [...backupReports];

    // Apply filters
    if (filters.status !== 'all') {
      reports = reports.filter(report => report.status === filters.status);
    }

    if (filters.deviceType !== 'all') {
      reports = reports.filter(report => report.device?.deviceType === filters.deviceType);
    }

    setFilteredReports(reports);
    setCurrentPage(1); // Reset to first page when filters change
  }, [backupReports, filters]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((filteredReports?.length || 0) / itemsPerPage);

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

  const getStatusClass = (timeStr: string) => {
    try {
      const backupTime = new Date(timeStr).getTime();
      const now = new Date().getTime();
      const hoursDiff = (now - backupTime) / (1000 * 60 * 60);

      if (hoursDiff < 24) return "text-success";
      if (hoursDiff < 48) return "text-warning";
      return "text-error";
    } catch (error) {
      return "text-neutral-500";
    }
  };

  const columns = [
    {
      key: "device",
      title: "Device Name",
      render: (report: BackupReport) => (
        <div className="flex items-center">
          <i className={`${report.device?.deviceType === 'server' ? 'ri-server-line' : 'ri-computer-line'} text-lg text-neutral-400 mr-2`}></i>
          <div>
            <div className="text-sm font-medium text-neutral-900">{report.device?.hostname}</div>
            <div className="text-xs text-neutral-500">{report.device?.ip}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (report: BackupReport) => <StatusBadge status={report.status as any} />,
    },
    {
      key: "time",
      title: "Last Backup",
      render: (report: BackupReport) => (
        <div>
          <div className="text-sm text-neutral-900">{formatDateTime(report.time)}</div>
          <div className={getStatusClass(report.time)}>
            {formatTimeAgo(report.time)}
          </div>
        </div>
      ),
    },
    {
      key: "size",
      title: "Size",
      render: (report: BackupReport) => (
        <span className="text-sm text-neutral-900">{report.size}</span>
      ),
    },
    {
      key: "trend",
      title: "Trend",
      render: (report: BackupReport) => (
        <div className="flex items-center">
          <span className="text-neutral-500 flex items-center text-xs">
            <i className="ri-line-chart-line mr-1"></i> Stable
          </span>
          <div className="ml-2 w-16 h-6 bg-neutral-100 rounded overflow-hidden">
            <div className="bg-neutral-300 h-full" style={{ width: "70%" }}></div>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (report: BackupReport) => (
        <div>
          <Link href={`/devices/${report.deviceId}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark mr-2">
              <i className="ri-eye-line"></i>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-700">
            <i className="ri-refresh-line"></i>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden mb-6">
      <CardHeader className="border-b border-neutral-200 px-4 py-3 bg-neutral-50 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-neutral-800">Backup Status</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="p-1 text-neutral-500 hover:text-neutral-700">
            <i className="ri-download-2-line"></i>
          </Button>
          <Button variant="ghost" size="icon" className="p-1 text-neutral-500 hover:text-neutral-700">
            <i className="ri-more-2-fill"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          data={currentItems}
          columns={columns}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {filteredReports && filteredReports.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-neutral-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredReports.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredReports.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                  >
                    <span className="sr-only">Previous</span>
                    <i className="ri-arrow-left-s-line text-lg"></i>
                  </Button>
                  
                  {[...Array(totalPages)].map((_, idx) => (
                    <Button
                      key={idx}
                      variant={currentPage === idx + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium ${
                        currentPage === idx + 1
                          ? "bg-primary text-white hover:bg-primary-dark"
                          : "bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                  >
                    <span className="sr-only">Next</span>
                    <i className="ri-arrow-right-s-line text-lg"></i>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
