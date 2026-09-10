// -----------------------------------------------------------------------------
// sisiMove — Traveller Vehicle
// -----------------------------------------------------------------------------
//
// Presentation component for the public vehicle information attached to a
// traveller's journey.
//
// Responsibilities:
// - Render safe, public vehicle information.
// - Compose make, model, year, and colour into a concise label.
// - Provide a consistent vehicle indicator.
//
// This component does not:
// - expose registration numbers or VINs;
// - inspect vehicle ownership;
// - perform verification;
// - validate vehicle eligibility;
// - access private vehicle information.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerVehicleSize =
  | 'sm'
  | 'md';

export interface TravellerVehicleProps {
  /**
   * Public vehicle make.
   *
   * Example: Toyota.
   */
  readonly make?: string | null;

  /**
   * Public vehicle model.
   *
   * Example: Fielder.
   */
  readonly model?: string | null;

  /**
   * Optional public model year.
   */
  readonly year?: number | null;

  /**
   * Optional public vehicle colour.
   */
  readonly color?: string | null;

  /**
   * Optional custom display label.
   *
   * When supplied, this takes precedence over the generated label.
   */
  readonly label?: ReactNode;

  /**
   * Optional leading content override.
   */
  readonly leadingContent?: ReactNode;

  /**
   * Presentation size.
   */
  readonly size?: TravellerVehicleSize;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeText(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim();

  return normalized || null;
}

function normalizeYear(
  value: number | null | undefined,
): number | null {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value) ||
    !Number.isInteger(value)
  ) {
    return null;
  }

  if (
    value < 1900 ||
    value > 2100
  ) {
    return null;
  }

  return value;
}

// -----------------------------------------------------------------------------
// Default Icon
// -----------------------------------------------------------------------------

function DefaultVehicleIcon({
  size,
}: {
  readonly size: TravellerVehicleSize;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
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
        d="M3.25 12.75V8.5a2 2 0 0 1 2-2h9.5a2 2 0 0 1 2 2v4.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M4.25 12.75h11.5v2.5h-2v-2.5h-7.5v2.5h-2v2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <circle
        cx="5.5"
        cy="15.25"
        r="1"
        fill="currentColor"
      />

      <circle
        cx="14.5"
        cy="15.25"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerVehicle({
  make,
  model,
  year,
  color,
  label,
  leadingContent,
  size = 'sm',
  className,
}: TravellerVehicleProps) {
  const normalizedMake =
    normalizeText(make);

  const normalizedModel =
    normalizeText(model);

  const normalizedColor =
    normalizeText(color);

  const normalizedYear =
    normalizeYear(year);

  const vehicleName = [
    normalizedMake,
    normalizedModel,
  ]
    .filter(Boolean)
    .join(' ');

  const vehicleDetails = [
    normalizedYear !== null
      ? String(normalizedYear)
      : null,
    normalizedColor,
  ]
    .filter(Boolean)
    .join(' ');

  const generatedLabel =
    [vehicleName, vehicleDetails]
      .filter(Boolean)
      .join(' ') || null;

  const resolvedLabel =
    label ?? generatedLabel;

  const hasLabel =
    resolvedLabel !== null &&
    resolvedLabel !== undefined;

  const hasLeadingContent =
    leadingContent !== null &&
    leadingContent !== undefined;

  if (
    !hasLabel &&
    !hasLeadingContent
  ) {
    return null;
  }

  const textSize =
    size === 'sm'
      ? 'text-xs'
      : 'text-sm';

  return (
    <div
      className={cn(
        'inline-flex',
        'min-w-0',
        'items-center',
        'gap-1.5',
        textSize,
        'text-[var(--foreground-muted)]',
        className,
      )}
    >
      {leadingContent ?? (
        <DefaultVehicleIcon
          size={size}
        />
      )}

      {hasLabel && (
        <span
          className="min-w-0 truncate"
          title={
            typeof resolvedLabel === 'string'
              ? resolvedLabel
              : undefined
          }
        >
          {resolvedLabel}
        </span>
      )}
    </div>
  );
}