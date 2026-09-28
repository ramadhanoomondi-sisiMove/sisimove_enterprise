// -----------------------------------------------------------------------------
// sisiMove — Journey Shared Components
// -----------------------------------------------------------------------------
//
// Public export surface for reusable Journey presentation components.
//
// Shared Journey components are intentionally presentation-focused. They
// consume frontend read models and do not own Journey fetching, mutations,
// domain orchestration, or Asset resolution.
//
// Consumers should import shared Journey components through this barrel:
//
//     import {
//       JourneyCapacitySummary,
//       JourneyDate,
//       JourneyPreferencesSummary,
//       JourneyPrice,
//       JourneyRoute,
//       JourneyScheduleSummary,
//       JourneyStatusBadge,
//       JourneyVehicleAsset,
//       JourneyVehicleSummary,
//       JourneyWaypoints,
//     } from "@/features/journey/components/shared";
//
// -----------------------------------------------------------------------------

export { JourneyStatusBadge } from "./journey-status-badge";
export type { JourneyStatusBadgeProps } from "./journey-status-badge";

export { JourneyRoute } from "./journey-route";
export type { JourneyRouteProps } from "./journey-route";

export { JourneyDate } from "./journey-date";
export type { JourneyDateProps } from "./journey-date";

export { JourneyScheduleSummary } from "./journey-schedule-summary";
export type { JourneyScheduleSummaryProps } from "./journey-schedule-summary";

export { JourneyPrice } from "./journey-price";
export type { JourneyPriceProps } from "./journey-price";

export { JourneyCapacitySummary } from "./journey-capacity-summary";
export type { JourneyCapacitySummaryProps } from "./journey-capacity-summary";

export { JourneyVehicleSummary } from "./journey-vehicle-summary";
export type { JourneyVehicleSummaryProps } from "./journey-vehicle-summary";

export { JourneyVehicleAsset } from "./journey-vehicle-asset";
export type { JourneyVehicleAssetProps } from "./journey-vehicle-asset";

export { JourneyPreferencesSummary } from "./journey-preferences-summary";
export type { JourneyPreferencesSummaryProps } from "./journey-preferences-summary";

export { JourneyWaypoints } from "./journey-waypoints";
export type { JourneyWaypointsProps } from "./journey-waypoints";

export { JourneyActions } from "./journey-actions";
export type { JourneyActionsProps } from "./journey-actions";