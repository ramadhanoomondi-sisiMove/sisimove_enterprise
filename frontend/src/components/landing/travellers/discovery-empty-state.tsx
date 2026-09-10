// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Empty State
// -----------------------------------------------------------------------------
//
// Presentation component for an empty public Journey discovery result.
//
// Public discovery is Journey-first:
//
// - Published Journeys are the primary discovery result.
// - Open Journey Demands are an additional public discovery stream.
// - This component presents the absence of results supplied by the parent.
//
// Responsibilities:
// - Present an appropriate empty state for public discovery.
// - Distinguish between an unfiltered discovery result and a constrained result.
// - Allow the parent composition to provide actions.
// - Remain independent of routing, API calls, authentication, and business
//   rules.
//
// This component does not:
// - fetch discovery data;
// - perform search or filtering;
// - determine whether a Journey should be published;
// - determine matching eligibility;
// - resolve traveller identity;
// - perform booking.
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
  /**
   * Visible action label.
   */
  readonly label: string;

  /**
   * Optional presentation content displayed before the label.
   */
  readonly leadingContent?: ReactNode;

  /**
   * Visual treatment of the action.
   */
  readonly variant?: DiscoveryEmptyStateActionVariant;

  /**
   * Optional action handler.
   *
   * The parent composition layer owns the behavior.
   */
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
   * Whether the empty result represents a constrained discovery request.
   *
   * This flag describes the state supplied by the parent. It does not cause
   * this component to perform filtering or search.
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
      ? 'No journeys match your search'
      : 'No journeys available yet');

  const resolvedDescription =
    description ??
    (hasFilters
      ? 'Try a different route or date to see other journeys.'
      : 'Published journeys and open travel requests will appear here.');

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
      {/* ------------------------------------------------------------------- */}
      {/* Journey / traveller representation                                  */}
      {/* ------------------------------------------------------------------- */}

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

      {/* ------------------------------------------------------------------- */}
      {/* Additional participant                                              */}
      {/* ------------------------------------------------------------------- */}

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