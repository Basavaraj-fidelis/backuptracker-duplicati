import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { format, formatDistance } from "date-fns";

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
}

export default function Devices() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });

  const { data: latestBackupReports } = useQuery<BackupReport[]>({
    queryKey: ['/api/latest-backups'],
  });

  const getLatestBackupForDevice = (deviceId: number) => {
    if (!latestBackupReports) return null;
    return latestBackupReports.find(report => report.deviceId === deviceId);
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
      key: "hostname",
      title: "Device Name",
      render: (device: Device) => (
        <div className="flex items-center">
          <i className={`${device.deviceType === 'server' ? 'ri-server-line' : 'ri-computer-line'} text-lg text-neutral-400 mr-2`}></i>
          <div>
            <div className="text-sm font-medium text-neutral-900">{device.hostname}</div>
            <div className="text-xs text-neutral-500">{device.ip}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      title: "Type",
      render: (device: Device) => (
        <span className="text-sm text-neutral-700">
          {device.deviceType === 'server' ? 'Server' : 'Workstation'}
        </span>
      ),
    },
    {
      key: "status",
      title: "Backup Status",
      render: (device: Device) => {
        const latestBackup = getLatestBackupForDevice(device.id);
        return latestBackup ? (
          <StatusBadge status={latestBackup.status as any} />
        ) : (
          <span className="text-sm text-neutral-500">No backups</span>
        );
      },
    },
    {
      key: "lastBackup",
      title: "Last Backup",
      render: (device: Device) => {
        const latestBackup = getLatestBackupForDevice(device.id);
        return latestBackup ? (
          <div>
            <div className="text-sm text-neutral-700">
              {format(new Date(latestBackup.time), 'MMM dd, yyyy hh:mm a')}
            </div>
            <div className="text-xs text-neutral-500">
              {formatTimeAgo(latestBackup.time)}
            </div>
          </div>
        ) : (
          <span className="text-sm text-neutral-500">Never</span>
        );
      },
    },
    {
      key: "backupSize",
      title: "Backup Size",
      render: (device: Device) => {
        const latestBackup = getLatestBackupForDevice(device.id);
        return (
          <span className="text-sm text-neutral-700">
            {latestBackup ? latestBackup.size : 'N/A'}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (device: Device) => (
        <div className="flex items-center space-x-2">
          <Link href={`/devices/${device.id}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
              <i className="ri-eye-line mr-1"></i> Details
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <i className="ri-refresh-line mr-1"></i> Run Backup
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
              <h1 className="text-2xl font-bold text-neutral-800">Devices</h1>
              <p className="text-neutral-500 mt-1">Manage and monitor all connected devices</p>
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

              <Button className="bg-primary hover:bg-primary-dark text-white">
                <i className="ri-add-line mr-2"></i>
                Add Device
              </Button>
            </div>
          </div>

          {/* Devices Table */}
          <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <CardHeader className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
              <CardTitle className="text-lg font-semibold text-neutral-800">Registered Devices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                data={devices || []}
                columns={columns}
                isLoading={isLoading}
                onRowClick={(device) => navigate(`/devices/${device.id}`)}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}