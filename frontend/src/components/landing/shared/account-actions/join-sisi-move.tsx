// -----------------------------------------------------------------------------
// sisiMove — Join sisiMove
// -----------------------------------------------------------------------------
//
// Reusable public account-action component for visitors who want to join
// sisiMove.
//
// Presentation-only:
// - no authentication state;
// - no API calls;
// - no registration logic;
// - no business rules.
//
// The authentication boundary owns the actual registration flow.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

// =============================================================================
// Props
// =============================================================================

export interface JoinSisiMoveProps {
  /**
   * Registration destination.
   */
  readonly href?: string;

  /**
   * Optional consumer-supplied classes.
   */
  readonly className?: string;

  /**
   * Compact presentation used by header/navigation surfaces.
   */
  readonly compact?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function JoinSisiMove({
  href = '/register',
  className,
  compact = false,
}: JoinSisiMoveProps) {
  return (
    <Link
      href={href}
      className={[
        // ---------------------------------------------------------------------
        // Base
        // ---------------------------------------------------------------------

        'inline-flex',
        'min-w-0',
        'items-center',
        'justify-center',
        'gap-2',
        'rounded-[var(--radius-md)]',
        'border',
        'font-semibold',
        'whitespace-nowrap',
        'select-none',

        // ---------------------------------------------------------------------
        // Brand-outline action
        // ---------------------------------------------------------------------
        //
        // The header should remain visually light.
        //
        // Join sisiMove is still the stronger account action, but it no
        // longer competes with the page's primary blue CTA.
        //

        'border-[color:var(--brand)]',
        'bg-[color:var(--surface)]',
        'text-[color:var(--brand)]',

        'transition-colors',
        'duration-150',
        'ease-out',

        // ---------------------------------------------------------------------
        // Hover
        // ---------------------------------------------------------------------
        //
        // A very light brand surface gives the action feedback without
        // turning the header button into a heavy solid block.
        //

        'hover:bg-[color:var(--brand-soft)]',
        'hover:border-[color:var(--brand-hover)]',
        'hover:text-[color:var(--brand-hover)]',

        // ---------------------------------------------------------------------
        // Keyboard focus
        // ---------------------------------------------------------------------

        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[color:var(--brand)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[color:var(--background)]',

        // ---------------------------------------------------------------------
        // Density
        // ---------------------------------------------------------------------

        compact
          ? [
              'min-h-9',
              'px-3.5',
              'py-1.5',
              'text-sm',
            ].join(' ')
          : [
              'min-h-10',
              'px-4',
              'py-2',
              'text-sm',
              'sm:min-h-11',
              'sm:px-5',
              'sm:py-2.5',
            ].join(' '),

        // ---------------------------------------------------------------------
        // Consumer customization
        // ---------------------------------------------------------------------

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      Join sisiMove
    </Link>
  );
}