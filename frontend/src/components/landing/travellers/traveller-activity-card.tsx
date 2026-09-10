// -----------------------------------------------------------------------------
// sisiMove — Traveller Activity Card
// -----------------------------------------------------------------------------
//
// Public activity card shell for Journey-first discovery.
//
// The Journey is the discovery object. This component provides the reusable
// card presentation around the supplied activity content.
//
// Responsibilities:
// - Present one public Journey or Demand activity.
// - Provide optional presentation header content.
// - Provide optional activity actions.
// - Provide consistent card presentation.
// - Remain independent of API calls, routing, and domain logic.
//
// This component does NOT:
// - fetch data;
// - own discovery state;
// - resolve traveller identity;
// - calculate trust;
// - perform authentication;
// - perform routing;
// - contain Commercial or Financial logic;
// - depend on the obsolete PublicTravellerDiscovery model.
//
// Architectural note:
// The existing component name is intentionally retained to avoid unnecessary
// file churn while the public discovery presentation is being aligned around
// Journey-first discovery.
//
// Traveller-specific presentation, when legitimately available, is supplied
// by the parent through `headerContent` rather than being required by this
// generic card shell.
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import { Card } from '../../ui';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerActivityCardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
  > {
  /**
   * Activity content.
   *
   * Typically TravellerJourney or TravellerDemand.
   */
  readonly children: ReactNode;

  /**
   * Optional replacement header.
   *
   * The parent owns the header content and may provide Journey, traveller,
   * or other public presentation content appropriate to the context.
   */
  readonly headerContent?: ReactNode;

  /**
   * Optional action associated with the activity.
   *
   * The parent decides whether this is a Link, Button,
   * or another presentation element.
   */
  readonly action?: ReactNode;

  /**
   * Optional replacement for the default footer.
   *
   * When omitted, `action` is used.
   */
  readonly footerContent?: ReactNode;

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
  children,
  action,
  headerContent,
  footerContent,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className,
  ...props
}: TravellerActivityCardProps) {
  const resolvedFooterContent =
    footerContent ?? action;

  return (
    <Card
      {...props}
      variant={variant}
      padding={padding}
      interactive={interactive}
      header={headerContent}
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