import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { StatusCard } from "@/components/dashboard/status-card";
import { FilterControls } from "@/components/dashboard/filter-controls";
import { BackupTable } from "@/components/dashboard/backup-table";
import { AlertsCard } from "@/components/dashboard/alerts-card";
import { TrendsCard } from "@/components/dashboard/trends-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalDevices: number;
  healthyBackups: number;
  warningBackups: number;
  failedBackups: number;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "24h",
    deviceType: "all",
  });
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ['/api/stats'],
  });

  const handleRefreshData = async () => {
    try {
      await refetchStats();
      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh dashboard data.",
        variant: "destructive",
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">Backup Dashboard</h1>
              <p className="text-neutral-500 mt-1">Monitoring all devices and backup status</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search devices..."
                  className="px-4 py-2 border border-neutral-200 rounded-md w-full sm:w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <i className="ri-search-line absolute right-3 top-2.5 text-neutral-400"></i>
              </div>

              <Button className="bg-primary hover:bg-primary-dark text-white" onClick={handleRefreshData}>
                <i className="ri-refresh-line mr-2"></i>
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatusCard
              title="Total Devices"
              value={statsLoading ? "..." : stats?.totalDevices || 0}
              icon="ri-computer-line"
              iconBgColor="bg-primary-light/10"
              iconColor="text-primary"
              footer={
                <span className="text-success flex items-center">
                  <i className="ri-arrow-up-line mr-1"></i> 2 new since last week
                </span>
              }
            />

            <StatusCard
              title="Healthy Backups"
              value={statsLoading ? "..." : stats?.healthyBackups || 0}
              icon="ri-checkbox-circle-line"
              iconBgColor="bg-success-light/10"
              iconColor="text-success"
              valueColor="text-success"
              footer={
                <span className="flex items-center">
                  <i className="ri-information-line mr-1"></i> Last checked: 10 minutes ago
                </span>
              }
            />

            <StatusCard
              title="Warning State"
              value={statsLoading ? "..." : stats?.warningBackups || 0}
              icon="ri-alert-line"
              iconBgColor="bg-warning-light/10"
              iconColor="text-warning"
              valueColor="text-warning"
              footer={
                <span className="text-warning flex items-center">
                  <i className="ri-arrow-up-line mr-1"></i> 1 more than yesterday
                </span>
              }
            />

            <StatusCard
              title="Failed Backups"
              value={statsLoading ? "..." : stats?.failedBackups || 0}
              icon="ri-error-warning-line"
              iconBgColor="bg-error-light/10"
              iconColor="text-error"
              valueColor="text-error"
              footer={
                <span className="text-error flex items-center font-medium">
                  <i className="ri-alarm-warning-line mr-1"></i> Immediate attention required
                </span>
              }
            />
          </div>

          {/* Filter Controls */}
          <FilterControls onFilterChange={setFilters} />

          {/* Devices Backup Status Table */}
          <BackupTable filters={filters} />

          {/* Lower Sections: Recent Alerts and Backup Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsCard />
            <TrendsCard />
          </div>
        </main>
      </div>
    </div>
  );
}
