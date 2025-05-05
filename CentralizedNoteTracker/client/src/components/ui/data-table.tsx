import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  data: TData[];
  columns: {
    key: string;
    title: string;
    render?: (item: TData) => React.ReactNode;
  }[];
  onRowClick?: (item: TData) => void;
  className?: string;
  isLoading?: boolean;
}

export function DataTable<TData>({
  data,
  columns,
  onRowClick,
  className,
  isLoading = false,
}: DataTableProps<TData>) {
  if (isLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-xs text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center text-neutral-500">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-auto", className)}>
      <Table>
        <TableHeader className="bg-neutral-50 border-b border-neutral-200">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow
              key={idx}
              className={cn(
                "hover:bg-neutral-50 border-b border-neutral-200",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((column) => (
                <TableCell
                  key={`${idx}-${column.key}`}
                  className="px-4 py-3 whitespace-nowrap"
                >
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
