import { Link } from "react-router-dom";

export function CtaSection() {
  return (
    <section id="how-it-works" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-primary px-8 py-16 text-center shadow-raised sm:px-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,theme(colors.accent.500/25%),transparent_60%)]"
          />
          <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to bring order to your clinic?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-primary-50">
            Create your account in minutes. Admins can invite dentists and
            receptionists once you&apos;re set up.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary shadow-card transition-colors hover:bg-primary-50"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
