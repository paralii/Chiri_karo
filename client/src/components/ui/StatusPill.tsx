import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const pillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      status: {
        confirmed: "bg-success-100 text-success-700",
        pending: "bg-warning-100 text-warning-700",
        cancelled: "bg-danger-100 text-danger-700",
        info: "bg-secondary-100 text-secondary-700",
        neutral: "bg-ink-100 text-ink-700",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  },
);

const dotColor: Record<string, string> = {
  confirmed: "bg-success",
  pending: "bg-warning animate-pulse-dot",
  cancelled: "bg-danger",
  info: "bg-secondary",
  neutral: "bg-ink-500",
};

export interface StatusPillProps extends VariantProps<typeof pillVariants> {
  label: string;
  className?: string;
}

export const StatusPill = ({
  status,
  label,
  className,
}: StatusPillProps): JSX.Element => {
  const key = status ?? "neutral";

  return (
    <span className={cn(pillVariants({ status }), className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[key])} />
      {label}
    </span>
  );
};
