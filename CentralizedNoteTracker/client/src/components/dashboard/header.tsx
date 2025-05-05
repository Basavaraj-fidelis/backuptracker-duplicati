import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="flex justify-between items-center px-4 h-16">
        <div className="flex items-center">
          <button
            className="md:hidden text-neutral-500 mr-2"
            onClick={onToggleSidebar}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          <h1 className="text-lg font-semibold md:hidden">Duplicati Monitor</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full"
              onClick={toggleTheme}
            >
              <i
                className={`${
                  theme === "dark" ? "ri-sun-line" : "ri-moon-line"
                } text-xl`}
              ></i>
            </Button>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full"
              onClick={toggleNotifications}
            >
              <i className="ri-notification-3-line text-xl"></i>
              <span className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full text-white text-xs flex items-center justify-center font-medium">
                3
              </span>
            </Button>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full"
              onClick={toggleUserMenu}
            >
              <i className="ri-user-3-line text-xl"></i>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
