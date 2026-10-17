
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Verification Asset Model
 * -----------------------------------------------------------------------------
 *
 * Path:
 * src/features/admin/verifications/models/verification-asset.model.ts
 *
 * Purpose:
 * Defines frontend display models for evidence assets referenced by
 * verification requests.
 *
 * Security:
 * - Use public IDs instead of internal database IDs.
 * - Never expose storage bucket names or object keys in the UI model.
 * - Do not construct public file URLs from storage metadata.
 * - Evidence previews and downloads must use an authorized backend flow.
 *
 * Important:
 * The VerificationRequest API response exposes assetPublicId, not the full
 * Asset record. Populate additional metadata only from an actual authorized
 * asset API response.
 * -----------------------------------------------------------------------------
 */

// =============================================================================
// ASSET METADATA
// =============================================================================

/**
 * Asset lifecycle values known to the frontend.
 *
 * Verify these values against the backend Asset status enum before mapping
 * API responses into this type.
 */
export type VerificationAssetStatus =
  | "PENDING"
  | "ACTIVE"
  | "ARCHIVED"
  | "DELETED";

/**
 * Asset categories used by verification evidence.
 *
 * These categories align with the verification request types. They do not
 * replace the Asset model's own category or type contract.
 */
export type VerificationAssetCategory =
  | "PROFILE_PHOTO"
  | "GOVERNMENT_ID"
  | "DRIVER_LICENSE";

/**
 * Safe metadata for an evidence asset displayed in the admin interface.
 *
 * Optional properties must only be populated when returned by the backend.
 */
export interface VerificationAssetModel {
  /** Public ID of the evidence asset. */
  assetPublicId: string;

  /** Original filename, when provided by the authorized API. */
  fileName?: string;

  /** MIME type reported by the backend. */
  mimeType?: string;

  /** File size in bytes, when available. */
  sizeBytes?: number;

  /** Asset category, when provided by the backend. */
  category?: string;

  /** Asset type, when provided by the backend. */
  type?: string;

  /** Asset lifecycle status, when provided by the backend. */
  status?: VerificationAssetStatus;

  /** Upload timestamp, when available. */
  uploadedAt?: string;

  /** Whether an authorized preview can currently be requested. */
  previewAvailable: boolean;

  /** Whether an authorized download can currently be requested. */
  downloadAvailable: boolean;
}

// =============================================================================
// EVIDENCE ACCESS
// =============================================================================

/**
 * Describes an access operation initiated by the UI.
 *
 * The frontend must pass the asset public ID to the appropriate authorized
 * backend endpoint. It must not use this type to construct storage URLs.
 */
export type VerificationAssetAccessAction = "preview" | "download";

/**
 * Request parameters for obtaining authorized evidence access.
 *
 * The backend remains responsible for authentication, authorization,
 * resource validation, and returning the appropriate response.
 */
export interface VerificationAssetAccessRequest {
  assetPublicId: string;
  action: VerificationAssetAccessAction;
}

/**
 * Represents the UI state while requesting access to an evidence asset.
 *
 * This is local presentation state, not a backend response contract.
 */
export type VerificationAssetAccessState =
  | "idle"
  | "loading"
  | "available"
  | "unavailable"
  | "error";
