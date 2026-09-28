// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for the Journey vehicle.
//
// JourneyVehicle is a Journey-domain entity. The frontend therefore models
// the HTTP projection of that entity rather than recreating the backend
// entity/value-object structure.
//
// Important:
// - publicId is the public JourneyVehicle identifier;
// - vehicle details are owned by the Journey context;
// - assetPublicId is an opaque reference to the Asset bounded context;
// - assetPublicId is NOT an image URL;
// - optional vehicle fields remain nullable;
// - the frontend does not create or manage the underlying Asset through this
//   model.
//
// -----------------------------------------------------------------------------

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
}