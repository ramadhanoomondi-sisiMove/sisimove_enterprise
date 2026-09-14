// -----------------------------------------------------------------------------
// sisiMove — Public Trust Models
// -----------------------------------------------------------------------------
//
// Public export surface for the Trust feature.
//
// Consumers should import public Trust contracts from this barrel rather than
// reaching into individual model files:
//
//     import type {
//       PublicTravellerTrust,
//       PublicTrustBadge,
//       PublicTrustBadgeAsset,
//       PublicTrustBadgeType,
//       PublicTrustVerificationLevel,
//     } from "@/features/trust/models";
//
// This keeps the internal model-file layout replaceable while presenting one
// stable public model boundary to hooks, mappers, and UI components.
//
// -----------------------------------------------------------------------------

export type {
  PublicTravellerTrust,
  PublicTrustVerificationLevel,
} from "./public-traveller-trust";

export type {
  PublicTrustBadge,
  PublicTrustBadgeAsset,
  PublicTrustBadgeType,
} from "./public-trust-badge";