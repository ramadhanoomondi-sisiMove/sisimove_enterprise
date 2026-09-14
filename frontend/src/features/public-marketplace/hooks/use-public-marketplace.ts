// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Hook
// -----------------------------------------------------------------------------
//
// The Public Marketplace is a frontend composition boundary over the
// independent public Journey and Journey Demand feature domains.
//
// The marketplace does not own either domain's API implementation.
//
// It composes:
//
//     usePublicJourneys()
//              +
//     useJourneyDemands()
//              ↓
//     PublicMarketplaceItem[]
//
// The marketplace is responsible for:
//
// - consuming canonical PublicMarketplaceQuery state;
// - passing route/date discovery criteria to the domain public hooks;
// - composing Journey and Demand into one discriminated marketplace stream;
// - applying marketplace-level filtering that can be derived truthfully from
//   the public read models;
// - applying only sorting semantics that can be derived from those models.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — QUERY MAPPING
// -----------------------------------------------------------------------------
//
// External query representations such as URLSearchParams must first pass
// through:
//
//     mapMarketplaceQuery()
//
// That mapper is the canonical boundary for:
//
// - type normalization;
// - date validation;
// - numeric filter parsing;
// - boolean filter parsing;
// - sort field normalization;
// - sort direction normalization.
//
// This hook therefore does NOT repeat URL/query parsing logic.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — PAGINATION
// -----------------------------------------------------------------------------
//
// The current Journey and Journey Demand collection hooks return arrays rather
// than a unified marketplace pagination envelope.
//
// Consequently this hook does not fabricate:
//
// - limit;
// - nextCursor;
// - hasMore.
//
// Those values belong to a future unified Public Marketplace read boundary.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — SORTING
// -----------------------------------------------------------------------------
//
// DATE and PRICE can be derived from the current public models.
//
// RELEVANCE cannot be reconstructed reliably on the client.
//
// NEWEST cannot be reconstructed because the current public models deliberately
// do not expose creation/publication timestamps.
//
// Those two sorts therefore preserve the underlying source order until the
// marketplace backend/read boundary supplies canonical ranking information.
//
// -----------------------------------------------------------------------------

import { useMemo } from "react";

import { usePublicJourneys } from "../../journeys/hooks";
import { useJourneyDemands } from "../../journey-demands/hooks";

import type { PublicJourney } from "../../journeys/models/public-journey";
import type { PublicJourneyDemand } from "../../journey-demands/models/public-journey-demand";

import type {
  PublicMarketplaceFilter,
  PublicMarketplaceQuery,
  PublicMarketplaceSort,
} from "../models";

import { DEFAULT_MARKETPLACE_SORT } from "../constants";

// -----------------------------------------------------------------------------
// Public hook result
// -----------------------------------------------------------------------------

export interface UsePublicMarketplaceResult {
  /**
   * Current marketplace items.
   *
   * Each item identifies its source explicitly through the discriminated
   * `type` property.
   */
  readonly items: readonly PublicMarketplaceItem[];

  /**
   * Whether either underlying public marketplace source is loading.
   */
  readonly isLoading: boolean;

  /**
   * Marketplace-level read error.
   */
  readonly error: Error | null;
}

// -----------------------------------------------------------------------------
// Marketplace item
// -----------------------------------------------------------------------------

export type PublicMarketplaceItem =
  | {
      readonly type: "JOURNEY";
      readonly journey: PublicJourney;
    }
  | {
      readonly type: "DEMAND";
      readonly demand: PublicJourneyDemand;
    };

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Composes the public Journey and Journey Demand discovery streams into the
 * Public Marketplace.
 *
 * The query should normally come from `mapMarketplaceQuery()` when it
 * originates from URL/API/browser state.
 *
 * An empty query is valid and resolves to the default marketplace scope.
 */
export function usePublicMarketplace(
  query: PublicMarketplaceQuery,
): UsePublicMarketplaceResult {
  // ---------------------------------------------------------------------------
  // Domain discovery query
  // ---------------------------------------------------------------------------

  const domainQuery = useMemo(
    () => ({
      ...(query.from !== null ? { from: query.from } : {}),
      ...(query.to !== null ? { to: query.to } : {}),
      ...(query.date !== null ? { date: query.date } : {}),
    }),
    [query.from, query.to, query.date],
  );

  // ---------------------------------------------------------------------------
  // Public Journey source
  // ---------------------------------------------------------------------------

  const journeys = usePublicJourneys(domainQuery);

  // ---------------------------------------------------------------------------
  // Public Journey Demand source
  // ---------------------------------------------------------------------------

  const demands = useJourneyDemands(domainQuery);

  // ---------------------------------------------------------------------------
  // Compose marketplace streams
  // ---------------------------------------------------------------------------

  const composedItems = useMemo<readonly PublicMarketplaceItem[]>(() => {
    const journeyItems: PublicMarketplaceItem[] =
      query.type === "DEMAND"
        ? []
        : journeys.data.map(
            (journey): PublicMarketplaceItem => ({
              type: "JOURNEY",
              journey,
            }),
          );

    const demandItems: PublicMarketplaceItem[] =
      query.type === "JOURNEY"
        ? []
        : demands.data.map(
            (demand): PublicMarketplaceItem => ({
              type: "DEMAND",
              demand,
            }),
          );

    return [...journeyItems, ...demandItems];
  }, [query.type, journeys.data, demands.data]);

  // ---------------------------------------------------------------------------
  // Marketplace filters
  // ---------------------------------------------------------------------------

  const filteredItems = useMemo(
    () => applyMarketplaceFilter(composedItems, query.filter),
    [composedItems, query.filter],
  );

  // ---------------------------------------------------------------------------
  // Marketplace sorting
  // ---------------------------------------------------------------------------
  //
  // PublicMarketplaceQuery intentionally permits `sort: null`.
  //
  // Null means that no explicit sort was supplied by the caller. The
  // marketplace therefore resolves it to the feature's canonical default
  // rather than passing null into the sorting implementation.
  // ---------------------------------------------------------------------------

  const marketplaceSort =
    query.sort ?? DEFAULT_MARKETPLACE_SORT;

  const sortedItems = useMemo(
    () => applyMarketplaceSort(filteredItems, marketplaceSort),
    [filteredItems, marketplaceSort],
  );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  const isLoading = journeys.isLoading || demands.isLoading;

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  const error = journeys.error ?? demands.error ?? null;

  return {
    items: sortedItems,
    isLoading,
    error,
  };
}

