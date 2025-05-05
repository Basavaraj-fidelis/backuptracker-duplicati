import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      icon: "ri-dashboard-line",
      href: "/",
    },
    {
      title: "Devices",
      icon: "ri-computer-line",
      href: "/devices",
    },
    {
      title: "Backup History",
      icon: "ri-history-line",
      href: "/history",
    },
    {
      title: "Alerts",
      icon: "ri-alert-line",
      href: "/alerts",
    },
    {
      title: "Downloads",
      icon: "ri-download-2-line",
      href: "/downloads",
    },
  ];

  const configItems = [
    {
      title: "Settings",
      icon: "ri-settings-line",
      href: "/settings",
    },
    {
      title: "User Management",
      icon: "ri-user-settings-line",
      href: "/users",
    },
  ];

  return (
    <div
      className={cn(
        "sidebar hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 h-full",
        className
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-neutral-200">
        <h1 className="text-xl font-semibold text-primary">
          <i className="ri-hard-drive-2-line mr-2"></i>Duplicati Monitor
        </h1>
      </div>

      <nav className="flex-grow p-4">
        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Main
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md",
                location === item.href
                  ? "bg-primary-light/10 text-primary"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <i className={cn(item.icon, "mr-2 text-lg")}></i>
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Configuration
          </p>
          {configItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md",
                location === item.href
                  ? "bg-primary-light/10 text-primary"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <i className={cn(item.icon, "mr-2 text-lg")}></i>
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="text-sm font-medium">JD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-neutral-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
