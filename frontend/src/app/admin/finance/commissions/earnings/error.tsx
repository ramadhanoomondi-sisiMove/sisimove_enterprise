'use client';

interface EarningCommissionDirectoryErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function EarningCommissionDirectoryError({
  error,
  reset,
}: EarningCommissionDirectoryErrorProps) {
  return (
    <div
      role="alert"
      className="space-y-4 p-6"
    >
      <h2 className="text-lg font-semibold">
        Unable to display earning commissions
      </h2>

      <p className="text-sm text-[var(--foreground-secondary)]">
        {error.message || 'An unexpected error occurred.'}
      </p>

      <button
        type="button"
        onClick={reset}
        className="rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}