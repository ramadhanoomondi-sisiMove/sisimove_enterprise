// -----------------------------------------------------------------------------
// sisiMove — Traveller Activity List
// -----------------------------------------------------------------------------
//
// Collection component for public Journey discovery.
//
// The Journey is the discovery object. This component is intentionally a
// generic presentation collection: the parent supplies the already-resolved
// card content and optional presentation controls.
//
// Responsibilities:
// - Render a collection of public activity cards.
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
// - resolve traveller identity;
// - transform API responses;
// - inspect Journey or Journey Demand domain models.
//
// The parent discovery/container layer owns discovery state and data retrieval.
//
// Component names and the existing file boundary are intentionally retained
// to avoid unnecessary file churn while public discovery terminology is being
// aligned around journeys.
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
} from './traveller-activity-card';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Presentation item for the public activity list.
 *
 * The parent/container is responsible for resolving the activity and supplying
 * its presentation content. The list does not know whether that content is a
 * Journey, Demand, or another supported public activity.
 */
export interface TravellerActivityListItem {
  /**
   * Stable public identifier used as the React rendering key.
   *
   * For Journey-first discovery this should normally be the Journey public ID.
   */
  readonly publicId: string;

  /**
   * Activity presentation content.
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
   *
   * The parent owns the header presentation.
   */
  readonly headerContent?: ReactNode;

  /**
   * Optional replacement footer.
   *
   * When omitted, `action` is used.
   */
  readonly footerContent?: ReactNode;

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
  readonly interactive?: TravellerActivityCardProps['interactive'];
}

export interface TravellerActivityListProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
  > {
  /**
   * Public activities to display.
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
      {items.map((item) => (
        <TravellerActivityCard
          key={item.publicId}
          action={item.action}
          headerContent={item.headerContent}
          footerContent={item.footerContent}
          variant={item.variant}
          padding={item.padding}
          interactive={item.interactive}
        >
          {item.content}
        </TravellerActivityCard>
      ))}
    </div>
  );
}