// src/domains/asset/application/requests/regenerate-asset-variant.request.ts

import type { AssetVariantType } from '../../../domain/value-objects';

export class RegenerateAssetVariantRequest {
  /**
   * Parent asset public identifier.
   */
  assetPublicId!: string;

  /**
   * Variant to regenerate.
   */
  variant!: AssetVariantType;

  /**
   * Force regeneration even if the variant is current.
   */
  force!: boolean;

  /**
   * Remove the existing variant before regeneration.
   */
  deleteExisting!: boolean;

  /**
   * Preserve the existing variant if regeneration fails.
   */
  preserveExistingOnFailure!: boolean;

  /**
   * Execute regeneration asynchronously.
   */
  asynchronous!: boolean;

  /**
   * Optional output width.
   */
  width!: number | null;

  /**
   * Optional output height.
   */
  height!: number | null;

  /**
   * Optional output quality (1–100).
   */
  quality!: number | null;

  /**
   * Optional compression level.
   */
  compressionLevel!: number | null;

  /**
   * Optional output MIME type.
   */
  outputMimeType!: string | null;

  /**
   * Optional processing preset/profile.
   */
  preset!: string | null;

  /**
   * Ignore cached processing results.
   */
  invalidateCache!: boolean;

  /**
   * Optional reason for regeneration.
   */
  reason!: string | null;
}
