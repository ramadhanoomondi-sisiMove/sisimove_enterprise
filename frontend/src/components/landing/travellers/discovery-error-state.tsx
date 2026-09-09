// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Error State
// -----------------------------------------------------------------------------
//
// Presentation component for errors occurring while loading public traveller
// discovery.
//
// Responsibilities:
// - Present a discovery-specific error message.
// - Delegate action behavior to the parent.
// - Remain independent of API, authentication, routing, and business logic.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  ErrorState,
  type ErrorStateAction,
} from '../../ui';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface DiscoveryErrorStateProps {
  /**
   * Optional error heading override.
   */
  readonly title?: string;

  /**
   * Optional error description override.
   */
  readonly description?: string;

  /**
   * Optional retry action.
   *
   * The parent component owns the retry behavior.
   */
  readonly retryAction?: ErrorStateAction;

  /**
   * Optional secondary action.
   *
   * The parent component owns the action behavior.
   */
  readonly secondaryAction?: ErrorStateAction;

  /**
   * Optional icon override.
   */
  readonly icon?: ReactNode;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DiscoveryErrorState({
  title = 'Unable to load travellers',
  description =
    'Something went wrong while loading traveller discovery. Please try again.',
  retryAction,
  secondaryAction,
  icon,
  className,
}: DiscoveryErrorStateProps) {
  return (
    <ErrorState
      icon={icon ?? <DefaultErrorIcon />}
      title={title}
      description={description}
      retryAction={retryAction}
      secondaryAction={secondaryAction}
      className={cn('min-h-56', className)}
    />
  );
}

// -----------------------------------------------------------------------------
// Default Icon
// -----------------------------------------------------------------------------

function DefaultErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="h-6 w-6"
    >
      <path
        d="M12 3.5 21 19H3L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 9v4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="16.5"
        r=".9"
        fill="currentColor"
      />
    </svg>
  );
}