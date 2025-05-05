import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generateRandomData = (days: number) => {
  // This is a placeholder for demonstration - in a real app this would be actual data
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      size: Math.floor(Math.random() * 80) + 20,
    });
  }

  return data;
};

export function TrendsCard() {
  const [period, setPeriod] = useState("7d");
  
  // Get data based on selected period
  let daysToShow = 7;
  switch (period) {
    case "30d":
      daysToShow = 30;
      break;
    case "90d":
      daysToShow = 90;
      break;
    default:
      daysToShow = 7;
  }
  
  const data = generateRandomData(daysToShow);
  
  // In a real app, these would be calculated from actual data
  const successPercentage = 95;
  const warningPercentage = 3;
  const failedPercentage = 2;
  
  return (
    <Card className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="border-b border-neutral-200 px-4 py-3 bg-neutral-50 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold text-neutral-800">Backup Trends</CardTitle>
        <Select
          value={period}
          onValueChange={setPeriod}
        >
          <SelectTrigger className="text-sm border-neutral-200 rounded-md w-36">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <div className="text-sm font-medium text-neutral-600">Total Backup Size Trend</div>
          <div className="text-sm font-medium text-success">+4.2% Growth</div>
        </div>
        
        <div className="w-full h-48 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="size" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-sm text-neutral-500">Successful</p>
            <p className="text-lg font-semibold text-success">{successPercentage}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-500">Warning</p>
            <p className="text-lg font-semibold text-warning">{warningPercentage}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-500">Failed</p>
            <p className="text-lg font-semibold text-error">{failedPercentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
