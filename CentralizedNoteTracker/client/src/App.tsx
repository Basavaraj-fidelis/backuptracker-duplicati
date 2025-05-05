import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import DeviceDetails from "@/pages/device-details";
import Devices from "@/pages/devices";
import History from "@/pages/history";
import Alerts from "@/pages/alerts";
import Settings from "@/pages/settings";
import Users from "@/pages/users";
import Downloads from "@/pages/downloads";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/ui/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/devices" component={Devices} />
      <Route path="/devices/:id" component={DeviceDetails} />
      <Route path="/history" component={History} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/settings" component={Settings} />
      <Route path="/users" component={Users} />
      <Route path="/downloads" component={Downloads} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
