// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Actions
// -----------------------------------------------------------------------------
//
// Presentation component for the action area of a public Journey marketplace
// listing.
//
// MARKETPLACE PHILOSOPHY
// ----------------------
//
// A Journey marketplace card is intentionally a compact marketplace row:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//
// The action column contains only the actions that the parent marketplace
// read model has explicitly made available.
//
// Current actions:
//
//   1. View
//      Opens the public Journey detail page.
//
//   2. Book
//      Opens the booking flow when the parent supplies a booking destination.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component is presentation-only.
//
// It deliberately does not:
//
// - determine whether a Journey is bookable;
// - inspect Journey status;
// - inspect seat availability;
// - check authentication;
// - determine booking eligibility;
// - create a booking;
// - perform programmatic navigation;
// - construct URLs;
// - fetch data;
// - contain Journey or Booking business rules.
//
// The parent owns those decisions and supplies the resulting destinations.
//
// BOOKING CONTRACT
// ----------------
//
// `bookHref` is the presentation-level signal that a Book action exists.
//
//   bookHref provided
//       → render Book.
//
//   bookHref omitted
//       → do not render Book.
//
// This component does not infer why a booking destination is absent.
//
// DISABLED LINKS
// --------------
//
// These controls remain Next.js Links because their normal behavior is
// navigation to a destination supplied by the parent.
//
// When disabled:
//
// - aria-disabled communicates the state to assistive technology;
// - tabIndex={-1} removes the link from normal keyboard navigation;
// - preventDefault() prevents navigation;
// - visual styling communicates the unavailable state.
//
// RESPONSIVE MARKETPLACE RULE
// ---------------------------
//
// The parent marketplace card owns the action column allocation.
//
// This component intentionally does NOT:
//
// - set a fixed column width;
// - set a minimum column width;
// - use shrink-0 on the action column;
// - add marketplace-level padding;
// - control the complete marketplace row.
//
// The parent is responsible for the column allocation:
//
//     Date | Provider | Route | Vehicle | Price | Actions
//
// VERTICAL POSITIONING
// --------------------
//
// Unlike the information columns, the action group is intentionally aligned
// toward the lower part of the marketplace row.
//
// This prevents:
//
//     Price
//     per seat
//     available
//     [View]
//     [Book]
//
// from visually collapsing into one dense vertical block.
//
// The action area therefore uses `justify-end`.
//
// The marketplace parent still controls the row's overall height.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --brand
//   --brand-hover
//   --background
//   --background-muted
//   --foreground
//   --foreground-subtle
//   --border
//   --border-strong
//
// No generic or nonexistent tokens are introduced.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';
import type { MouseEvent } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardActionsProps {
  /**
   * Public Journey detail destination.
   */
  readonly viewHref: string;

  /**
   * Optional booking destination.
   *
   * When omitted, the Book action is not rendered.
   */
  readonly bookHref?: string;

  /**
   * Whether the View Journey action should be presented as unavailable.
   *
   * The parent owns the reason for the disabled state.
   */
  readonly viewDisabled?: boolean;

  /**
   * Whether the Book action should be presented as unavailable.
   *
   * The parent owns the reason for the disabled state.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional additional styling supplied by the parent marketplace card.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Disabled navigation helper
// -----------------------------------------------------------------------------
//
// Next.js Link does not expose a native disabled state.
//
// The parent can therefore mark a navigation action as unavailable while this
// component handles only the presentation mechanics required to prevent the
// link from navigating.
//
// -----------------------------------------------------------------------------

function handleDisabledClick(
  event: MouseEvent<HTMLAnchorElement>,
): void {
  event.preventDefault();
}

// -----------------------------------------------------------------------------
// Shared control classes
// -----------------------------------------------------------------------------
//
// The two actions share the same responsive geometry and typography.
//
// Keeping the shared structure here makes it harder for View and Book to drift
// apart as the marketplace density is refined.
//
// -----------------------------------------------------------------------------

const ACTION_BASE = [
  'inline-flex',
  'min-h-8',
  'sm:min-h-8',
  'md:min-h-9',
  'w-full',
  'min-w-0',
  'items-center',
  'justify-center',
  'rounded-[var(--radius-md)]',
  'px-2',
  'py-1',
  'sm:px-2.5',
  'sm:py-1.5',
  'md:px-3',
  'md:py-1.5',
  'text-[11px]',
  'sm:text-xs',
  'md:text-sm',
  'font-medium',
  'leading-tight',
  'transition-colors',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-[color:var(--brand)]',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-[color:var(--background)]',
].join(' ');

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

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
        // -------------------------------------------------------------------
        // Action content boundary
        // -------------------------------------------------------------------
        //
        // The parent owns the marketplace column width and outer section
        // padding.
        //
        // `justify-end` is intentional. Actions sit toward the lower part of
        // the marketplace row instead of competing vertically with the price.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-end',

        // -------------------------------------------------------------------
        // Responsive internal density
        // -------------------------------------------------------------------

        'gap-1',
        'sm:gap-1.5',
        'md:gap-2',

        // -------------------------------------------------------------------
        // Small separation from the marketplace information above.
        //
        // This is internal action spacing, not marketplace-level padding.
        // -------------------------------------------------------------------

        'pt-1.5',
        'sm:pt-2',
        'md:pt-2.5',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------ */}
      {/* View Journey                                                       */}
      {/* ------------------------------------------------------------------ */}

      <Link
        href={viewHref}
        aria-disabled={viewDisabled}
        tabIndex={viewDisabled ? -1 : undefined}
        onClick={viewDisabled ? handleDisabledClick : undefined}
        className={[
          ACTION_BASE,

          viewDisabled
            ? [
                'cursor-not-allowed',
                'border',
                'border-[var(--border)]',
                'text-[var(--foreground-subtle)]',
                'opacity-60',
                'pointer-events-none',
              ].join(' ')
            : [
                'border',
                'border-[var(--border)]',
                'bg-[var(--background)]',
                'text-[var(--foreground)]',
                'hover:border-[var(--border-strong)]',
                'hover:bg-[var(--background-muted)]',
              ].join(' '),
        ].join(' ')}
      >
        View
      </Link>

      {/* ------------------------------------------------------------------ */}
      {/* Book                                                                */}
      {/* ------------------------------------------------------------------ */}

      {bookHref && (
        <Link
          href={bookHref}
          aria-disabled={bookDisabled}
          tabIndex={bookDisabled ? -1 : undefined}
          onClick={bookDisabled ? handleDisabledClick : undefined}
          className={[
            ACTION_BASE,

            bookDisabled
              ? [
                  'cursor-not-allowed',
                  'bg-[var(--brand)]',
                  'text-white',
                  'opacity-50',
                  'pointer-events-none',
                ].join(' ')
              : [
                  'bg-[var(--brand)]',
                  'text-white',
                  'hover:bg-[var(--brand-hover)]',
                ].join(' '),
          ].join(' ')}
        >
          Book
        </Link>
      )}
    </div>
  );
}