// -----------------------------------------------------------------------------
// sisiMove — Public Journey Vehicle
// -----------------------------------------------------------------------------
//
// Public vehicle representation for a Journey.
//
// JourneyVehicle is a Journey-domain entity and is therefore not exposed as
// its persistence representation.
//
// Asset storage details are also intentionally excluded. The public boundary
// resolves the vehicle asset into a safe renderable representation.
// -----------------------------------------------------------------------------

export interface PublicJourneyVehicle {
  publicId: string;

  make: string;
  model: string;

  year: number | null;
  color: string | null;

  registration: string | null;

  asset: PublicJourneyVehicleAsset | null;
}

export interface PublicJourneyVehicleAsset {
  publicId: string;
  url: string;
  alt: string | null;
}