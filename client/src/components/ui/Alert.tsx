import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "../../lib/cn";

const alertVariants = cva(
  "flex items-start gap-3 rounded border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        success: "bg-success-50 border-success-100 text-success-700",
        warning: "bg-warning-50 border-warning-100 text-warning-700",
        danger: "bg-danger-50 border-danger-100 text-danger-700",
        info: "bg-secondary-50 border-secondary-100 text-secondary-700",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
} as const;

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
}

export const Alert = ({
  className,
  variant,
  title,
  children,
  ...props
}: AlertProps): JSX.Element => {
  const key = variant ?? "info";
  const Icon = icons[key];

  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex flex-col gap-0.5">
        {title && <span className="font-semibold">{title}</span>}
        <span>{children}</span>
      </div>
    </div>
  );
};
