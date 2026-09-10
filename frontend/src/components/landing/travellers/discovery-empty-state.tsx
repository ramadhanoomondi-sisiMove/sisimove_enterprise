// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Empty State
// -----------------------------------------------------------------------------
//
// Presentation component for an empty public Journey discovery result.
//
// Public discovery is Journey-first:
//
// - Published Journeys are the primary discovery result.
// - When no Journey is available for a search, the traveller should have a
//   clear path to create a Journey Demand.
// - A Journey Demand allows the traveller to express where and when they want
//   to travel and can later be matched when a suitable Journey is published.
//
// This component presents the empty discovery state supplied by its parent.
//
// Responsibilities:
// - Present an appropriate empty state for public Journey discovery.
// - Distinguish between an unsearched discovery state and a constrained search
//   with no published Journey available.
// - Explain the value of creating a Journey Demand when appropriate.
// - Allow the parent composition to provide actions.
// - Remain independent of routing, API calls, authentication, and business
//   rules.
//
// This component does not:
// - fetch discovery data;
// - perform search or filtering;
// - create Journey Demands;
// - determine whether a Journey should be published;
// - determine matching eligibility;
// - resolve traveller identity;
// - perform booking;
// - perform routing or navigation.
//
// Architectural boundary:
//
// Discovery composition
//        ↓
// DiscoveryEmptyState
//        ↓
// parent-controlled action
//        ↓
// Journey Demand / search / other flow
//
// The empty state does not know what an action does. The parent owns the
// behavior supplied through the action props.
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
   *
   * For example, the parent may use this action to:
   * - open Journey Demand creation;
   * - navigate to another discovery state;
   * - change the current search;
   * - scroll to relevant public demand.
   *
   * This component does not interpret the action.
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
   * Whether the empty result represents a constrained Journey search.
   *
   * This flag describes the state supplied by the parent. It does not cause
   * this component to perform filtering or search.
   *
   * When true, the default empty state communicates that no published Journey
   * is currently available for the requested search and that the traveller
   * can create a Journey Demand instead.
   */
  readonly hasSearchCriteria?: boolean;

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
  hasSearchCriteria = false,
  className,
}: DiscoveryEmptyStateProps) {
  const resolvedTitle =
    title ??
    (hasSearchCriteria
      ? 'No journey available yet'
      : 'No journeys available yet');

  const resolvedDescription =
    description ??
    (hasSearchCriteria
      ? 'No one has published a journey for your search yet. Create a travel demand and we’ll notify you when a matching journey is published.'
      : 'Published journeys will appear here. You can also create a travel demand if you already know where and when you want to travel.');

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