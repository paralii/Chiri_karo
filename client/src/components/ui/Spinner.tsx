import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SpinnerProps {
  className?: string;
  size?: number;
}

export const Spinner = ({
  className,
  size = 20,
}: SpinnerProps): JSX.Element => (
  <Loader2 className={cn("animate-spin text-primary", className)} size={size} />
);
