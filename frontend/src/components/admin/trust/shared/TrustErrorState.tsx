
/**
 * sisiMove — Trust Error State
 *
 * Domain-specific error-state adapter for the Trust administration feature.
 *
 * Responsibilities:
 * - Present recoverable Trust data and operation errors.
 * - Preserve the shared design system's error-state styling.
 * - Support retry and secondary actions.
 * - Keep the shared ErrorState component as the single source of UI behavior.
 *
 * Non-responsibilities:
 * - Interpreting API errors.
 * - Performing retries automatically.
 * - Exposing backend error details or internal diagnostics.
 */

import type { ReactNode } from 'react';

import {
  ErrorState,
  type ErrorStateAction,
} from '@/components/ui/error-state';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustErrorStateVariant =
  | 'load'
  | 'action'
  | 'permission'
  | 'not-found'
  | 'generic';

export interface TrustErrorStateProps {
  /**
   * Error category used to select sensible default copy.
   */
  variant?: TrustErrorStateVariant;

  /**
   * Optional heading override.
   */
  title?: string;

  /**
   * Optional supporting description override.
   */
  description?: string;

  /**
   * Optional icon displayed above the heading.
   */
  icon?: ReactNode;

  /**
   * Retry action, typically connected to a query refetch function.
   */
  retryAction?: ErrorStateAction;

  /**
   * Optional secondary action, such as navigating back.
   */
  secondaryAction?: ErrorStateAction;

  /**
   * Additional classes applied to the shared error-state root.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const ERROR_COPY: Record<
  TrustErrorStateVariant,
  { title: string; description: string }
> = {
  load: {
    title: 'Unable to load Trust data',
    description:
      'The Trust information could not be loaded. Please try again.',
  },
  action: {
    title: 'Unable to complete the action',
    description:
      'The Trust operation could not be completed. Please try again.',
  },
  permission: {
    title: 'Access unavailable',
    description:
      'You may not have permission to view or manage this Trust information.',
  },
  'not-found': {
    title: 'Trust record not found',
    description:
      'This Trust record may no longer exist or may be unavailable.',
  },
  generic: {
    title: 'Something went wrong',
    description:
      'We could not complete your request. Please try again.',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustErrorState({
  variant = 'generic',
  title,
  description,
  icon,
  retryAction,
  secondaryAction,
  className,
}: TrustErrorStateProps) {
  const defaults = ERROR_COPY[variant];

  const canRetry = variant !== 'permission' && variant !== 'not-found';

  return (
    <ErrorState
      icon={icon}
      title={title ?? defaults.title}
      description={description ?? defaults.description}
      retryAction={canRetry ? retryAction : undefined}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default TrustErrorState;
