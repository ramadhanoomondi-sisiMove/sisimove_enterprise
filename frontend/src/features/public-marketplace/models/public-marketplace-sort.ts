// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Sort
// -----------------------------------------------------------------------------
//
// Defines how the public marketplace orders discoverable items.
//
// Sorting is a read-side concern.
//
// It does NOT change:
// - Journey state;
// - Journey Demand state;
// - publication order in the domain;
// - booking priority;
// - matching decisions;
// - business ownership.
//
// The marketplace simply decides which already-published items should appear
// first in the current public view.
//
// -----------------------------------------------------------------------------
//
// Marketplace principle
//
// The default marketplace should feel like a real market:
//
//     useful / relevant available items first
//
// Search and filters may narrow the collection, while sorting determines the
// order in which the matching items are presented.
//
// The frontend should therefore send an explicit sort when the visitor
// changes ordering, while the absence of a sort can represent the backend's
// default marketplace ordering.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Marketplace Sort Field
// -----------------------------------------------------------------------------

export type PublicMarketplaceSortField =
  | "RELEVANCE"
  | "DATE"
  | "PRICE"
  | "NEWEST";

// -----------------------------------------------------------------------------
// Public Marketplace Sort Direction
// -----------------------------------------------------------------------------

export type PublicMarketplaceSortDirection =
  | "ASC"
  | "DESC";

// -----------------------------------------------------------------------------
// Public Marketplace Sort
// -----------------------------------------------------------------------------

export interface PublicMarketplaceSort {
  /**
   * Marketplace-level field used to determine ordering.
   *
   * RELEVANCE
   *     Orders items according to marketplace relevance.
   *
   * DATE
   *     Orders according to the applicable journey/demand travel date or
   *     schedule represented by the public marketplace read boundary.
   *
   * PRICE
   *     Orders according to the applicable public price representation.
   *
   * NEWEST
   *     Orders according to marketplace publication/creation recency.
   */
  field: PublicMarketplaceSortField;

  /**
   * Direction in which the selected field should be ordered.
   */
  direction: PublicMarketplaceSortDirection;
}