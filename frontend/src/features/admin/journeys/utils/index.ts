
/**
 * Path:
 * src/features/journeys/utils/index.ts
 *
 * sisiMove — Journey Control Center
 * Public exports for journey utility functions.
 *
 * Responsibilities:
 * - Expose shared journey formatters.
 * - Expose journey lifecycle status utilities.
 * - Keep imports from the utils directory consistent.
 *
 * Architectural rules:
 * - Re-export only.
 * - No business logic or runtime side effects.
 */

// -----------------------------------------------------------------------------
// Journey Formatters
// -----------------------------------------------------------------------------

export {
  formatBoolean,
  formatCompactPublicId,
  formatCoordinates,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDisplayValue,
  formatDistanceKm,
  formatNumber,
  formatPercentage,
  formatPublicId,
  formatShortDate,
  formatTime,
  formatUnknownValue,
  toISOString,
} from './journey-formatters';

export type {
  JourneyCoordinates,
  JourneyCoordinateValue,
  JourneyDateValue,
} from './journey-formatters';

// -----------------------------------------------------------------------------
// Journey Status
// -----------------------------------------------------------------------------

export {
  getAllJourneyStatuses,
  getJourneyStatusDescription,
  getJourneyStatusGroup,
  getJourneyStatusLabel,
  getJourneyStatusMetadata,
  getJourneyStatusVariant,
  getJourneyStatusesByGroup,
  isJourneyActive,
  isJourneyCancelled,
  isJourneyCompleted,
  isJourneyDraft,
  isJourneyExpired,
  isJourneyFull,
  isJourneyStatus,
  isJourneyTerminal,
  isJourneyUpcoming,
  isJourneyAwaitingCompletion,
  normalizeJourneyStatus,
  toJourneyStatus,
} from './journey-status';

export type {
  JourneyStatus,
  JourneyStatusGroup,
  JourneyStatusInput,
  JourneyStatusMetadata,
  JourneyStatusVariant,
} from './journey-status';
