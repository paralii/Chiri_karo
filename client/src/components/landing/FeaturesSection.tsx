interface Feature {
  title: string;
  description: string;
  colorClass: string;
  icon: JSX.Element;
}

const features: Feature[] = [
  {
    title: "Smart Scheduling",
    description:
      "Book, reschedule, and manage appointments across dentists and chairs without double-booking.",
    colorClass: "bg-primary-50 text-primary-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 6h15A1.5 1.5 0 0121 7.5v12a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-12A1.5 1.5 0 014.5 6z"
        />
      </svg>
    ),
  },
  {
    title: "Patient Records",
    description:
      "Centralized, secure patient history — treatments, notes, and documents in one searchable place.",
    colorClass: "bg-secondary-50 text-secondary-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Role-Based Access",
    description:
      "Admins, dentists, receptionists, and patients each see exactly what they need — nothing more.",
    colorClass: "bg-accent-50 text-accent-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 4.556-3.32 8.333-7.667 9.043a1.5 1.5 0 01-.666 0C8.32 20.333 5 16.556 5 12V6.309a1.5 1.5 0 011.043-1.428L11.5 3.13a1.5 1.5 0 01.999 0l5.457 1.75A1.5 1.5 0 0119 6.31V12z"
        />
      </svg>
    ),
  },
  {
    title: "Billing & Invoices",
    description:
      "Track treatment costs and payments per patient, with a clear status at a glance.",
    colorClass: "bg-success-50 text-success-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-4.5-9.75h6a2.25 2.25 0 010 4.5h-3a2.25 2.25 0 000 4.5h6"
        />
      </svg>
    ),
  },
  {
    title: "Secure by Design",
    description:
      "JWT sessions, OTP verification, and encrypted credentials keep every login protected.",
    colorClass: "bg-warning-50 text-warning-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
        />
      </svg>
    ),
  },
  {
    title: "Google Sign-In",
    description:
      "Patients and staff can sign in instantly with Google — no extra password to remember.",
    colorClass: "bg-danger-50 text-danger-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.8}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5c3.86 0 7.05-2.91 7.45-6.66H12v-2.5h9.9c.1.53.15 1.08.15 1.66 0 5.7-4.4 10-10.05 10C6.4 22 2 17.6 2 12S6.4 2 12 2c2.7 0 4.96 1 6.7 2.62l-2.72 2.62C15 6.28 13.63 5.7 12 5.7c-3.48 0-6.3 2.82-6.3 6.3"
        />
      </svg>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-surface-sunken py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-secondary-600">
            Everything in one place
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            Built for how dental clinics actually run
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            From the front desk to the operatory, Chirikaro keeps every role
            moving in sync.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-ink-100 bg-surface p-6 shadow-card transition-shadow hover:shadow-raised"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.colorClass}`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
