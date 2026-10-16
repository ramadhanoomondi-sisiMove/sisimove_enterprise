
// -----------------------------------------------------------------------------
// sisiMove — Member Empty State
// -----------------------------------------------------------------------------
//
// Member-specific empty-state presentation for the Admin Members feature.
//
// Responsibilities:
// - Communicate when a member collection or section has no content.
// - Provide member-contextual title and supporting description.
// - Support optional primary and secondary actions.
// - Delegate rendering and action styling to the shared EmptyState.
//
// Non-responsibilities:
// - Fetching member data.
// - Determining loading or error states.
// - Performing member-management operations directly.
//
// Architecture:
//
// MemberEmptyState
//        │
//        ▼
//   shared EmptyState
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  EmptyState,
  type EmptyStateAction,
} from '@/components/ui/empty-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberEmptyStateProps {
  /**
   * Main empty-state heading.
   */
  readonly title: string;

  /**
   * Optional supporting description.
   */
  readonly description?: string;

  /**
   * Optional visual element displayed above the title.
   */
  readonly icon?: ReactNode;

  /**
   * Optional primary action.
   *
   * The parent supplies the action handler.
   */
  readonly primaryAction?: EmptyStateAction;

  /**
   * Optional secondary action.
   *
   * The parent supplies the action handler.
   */
  readonly secondaryAction?: EmptyStateAction;

  /**
   * Optional additional presentation classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Member Empty State
// -----------------------------------------------------------------------------

export function MemberEmptyState({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  className,
}: MemberEmptyStateProps): ReactNode {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={icon}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default MemberEmptyState;
