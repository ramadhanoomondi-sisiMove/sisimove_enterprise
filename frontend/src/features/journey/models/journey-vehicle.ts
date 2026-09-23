// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Model
// -----------------------------------------------------------------------------
//
// Represents the vehicle attached to a Journey.
//
// assetPublicId is an opaque cross-domain reference to the Assets domain.
// It must not become a frontend object relation.
// -----------------------------------------------------------------------------

export interface JourneyVehicle {
  publicId: string;

  make: string;
  model: string;

  year: number | null;

  color: string | null;

  registration: string | null;

  assetPublicId: string | null;
}