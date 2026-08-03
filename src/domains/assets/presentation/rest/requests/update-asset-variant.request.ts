// src/domains/asset/application/requests/update-asset-variant.request.ts

import type {
  AssetVariantStatus,
  StorageProvider,
} from '../../../domain/value-objects';

export class UpdateAssetVariantRequest {
  /**
   * Variant public identifier.
   */
  variantPublicId!: string;

  /**
   * Variant processing status.
   */
  status!: AssetVariantStatus | null;

  /**
   * Storage provider.
   */
  storageProvider!: StorageProvider | null;

  /**
   * Storage bucket/container.
   */
  bucket!: string | null;

  /**
   * Storage object key.
   */
  objectKey!: string | null;

  /**
   * MIME type.
   */
  mimeType!: string | null;

  /**
   * File extension.
   */
  extension!: string | null;

  /**
   * File size.
   */
  sizeBytes!: bigint | null;

  /**
   * Image width.
   */
  width!: number | null;

  /**
   * Image height.
   */
  height!: number | null;

  /**
   * Media duration in seconds.
   */
  durationSeconds!: number | null;

  /**
   * Indicates whether the variant is system generated.
   */
  isGenerated!: boolean | null;
}
