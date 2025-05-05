import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Downloads() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Duplicati agent versions - these would ideally come from an API
  const latestVersion = "2.0.6.3";
  const betaVersion = "canary-2.0.6.101";

  const windowsAgents = [
    {
      name: "Duplicati for Windows (MSI)",
      platform: "Windows",
      version: latestVersion,
      size: "32.4 MB",
      filename: `duplicati-${latestVersion}.msi`,
      icon: "ri-windows-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${latestVersion}/duplicati-${latestVersion}.msi`
    },
    {
      name: "Duplicati for Windows (ZIP)",
      platform: "Windows",
      version: latestVersion,
      size: "28.6 MB",
      filename: `duplicati-${latestVersion}-windows.zip`,
      icon: "ri-windows-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${latestVersion}/duplicati-${latestVersion}-windows.zip`
    }
  ];

  const linuxAgents = [
    {
      name: "Duplicati for Linux (Debian/Ubuntu)",
      platform: "Linux",
      version: latestVersion,
      size: "25.2 MB",
      filename: `duplicati_${latestVersion}-1_all.deb`,
      icon: "ri-ubuntu-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${latestVersion}/duplicati_${latestVersion}-1_all.deb`
    },
    {
      name: "Duplicati for Linux (Fedora/Red Hat)",
      platform: "Linux",
      version: latestVersion,
      size: "26.8 MB",
      filename: `duplicati-${latestVersion}-1.noarch.rpm`,
      icon: "ri-centos-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${latestVersion}/duplicati-${latestVersion}-1.noarch.rpm`
    },
    {
      name: "Duplicati for Linux (Generic)",
      platform: "Linux",
      version: latestVersion,
      size: "23.1 MB",
      filename: `duplicati-${latestVersion}.tar.gz`,
      icon: "ri-terminal-box-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${latestVersion}/duplicati-${latestVersion}.tar.gz`
    }
  ];

  const macAgents = [
    {
      name: "Duplicati for macOS",
      platform: "macOS",
      version: latestVersion,
      size: "24.9 MB",
      filename: `duplicati-${latestVersion}.dmg`,
      icon: "ri-apple-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${latestVersion}/duplicati-${latestVersion}.dmg`
    }
  ];

  const betaAgents = [
    {
      name: "Duplicati for Windows (Beta)",
      platform: "Windows",
      version: betaVersion,
      size: "33.1 MB",
      filename: `duplicati-${betaVersion}.msi`,
      icon: "ri-windows-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${betaVersion}/duplicati-${betaVersion}.msi`
    },
    {
      name: "Duplicati for Linux (Beta)",
      platform: "Linux",
      version: betaVersion,
      size: "25.7 MB",
      filename: `duplicati-${betaVersion}.tar.gz`,
      icon: "ri-terminal-box-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${betaVersion}/duplicati-${betaVersion}.tar.gz`
    },
    {
      name: "Duplicati for macOS (Beta)",
      platform: "macOS",
      version: betaVersion,
      size: "25.2 MB",
      filename: `duplicati-${betaVersion}.dmg`,
      icon: "ri-apple-fill",
      link: `https://github.com/duplicati/duplicati/releases/download/v${betaVersion}/duplicati-${betaVersion}.dmg`
    }
  ];

  const renderAgentCard = (agent: any) => (
    <Card key={agent.filename} className="border border-neutral-200 rounded-lg hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`text-2xl mr-4 ${
              agent.platform === 'Windows' ? 'text-blue-500' : 
              agent.platform === 'Linux' ? 'text-orange-500' : 
              'text-gray-500'
            }`}>
              <i className={agent.icon}></i>
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900">{agent.name}</h3>
              <p className="text-sm text-neutral-500">Version {agent.version}</p>
              <p className="text-xs text-neutral-400 mt-1">Size: {agent.size}</p>
            </div>
          </div>
          <a 
            href={agent.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary-dark text-white inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
          >
            <i className="ri-download-line mr-2"></i>
            Download
          </a>
        </div>
      </CardContent>
    </Card>
  );

  const renderAgentSection = (agents: any[], title: string, description: string) => (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
        <p className="text-neutral-500">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {agents.map(renderAgentCard)}
      </div>
    </div>
  );

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
              <h1 className="text-2xl font-bold text-neutral-800">Downloads</h1>
              <p className="text-neutral-500 mt-1">Download Duplicati client agents for your systems</p>
            </div>
          </div>

          {/* Informational Box */}
          <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0 flex items-start justify-center">
                  <div className="bg-primary-light/10 text-primary rounded-full p-4">
                    <i className="ri-information-line text-3xl"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">About Duplicati Agents</h3>
                  <p className="text-neutral-600 mt-2">
                    Duplicati is a free, open-source backup client that securely stores encrypted, incremental, compressed remote backups 
                    of local files on cloud storage services and remote file servers. It's available for Windows, macOS, and Linux.
                  </p>
                  <p className="text-neutral-600 mt-2">
                    To use this monitoring system, download and install the appropriate Duplicati agent for each device you want to monitor.
                    After installation, configure the agent to report to this central dashboard using the setup guide.
                  </p>
                  <div className="mt-4">
                    <a 
                      href="https://duplicati.readthedocs.io/en/latest/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 mr-4"
                    >
                      <i className="ri-book-open-line mr-2"></i>
                      Documentation
                    </a>
                    <a 
                      href="#setup-guide" 
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium text-primary underline-offset-4 ring-offset-white transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <i className="ri-guide-line mr-2"></i>
                      Setup Guide
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Downloads Tabs */}
          <Tabs defaultValue="stable" className="space-y-6">
            <TabsList className="bg-neutral-100 p-1 rounded-md border border-neutral-200">
              <TabsTrigger value="stable" className="px-4 py-2">Stable Release</TabsTrigger>
              <TabsTrigger value="beta" className="px-4 py-2">Beta Release</TabsTrigger>
            </TabsList>

            <TabsContent value="stable" className="space-y-8">
              {renderAgentSection(
                windowsAgents, 
                "Windows",
                "Download Duplicati client agents for Windows systems"
              )}
              
              {renderAgentSection(
                linuxAgents, 
                "Linux",
                "Download Duplicati client agents for Linux systems"
              )}
              
              {renderAgentSection(
                macAgents, 
                "macOS",
                "Download Duplicati client agents for macOS systems"
              )}
            </TabsContent>

            <TabsContent value="beta" className="space-y-8">
              <Card className="border border-warning-light bg-warning-light/10 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <i className="ri-alert-line text-warning text-xl mr-2"></i>
                    <p className="text-sm text-warning-dark">
                      Beta releases may contain bugs and are not recommended for production environments.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {renderAgentSection(
                betaAgents, 
                "Beta Releases",
                "Download the latest beta versions of Duplicati client agents"
              )}
            </TabsContent>
          </Tabs>

          {/* Setup Guide */}
          <div id="setup-guide" className="mt-12 pt-4 border-t border-neutral-200">
            <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-neutral-800">Agent Setup Guide</CardTitle>
                <CardDescription>Follow these steps to connect your Duplicati agent to this monitoring dashboard</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ol className="list-decimal list-inside space-y-4">
                  <li className="text-neutral-700">
                    <span className="font-medium">Install Duplicati</span>
                    <p className="ml-6 mt-1 text-neutral-600">
                      Download and install the appropriate Duplicati agent for your system from the links above.
                    </p>
                  </li>
                  <li className="text-neutral-700">
                    <span className="font-medium">Configure Backup Jobs</span>
                    <p className="ml-6 mt-1 text-neutral-600">
                      Set up your backup jobs in Duplicati as you normally would, specifying sources, destinations, 
                      schedules, and retention policies.
                    </p>
                  </li>
                  <li className="text-neutral-700">
                    <span className="font-medium">Add Reporting Hook</span>
                    <p className="ml-6 mt-1 text-neutral-600">
                      In your Duplicati backup job settings, go to the "Advanced options" section and add the following:
                    </p>
                    <div className="ml-6 mt-2 bg-neutral-100 p-3 rounded-md text-sm font-mono">
                      --run-script-after="%DUPLICATI_HOME%/report_script.bat"
                    </div>
                  </li>
                  <li className="text-neutral-700">
                    <span className="font-medium">Create Report Script</span>
                    <p className="ml-6 mt-1 text-neutral-600">
                      Create a script file named <code>report_script.bat</code> (Windows) or <code>report_script.sh</code> (Linux/macOS) 
                      in your Duplicati home directory with the following content:
                    </p>
                    <div className="ml-6 mt-2 bg-neutral-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                      <p>curl -X POST https://your-dashboard-url/api/backup/report \</p>
                      <p>  -H "Content-Type: application/json" \</p>
                      <p>  -d @- &lt;&lt;EOF</p>
                      <p>&#123;</p>
                      <p>  "hostname": "%DUPLICATI__PARSED_RESULT_SourceHostname%",</p>
                      <p>  "ip": "%DUPLICATI__PARSED_RESULT_SourceIP%",</p>
                      <p>  "status": "%DUPLICATI__PARSED_RESULT_ParsedResult%",</p>
                      <p>  "time": "%DUPLICATI__PARSED_RESULT_EndTime%",</p>
                      <p>  "size": "%DUPLICATI__PARSED_RESULT_SizeOfModifiedFiles%",</p>
                      <p>  "duration": "%DUPLICATI__PARSED_RESULT_Duration%",</p>
                      <p>  "fileCount": "%DUPLICATI__PARSED_RESULT_ModifiedFiles%"</p>
                      <p>&#125;</p>
                      <p>EOF</p>
                    </div>
                    <p className="ml-6 mt-2 text-neutral-600">
                      Make sure to replace <code>https://your-dashboard-url</code> with the actual URL of this dashboard.
                    </p>
                  </li>
                  <li className="text-neutral-700">
                    <span className="font-medium">Make Script Executable (Linux/macOS)</span>
                    <p className="ml-6 mt-1 text-neutral-600">
                      If you're using Linux or macOS, don't forget to make the script executable:
                    </p>
                    <div className="ml-6 mt-2 bg-neutral-100 p-3 rounded-md text-sm font-mono">
                      chmod +x report_script.sh
                    </div>
                  </li>
                  <li className="text-neutral-700">
                    <span className="font-medium">Test Backup Job</span>
                    <p className="ml-6 mt-1 text-neutral-600">
                      Run your backup job manually to verify that it completes successfully and reports to the dashboard.
                    </p>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}