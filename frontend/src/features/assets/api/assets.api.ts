// -----------------------------------------------------------------------------
// sisiMove — My Assets API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for Assets belonging to the currently
// authenticated Identity.
//
// Backend routes:
//
//   GET    /assets/owner
//   POST   /assets
//   PATCH  /assets/:assetPublicId/archive
//   DELETE /assets/:assetPublicId
//   PATCH  /assets/:assetPublicId/visibility
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Asset — Models
// -----------------------------------------------------------------------------

import type { Asset } from '../models';

// =============================================================================
// Constants
// =============================================================================

/**
 * Base route for the Asset HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('assets')
 */
const ASSETS_PATH = '/assets';

// =============================================================================
// Frontend Request Types
// =============================================================================
//
// These types describe HTTP input only.
//
// They intentionally do not contain:
//
// - owner identity;
// - persistence IDs;
// - storage information;
// - lifecycle state;
// - application metadata.
//
// -----------------------------------------------------------------------------

/**
 * Asset types accepted by the upload endpoint.
 *
 * Aligned with the backend AssetType contract.
 */
export type AssetUploadType =
  | 'IMAGE'
  | 'VIDEO'
  | 'AUDIO'
  | 'DOCUMENT'
  | 'OTHER';

/**
 * Asset categories accepted by the upload endpoint.
 *
 * Aligned with the backend AssetCategory contract.
 */
export type AssetUploadCategory =
  | 'PROFILE_PHOTO'
  | 'COVER_PHOTO'
  | 'AVATAR'
  | 'GOVERNMENT_ID'
  | 'DRIVER_LICENSE'
  | 'PASSPORT'
  | 'SELFIE'
  | 'VEHICLE_PHOTO'
  | 'CHAT_ATTACHMENT'
  | 'OTHER';

/**
 * Asset visibility accepted by the Asset API.
 *
 * Aligned with the backend AssetVisibility contract.
 */
export type AssetVisibility =
  | 'PUBLIC'
  | 'PRIVATE';

/**
 * Client input required to upload an Asset.
 *
 * The authenticated Identity is intentionally absent.
 */
export interface UploadAssetInput {
  readonly file: File;
  readonly type: AssetUploadType;
  readonly category: AssetUploadCategory;
  readonly visibility?: AssetVisibility;
}

/**
 * Client input for changing Asset visibility.
 */
export interface ChangeAssetVisibilityInput {
  readonly visibility: AssetVisibility;
}

// =============================================================================
// My Assets
// =============================================================================

/**
 * Retrieve Assets belonging to the currently authenticated Identity.
 *
 * Backend:
 *
 *     GET /assets/owner
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * The backend derives ownership from the authenticated session.
 *
 * The frontend therefore does not send an owner identifier.
 *
 * Empty collection:
 *
 *     []
 *
 * is a valid successful response.
 */
export async function getMyAssets(): Promise<readonly Asset[]> {
  return authenticatedApiClient.get<readonly Asset[]>(
    `${ASSETS_PATH}/owner`,
  );
}

// =============================================================================
// Upload Asset
// =============================================================================

/**
 * Upload a physical Asset for the currently authenticated Identity.
 *
 * Backend:
 *
 *     POST /assets
 *
 * Content type:
 *
 *     multipart/form-data
 *
 * Multipart fields:
 *
 *     file
 *     type
 *     category
 *     visibility?
 *
 * The backend derives or generates:
 *
 *     owner Identity
 *     Asset public ID
 *     storage provider
 *     bucket
 *     object key
 *     lifecycle status
 *     correlation ID
 *     causation ID
 *
 * The browser File is converted to FormData because the backend uses:
 *
 *     FileInterceptor('file')
 */
export async function uploadAsset(
  input: UploadAssetInput,
): Promise<Asset> {
  const formData = new FormData();

  formData.append('file', input.file);
  formData.append('type', input.type);
  formData.append('category', input.category);

  if (input.visibility !== undefined) {
    formData.append('visibility', input.visibility);
  }

  return authenticatedApiClient.post<Asset>(
    ASSETS_PATH,
    formData,
  );
}

// =============================================================================
// Archive Asset
// =============================================================================

/**
 * Archive an Asset belonging to the currently authenticated Identity.
 *
 * Backend:
 *
 *     PATCH /assets/:assetPublicId/archive
 *
 * The Asset public ID identifies the target.
 *
 * The authenticated session identifies the caller.
 *
 * Ownership authorization remains a backend application concern.
 */
export async function archiveAsset(
  assetPublicId: string,
): Promise<Asset> {
  return authenticatedApiClient.patch<Asset>(
    `${ASSETS_PATH}/${encodeURIComponent(assetPublicId)}/archive`,
  );
}

// =============================================================================
// Delete Asset
// =============================================================================

/**
 * Delete an Asset belonging to the currently authenticated Identity.
 *
 * Backend:
 *
 *     DELETE /assets/:assetPublicId
 *
 * The backend is responsible for:
 *
 * - resolving the Asset;
 * - verifying ownership;
 * - enforcing deletion rules;
 * - coordinating physical storage deletion where required.
 */
export async function deleteAsset(
  assetPublicId: string,
): Promise<Asset> {
  return authenticatedApiClient.delete<Asset>(
    `${ASSETS_PATH}/${encodeURIComponent(assetPublicId)}`,
  );
}

// =============================================================================
// Change Asset Visibility
// =============================================================================

/**
 * Change the visibility of an Asset belonging to the currently authenticated
 * Identity.
 *
 * Backend:
 *
 *     PATCH /assets/:assetPublicId/visibility
 *
 * Body:
 *
 *     {
 *       visibility: 'PUBLIC' | 'PRIVATE'
 *     }
 *
 * Ownership authorization remains a backend application concern.
 */
export async function changeAssetVisibility(
  assetPublicId: string,
  input: ChangeAssetVisibilityInput,
): Promise<Asset> {
  return authenticatedApiClient.patch<Asset>(
    `${ASSETS_PATH}/${encodeURIComponent(assetPublicId)}/visibility`,
    input,
  );
}