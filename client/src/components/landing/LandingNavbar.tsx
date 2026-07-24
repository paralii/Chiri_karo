import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

interface LandingNavbarProps {
  className?: string;
}

const navLinks: Array<{ label: string; href: string }> = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

export function LandingNavbar({ className }: LandingNavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-ink-100 bg-surface/80 backdrop-blur-md",
        className,
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-display font-bold">
            C
          </span>
          <span className="font-display text-lg font-semibold text-ink-900">
            Chirikaro
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink-500 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-ink-500 transition-colors hover:text-primary sm:inline-block"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors hover:bg-primary-600"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
