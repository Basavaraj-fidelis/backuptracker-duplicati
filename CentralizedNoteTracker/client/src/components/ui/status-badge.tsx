import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "failed" | "error";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return "bg-success-light/20 text-success";
      case "warning":
        return "bg-warning-light/20 text-warning";
      case "failed":
      case "error":
        return "bg-error-light/20 text-error";
      default:
        return "bg-neutral-200 text-neutral-700";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "failed":
      case "error":
        return "Failed";
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
        getStatusStyles(),
        className
      )}
    >
      {getStatusText()}
    </span>
  );
}
