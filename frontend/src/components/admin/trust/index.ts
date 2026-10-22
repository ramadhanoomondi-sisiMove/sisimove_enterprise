
/**
 * sisiMove — Trust Control Center
 * Public component exports.
 *
 * This barrel exposes the shared, layout, timeline, profile,
 * moderation, badge, and overview components.
 *
 * Components remain responsible for presentation.
 * Data fetching, authorization, and mutation orchestration
 * remain in their respective feature hooks and route containers.
 */

// -----------------------------------------------------------------------------
// Shared
// -----------------------------------------------------------------------------

export {
  TrustStatusBadge,
  type TrustStatusBadgeStatus,
  type TrustStatusBadgeProps,
} from './shared/TrustStatusBadge';

export {
  TrustLoadingState,
  type TrustLoadingStateProps,
} from './shared/TrustLoadingState';

export {
  TrustErrorState,
  type TrustErrorStateProps,
} from './shared/TrustErrorState';

export {
  TrustEmptyState,
  type TrustEmptyStateProps,
} from './shared/TrustEmptyState';

export {
  TrustConfirmDialog,
  type TrustConfirmDialogProps,
  type TrustConfirmDialogTone,
} from './shared/TrustConfirmDialog';

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

export {
  TrustPageContainer,
  type TrustPageContainerProps,
} from './layout/TrustPageContainer';

export {
  TrustControlCenterHeader,
  type TrustControlCenterHeaderProps,
} from './layout/TrustControlCenterHeader';

export {
  TrustWorkspaceNavigation,
  type TrustWorkspaceNavigationProps,
} from './layout/TrustWorkspaceNavigation';

// -----------------------------------------------------------------------------
// Timeline
// -----------------------------------------------------------------------------

export {
  TrustEventDetails,
  type TrustEventDetailsProps,
} from './timeline/TrustEventDetails';

export {
  TrustEventCard,
  type TrustEventCardProps,
} from './timeline/TrustEventCard';

export {
  TrustEventTimeline,
  type TrustEventTimelineProps,
} from './timeline/TrustEventTimeline';

// -----------------------------------------------------------------------------
// Profiles — profile management workspace
// -----------------------------------------------------------------------------

export {
  TrustProfileMetrics,
  type TrustProfileMetricsProps,
} from './profiles/TrustProfileMetrics';

export {
  TrustProfileJourneyMetrics,
  type TrustProfileJourneyMetricsProps,
} from './profiles/TrustProfileJourneyMetrics';

export {
  TrustProfileVerificationPanel,
  type TrustProfileVerificationPanelProps,
} from './profiles/TrustProfileVerificationPanel';

export {
  TrustProfileRatingsPanel,
  type TrustProfileRatingsPanelProps,
} from './profiles/TrustProfileRatingsPanel';

export {
  TrustProfileReviewsPanel,
  type TrustProfileReviewsPanelProps,
} from './profiles/TrustProfileReviewsPanel';

export {
  TrustProfileBadgesPanel,
  type TrustProfileBadgesPanelProps,
} from './profiles/TrustProfileBadgesPanel';

export {
  TrustProfileActions,
  type TrustProfileActionsProps,
  type TrustProfileAction,
} from './profiles/TrustProfileActions';

export {
  TrustProfileOverviewPanel,
  type TrustProfileOverviewPanelProps,
} from './profiles/TrustProfileOverviewPanel';

export {
  TrustProfileManagementHeader,
  type TrustProfileManagementHeaderProps,
} from './profiles/TrustProfileManagementHeader';

export {
  TrustProfileManagementWorkspace,
  type TrustProfileManagementWorkspaceProps,
} from './profiles/TrustProfileManagementWorkspace';

// -----------------------------------------------------------------------------
// Profiles — directory
// -----------------------------------------------------------------------------

export {
  TrustProfileRow,
  type TrustProfileRowProps,
} from './profiles/TrustProfileRow';

export {
  TrustProfilePagination,
  type TrustProfilePaginationProps,
} from './profiles/TrustProfilePagination';

export {
  TrustProfileFilters,
  type TrustProfileFiltersProps,
  type TrustProfileFiltersValue,
} from './profiles/TrustProfileFilters';

export {
  TrustProfileTable,
  type TrustProfileTableProps,
} from './profiles/TrustProfileTable';

export {
  TrustProfileDirectory,
  type TrustProfileDirectoryProps,
} from './profiles/TrustProfileDirectory';

// -----------------------------------------------------------------------------
// Moderation
// -----------------------------------------------------------------------------

export {
  TrustModerationReasonField,
  type TrustModerationReasonFieldProps,
} from './moderation/TrustModerationReasonField';

export {
  TrustRatingCard,
  type TrustRatingCardProps,
  type TrustRatingCardAction,
} from './moderation/TrustRatingCard';

export {
  TrustRatingList,
  type TrustRatingListProps,
} from './moderation/TrustRatingList';

export {
  TrustReviewCard,
  type TrustReviewCardProps,
  type TrustReviewCardAction,
} from './moderation/TrustReviewCard';

export {
  TrustReviewList,
  type TrustReviewListProps,
} from './moderation/TrustReviewList';

export {
  TrustModerationDialog,
  type TrustModerationDialogProps,
} from './moderation/TrustModerationDialog';

export {
  TrustModerationWorkspace,
  type TrustModerationWorkspaceProps,
  type TrustModerationActionRequest,
} from './moderation/TrustModerationWorkspace';

// -----------------------------------------------------------------------------
// Badges
// -----------------------------------------------------------------------------

export {
  TrustBadgeStatusControl,
  type TrustBadgeStatusControlProps,
} from './badges/TrustBadgeStatusControl';

export {
  TrustBadgeCard,
  type TrustBadgeCardProps,
  type TrustBadgeCardAction,
} from './badges/TrustBadgeCard';

export {
  TrustProfileBadgeList,
  type TrustProfileBadgeListProps,
} from './badges/TrustProfileBadgeList';

export {
  TrustBadgeForm,
  type TrustBadgeFormProps,
  type TrustBadgeFormPayload,
} from './badges/TrustBadgeForm';

export {
  TrustAwardBadgeDialog,
  type TrustAwardBadgeDialogProps,
} from './badges/TrustAwardBadgeDialog';

export {
  TrustBadgeCatalogue,
  type TrustBadgeCatalogueProps,
  type TrustBadgeCatalogueFilter,
} from './badges/TrustBadgeCatalogue';

// -----------------------------------------------------------------------------
// Overview
// -----------------------------------------------------------------------------

export {
  TrustMetricCard,
  type TrustMetricCardProps,
  type TrustMetricTrendDirection,
} from './overview/TrustMetricCard';

export {
  TrustProfileSnapshot,
  type TrustProfileSnapshotProps,
  type TrustProfileSnapshotItem,
} from './overview/TrustProfileSnapshot';

export {
  TrustActivityFeed,
  type TrustActivityFeedProps,
} from './overview/TrustActivityFeed';

export {
  TrustOverviewEmptyState,
  type TrustOverviewEmptyStateProps,
} from './overview/TrustOverviewEmptyState';

export {
  TrustOverviewDashboard,
  type TrustOverviewDashboardProps,
  type TrustOverviewMetrics,
} from './overview/TrustOverviewDashboard';
