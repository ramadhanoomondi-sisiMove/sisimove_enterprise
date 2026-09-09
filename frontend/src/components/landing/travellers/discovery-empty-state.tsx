// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Empty State
// -----------------------------------------------------------------------------
//
// Presentation component for an empty public traveller-discovery result.
//
// Responsibilities:
// - Present an appropriate empty state for discovery.
// - Distinguish between an unfiltered discovery state and filtered search.
// - Allow the parent composition to provide actions.
// - Remain independent of routing, API calls, authentication, and business rules.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { EmptyState } from '../../ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type DiscoveryEmptyStateActionVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost';

export interface DiscoveryEmptyStateAction {
  readonly label: string;
  readonly leadingContent?: ReactNode;
  readonly variant?: DiscoveryEmptyStateActionVariant;
  readonly onClick?: () => void;
}

export interface DiscoveryEmptyStateProps {
  /**
   * Optional title override.
   *
   * When omitted, the title is selected from the discovery context.
   */
  readonly title?: string;

  /**
   * Optional supporting message override.
   *
   * When omitted, the message is selected from the discovery context.
   */
  readonly description?: string;

  /**
   * Optional primary action.
   *
   * The parent component owns the action's behavior.
   */
  readonly primaryAction?: DiscoveryEmptyStateAction;

  /**
   * Optional secondary action.
   *
   * The parent component owns the action's behavior.
   */
  readonly secondaryAction?: DiscoveryEmptyStateAction;

  /**
   * Optional icon override.
   */
  readonly icon?: ReactNode;

  /**
   * Whether the empty result was produced by active
   * discovery criteria such as route, date, or activity type.
   */
  readonly hasFilters?: boolean;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DiscoveryEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
  hasFilters = false,
  className,
}: DiscoveryEmptyStateProps) {
  const resolvedTitle =
    title ??
    (hasFilters
      ? 'No travellers found'
      : 'No travellers to show yet');

  const resolvedDescription =
    description ??
    (hasFilters
      ? 'Try a different route or date to find people travelling your way.'
      : 'Travellers sharing journeys or looking for one will appear here.');

  return (
    <EmptyState
      icon={icon ?? <DefaultDiscoveryIcon />}
      title={resolvedTitle}
      description={resolvedDescription}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

// -----------------------------------------------------------------------------
// Default Icon
// -----------------------------------------------------------------------------

function DefaultDiscoveryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6"
      focusable="false"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.75"
      />

      <path
        d="M3.5 19c.5-3.1 2.4-5 5.5-5s5 1.9 5.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      <path
        d="M15 6.5a2.5 2.5 0 1 1 0 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      <path
        d="M16 14.5c2.2.5 3.6 2 4 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}