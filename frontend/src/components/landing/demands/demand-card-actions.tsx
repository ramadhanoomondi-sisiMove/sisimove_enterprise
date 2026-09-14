// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Card Actions
// -----------------------------------------------------------------------------
//
// Presentation component for the actions portion of a public Journey Demand
// marketplace card.
//
// The component exposes the two marketplace actions:
//
// - View demand
// - Join
//
// Navigation targets are supplied by the parent. This keeps route construction
// and marketplace navigation policy outside the presentation component.
//
// The component deliberately does not:
// - fetch Demand data;
// - determine whether joining is allowed;
// - perform authentication checks;
// - perform booking or joining mutations;
// - construct API URLs;
// - contain Demand lifecycle logic.
//
// The Join action is optional because the parent may determine that a Join
// action is not currently appropriate for the displayed Demand.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandCardActionsProps {
  /**
   * Destination for the public Demand detail page.
   */
  viewHref: string;

  /**
   * Optional destination for joining the Demand.
   *
   * When absent, the Join action is not rendered.
   */
  joinHref?: string;

  /**
   * Optional additional styling supplied by the parent marketplace card.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandCardActions({
  viewHref,
  joinHref,
  className,
}: DemandCardActionsProps) {
  return (
    <div
      className={[
        'flex',
        'items-center',
        'gap-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* View Demand                                                         */}
      {/* ------------------------------------------------------------------- */}
      {/*
        The detail action is always available because the marketplace card
        represents a public Demand.
      */}

      <Link
        href={viewHref}
        className={[
          'inline-flex',
          'min-h-10',
          'items-center',
          'justify-center',
          'rounded-[var(--radius-md)]',
          'border',
          'border-[var(--border-strong)]',
          'bg-transparent',
          'px-4',
          'text-sm',
          'font-medium',
          'whitespace-nowrap',
          'text-[var(--foreground)]',
          'transition-colors',
          'duration-150',
          'ease-out',
          'hover:border-[var(--foreground-subtle)]',
          'hover:bg-[var(--background-subtle)]',
          'active:bg-[var(--background-muted)]',
          'focus-visible:outline-2',
          'focus-visible:outline-[var(--brand)]',
          'focus-visible:outline-offset-2',
        ].join(' ')}
      >
        View demand
      </Link>

      {/* ------------------------------------------------------------------- */}
      {/* Join Demand                                                         */}
      {/* ------------------------------------------------------------------- */}
      {/*
        Join is rendered only when the parent supplies a destination.

        This component does not decide whether a Demand is joinable. That
        decision belongs to the application/marketplace layer.
      */}

      {joinHref && (
        <Link
          href={joinHref}
          className={[
            'inline-flex',
            'min-h-10',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-md)]',
            'border',
            'border-transparent',
            'bg-[var(--brand)]',
            'px-4',
            'text-sm',
            'font-medium',
            'whitespace-nowrap',
            'text-[var(--brand-foreground)]',
            'transition-colors',
            'duration-150',
            'ease-out',
            'hover:bg-[var(--brand-hover)]',
            'active:bg-[var(--brand-hover)]',
            'focus-visible:outline-2',
            'focus-visible:outline-[var(--brand)]',
            'focus-visible:outline-offset-2',
          ].join(' ')}
        >
          Join
        </Link>
      )}
    </div>
  );
}

