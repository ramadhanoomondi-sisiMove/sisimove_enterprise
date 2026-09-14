// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Actions
// -----------------------------------------------------------------------------
//
// Presentation component for the actions displayed at the bottom of a public
// Journey marketplace card.
//
// The card exposes two possible marketplace actions:
//
//   1. View journey
//      Opens the public Journey detail page.
//
//   2. Book
//      Opens the booking flow when the surrounding marketplace context provides
//      a booking destination.
//
// Both actions support an explicit disabled state.
//
// Because these controls are rendered as Next.js Links rather than native
// buttons, the disabled state is implemented explicitly:
//
//   - `aria-disabled` communicates the state to assistive technology;
//   - `tabIndex={-1}` removes a disabled link from keyboard navigation;
//   - `preventDefault()` prevents navigation;
//   - disabled styling communicates the unavailable state visually.
//
// This component deliberately does not:
// - determine whether a Journey is bookable;
// - check authentication;
// - check seat availability;
// - create a booking;
// - perform navigation programmatically;
// - contain marketplace or booking business logic.
//
// The parent component decides which actions are available and whether they
// are disabled by supplying the appropriate props.
//
// Direct Next.js Links are used instead of extending the shared Button
// primitive with `asChild`. The Button primitive remains a native button,
// while these links reproduce the same visual treatment for navigation.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

export interface JourneyCardActionsProps {
  viewHref: string;
  bookHref?: string;
  viewDisabled?: boolean;
  bookDisabled?: boolean;
  className?: string;
}

export function JourneyCardActions({
  viewHref,
  bookHref,
  viewDisabled = false,
  bookDisabled = false,
  className,
}: JourneyCardActionsProps) {
  return (
    <div
      className={[
        'flex min-w-0 flex-wrap items-center gap-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Link
        href={viewHref}
        aria-disabled={viewDisabled}
        tabIndex={viewDisabled ? -1 : undefined}
        onClick={
          viewDisabled
            ? (event) => {
                event.preventDefault();
              }
            : undefined
        }
        className={[
          'inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
          viewDisabled
            ? 'cursor-not-allowed border-[var(--border)] text-[var(--foreground-subtle)] opacity-60'
            : 'border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]',
        ].join(' ')}
      >
        View journey
      </Link>

      {bookHref && (
        <Link
          href={bookHref}
          aria-disabled={bookDisabled}
          tabIndex={bookDisabled ? -1 : undefined}
          onClick={
            bookDisabled
              ? (event) => {
                  event.preventDefault();
                }
              : undefined
          }
          className={[
            'inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
            bookDisabled
              ? 'cursor-not-allowed bg-[var(--primary)] text-[var(--primary-foreground)] opacity-50'
              : 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
          ].join(' ')}
        >
          Book
        </Link>
      )}
    </div>
  );
}
