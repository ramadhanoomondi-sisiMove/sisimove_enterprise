// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Pagination
// -----------------------------------------------------------------------------
//
// Pagination state for the public marketplace.
//
// The marketplace is potentially unbounded. As more Journeys and Journey
// Demands are published, the frontend must be able to retrieve the market in
// manageable portions rather than loading the entire marketplace at once.
//
// This model describes the PUBLIC RESULT state.
//
// It does NOT expose database pagination details such as:
// - Prisma cursors;
// - internal database IDs;
// - SQL offsets;
// - query-builder state.
//
// The public marketplace boundary decides how its underlying data source is
// paginated and translates that into this stable frontend representation.
//
// -----------------------------------------------------------------------------
//
// Marketplace loading model
//
//     Initial marketplace
//            ↓
//       first page
//            ↓
//       render items
//            ↓
//       Load more
//            ↓
//       next page
//            ↓
//       append items
//
// The UI therefore does not need to know whether the backend uses:
// - cursor pagination;
// - offset pagination;
// - another implementation.
//
// It only needs to know whether another page exists and what public token,
// if any, is required to request it.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Marketplace Pagination
// -----------------------------------------------------------------------------

export interface PublicMarketplacePagination {
  /**
   * Number of marketplace items returned in the current result.
   *
   * This represents the actual number of items in the current response, which
   * can be smaller than the requested page size on the final page.
   */
  count: number;

  /**
   * Requested/result page size.
   *
   * This allows the frontend to preserve the current marketplace loading
   * configuration when requesting the next page.
   */
  limit: number;

  /**
   * Opaque continuation token for retrieving the next marketplace page.
   *
   * The frontend must treat this value as opaque.
   *
   * It must not attempt to decode, construct, or interpret the token.
   *
   * `null` means that there is no continuation token.
   */
  nextCursor: string | null;

  /**
   * Indicates whether more marketplace items are available.
   *
   * This is intentionally explicit rather than requiring the UI to infer
   * availability from `nextCursor`.
   */
  hasMore: boolean;
}