// src/domains/asset/application/requests/delete-asset-variant.request.ts

export class DeleteAssetVariantRequest {
  /**
   * Variant public identifier.
   */
  variantPublicId!: string;

  /**
   * Permanently delete the variant instead of performing a soft delete.
   */
  permanent!: boolean;

  /**
   * Remove the physical object from storage.
   */
  deleteFromStorage!: boolean;

  /**
   * Delete all processing metadata associated with the variant.
   */
  deleteMetadata!: boolean;

  /**
   * Ignore missing storage objects.
   */
  ignoreMissingStorageObject!: boolean;

  /**
   * Optional reason for deletion.
   */
  reason!: string | null;
}
