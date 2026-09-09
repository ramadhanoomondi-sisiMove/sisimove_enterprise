// -----------------------------------------------------------------------------
// SisiMove — Journey Asset
// -----------------------------------------------------------------------------
//
// Public/frontend representation of an asset attached to a Journey.
//
// This model is a frontend read model and is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
//
// The underlying Asset belongs to the appropriate asset/infrastructure
// boundary. This model represents only the Journey-specific public
// association and the information required for presentation.
//
// The backend is responsible for resolving asset visibility and exposing only
// assets that are approved for the public Journey projection.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Asset Type
// -----------------------------------------------------------------------------

export type JourneyAssetType =
  | 'VEHICLE'
  | 'ROUTE'
  | 'OTHER';

// -----------------------------------------------------------------------------
// Journey Asset
// -----------------------------------------------------------------------------

export interface JourneyAsset {
  /**
   * Stable public identifier of the Journey-to-Asset association.
   *
   * This identifies the association from the Journey perspective and must not
   * be treated as an internal database identifier.
   */
  publicId: string;

  /**
   * Stable public identifier of the underlying Asset.
   *
   * This is an opaque cross-boundary reference. The frontend must not assume
   * ownership of the Asset entity or resolve private Asset information from
   * this identifier.
   */
  assetPublicId: string;

  /**
   * Public presentation role of the asset within the Journey.
   *
   * VEHICLE identifies an asset used to visually represent the Journey's
   * vehicle.
   *
   * ROUTE identifies an asset used to visually represent the Journey route.
   *
   * OTHER identifies another asset approved for public Journey presentation.
   */
  type: JourneyAssetType;

  /**
   * Display ordering of the asset.
   *
   * Lower values are displayed before higher values.
   */
  sortOrder: number;

  /**
   * Publicly accessible URL for the resolved asset.
   *
   * The backend is responsible for:
   * - validating asset visibility
   * - applying access rules
   * - resolving the appropriate public URL
   * - preventing private assets from entering the public projection
   */
  url: string;

  /**
   * Accessible description of the asset.
   *
   * Null when no suitable public description is available.
   */
  altText: string | null;
}