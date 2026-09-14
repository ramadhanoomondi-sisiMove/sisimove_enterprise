// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace
// -----------------------------------------------------------------------------
//
// Public API barrel for the Public Marketplace feature.
//
// Consumers should import marketplace functionality through this barrel rather
// than depending on individual implementation files.
//
// The marketplace feature owns:
//
// - public marketplace models;
// - marketplace query mapping;
// - marketplace constants;
// - marketplace composition hooks.
//
// Domain-specific Journey and Journey Demand models remain owned by their
// respective feature domains.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export type {
  PublicMarketplace,
  PublicMarketplaceItem,
  PublicMarketplaceItemType,
  PublicMarketplaceJourneyItem,
  PublicMarketplaceDemandItem,
  PublicMarketplaceQuery,
  PublicMarketplaceType,
  PublicMarketplaceFilter,
  PublicMarketplaceSort,
  PublicMarketplaceSortField,
  PublicMarketplaceSortDirection,
  PublicMarketplacePagination,
} from "./models";

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

export {
  usePublicMarketplace,
} from "./hooks";

export type {
  UsePublicMarketplaceResult,
} from "./hooks";

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export {
  DEFAULT_MARKETPLACE_TYPE,
  DEFAULT_MARKETPLACE_PAGE_SIZE,
  MAX_MARKETPLACE_PAGE_SIZE,
  MARKETPLACE_ITEM_TYPES,
  MARKETPLACE_TYPES,
  MARKETPLACE_SORT_FIELDS,
  MARKETPLACE_SORT_DIRECTIONS,
  DEFAULT_MARKETPLACE_SORT,
  MARKETPLACE_QUERY_PARAMS,
  MARKETPLACE_LABELS,
  MARKETPLACE_ROUTES,
} from "./constants";

