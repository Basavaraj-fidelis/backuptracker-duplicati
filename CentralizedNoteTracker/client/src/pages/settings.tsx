import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSaveSettings = () => {
    // In a real app, this would send data to the backend
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
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
              <h1 className="text-2xl font-bold text-neutral-800">Settings</h1>
              <p className="text-neutral-500 mt-1">Configure your backup monitoring system</p>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-neutral-100 p-1 rounded-md border border-neutral-200">
              <TabsTrigger value="general" className="px-4 py-2">General</TabsTrigger>
              <TabsTrigger value="notifications" className="px-4 py-2">Notifications</TabsTrigger>
              <TabsTrigger value="backup" className="px-4 py-2">Backup</TabsTrigger>
              <TabsTrigger value="advanced" className="px-4 py-2">Advanced</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                  <CardTitle className="text-lg font-semibold text-neutral-800">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="system-name">System Name</Label>
                        <Input 
                          id="system-name"
                          placeholder="Backup Monitoring System"
                          defaultValue="Duplicati Backup Monitor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Administrator Email</Label>
                        <Input 
                          id="admin-email"
                          type="email"
                          placeholder="admin@example.com"
                          defaultValue="admin@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="utc">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="utc">UTC</SelectItem>
                              <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                              <SelectItem value="cst">Central Time (US & Canada)</SelectItem>
                              <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                              <SelectItem value="gmt">London (GMT)</SelectItem>
                              <SelectItem value="cet">Central European Time (CET)</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select defaultValue="mdy">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                              <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                              <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                              <SelectItem value="iso">ISO 8601 (YYYY-MM-DD)</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-neutral-200">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">Dark Mode</h3>
                        <p className="text-xs text-neutral-500">Enable dark mode for the interface</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-neutral-200">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">Automatic Updates</h3>
                        <p className="text-xs text-neutral-500">Keep the system updated automatically</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                  <CardTitle className="text-lg font-semibold text-neutral-800">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">Email Notifications</h3>
                        <p className="text-xs text-neutral-500">Receive backup status updates via email</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-neutral-200">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">SMS Alerts</h3>
                        <p className="text-xs text-neutral-500">Get critical alerts via SMS</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-neutral-200">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">Push Notifications</h3>
                        <p className="text-xs text-neutral-500">Browser push notifications for alerts</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-neutral-200">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">Weekly Reports</h3>
                        <p className="text-xs text-neutral-500">Receive weekly summary of backup status</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-neutral-200 pt-4">
                    <h3 className="text-sm font-medium text-neutral-900">Alert Thresholds</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="warning-threshold">Warning Threshold (hours)</Label>
                        <Input 
                          id="warning-threshold"
                          type="number"
                          defaultValue="24"
                        />
                        <p className="text-xs text-neutral-500">Hours after which a backup is marked as warning</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="error-threshold">Error Threshold (hours)</Label>
                        <Input 
                          id="error-threshold"
                          type="number"
                          defaultValue="72"
                        />
                        <p className="text-xs text-neutral-500">Hours after which a backup is marked as error</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Backup Settings */}
            <TabsContent value="backup">
              <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                  <CardTitle className="text-lg font-semibold text-neutral-800">Backup Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="retention-period">Data Retention Period (days)</Label>
                      <Input 
                        id="retention-period"
                        type="number"
                        defaultValue="90"
                      />
                      <p className="text-xs text-neutral-500">Number of days to retain backup history data</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auto-cleanup">Automatic Cleanup</Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                            <SelectItem value="manual">Manual Only</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-neutral-500">How to handle cleanup of old backup reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced">
              <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                  <CardTitle className="text-lg font-semibold text-neutral-800">Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">Enable API Access</h3>
                        <p className="text-xs text-neutral-500">Allow external systems to access the API</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-neutral-200">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">Debug Mode</h3>
                        <p className="text-xs text-neutral-500">Enable additional logging for troubleshooting</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-neutral-200">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">SSL Verification</h3>
                        <p className="text-xs text-neutral-500">Verify SSL certificates for API connections</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200">
                    <Button variant="destructive" className="w-full md:w-auto">
                      Reset All Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </main>
      </div>
    </div>
  );
}