// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Model
// -----------------------------------------------------------------------------
//
// Represents the scheduled departure and optional arrival of a Journey.
//
// Date/time values remain strings at the API model boundary. Components can
// convert them to Date objects when presentation logic requires it.
// -----------------------------------------------------------------------------

export interface JourneySchedule {
  publicId: string;

  departureAt: string;

  arrivalAt: string | null;

  timezone: string;
}