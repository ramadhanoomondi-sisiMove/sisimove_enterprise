// -----------------------------------------------------------------------------
// sisiMove — Public Asset Models
// -----------------------------------------------------------------------------
//
// Public export surface for the Asset feature.
//
// Consumers should import the public Asset contract through this barrel:
//
//     import type { PublicAsset } from "@/features/assets/models";
//
// The frontend therefore depends on the public Asset read boundary rather
// than on Prisma models, storage-provider enums, or internal Asset metadata.
//
// -----------------------------------------------------------------------------

export type {
  PublicAsset,
} from "./public-asset";