
/**
 * Path:
 * src/features/journeys/utils/journey-status.ts
 *
 * sisiMove — Journey Control Center
 * Journey lifecycle status utilities.
 *
 * Responsibilities:
 * - Define the supported Journey lifecycle statuses.
 * - Provide consistent human-readable labels.
 * - Provide semantic visual variants for status badges.
 * - Group statuses for operational filtering and summaries.
 * - Handle unknown backend values safely.
 *
 * Architectural rules:
 * - No React or UI component dependencies.
 * - No API or domain-layer dependencies.
 * - Journey statuses remain separate from booking, boarding,
 *   completion, and settlement statuses.
 */

// -----------------------------------------------------------------------------
// Journey Status
// -----------------------------------------------------------------------------

/**
 * Journey lifecycle statuses defined by the supplied backend schema.
 */
export const JOURNEY_STATUSES = [
  'DRAFT',
  'PUBLISHED',
  'FULL',
  'BOARDING',
  'IN_PROGRESS',
  'COMPLETION_PENDING',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
] as const;

export type JourneyStatus = (typeof JOURNEY_STATUSES)[number];

/**
 * Allows status utilities to safely accept unvalidated API values.
 */
export type JourneyStatusInput = string | null | undefined;

// -----------------------------------------------------------------------------
// Status Display Types
// -----------------------------------------------------------------------------

export type JourneyStatusVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type JourneyStatusGroup =
  | 'draft'
  | 'upcoming'
  | 'active'
  | 'attention'
  | 'terminal'
  | 'unknown';

export interface JourneyStatusMetadata {
  readonly label: string;
  readonly variant: JourneyStatusVariant;
  readonly group: JourneyStatusGroup;
  readonly description: string;
}

// -----------------------------------------------------------------------------
// Status Metadata
// -----------------------------------------------------------------------------

const JOURNEY_STATUS_METADATA: Record<
  JourneyStatus,
  JourneyStatusMetadata
> = {
  DRAFT: {
    label: 'Draft',
    variant: 'neutral',
    group: 'draft',
    description: 'The journey has not yet been published.',
  },

  PUBLISHED: {
    label: 'Published',
    variant: 'info',
    group: 'upcoming',
    description: 'The journey has been published.',
  },

  FULL: {
    label: 'Full',
    variant: 'warning',
    group: 'upcoming',
    description: 'The journey has reached its available capacity.',
  },

  BOARDING: {
    label: 'Boarding',
    variant: 'warning',
    group: 'active',
    description: 'The journey is in its boarding phase.',
  },

  IN_PROGRESS: {
    label: 'In Progress',
    variant: 'info',
    group: 'active',
    description: 'The journey is underway.',
  },

  COMPLETION_PENDING: {
    label: 'Completion Pending',
    variant: 'warning',
    group: 'attention',
    description: 'The journey is awaiting completion processing.',
  },

  COMPLETED: {
    label: 'Completed',
    variant: 'success',
    group: 'terminal',
    description: 'The journey has been completed.',
  },

  CANCELLED: {
    label: 'Cancelled',
    variant: 'danger',
    group: 'terminal',
    description: 'The journey has been cancelled.',
  },

  EXPIRED: {
    label: 'Expired',
    variant: 'neutral',
    group: 'terminal',
    description: 'The journey has expired.',
  },
};

const UNKNOWN_STATUS_METADATA: JourneyStatusMetadata = {
  label: 'Unknown Status',
  variant: 'neutral',
  group: 'unknown',
  description: 'The journey status is not recognized.',
};

// -----------------------------------------------------------------------------
// Normalization and Validation
// -----------------------------------------------------------------------------

/**
 * Normalizes an external status value for comparison.
 *
 * Returns null for absent or empty values.
 */
export function normalizeJourneyStatus(
  status: JourneyStatusInput,
): string | null {
  const normalized = status?.trim().toUpperCase();

  return normalized || null;
}

/**
 * Checks whether an external value matches a supported Journey status.
 */
export function isJourneyStatus(
  status: JourneyStatusInput,
): status is JourneyStatus {
  const normalized = normalizeJourneyStatus(status);

  return (
    normalized !== null &&
    JOURNEY_STATUSES.some((candidate) => candidate === normalized)
  );
}

/**
 * Converts an external status into a supported JourneyStatus.
 *
 * Returns null rather than pretending an unknown status is valid.
 */
