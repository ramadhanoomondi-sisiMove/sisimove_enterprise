// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Header
// -----------------------------------------------------------------------------
//
// Compact presentation header for the public marketplace.
//
// The landing hero introduces the journey market. This component does not
// repeat that introduction.
//
// Its responsibility is to establish the marketplace discovery surface and
// provide concise context for the marketplace stream currently selected.
//
//     MARKET
//     Browse the marketplace
//     Browse available journeys and travel plans.
//
// The selected stream is supplied by the parent marketplace boundary.
//
// This component does NOT:
//
// - fetch marketplace data;
// - own marketplace query state;
// - update URL state;
// - perform filtering;
// - perform sorting;
// - determine whether marketplace items exist;
// - contain Journey business logic;
// - contain Journey Demand business logic;
// - render marketplace results;
// - render marketplace tabs.
//
// MarketplaceTabs owns the interactive stream selection control.
//
// -----------------------------------------------------------------------------

import {
  CarFront,
  Store,
  UsersRound,
} from 'lucide-react';

import type { PublicMarketplaceType } from '@/features/public-marketplace/models/public-marketplace-query';

import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

export interface MarketplaceHeaderProps {
  /**
   * Currently selected marketplace stream.
   *
   * The parent marketplace boundary owns this state.
   */
  readonly type: PublicMarketplaceType;

  /**
   * Optional additional classes applied to the header container.
   */
  readonly className?: string;
}

// =============================================================================
// Presentation helpers
// =============================================================================

function getMarketplaceDescription(
  type: PublicMarketplaceType,
): string {
  switch (type) {
    case 'JOURNEY':
      return 'Browse published journeys with available seats.';

    case 'DEMAND':
      return 'Browse travel plans looking for a match.';

    case 'ALL':
    default:
      return 'Browse available journeys and travel plans.';
  }
}

// =============================================================================
// Marketplace Scope Icon
// =============================================================================
//
// Keep this component stable outside MarketplaceHeader's render.
//
// Do not return a Lucide component from a render-time helper and then render
// that returned component as <MarketplaceIcon />. React/compiler rules treat
// that as creating a component during render.
//
// Instead, this stable component owns the switch and renders the appropriate
// Lucide component directly.
// -----------------------------------------------------------------------------

function MarketplaceScopeIcon({
  type,
}: {
  readonly type: PublicMarketplaceType;
}) {
  switch (type) {
    case 'JOURNEY':
      return (
        <CarFront
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
      );

    case 'DEMAND':
      return (
        <UsersRound
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
      );

    case 'ALL':
    default:
      return (
        <Store
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
      );
  }
}

// =============================================================================
// Marketplace Header
// =============================================================================

export function MarketplaceHeader({
  type,
  className,
}: MarketplaceHeaderProps) {
  const description = getMarketplaceDescription(type);

  return (
    <header
      aria-labelledby="marketplace-heading"
      className={cn(
        'min-w-0',
        className,
      )}
    >
      {/* =====================================================================
          Marketplace identity

          The icon changes with the selected marketplace scope. The icon
          itself is rendered by a stable component declared outside this
          render function.
      ===================================================================== */}

      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center',
            'rounded-[var(--radius-sm)]',
            'bg-[var(--brand-soft)]',
            'text-[var(--brand)]',
          )}
        >
          <MarketplaceScopeIcon type={type} />
        </span>

        <p
          className={cn(
            'text-[9px] font-semibold uppercase',
            'tracking-[0.16em]',
            'text-[var(--brand)]',
            'sm:text-[10px]',
          )}
        >
          Market
        </p>
      </div>

      {/* =====================================================================
          Marketplace context
      ===================================================================== */}

      <div className="mt-1.5 min-w-0">
        <h2
          id="marketplace-heading"
          className={cn(
            'text-lg font-semibold',
            'tracking-[-0.02em]',
            'text-[var(--foreground)]',
            'sm:text-xl',
          )}
        >
          Browse the marketplace
        </h2>

        <p
          className={cn(
            'mt-0.5 max-w-2xl',
            'text-xs leading-5',
            'text-[var(--foreground-muted)]',
            'sm:text-sm sm:leading-6',
          )}
        >
          {description}
        </p>
      </div>
    </header>
  );
}