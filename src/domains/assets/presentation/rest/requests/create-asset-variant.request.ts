// src/domains/asset/application/requests/create-asset-variant.request.ts

import type {
  AssetVariantStatus,
  AssetVariantType,
  StorageProvider,
} from '../../../domain/value-objects';

export class CreateAssetVariantRequest {
  /**
   * Parent asset public identifier.
   */
  assetPublicId!: string;

  /**
   * Variant type.
   */
  variant!: AssetVariantType;

  /**
   * Initial variant status.
   */
  status!: AssetVariantStatus;

  /**
   * Indicates whether this variant was automatically generated.
   */
  isGenerated!: boolean;

  /**
   * Storage provider.
   */
  storageProvider!: StorageProvider;

  /**
   * Storage bucket/container.
   */
  bucket!: string;

  /**
   * Object key/path.
   */
  objectKey!: string;

  /**
   * Variant MIME type.
   */
  mimeType!: string;

  /**
   * File extension.
   */
  extension!: string | null;

  /**
   * Variant file size.
   */
  sizeBytes!: bigint;

  /**
   * Image width.
   */
  width!: number | null;

  /**
   * Image height.
   */
  height!: number | null;

  /**
   * Media duration.
   */
  durationSeconds!: number | null;
}
