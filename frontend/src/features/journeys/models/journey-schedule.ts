// -----------------------------------------------------------------------------
// SisiMove — Journey Schedule
// -----------------------------------------------------------------------------
//
// Public/frontend representation of the schedule of a Journey.
//
// This model is a frontend read model and is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
//
// The backend owns the authoritative Journey schedule. The frontend consumes
// the public schedule projection for discovery and presentation.
//
// Schedule timestamps must represent unambiguous ISO-8601 datetime values.
// The supplied IANA timezone controls how those timestamps are presented to
// the user.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Schedule
// -----------------------------------------------------------------------------

export interface JourneySchedule {
  /**
   * Stable public identifier of the schedule representation.
   *
   * This is an opaque frontend-safe identifier and must not be treated as an
   * internal database identifier.
   */
  publicId: string;

  /**
   * Planned Journey departure time.
   *
   * ISO-8601 datetime string returned by the API.
   *
   * Example:
   * 2026-09-12T08:00:00+03:00
   *
   * The backend is authoritative for this value.
   */
  departureAt: string;

  /**
   * Planned Journey arrival time.
   *
   * ISO-8601 datetime string returned by the API.
   *
   * Null when an arrival time has not been provided.
   *
   * The backend is authoritative for this value.
   */
  arrivalAt: string | null;

  /**
   * IANA timezone associated with the Journey schedule.
   *
   * Example:
   * Africa/Nairobi
   *
   * The frontend should use this timezone when presenting the Journey's
   * departure and arrival times.
   */
  timezone: string;
}