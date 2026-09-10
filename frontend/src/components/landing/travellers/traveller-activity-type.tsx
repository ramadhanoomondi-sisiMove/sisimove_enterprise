// -----------------------------------------------------------------------------
// sisiMove — Traveller Activity Type
// -----------------------------------------------------------------------------
//
// Presentation component that communicates the type of public activity:
//
// - JOURNEY — a published journey with available travel capacity.
// - DEMAND  — a published journey demand from someone looking to travel.
//
// Responsibilities:
// - Translate the public activity type into user-facing language.
// - Render the activity type as a visual badge.
// - Provide an appropriate visual distinction between journeys and demands.
//
// This component does not:
// - fetch activity data;
// - determine activity state;
// - perform filtering;
// - perform routing;
// - perform authentication or authorization;
// - contain Journey, Booking, Commercial, or Financial logic;
// - depend on the obsolete PublicTravellerDiscovery model.
//
// Architectural note:
// The activity type is a presentation concern. The component retains its
// existing name and file boundary to avoid unnecessary file churn.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Badge } from '../../ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerActivityType =
  | 'JOURNEY'
  | 'DEMAND';

export interface TravellerActivityTypeProps {
  /**
   * Type of public activity being presented.
   */
  readonly type: TravellerActivityType;

  /**
   * Optional custom label.
   *
   * When omitted:
   * - JOURNEY → Journey
   * - DEMAND  → Demand
   */
  readonly label?: ReactNode;

  /**
   * Badge size.
   */
  readonly size?: 'sm' | 'md';
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getDefaultLabel(
  type: TravellerActivityType,
): string {
  switch (type) {
    case 'JOURNEY':
      return 'Journey';

    case 'DEMAND':
      return 'Demand';
  }
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function JourneyIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="h-3.5 w-3.5"
    >
      <path
        d="M4 15.5h12M5.25 15.5V8.75l4.75-4.25 4.75 4.25v6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 15.5v-3.75h4v3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DemandIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="h-3.5 w-3.5"
    >
      <path
        d="M4 5.25h12M4 9.25h9M4 13.25h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <circle
        cx="15"
        cy="13.25"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M15 12v1.25l.75.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerActivityType({
  type,
  label,
  size = 'sm',
}: TravellerActivityTypeProps) {
  const resolvedLabel =
    label ?? getDefaultLabel(type);

  switch (type) {
    case 'JOURNEY':
      return (
        <Badge
          variant="brand"
          size={size}
          leadingContent={<JourneyIcon />}
        >
          {resolvedLabel}
        </Badge>
      );

    case 'DEMAND':
      return (
        <Badge
          variant="outline"
          size={size}
          leadingContent={<DemandIcon />}
        >
          {resolvedLabel}
        </Badge>
      );
  }
}