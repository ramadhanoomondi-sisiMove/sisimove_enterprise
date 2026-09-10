// -----------------------------------------------------------------------------
// sisiMove — Traveller Landing Components
// -----------------------------------------------------------------------------
//
// Public barrel for the landing-page traveller presentation and composition
// layer.
//
// Architectural boundary:
//
// - Exports landing traveller presentation components.
// - Exports the public traveller discovery composition component.
// - Exports presentation props and types owned by this layer.
// - Does not re-export feature/domain models.
// - Does not expose API clients, repositories, or application services.
//
// TravellerDiscoveryContent is the client-side composition boundary for public
// discovery. It consumes the existing Journey and Journey Demand hooks and
// connects feature state to the presentation layer.
//
// Feature models and hooks remain available from their owning feature modules.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Traveller Discovery
// -----------------------------------------------------------------------------

export {
  TravellerDiscoveryContent,
} from './traveller-discovery-content';

export type {
  TravellerDiscoveryContentProps,
} from './traveller-discovery-content';

export {
  TravellerDiscoverySection,
} from './traveller-discovery-section';

export type {
  TravellerDiscoverySectionProps,
  TravellerDiscoveryStatus,
} from './traveller-discovery-section';

export {
  TravellerDiscoveryHeader,
} from './traveller-discovery-header';

export type {
  TravellerDiscoveryHeaderProps,
} from './traveller-discovery-header';

export {
  TravellerDiscoveryTabs,
} from './traveller-discovery-tabs';

export type {
  TravellerDiscoveryTabsProps,
  TravellerDiscoveryTab,
  TravellerDiscoveryTabItem,
} from './traveller-discovery-tabs';

// -----------------------------------------------------------------------------
// Traveller Activity
// -----------------------------------------------------------------------------

export {
  TravellerActivityList,
} from './traveller-activity-list';

export type {
  TravellerActivityListProps,
  TravellerActivityListItem,
} from './traveller-activity-list';

export {
  TravellerActivityCard,
} from './traveller-activity-card';

export type {
  TravellerActivityCardProps,
} from './traveller-activity-card';

// -----------------------------------------------------------------------------
// Traveller Presentation
// -----------------------------------------------------------------------------

export {
  TravellerSummary,
} from './traveller-summary';

export type {
  TravellerSummaryProps,
} from './traveller-summary';

export {
  TravellerAvatar,
} from './traveller-avatar';

export type {
  TravellerAvatarProps,
} from './traveller-avatar';

export {
  TravellerVerification,
} from './traveller-verification';

export type {
  TravellerVerificationProps,
  TravellerVerificationLevel,
} from './traveller-verification';

export {
  TravellerRating,
} from './traveller-rating';

export type {
  TravellerRatingProps,
} from './traveller-rating';

export {
  TravellerHistory,
} from './traveller-history';

export type {
  TravellerHistoryProps,
} from './traveller-history';

export {
  TravellerTrust,
} from './traveller-trust';

export type {
  TravellerTrustProps,
} from './traveller-trust';

// -----------------------------------------------------------------------------
// Traveller Activity Details
// -----------------------------------------------------------------------------

export {
  TravellerActivityType,
} from './traveller-activity-type';

export type {
  TravellerActivityTypeProps,
  TravellerActivityType as TravellerActivityTypeValue,
} from './traveller-activity-type';

export {
  TravellerRoute,
} from './traveller-route';

export type {
  TravellerRouteProps,
} from './traveller-route';

export {
  TravellerSchedule,
} from './traveller-schedule';

export type {
  TravellerScheduleProps,
} from './traveller-schedule';

export {
  TravellerVehicle,
} from './traveller-vehicle';

export type {
  TravellerVehicleProps,
} from './traveller-vehicle';

export {
  TravellerAvailability,
} from './traveller-availability';

export type {
  TravellerAvailabilityProps,
  TravellerAvailabilitySize,
} from './traveller-availability';

export {
  TravellerPrice,
} from './traveller-price';

export type {
  TravellerPriceProps,
  TravellerPriceSize,
} from './traveller-price';

export {
  TravellerJourney,
} from './traveller-journey';

export type {
  TravellerJourneyProps,
} from './traveller-journey';

export {
  TravellerDemand,
} from './traveller-demand';

export type {
  TravellerDemandProps,
} from './traveller-demand';

// -----------------------------------------------------------------------------
// Discovery States
// -----------------------------------------------------------------------------

export {
  DiscoveryEmptyState,
} from './discovery-empty-state';

export type {
  DiscoveryEmptyStateProps,
} from './discovery-empty-state';

export {
  DiscoveryLoadingState,
} from './discovery-loading-state';

export type {
  DiscoveryLoadingStateProps,
} from './discovery-loading-state';

export {
  DiscoveryErrorState,
} from './discovery-error-state';

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

export {
  TravellerProfilePage,
} from './traveller-profile-page';

export type {
  TravellerProfilePageProps,
} from './traveller-profile-page';

export {
  TravellerProfileContent,
} from './traveller-profile-content';

export type {
  TravellerProfileContentProps,
} from './traveller-profile-content';

export {
  TravellerProfileHeader,
} from './traveller-profile-header';

export type {
  TravellerProfileHeaderProps,
} from './traveller-profile-header';

export {
  TravellerProfileCorridor,
} from './traveller-profile-corridor';

export type {
  TravellerProfileCorridorProps,
} from './traveller-profile-corridor';

export {
  TravellerProfilePreferences,
} from './traveller-profile-preferences';

export type {
  TravellerProfilePreferencesProps,
} from './traveller-profile-preferences';