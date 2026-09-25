// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Mapper
// -----------------------------------------------------------------------------
//
// Maps the raw Journey schedule API representation into the stable frontend
// JourneySchedule model.
//
// Architectural boundary:
//
//   HTTP API response
//       │
//       ▼
//   mapJourneySchedule()
//       │
//       ▼
//   JourneySchedule model
//       │
//       ▼
//   Hooks / Components
//
// This mapper performs transport-to-model normalization only.
//
// It does NOT:
//
// - format dates for display;
// - convert timestamps to the user's local timezone;
// - calculate journey duration;
// - create or modify schedule data;
// - expose persistence identifiers.
//
// Date formatting and presentation belong to the UI layer.
//
// -----------------------------------------------------------------------------

import type { JourneySchedule } from '../models';

/**
 * Raw Journey schedule representation returned by the HTTP API.
 */
export interface JourneyScheduleApiResponse {
  /**
   * Public identifier of the schedule.
   */
  publicId: string;

  /**
   * Journey departure timestamp.
   *
   * Expected to be an ISO-8601 timestamp.
   */
  departureAt: string;

  /**
   * Expected arrival timestamp, when available.
   */
  arrivalAt?: string | null;

  /**
   * IANA timezone associated with the schedule.
   */
  timezone: string;

  /**
   * Creation timestamp, when provided.
   */
  createdAt?: string;

  /**
   * Last update timestamp, when provided.
   */
  updatedAt?: string;
}

/**
 * Map a raw Journey schedule API representation into the frontend model.
 *
 * @param schedule Raw schedule representation returned by the Journey API.
 * @returns Stable frontend JourneySchedule model.
 */
export function mapJourneySchedule(
  schedule: JourneyScheduleApiResponse,
): JourneySchedule {
  return {
    publicId: schedule.publicId,
    departureAt: schedule.departureAt,
    arrivalAt: schedule.arrivalAt,
    timezone: schedule.timezone,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
}