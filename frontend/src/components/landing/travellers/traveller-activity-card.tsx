// -----------------------------------------------------------------------------
// sisiMove — Traveller Activity Card
// -----------------------------------------------------------------------------
//
// Traveller-first activity card for public discovery.
//
// Responsibilities:
// - Present a traveller's public identity and trust summary
// - Present one journey or demand activity
// - Present optional activity actions
// - Keep the traveller visually primary
// - Remain independent of API calls, routing, and domain logic
//
// Architectural boundary:
// - Presentation-only component
// - Does not own discovery state
// - Does not fetch data
// - Does not perform authentication
// - Does not perform routing
// - Does not contain Commercial or Financial information
// - Does not define an alternative traveller/domain model
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import type {
  PublicTravellerActivityType,
} from '@/features/traveller-discovery';

import { Card } from '../../ui';

import { cn } from '../../../foundation/utils/cn';

import { TravellerActivityType } from './traveller-activity-type';
import { TravellerSummary } from './traveller-summary';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerActivityCardType =
  PublicTravellerActivityType;

export interface TravellerActivityCardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
  > {
  /**
   * Type of traveller activity.
   *
   * Mirrors the public discovery activity contract.
   */
  readonly type: TravellerActivityCardType;

  /**
   * Public traveller handle.
   */
  readonly handle: string;

  /**
   * Optional traveller avatar URL.
   */
  readonly avatarUrl?: string | null;

  /**
   * Whether the traveller has a public verified status.
   */
  readonly verified?: boolean;

  /**
   * Public verification level.
   */
  readonly verificationLevel?:
    | 'NONE'
    | 'BASIC'
    | 'VERIFIED'
    | string
    | null;

  /**
   * Traveller rating score.
   */
  readonly rating?: number | null;

  /**
   * Number of ratings received.
   */
  readonly ratingCount?: number | null;

  /**
   * Number of completed journeys.
   */
  readonly completedJourneys?: number | null;

  /**
   * Activity content.
   *
   * Typically TravellerJourney or TravellerDemand.
   */
  readonly children: ReactNode;

  /**
   * Optional action associated with the activity.
   *
   * The parent decides whether this is a Link, Button,
   * or another presentation element.
   */
  readonly action?: ReactNode;

  /**
   * Optional replacement for the default traveller/activity header.
   *
   * When supplied, the default header is not rendered.
   */
  readonly headerContent?: ReactNode;

  /**
   * Optional replacement for the default footer.
   *
   * When omitted, action is used.
   */
  readonly footerContent?: ReactNode;

  /**
   * Whether to display the activity type.
   */
  readonly showActivityType?: boolean;

  /**
   * Whether to display traveller trust information.
   */
  readonly showTrust?: boolean;

  /**
   * Card presentation variant.
   */
  readonly variant?: 'default' | 'muted' | 'outlined';

  /**
   * Card padding.
   */
  readonly padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * Whether the card receives interactive styling.
   */
  readonly interactive?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerActivityCard({
  type,
  handle,
  avatarUrl,
  verified = false,
  verificationLevel = verified ? 'VERIFIED' : 'NONE',
  rating = null,
  ratingCount = 0,
  completedJourneys = 0,
  children,
  action,
  headerContent,
  footerContent,
  showActivityType = true,
  showTrust = true,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className,
  ...props
}: TravellerActivityCardProps) {
  const resolvedHeaderContent =
    headerContent ?? (
      <div className="min-w-0">
        {showActivityType && (
          <div className="mb-4">
            <TravellerActivityType type={type} />
          </div>
        )}

        <TravellerSummary
          handle={handle}
          avatarUrl={avatarUrl}
          verified={verified}
          verificationLevel={verificationLevel}
          rating={rating}
          ratingCount={ratingCount}
          completedJourneys={completedJourneys}
          showTrust={showTrust}
        />
      </div>
    );

  const resolvedFooterContent =
    footerContent ?? action;

  return (
    <Card
      {...props}
      variant={variant}
      padding={padding}
      interactive={interactive}
      header={resolvedHeaderContent}
      footer={
        resolvedFooterContent ? (
          <div className="w-full">
            {resolvedFooterContent}
          </div>
        ) : undefined
      }
      className={cn(
        'w-full',
        className,
      )}
    >
      <div className="min-w-0">
        {children}
      </div>
    </Card>
  );
}