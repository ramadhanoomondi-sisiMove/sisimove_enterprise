// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Actions
// -----------------------------------------------------------------------------
//
// Navigation-only actions for a public Journey Demand marketplace card.
//
// ARCHITECTURAL BOUNDARY
// ----------------------
//
// This component is presentation-only.
//
// It does NOT determine:
//
// - whether the visitor may join
// - whether the Demand is joinable
// - whether the Demand is fulfilled
// - whether the visitor owns the Demand
// - whether authentication is required
// - whether the Demand is still accepting participants
//
// Those decisions belong to the marketplace/application layer.
//
// The application layer supplies:
//
// - viewHref
// - joinHref
// - viewDisabled
// - joinDisabled
//
// This component simply renders those navigation affordances.
//
// RESPONSIVE MARKETPLACE RULE
// ---------------------------
//
// The marketplace card remains a horizontal row at every viewport size.
//
// Therefore this action column must also:
//
// - remain horizontally contained within its allocated flex column
// - have min-w-0
// - never define a fixed desktop width
// - never force horizontal scrolling
// - contract its padding, gap, typography, and controls at smaller sizes
//
// The parent DemandMarketplaceCard owns the outer marketplace column
// allocation. This component owns only the internal action presentation.
//
// -----------------------------------------------------------------------------
// VERTICAL ALIGNMENT
// ------------------
//
// DemandMarketplaceCard uses `items-stretch`, allowing each marketplace
// section to occupy the natural height of the row.
//
// The action group therefore uses `justify-end`.
//
// This intentionally places View / Join toward the lower portion of the
// marketplace row rather than vertically centering them.
//
// This is especially important when another marketplace section — such as
// requester trust information or route information — determines the row's
// natural height.
//
// No fixed height or min-height is introduced.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';
import type { MouseEvent } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandCardActionsProps {
  /**
   * Public Demand detail URL.
   */
  readonly viewHref: string;

  /**
   * Optional URL for joining the Demand.
   *
   * Omit when the current marketplace/application state does not expose a
   * Join action.
   */
  readonly joinHref?: string;

  /**
   * Disable the View navigation.
   */
  readonly viewDisabled?: boolean;

  /**
   * Disable the Join navigation.
   */
  readonly joinDisabled?: boolean;

  /**
   * Optional presentation class.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Disabled navigation helper
// -----------------------------------------------------------------------------
//
// Next.js <Link> does not have a native disabled state.
//
// When the application layer marks navigation as disabled, prevent the
// navigation event here while also communicating the state through ARIA.
//
// This remains presentation behavior; the component does not decide WHY
// navigation is disabled.
// -----------------------------------------------------------------------------

function handleDisabledClick(
  event: MouseEvent<HTMLAnchorElement>,
): void {
  event.preventDefault();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandCardActions({
  viewHref,
  joinHref,
  viewDisabled = false,
  joinDisabled = false,
  className,
}: DemandCardActionsProps) {
  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Layout
        // -------------------------------------------------------------------
        //
        // Keep the action section vertically arranged internally while the
        // marketplace card itself remains a horizontal row.
        //
        // `justify-end` deliberately anchors the action group toward the
        // bottom of the natural marketplace row.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-end',

        // -------------------------------------------------------------------
        // Proportional internal density
        // -------------------------------------------------------------------
        //
        // The outer marketplace column already receives its responsive
        // section padding from DemandMarketplaceCard.
        //
        // These values control only the spacing between the actions and the
        // small internal separation from the upper edge of the action area.
        //
        'gap-1',
        'sm:gap-1.5',
        'md:gap-2',
        'pt-1.5',
        'sm:pt-2',
        'md:pt-2.5',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------ */}
      {/* View Demand                                                        */}
      {/* ------------------------------------------------------------------ */}

      <Link
        href={viewHref}
        aria-disabled={viewDisabled}
        tabIndex={viewDisabled ? -1 : undefined}
        onClick={viewDisabled ? handleDisabledClick : undefined}
        className={[
          // ----------------------------------------------------------------
          // Control geometry
          // ----------------------------------------------------------------

          'inline-flex',
          'min-h-8',
          'sm:min-h-8',
          'md:min-h-9',
          'w-full',
          'min-w-0',
          'items-center',
          'justify-center',

          // ----------------------------------------------------------------
          // Shape
          // ----------------------------------------------------------------

          'rounded-[var(--radius-md)]',
          'border',
          'border-[var(--border)]',
          'bg-[var(--background)]',

          // ----------------------------------------------------------------
          // Responsive control spacing
          // ----------------------------------------------------------------

          'px-2',
          'py-1',
          'sm:px-2.5',
          'sm:py-1.5',
          'md:px-3',
          'md:py-1.5',

          // ----------------------------------------------------------------
          // Responsive typography
          // ----------------------------------------------------------------

          'text-[11px]',
          'sm:text-xs',
          'md:text-sm',
          'font-medium',
          'leading-tight',

          // ----------------------------------------------------------------
          // Colour / interaction
          // ----------------------------------------------------------------

          'text-[var(--foreground)]',
          'transition-colors',
          'hover:border-[var(--border-strong)]',
          'hover:bg-[var(--background-subtle)]',

          // ----------------------------------------------------------------
          // Accessibility / keyboard focus
          // ----------------------------------------------------------------

          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[color:var(--brand)]',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[color:var(--background)]',

          // ----------------------------------------------------------------
          // Disabled presentation
          // ----------------------------------------------------------------

          viewDisabled
            ? [
                'pointer-events-none',
                'cursor-not-allowed',
                'opacity-50',
              ].join(' ')
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        View
      </Link>

      {/* ------------------------------------------------------------------ */}
      {/* Join Demand                                                        */}
      {/* ------------------------------------------------------------------ */}

      {joinHref && (
        <Link
          href={joinHref}
          aria-disabled={joinDisabled}
          tabIndex={joinDisabled ? -1 : undefined}
          onClick={joinDisabled ? handleDisabledClick : undefined}
          className={[
            // ----------------------------------------------------------------
            // Control geometry
            // ----------------------------------------------------------------

            'inline-flex',
            'min-h-8',
            'sm:min-h-8',
            'md:min-h-9',
            'w-full',
            'min-w-0',
            'items-center',
            'justify-center',

            // ----------------------------------------------------------------
            // Shape
            // ----------------------------------------------------------------

            'rounded-[var(--radius-md)]',
            'bg-[var(--brand)]',

            // ----------------------------------------------------------------
            // Responsive control spacing
            // ----------------------------------------------------------------

            'px-2',
            'py-1',
            'sm:px-2.5',
            'sm:py-1.5',
            'md:px-3',
            'md:py-1.5',

            // ----------------------------------------------------------------
            // Responsive typography
            // ----------------------------------------------------------------

            'text-[11px]',
            'sm:text-xs',
            'md:text-sm',
            'font-medium',
            'leading-tight',

            // ----------------------------------------------------------------
            // Colour / interaction
            // ----------------------------------------------------------------
            //
            // Explicit white keeps the primary action readable against the
            // brand background without relying on another foreground token.
            //

            'text-white',
            'transition-colors',
            'hover:bg-[var(--brand-hover)]',

            // ----------------------------------------------------------------
            // Accessibility / keyboard focus
            // ----------------------------------------------------------------

            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[color:var(--brand)]',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-[color:var(--background)]',

            // ----------------------------------------------------------------
            // Disabled presentation
            // ----------------------------------------------------------------

            joinDisabled
              ? [
                  'pointer-events-none',
                  'cursor-not-allowed',
                  'opacity-50',
                ].join(' ')
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          Join
        </Link>
      )}
    </div>
  );
}