export function toJourneyStatus(
  status: JourneyStatusInput,
): JourneyStatus | null {
  const normalized = normalizeJourneyStatus(status);

  if (
    normalized === null ||
    !JOURNEY_STATUSES.some((candidate) => candidate === normalized)
  ) {
    return null;
  }

  return normalized as JourneyStatus;
}

// -----------------------------------------------------------------------------
// Labels and Metadata
// -----------------------------------------------------------------------------

/**
 * Returns the display label for a Journey status.
 */
export function getJourneyStatusLabel(
  status: JourneyStatusInput,
): string {
  const normalized = toJourneyStatus(status);

  if (!normalized) {
    return status?.trim() || UNKNOWN_STATUS_METADATA.label;
  }

  return JOURNEY_STATUS_METADATA[normalized].label;
}

/**
 * Returns complete display metadata for a Journey status.
 */
export function getJourneyStatusMetadata(
  status: JourneyStatusInput,
): JourneyStatusMetadata {
  const normalized = toJourneyStatus(status);

  return normalized
    ? JOURNEY_STATUS_METADATA[normalized]
    : UNKNOWN_STATUS_METADATA;
}

/**
 * Returns the semantic variant used by status badge components.
 *
 * UI components decide how each variant is styled.
 */
export function getJourneyStatusVariant(
  status: JourneyStatusInput,
): JourneyStatusVariant {
  return getJourneyStatusMetadata(status).variant;
}

/**
 * Returns the operational group associated with a Journey status.
 */
export function getJourneyStatusGroup(
  status: JourneyStatusInput,
): JourneyStatusGroup {
  return getJourneyStatusMetadata(status).group;
}

/**
 * Returns the explanatory description for a Journey status.
 */
export function getJourneyStatusDescription(
  status: JourneyStatusInput,
): string {
  return getJourneyStatusMetadata(status).description;
}

// -----------------------------------------------------------------------------
// Operational Classification
// -----------------------------------------------------------------------------

/**
 * True when a journey is still in draft state.
 */
export function isJourneyDraft(status: JourneyStatusInput): boolean {
  return toJourneyStatus(status) === 'DRAFT';
}

/**
 * True when a journey is published and not yet full or underway.
 */
export function isJourneyUpcoming(status: JourneyStatusInput): boolean {
  const normalized = toJourneyStatus(status);

  return normalized === 'PUBLISHED' || normalized === 'FULL';
}

/**
 * True when a journey is boarding or underway.
 */
export function isJourneyActive(status: JourneyStatusInput): boolean {
  const normalized = toJourneyStatus(status);

  return normalized === 'BOARDING' || normalized === 'IN_PROGRESS';
}

/**
 * True when a journey needs completion processing.
 */
export function isJourneyAwaitingCompletion(
  status: JourneyStatusInput,
): boolean {
  return toJourneyStatus(status) === 'COMPLETION_PENDING';
}

/**
 * True when a journey has reached a terminal status.
 *
 * Terminal here describes the journey lifecycle, not its settlement state.
 */
export function isJourneyTerminal(status: JourneyStatusInput): boolean {
  const normalized = toJourneyStatus(status);

  return (
    normalized === 'COMPLETED' ||
    normalized === 'CANCELLED' ||
    normalized === 'EXPIRED'
  );
}

/**
 * True when a journey is completed successfully.
 */
export function isJourneyCompleted(status: JourneyStatusInput): boolean {
  return toJourneyStatus(status) === 'COMPLETED';
}

/**
 * True when a journey has been cancelled.
 */
export function isJourneyCancelled(status: JourneyStatusInput): boolean {
  return toJourneyStatus(status) === 'CANCELLED';
}

/**
 * True when a journey has expired.
 */
export function isJourneyExpired(status: JourneyStatusInput): boolean {
  return toJourneyStatus(status) === 'EXPIRED';
}

/**
 * True when a journey is full.
 */
export function isJourneyFull(status: JourneyStatusInput): boolean {
  return toJourneyStatus(status) === 'FULL';
}

// -----------------------------------------------------------------------------
// Collection Helpers
// -----------------------------------------------------------------------------

/**
 * Returns all supported Journey statuses in canonical order.
 */
export function getAllJourneyStatuses(): readonly JourneyStatus[] {
  return JOURNEY_STATUSES;
}

/**
 * Returns supported statuses belonging to a particular operational group.
 */
export function getJourneyStatusesByGroup(
  group: Exclude<JourneyStatusGroup, 'unknown'>,
): JourneyStatus[] {
  return JOURNEY_STATUSES.filter(
    (status) => JOURNEY_STATUS_METADATA[status].group === group,
  );
}
