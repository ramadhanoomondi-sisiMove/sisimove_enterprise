// -----------------------------------------------------------------------------
// sisiMove — Traveller Activity List
// -----------------------------------------------------------------------------
//
// Collection component for traveller discovery.
//
// Responsibilities:
// - Render a collection of traveller activity cards.
// - Provide the responsive grid layout.
// - Provide an optional empty state.
// - Remain independent of API calls, routing, and discovery state.
//
// This component does NOT:
// - fetch data;
// - filter data;
// - select tabs;
// - perform routing;
// - authenticate users;
// - calculate trust;
// - transform API responses.
//
// The parent discovery/container layer owns discovery state and data retrieval.
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';


import { cn } from '../../../foundation/utils/cn';

import { DiscoveryEmptyState } from './discovery-empty-state';

import {
  TravellerActivityCard,
  type TravellerActivityCardProps,
  type TravellerActivityCardType,
} from './traveller-activity-card';

import type {
  PublicTravellerActivity,
  PublicTravellerDiscoveryResult,
} from '@/features/traveller-discovery';



// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Presentation item for the activity list.
 *
 * The traveller and trust data come directly from the public discovery
 * projection. Activity data is likewise sourced from the public discovery
 * projection.
 *
 * `content`, `action`, `headerContent`, and `footerContent` remain presentation
 * concerns and are supplied by the parent/container.
 */
export interface TravellerActivityListItem {
  /**
   * Stable public activity identifier.
   *
   * This should normally be PublicTravellerActivity.publicId and is used
   * as the React rendering key.
   */
  readonly publicId: string;

  /**
   * Public discovery result containing the traveller, trust projection,
   * and activity collection.
   */
  readonly discovery: PublicTravellerDiscoveryResult;

  /**
   * Activity being rendered.
   */
  readonly activityIndex?: number;

  /**
   * Activity content.
   *
   * Usually TravellerJourney or TravellerDemand.
   */
  readonly content: ReactNode;

  /**
   * Optional action.
   *
   * Usually a Link or Button supplied by the parent.
   */
  readonly action?: ReactNode;

  /**
   * Optional replacement header.
   */
  readonly headerContent?: ReactNode;

  /**
   * Optional replacement footer.
   */
  readonly footerContent?: ReactNode;

  /**
   * Whether to display the activity type.
   */
  readonly showActivityType?: boolean;

  /**
   * Whether to display trust information.
   */
  readonly showTrust?: boolean;

  /**
   * Card presentation variant.
   */
  readonly variant?: TravellerActivityCardProps['variant'];

  /**
   * Card padding.
   */
  readonly padding?: TravellerActivityCardProps['padding'];

  /**
   * Whether the card receives interactive styling.
   */
  readonly interactive?: boolean;
}

export interface TravellerActivityListProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
  > {
  /**
   * Activities to display.
   */
  readonly items: readonly TravellerActivityListItem[];

  /**
   * Optional custom empty state.
   */
  readonly emptyState?: ReactNode;

  /**
   * Whether to render an empty state when there are no items.
   */
  readonly showEmptyState?: boolean;

  /**
   * Number of columns on larger screens.
   */
  readonly columns?: 1 | 2 | 3;

  /**
   * Gap between cards.
   */
  readonly gap?: 'sm' | 'md' | 'lg';
}

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

const columnClasses: Record<
  NonNullable<
    TravellerActivityListProps['columns']
  >,
  string
> = {
  1: 'grid-cols-1',

  2: [
    'grid-cols-1',
    'md:grid-cols-2',
  ].join(' '),

  3: [
    'grid-cols-1',
    'md:grid-cols-2',
    'xl:grid-cols-3',
  ].join(' '),
};

const gapClasses: Record<
  NonNullable<
    TravellerActivityListProps['gap']
  >,
  string
> = {
  sm: 'gap-3',

  md: [
    'gap-4',
    'md:gap-5',
  ].join(' '),

  lg: [
    'gap-5',
    'md:gap-6',
  ].join(' '),
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function resolveActivityType(
  type: PublicTravellerActivity['type'],
): TravellerActivityCardType {
  switch (type) {
    case 'JOURNEY':
      return 'JOURNEY';

    case 'DEMAND':
      return 'DEMAND';

    default: {
      const exhaustiveCheck: never = type;
      return exhaustiveCheck;
    }
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerActivityList({
  items,
  emptyState,
  showEmptyState = true,
  columns = 3,
  gap = 'md',
  className,
  ...props
}: TravellerActivityListProps) {
  if (items.length === 0) {
    if (!showEmptyState) {
      return null;
    }

    return (
      <div
        {...props}
        className={cn(
          'w-full',
          className,
        )}
      >
        {emptyState ?? (
          <DiscoveryEmptyState />
        )}
      </div>
    );
  }

  return (
    <div
      {...props}
      className={cn(
        'grid',
        'w-full',
        columnClasses[columns],
        gapClasses[gap],
        className,
      )}
    >
      {items.map((item) => {
        const activity =
          item.discovery.activities[
            item.activityIndex ?? 0
          ];

        if (!activity) {
          return null;
        }

        const {
          traveller,
          trust,
        } = item.discovery;

        return (
          <TravellerActivityCard
            key={item.publicId}
            type={resolveActivityType(
              activity.type,
            )}
            handle={
              traveller.handle
            }
            avatarUrl={
              traveller.avatarUrl
            }
            verified={
              trust.verification.verified
            }
            verificationLevel={
              trust.verification.level
            }
            rating={
              trust.rating.score
            }
            ratingCount={
              trust.rating.count
            }
            completedJourneys={
              trust.journeyHistory
                .completedJourneys
            }
            action={item.action}
            headerContent={
              item.headerContent
            }
            footerContent={
              item.footerContent
            }
            showActivityType={
              item.showActivityType
            }
            showTrust={
              item.showTrust
            }
            variant={item.variant}
            padding={item.padding}
            interactive={
              item.interactive
            }
          >
            {item.content}
          </TravellerActivityCard>
        );
      })}
    </div>
  );
}