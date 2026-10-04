// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for the Journey vehicle.
//
// JourneyVehicle is a Journey-domain entity projection. The frontend models
// the HTTP projection of that entity without recreating the backend
// entity/value-object structure.
//
// Important:
// - publicId is the public JourneyVehicle identifier;
// - vehicle details are owned by the Journey context;
// - assetPublicId is an opaque reference to the Asset bounded context;
// - assetPublicId is NOT an image URL;
// - asset is the resolved browser-facing PublicAsset representation;
// - optional vehicle fields remain nullable;
// - the frontend does not create or manage the underlying Asset through this
//   model.
//
// -----------------------------------------------------------------------------

/**
 * Resolved browser-facing reference to a vehicle Asset.
 *
 * This is supplied by the authenticated Journey read model after the
 * Journey application boundary resolves the Asset reference.
 *
 * The shape intentionally follows the browser-facing PublicAsset contract
 * required for rendering:
 *
 *     publicId
 *     url
 *     alt
 *
 * It does not expose the authenticated Asset-management model.
 */
export interface JourneyVehicleAsset {
  /**
   * Public Asset identifier.
   */
  readonly publicId: string;

  /**
   * Browser-facing Asset URL.
   */
  readonly url: string;

  /**
   * Optional accessible alternative text supplied by the Asset boundary.
   */
  readonly alt: string | null;
}

/**
 * Journey vehicle read model.
 */
export interface JourneyVehicle {
  /**
   * Public Journey vehicle identifier.
   *
   * Internal persistence identifiers are intentionally not exposed.
   */
  readonly publicId: string;

  /**
   * Vehicle manufacturer/make.
   */
  readonly make: string;

  /**
   * Vehicle model.
   */
  readonly model: string;

  /**
   * Optional vehicle manufacturing/model year.
   */
  readonly year: number | null;

  /**
   * Optional vehicle color.
   */
  readonly color: string | null;

  /**
   * Optional vehicle registration.
   *
   * Note:
   * The backend public projection currently exposes this field, but public
   * registration visibility should remain subject to the SisiMove privacy
   * contract before the marketplace UI renders it.
   */
  readonly registration: string | null;

  /**
   * Optional reference to an Asset owned by the Asset bounded context.
   *
   * This is an opaque public identifier, not a URL.
   */
  readonly assetPublicId: string | null;

  /**
   * Resolved browser-facing representation of the vehicle Asset.
   *
   * This is null when:
   * - the vehicle has no assetPublicId; or
   * - the Asset reference could not be resolved by the backend.
   */
  readonly asset: JourneyVehicleAsset | null;
}