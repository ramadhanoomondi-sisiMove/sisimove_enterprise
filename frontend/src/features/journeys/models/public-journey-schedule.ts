// -----------------------------------------------------------------------------
// sisiMove — Public Journey Schedule
// -----------------------------------------------------------------------------
//
// Public scheduling information for a Journey.
//
// Date values cross the API boundary as ISO-8601 strings rather than
// JavaScript Date objects.
//
// The timezone is retained explicitly so the frontend does not have to infer
// the Journey's intended timezone from the visitor's device.
// -----------------------------------------------------------------------------

export interface PublicJourneySchedule {
  departureAt: string;
  arrivalAt: string | null;
  timezone: string;
}