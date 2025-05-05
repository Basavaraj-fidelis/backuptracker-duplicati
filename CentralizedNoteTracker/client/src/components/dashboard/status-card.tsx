import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: number | string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  footer?: React.ReactNode;
  valueColor?: string;
  className?: string;
}

export function StatusCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  footer,
  valueColor,
  className,
}: StatusCardProps) {
  return (
    <div
      className={cn(
        "card bg-white border border-neutral-200 rounded-lg shadow-sm p-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <h3
            className={cn(
              "text-2xl font-bold mt-1",
              valueColor ? valueColor : ""
            )}
          >
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "p-3 rounded-full",
            `${iconBgColor} ${iconColor}`
          )}
        >
          <i className={cn(icon, "text-xl")}></i>
        </div>
      </div>
      {footer && <div className="mt-4 text-xs text-neutral-500">{footer}</div>}
    </div>
  );
}
