// -----------------------------------------------------------------------------
// sisiMove — Traveller Route
// -----------------------------------------------------------------------------
//
// Presentation component for a public traveller route.
//
// Responsibilities:
// - Render a concise origin → destination route.
// - Optionally render public intermediate waypoints.
// - Support horizontal and vertical presentations.
// - Remain independent of Journey/Community domain models.
//
// This component does not:
// - calculate routes;
// - resolve locations;
// - expose private pickup/drop-off points;
// - determine route eligibility;
// - access Journey APIs.
//
// The component accepts already-mapped public location strings. Structured
// Journey waypoint models are intentionally kept outside this presentation
// component.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerRouteOrientation =
  | 'horizontal'
  | 'vertical';

export type TravellerRouteSize =
  | 'sm'
  | 'md';

export interface TravellerRouteProps {
  /**
   * Public origin location.
   */
  readonly origin: string;

  /**
   * Public destination location.
   */
  readonly destination: string;

  /**
   * Optional public intermediate waypoints.
   *
   * The parent is responsible for mapping structured route waypoints into
   * display names.
   */
  readonly waypoints?: readonly string[];

  /**
   * Whether intermediate waypoints should be displayed.
   */
  readonly showWaypoints?: boolean;

  /**
   * Optional content rendered before the route.
   */
  readonly leadingContent?: ReactNode;

  /**
   * Optional label displayed above the route.
   */
  readonly label?: ReactNode;

  /**
   * Route orientation.
   */
  readonly orientation?: TravellerRouteOrientation;

  /**
   * Presentation size.
   */
  readonly size?: TravellerRouteSize;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeLocation(
  value: string,
): string | null {
  const normalized = value.trim();

  return normalized || null;
}

function normalizeWaypoints(
  waypoints: readonly string[] | undefined,
): string[] {
  if (!waypoints?.length) {
    return [];
  }

  return waypoints
    .map(normalizeLocation)
    .filter(
      (waypoint): waypoint is string =>
        waypoint !== null,
    );
}

// -----------------------------------------------------------------------------
// Route Connector
// -----------------------------------------------------------------------------

function RouteConnector({
  orientation,
  size,
}: {
  readonly orientation: TravellerRouteOrientation;
  readonly size: TravellerRouteSize;
}) {
  if (orientation === 'vertical') {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'ml-[3px]',
          'h-5',
          'border-l',
          'border-[var(--border)]',
          size === 'md'
            ? 'ml-[4px]'
            : undefined,
        )}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={
        size === 'sm'
          ? 'h-3.5 w-3.5 shrink-0'
          : 'h-4 w-4 shrink-0'
      }
    >
      <path
        d="M3 8h9M9 5l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Route Point
// -----------------------------------------------------------------------------

function RoutePoint({
  location,
  isOrigin,
  isDestination,
  size,
}: {
  readonly location: string;
  readonly isOrigin: boolean;
  readonly isDestination: boolean;
  readonly size: TravellerRouteSize;
}) {
  const isEndpoint =
    isOrigin || isDestination;

  return (
    <div
      className={cn(
        'flex',
        'min-w-0',
        'items-center',
        'gap-2',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0',
          'rounded-[var(--radius-full)]',
          isOrigin
            ? 'bg-[var(--brand)]'
            : isDestination
              ? 'bg-[var(--foreground)]'
              : 'bg-[var(--border-strong)]',
          size === 'sm'
            ? 'h-2 w-2'
            : 'h-2.5 w-2.5',
        )}
      />

      <span
        className={cn(
          'min-w-0',
          'truncate',
          size === 'sm'
            ? 'text-sm'
            : 'text-base',
          isEndpoint
            ? 'font-semibold text-[var(--foreground)]'
            : 'font-medium text-[var(--foreground-secondary)]',
        )}
        title={location}
      >
        {location}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerRoute({
  origin,
  destination,
  waypoints,
  showWaypoints = false,
  leadingContent,
  label,
  orientation = 'horizontal',
  size = 'sm',
  className,
}: TravellerRouteProps) {
  const normalizedOrigin =
    normalizeLocation(origin);

  const normalizedDestination =
    normalizeLocation(destination);

  const normalizedWaypoints =
    showWaypoints
      ? normalizeWaypoints(waypoints)
      : [];

  if (
    !normalizedOrigin ||
    !normalizedDestination
  ) {
    return null;
  }

  const locations = [
    normalizedOrigin,
    ...normalizedWaypoints,
    normalizedDestination,
  ];

  return (
    <div
      className={cn(
        'min-w-0',
        'w-full',
        className,
      )}
    >
      {leadingContent && (
        <div className="mb-2">
          {leadingContent}
        </div>
      )}

      {label && (
        <div
          className={cn(
            'mb-1.5',
            size === 'sm'
              ? 'text-xs'
              : 'text-sm',
            'font-medium',
            'text-[var(--foreground-muted)]',
          )}
        >
          {label}
        </div>
      )}

      <div
        aria-label={`${normalizedOrigin} to ${normalizedDestination}`}
        className={cn(
          'min-w-0',
          orientation === 'horizontal'
            ? 'flex flex-wrap items-center gap-x-2 gap-y-2'
            : 'flex flex-col items-start',
        )}
      >
        {locations.map(
          (location, index) => {
            const isOrigin =
              index === 0;

            const isDestination =
              index === locations.length - 1;

            return (
              <div
                key={`${location}-${index}`}
                className={cn(
                  'min-w-0',
                  orientation === 'horizontal'
                    ? 'inline-flex items-center gap-2'
                    : 'flex flex-col items-start',
                )}
              >
                <RoutePoint
                  location={location}
                  isOrigin={isOrigin}
                  isDestination={isDestination}
                  size={size}
                />

                {!isDestination && (
                  <div
                    className={cn(
                      orientation === 'horizontal'
                        ? 'shrink-0 text-[var(--foreground-subtle)]'
                        : 'ml-[3px] py-1',
                    )}
                  >
                    <RouteConnector
                      orientation={orientation}
                      size={size}
                    />
                  </div>
                )}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}