// src/domains/asset/application/requests/generate-asset-variant.request.ts

import type { AssetVariantType } from '../../../domain/value-objects';

export class GenerateAssetVariantRequest {
  /**
   * Parent asset public identifier.
   */
  assetPublicId!: string;

  /**
   * Variant to generate.
   */
  variant!: AssetVariantType;

  /**
   * Force regeneration even if the variant already exists.
   */
  force!: boolean;

  /**
   * Overwrite an existing variant.
   */
  overwriteExisting!: boolean;

  /**
   * Preserve the existing variant if generation fails.
   */
  preserveExistingOnFailure!: boolean;

  /**
   * Generate asynchronously.
   */
  asynchronous!: boolean;

  /**
   * Optional target width.
   */
  width!: number | null;

  /**
   * Optional target height.
   */
  height!: number | null;

  /**
   * Optional image quality (1-100).
   */
  quality!: number | null;

  /**
   * Optional compression level.
   */
  compressionLevel!: number | null;

  /**
   * Optional output format override.
   */
  outputMimeType!: string | null;

  /**
   * Optional processing profile or preset.
   */
  preset!: string | null;

  /**
   * Optional processing reason.
   */
  reason!: string | null;
}
