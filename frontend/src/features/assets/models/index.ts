// -----------------------------------------------------------------------------
// sisiMove — Asset Models
// -----------------------------------------------------------------------------
//
// Public export surface for the Asset feature.
//
// Consumers should import Asset contracts through this barrel:
//
//     import type { Asset, PublicAsset } from "@/features/assets/models";
//
// The frontend therefore depends on Asset API models and the public Asset
// read boundary rather than on Prisma models, storage-provider enums, or
// internal Asset persistence metadata.
//
// -----------------------------------------------------------------------------


export type {
  Asset,
} from './asset';

export type {
  PublicAsset,
} from './public-asset';