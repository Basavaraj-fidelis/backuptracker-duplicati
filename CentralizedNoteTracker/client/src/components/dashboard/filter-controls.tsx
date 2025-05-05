import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterControlsProps {
  onFilterChange: (filters: {
    status: string;
    dateRange: string;
    deviceType: string;
  }) => void;
}

export function FilterControls({ onFilterChange }: FilterControlsProps) {
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "24h",
    deviceType: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      status: "all",
      dateRange: "24h",
      deviceType: "all",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="status-filter" className="text-sm font-medium text-neutral-700">Status Filter</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date-range-filter" className="text-sm font-medium text-neutral-700">Date Range</Label>
          <Select
            value={filters.dateRange}
            onValueChange={(value) => handleFilterChange("dateRange", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="3d">Last 3 Days</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="device-type-filter" className="text-sm font-medium text-neutral-700">Devices</Label>
          <Select
            value={filters.deviceType}
            onValueChange={(value) => handleFilterChange("deviceType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select device type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="server">Servers Only</SelectItem>
                <SelectItem value="workstation">Workstations Only</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="md:ml-auto mt-2 md:mt-0">
          <Button
            variant="secondary"
            onClick={resetFilters}
            className="w-full md:w-auto"
          >
            <i className="ri-filter-3-line mr-2"></i>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