// -----------------------------------------------------------------------------
// Filtering
// -----------------------------------------------------------------------------

function applyMarketplaceFilter(
  items: readonly PublicMarketplaceItem[],
  filter: PublicMarketplaceFilter | null,
): PublicMarketplaceItem[] {
  if (filter === null) {
    return [...items];
  }

  return items.filter((item) => {
    // -------------------------------------------------------------------------
    // Minimum seats
    // -------------------------------------------------------------------------

    if (filter.minimumSeats !== null) {
      const availableSeats =
        item.type === "JOURNEY"
          ? item.journey.capacity.availableSeats
          : item.demand.capacity.remainingSeats;

      if (availableSeats < filter.minimumSeats) {
        return false;
      }
    }

    // -------------------------------------------------------------------------
    // Maximum price per seat
    // -------------------------------------------------------------------------

    if (filter.maximumPricePerSeat !== null) {
      if (item.type === "JOURNEY") {
        if (item.journey.pricing.amount > filter.maximumPricePerSeat) {
          return false;
        }
      } else {
        const maximumPrice =
          item.demand.pricing.maximumPricePerSeat;

        if (
          maximumPrice !== null &&
          maximumPrice > filter.maximumPricePerSeat
        ) {
          return false;
        }
      }
    }

    // -------------------------------------------------------------------------
    // Vehicle
    // -------------------------------------------------------------------------

    if (filter.hasVehicle !== null) {
      if (item.type === "JOURNEY") {
        const hasVehicleAsset =
          item.journey.vehicle.asset !== null;

        if (hasVehicleAsset !== filter.hasVehicle) {
          return false;
        }
      } else if (filter.hasVehicle) {
        return false;
      }
    }

    // -------------------------------------------------------------------------
    // Verified traveller
    // -------------------------------------------------------------------------

    if (filter.verifiedTravellerOnly) {
      const trust =
        item.type === "JOURNEY"
          ? item.journey.provider.trust
          : item.demand.requester.trust;

      const verified =
        trust.verificationLevel === "VERIFIED" ||
        trust.verificationLevel === "HIGHLY_VERIFIED";

      if (!verified) {
        return false;
      }
    }

    return true;
  });
}

// -----------------------------------------------------------------------------
// Sorting
// -----------------------------------------------------------------------------

function applyMarketplaceSort(
  items: readonly PublicMarketplaceItem[],
  sort: PublicMarketplaceSort,
): PublicMarketplaceItem[] {
  // ---------------------------------------------------------------------------
  // Relevance
  // ---------------------------------------------------------------------------
  //
  // Relevance is a marketplace ranking concern and cannot be reconstructed
  // reliably from the current public models.
  // ---------------------------------------------------------------------------

  if (sort.field === "RELEVANCE") {
    return [...items];
  }

  // ---------------------------------------------------------------------------
  // Newest
  // ---------------------------------------------------------------------------
  //
  // The current public models intentionally expose neither creation nor
  // publication timestamps.
  // ---------------------------------------------------------------------------

  if (sort.field === "NEWEST") {
    return [...items];
  }

  const direction = sort.direction === "ASC" ? 1 : -1;

  return [...items].sort((left, right) => {
    const leftValue = getSortableValue(left, sort.field);
    const rightValue = getSortableValue(right, sort.field);

    if (leftValue === null && rightValue === null) {
      return 0;
    }

    if (leftValue === null) {
      return 1;
    }

    if (rightValue === null) {
      return -1;
    }

    return compareSortableValues(leftValue, rightValue) * direction;
  });
}

// -----------------------------------------------------------------------------
// Sortable value
// -----------------------------------------------------------------------------

type SortableValue = number | string | null;

function getSortableValue(
  item: PublicMarketplaceItem,
  field: PublicMarketplaceSort["field"],
): SortableValue {
  switch (field) {
    case "DATE":
      return getMarketplaceDate(item);

    case "PRICE":
      return getMarketplacePrice(item);

    case "RELEVANCE":
    case "NEWEST":
      return null;
  }
}

// -----------------------------------------------------------------------------
// Marketplace date
// -----------------------------------------------------------------------------

function getMarketplaceDate(
  item: PublicMarketplaceItem,
): string | null {
  if (item.type === "JOURNEY") {
    return item.journey.schedule.departureAt;
  }

  return item.demand.schedule.earliestDeparture;
}

// -----------------------------------------------------------------------------
// Marketplace price
// -----------------------------------------------------------------------------

function getMarketplacePrice(
  item: PublicMarketplaceItem,
): number | null {
  if (item.type === "JOURNEY") {
    return item.journey.pricing.amount;
  }

  return (
    item.demand.pricing.maximumPricePerSeat ??
    item.demand.pricing.preferredPricePerSeat
  );
}

// -----------------------------------------------------------------------------
// Value comparison
// -----------------------------------------------------------------------------

function compareSortableValues(
  left: number | string,
  right: number | string,
): number {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right));
}

