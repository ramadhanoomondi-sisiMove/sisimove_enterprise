
/**
 * sisiMove — Trust Empty State
 *
 * Domain-specific empty-state adapter for the Trust administration feature.
 *
 * Responsibilities:
 * - Explain when a Trust collection or view contains no records.
 * - Provide context-specific default headings and descriptions.
 * - Support optional visual content and primary/secondary actions.
 * - Reuse the shared design-system EmptyState primitive.
 *
 * Non-responsibilities:
 * - Fetching or filtering Trust records.
 * - Deciding whether the current user may create or modify records.
 * - Performing navigation or mutations automatically.
 */

import type { ReactNode } from 'react';

import {
  EmptyState,
  type EmptyStateAction,
} from '@/components/ui/empty-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustEmptyStateVariant =
  | 'profiles'
  | 'ratings'
  | 'reviews'
  | 'badges'
  | 'events'
  | 'search'
  | 'generic';

export interface TrustEmptyStateProps {
  /**
   * Collection or view represented by the empty state.
   */
  variant?: TrustEmptyStateVariant;

  /**
   * Optional heading override.
   */
  title?: string;

  /**
   * Optional supporting description override.
   */
  description?: string;

  /**
   * Optional visual content displayed above the heading.
   */
  icon?: ReactNode;

  /**
   * Optional primary action, such as creating a record.
   */
  primaryAction?: EmptyStateAction;

  /**
   * Optional secondary action, such as clearing filters.
   */
  secondaryAction?: EmptyStateAction;

  /**
   * Additional classes applied to the shared empty-state root.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const EMPTY_STATE_COPY: Record<
  TrustEmptyStateVariant,
  { title: string; description: string }
> = {
  profiles: {
    title: 'No Trust profiles yet',
    description:
      'Trust profiles will appear here when they are available.',
  },
  ratings: {
    title: 'No ratings available',
    description:
      'There are no ratings to display for this profile or view.',
  },
  reviews: {
    title: 'No reviews available',
    description:
      'There are no reviews to display for this profile or view.',
  },
  badges: {
    title: 'No badges available',
    description:
      'No badges match this view. Try changing your filters or check back later.',
  },
  events: {
    title: 'No Trust activity yet',
    description:
      'Trust events will appear here when activity has been recorded.',
  },
  search: {
    title: 'No matching results',
    description:
      'Try adjusting your search or clearing some filters.',
  },
  generic: {
    title: 'Nothing to display',
    description:
      'There are no records available for this view right now.',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustEmptyState({
  variant = 'generic',
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  className,
}: TrustEmptyStateProps) {
  const defaults = EMPTY_STATE_COPY[variant];

  return (
    <EmptyState
      icon={icon}
      title={title ?? defaults.title}
      description={description ?? defaults.description}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default TrustEmptyState;
