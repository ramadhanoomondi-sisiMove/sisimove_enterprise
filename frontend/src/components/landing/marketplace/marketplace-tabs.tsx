// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Tabs
// -----------------------------------------------------------------------------
//
// Navigation control for the public marketplace.
//
// The marketplace contains three presentation scopes:
//
//     ALL
//         Published Journeys and published Journey Demands.
//
//     JOURNEY
//         Published travel supply.
//
//     DEMAND
//         Published travel demand.
//
// This component only presents and selects the marketplace scope.
//
// It does not:
//
// - fetch marketplace data;
// - perform filtering;
// - perform sorting;
// - manipulate URL state;
// - determine which items exist;
// - contain Journey business rules;
// - contain Journey Demand business rules.
//
// The parent/application boundary owns the actual marketplace query state.
//
// -----------------------------------------------------------------------------
// CONTROLLED INTERACTION
// -----------------------------------------------------------------------------
//
//     MarketplaceTabs
//          │
//          │ onChange("JOURNEY")
//          ↓
//     MarketplaceSection / marketplace state owner
//          │
//          ↓
//     PublicMarketplaceQuery.type
//
// The component is intentionally controlled.
//
// -----------------------------------------------------------------------------
// VISUAL BEHAVIOR
// -----------------------------------------------------------------------------
//
// The selected marketplace stream is immediately recognizable.
//
// Active:
//
//     ┌────────────────┐
//     │ ● Journeys     │
//     └────────────────┘
//
// Inactive:
//
//     ┌─────────────┐
//     │  Journeys   │
//     └─────────────┘
//
// The active tab uses the sisiMove brand treatment.
// Inactive tabs remain quiet until hovered.
//
// -----------------------------------------------------------------------------
// RESPONSIVE BEHAVIOR
// -----------------------------------------------------------------------------
//
// MarketplaceTabs is mobile-first.
//
// The tabs:
//
// - remain compact;
// - wrap when necessary;
// - never create horizontal page overflow;
// - remain comfortably touchable;
// - do not introduce horizontal scrolling.
//
// -----------------------------------------------------------------------------

import type { PublicMarketplaceType } from '@/features/public-marketplace/models/public-marketplace-query';

import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

export interface MarketplaceTabsProps {
  /**
   * Currently selected marketplace scope.
   *
   * The parent owns this state.
   */
  readonly value: PublicMarketplaceType;

  /**
   * Called when the visitor selects another marketplace scope.
   *
   * The component reports the requested scope but does not update application
   * state itself.
   */
  readonly onChange: (
    value: PublicMarketplaceType,
  ) => void;

  /**
   * Optional additional classes applied to the tab navigation container.
   */
  readonly className?: string;
}

// =============================================================================
// Tab Definition
// =============================================================================
//
// Labels describe marketplace discovery scopes rather than domain lifecycle
// states.
//
// The values intentionally use the actual PublicMarketplaceType values.
// -----------------------------------------------------------------------------

const MARKETPLACE_TABS: ReadonlyArray<{
  readonly value: PublicMarketplaceType;
  readonly label: string;
}> = [
  {
    value: 'ALL',
    label: 'All',
  },
  {
    value: 'JOURNEY',
    label: 'Journeys',
  },
  {
    value: 'DEMAND',
    label: 'Demand',
  },
];

// =============================================================================
// Marketplace Tabs
// =============================================================================

export function MarketplaceTabs({
  value,
  onChange,
  className,
}: MarketplaceTabsProps) {
  return (
    <nav
      aria-label="Marketplace scope"
      className={cn(
        'flex min-w-0 flex-wrap items-center',
        'gap-1',
        className,
      )}
    >
      {MARKETPLACE_TABS.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              // -----------------------------------------------------------------
              // Base control
              // -----------------------------------------------------------------

              'inline-flex min-h-9 shrink-0',
              'items-center justify-center gap-1.5',
              'rounded-full',
              'border',
              'px-3 py-1.5',
              'text-sm font-medium',
              'leading-5',

              // -----------------------------------------------------------------
              // Interaction
              // -----------------------------------------------------------------

              'transition-all duration-150',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
              'focus-visible:ring-offset-[var(--background)]',

              // -----------------------------------------------------------------
              // Active / inactive state
              // -----------------------------------------------------------------

              isActive
                ? cn(
                    'border-[var(--brand)]',
                    'bg-[var(--brand)]',
                    'text-[var(--brand-foreground)]',
                    'shadow-[var(--shadow-sm)]',
                  )
                : cn(
                    'border-transparent',
                    'bg-transparent',
                    'text-[var(--foreground-secondary)]',
                    'hover:border-[var(--border)]',
                    'hover:bg-[var(--background-subtle)]',
                    'hover:text-[var(--foreground)]',
                  ),
            )}
          >
            {isActive && (
              <span
                aria-hidden="true"
                className={cn(
                  'h-1.5 w-1.5 shrink-0',
                  'rounded-full',
                  'bg-[var(--brand-foreground)]',
                )}
              />
            )}

            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}