
/* -----------------------------------------------------------------------------
 * sisiMove — Member Access Denied
 * -----------------------------------------------------------------------------
 *
 * Member-specific access-denied presentation for the Admin Members feature.
 *
 * Responsibilities:
 * - Explain when access to a member resource or action is denied.
 * - Support optional recovery and secondary actions.
 * - Delegate presentation to the shared ErrorState primitive.
 *
 * Non-responsibilities:
 * - Evaluating permissions.
 * - Fetching member data.
 * - Performing navigation or changing permissions.
 *
 * -------------------------------------------------------------------------- */

import type { ReactNode } from 'react';

import {
  ErrorState,
  type ErrorStateAction,
} from '@/components/ui/error-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberAccessDeniedProps {
  /** Optional heading for the access-denied state. */
  readonly title?: string;

  /** Supporting explanation. */
  readonly description?: string;

  /** Optional visual element displayed above the heading. */
  readonly icon?: ReactNode;

  /** Optional recovery action, supplied by the parent. */
  readonly retryAction?: ErrorStateAction;

  /** Optional secondary action, supplied by the parent. */
  readonly secondaryAction?: ErrorStateAction;

  /** Additional presentation classes. */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_TITLE = 'Access denied';

const DEFAULT_DESCRIPTION =
  'You do not have permission to view this member information or perform this action. If you believe this is a mistake, contact your administrator.';

// -----------------------------------------------------------------------------
// Member Access Denied
// -----------------------------------------------------------------------------

export function MemberAccessDenied({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  icon,
  retryAction,
  secondaryAction,
  className,
}: MemberAccessDeniedProps): ReactNode {
  return (
    <ErrorState
      icon={icon}
      title={title}
      description={description}
      retryAction={retryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default MemberAccessDenied;
