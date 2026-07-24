import { ReactNode } from "react";
import { Stethoscope } from "lucide-react";

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthLayout = ({
  title,
  subtitle,
  children,
}: AuthLayoutProps): JSX.Element => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6" />
          <span className="font-display text-lg font-semibold">Chirikaro</span>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Care coordination, without the chaos.
          </h2>
          <p className="max-w-sm text-sm text-primary-100">
            One place for appointments, patient records and your clinic team —
            built for the way dental practices actually run.
          </p>
        </div>
        <span className="text-xs text-primary-200">
          © {new Date().getFullYear()} Chirikaro
        </span>
      </div>

      <div className="flex items-center justify-center bg-surface-sunken p-6 sm:p-10">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 flex flex-col gap-1">
            <h1 className="font-display text-2xl font-semibold text-ink-900">
              {title}
            </h1>
            <p className="text-sm text-ink-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
