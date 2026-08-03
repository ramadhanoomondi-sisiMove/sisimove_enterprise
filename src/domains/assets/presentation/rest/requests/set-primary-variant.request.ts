// src/domains/asset/application/requests/set-primary-variant.request.ts

import type { AssetVariantType } from '../../../domain/value-objects';

export class SetPrimaryVariantRequest {
  /**
   * Parent asset public identifier.
   */
  assetPublicId!: string;

  /**
   * Variant that should become the primary variant.
   */
  variant!: AssetVariantType;

  /**
   * Regenerate dependent variants after promoting this variant.
   */
  regenerateDependents!: boolean;

  /**
   * Update asset metadata (dimensions, size, MIME type, etc.)
   * from the selected primary variant.
   */
  synchronizeAssetMetadata!: boolean;

  /**
   * Preserve the previous primary variant.
   */
  preservePreviousPrimary!: boolean;

  /**
   * Optional reason for changing the primary variant.
   */
  reason!: string | null;
}
