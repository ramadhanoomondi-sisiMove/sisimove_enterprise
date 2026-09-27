// -----------------------------------------------------------------------------
// sisiMove — Support Case Reference
// -----------------------------------------------------------------------------
//
// API/application model for an optional cross-domain resource reference
// attached to a Support Case.
//
// A Support Case may refer to another SisiMove resource, such as a Journey,
// Booking, Payment, or another supported application resource.
//
// Responsibilities:
// - represent the opaque reference type;
// - represent the opaque referenced public ID;
// - provide a stable frontend shape for displaying contextual references.
//
// Non-responsibilities:
// - resolving the referenced resource;
// - fetching another domain;
// - determining the referenced resource's permissions;
// - constructing arbitrary routes;
// - interpreting unknown reference types;
// - becoming a cross-domain orchestration layer.
//
// `referencePublicId` is intentionally opaque. The Support feature does not
// assume ownership of the referenced domain.
//
// -----------------------------------------------------------------------------

export interface SupportCaseReference {
  /**
   * Backend-defined reference classification.
   *
   * This remains a string because Support does not own the complete set of
   * cross-domain reference types.
   */
  referenceType: string;

  /**
   * Public identifier of the referenced resource.
   *
   * This is intentionally opaque to the Support feature.
   */
  referencePublicId: string;
}