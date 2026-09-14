// -----------------------------------------------------------------------------
// sisiMove — Marketplace Error State
// -----------------------------------------------------------------------------
//
// Presentation component for errors encountered while loading or refreshing
// the public marketplace.
//
// Responsibilities:
//
// - present a clear, user-facing error message;
// - present a reusable marketplace error icon;
// - optionally expose a retry action supplied by the parent;
// - communicate the error state accessibly;
// - reflect retry progress without owning request state.
//
// This component does not:
//
// - fetch marketplace data;
// - determine the cause of the error;
// - perform retries internally;
// - manage loading or error state;
// - construct routes or marketplace queries.
//
// The parent application layer owns the request lifecycle and supplies the
// retry callback when retrying is supported.
// -----------------------------------------------------------------------------

import { MarketplaceErrorIcon } from './marketplace-error-icon';

export interface MarketplaceErrorStateProps {
  /**
   * Optional heading displayed to the visitor.
   */
  title?: string;

  /**
   * Optional explanation displayed below the heading.
   */
  description?: string;

  /**
   * Optional retry callback supplied by the parent component.
   */
  onRetry?: () => void;

  /**
   * Indicates that the parent is currently retrying the request.
   */
  isRetrying?: boolean;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}

export function MarketplaceErrorState({
  title = 'We could not load the marketplace',
  description = 'Something went wrong while loading available journeys and travel demands. Please try again.',
  onRetry,
  isRetrying = false,
  className,
}: MarketplaceErrorStateProps) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className={[
        'flex min-w-0 flex-col items-center justify-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] px-6 py-10 text-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <MarketplaceErrorIcon />

      <div className="flex min-w-0 flex-col items-center gap-2">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>

        <p className="max-w-xl text-sm leading-6 text-[var(--foreground-muted)]">
          {description}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          aria-busy={isRetrying}
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRetrying ? 'Retrying…' : 'Try again'}
        </button>
      )}
    </section>
  );
}
