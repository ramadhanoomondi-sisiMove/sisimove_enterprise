// -----------------------------------------------------------------------------
// Path: src/foundation/location/index.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Foundation Location Barrel
//
// Public exports for the foundation location capability.
//
// The foundation location layer provides reusable location presentation and
// types. Journey-specific supported-corridor data remains inside the Journey
// feature.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

export {
  LocationSelector,
  type LocationSelectorProps,
} from "./components/LocationSelector";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type {
  ResolvedLocation,
  SupportedLocation,
} from "./types/location.types";