
// -----------------------------------------------------------------------------
// sisiMove — Assets
// Frontend Asset Models
// -----------------------------------------------------------------------------

import type {
  AssetCategory,
  AssetStatus,
  AssetStorageProvider,
  AssetType,
  AssetVisibility,
} from './asset.enums';

// =============================================================================
// Asset Response Model
// =============================================================================

/**
 * Mirrors the backend AssetResponse returned by AssetResponseMapper.
 *
 * Dates assume the API client normalizes ISO date strings to Date objects.
 * The backend response does not include preview, public, or signed URLs.
 */
export interface AssetModel {
  readonly publicId: string;
  readonly ownerIdentityPublicId?: string;

  readonly type: AssetType;
  readonly category: AssetCategory;
  readonly status: AssetStatus;
  readonly visibility: AssetVisibility;

  readonly storageProvider: AssetStorageProvider;
  readonly bucket: string;
  readonly objectKey: string;

  readonly originalFilename?: string;
  readonly mimeType: string;
  readonly sizeBytes: number;

  readonly uploadedAt?: Date;
  readonly archivedAt?: Date;
  readonly deletedAt?: Date;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// =============================================================================
// Asset Collection
// =============================================================================

/**
 * GET /assets currently returns AssetResponse[].
 * No pagination wrapper is assumed.
 */
export type AssetCollectionModel = readonly AssetModel[];

// =============================================================================
// Structural Guard
// =============================================================================

export function isAssetModelCandidate(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}
