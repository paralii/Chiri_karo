import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,theme(colors.secondary.100),transparent_55%)]"
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-600">
            Built for modern dental practices
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Run your dental clinic{" "}
            <span className="text-primary">without the chaos</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
            Chirikaro brings scheduling, patient records, treatment history, and
            billing into one secure, role-aware platform — so your front desk,
            dentists, and patients are always on the same page.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-card transition-colors hover:bg-primary-600"
            >
              Create your account
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-lg border border-ink-100 px-6 py-3 text-base font-semibold text-ink-700 transition-colors hover:border-primary hover:text-primary"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-ink-500">
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-success"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-success"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              Set up in minutes
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-xl border border-ink-100 bg-surface-sunken p-6 shadow-raised">
            <div className="flex items-center justify-between border-b border-ink-100 pb-4">
              <span className="font-display text-sm font-semibold text-ink-900">
                Today&apos;s Schedule
              </span>
              <span className="font-mono text-xs text-ink-500">
                08:00 — 17:00
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                {
                  time: "09:00",
                  name: "A. Fernandez",
                  status: "Confirmed",
                  color: "bg-success",
                },
                {
                  time: "10:30",
                  name: "R. Menon",
                  status: "Pending",
                  color: "bg-warning",
                },
                {
                  time: "13:00",
                  name: "S. Iyer",
                  status: "Confirmed",
                  color: "bg-success",
                },
              ].map((item) => (
                <li
                  key={item.time}
                  className="flex items-center justify-between rounded-lg border border-ink-100 bg-surface px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-ink-500">
                      {item.time}
                    </span>
                    <span className="text-sm font-medium text-ink-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
                    <span
                      className={`h-2 w-2 rounded-full ${item.color} ${
                        item.status === "Pending" ? "animate-pulse-dot" : ""
                      }`}
                    />
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-primary-50 blur-2xl" />
          <div className="absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-full bg-accent-50 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
