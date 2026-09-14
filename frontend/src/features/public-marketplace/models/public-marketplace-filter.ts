// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Filter
// -----------------------------------------------------------------------------
//
// Secondary filtering criteria for the public marketplace.
//
// The marketplace is intentionally browse-first:
//
//     Visitor enters marketplace
//             ↓
//     Published items are already visible
//             ↓
//     Visitor optionally refines the market
//
// This model represents those optional refinements.
//
// It does NOT represent:
// - Journey business rules;
// - Journey Demand business rules;
// - booking constraints;
// - provider/passenger permissions;
// - persisted marketplace state.
//
// The filter is a read-side concern.
//
// -----------------------------------------------------------------------------
//
// Query vs Filter
//
// PublicMarketplaceQuery
//     ├── type
//     ├── from
//     ├── to
//     ├── date
//     ├── filter
//     └── sort
//
// PublicMarketplaceFilter
//     └── secondary constraints
//
// The distinction matters because:
//
//     from / to / date
//
// describe the primary discovery context, while filters progressively narrow
// the already-visible marketplace.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Marketplace Filter
// -----------------------------------------------------------------------------

export interface PublicMarketplaceFilter {
  /**
   * Minimum number of seats that should be available or requested.
   *
   * For Journey supply, this can be interpreted as minimum available seats.
   *
   * For Journey Demand, this can be interpreted as minimum requested or
   * remaining seats according to the marketplace read boundary.
   *
   * The underlying domain remains responsible for calculating those values.
   */
  minimumSeats: number | null;

  /**
   * Maximum price per seat that the visitor is willing to consider.
   *
   * This is a marketplace discovery constraint, not a booking commitment.
   *
   * The value uses the marketplace's monetary representation:
   *
   *     KES integer amount
   *
   * rather than a floating-point monetary value.
   */
  maximumPricePerSeat: number | null;

  /**
   * Whether the visitor wants to see only journeys with an available
   * vehicle/vehicle information suitable for public display.
   *
   * This remains a marketplace presentation filter and does not alter the
   * underlying Journey.
   */
  hasVehicle: boolean | null;

  /**
   * Whether the visitor wants marketplace items whose traveller/requester has
   * public trust verification.
   *
   * The marketplace does not perform verification itself. It filters against
   * the public Trust read model.
   */
  verifiedTravellerOnly: boolean | null;
}