export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-100 bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white font-display">
            C
          </span>
          <span className="font-display text-sm font-semibold text-ink-900">
            Chirikaro
          </span>
        </div>
        <p className="text-sm text-ink-500">
          &copy; {year} Chirikaro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
