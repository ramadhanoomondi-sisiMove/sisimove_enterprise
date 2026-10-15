
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Overview Components
 * -----------------------------------------------------------------------------
 *
 * Public barrel for the Admin Overview feature's presentation components.
 *
 * -----------------------------------------------------------------------------
 */

// =============================================================================
// Main Dashboard
// =============================================================================

export { default as AdminOverview } from './AdminOverview';


// =============================================================================
// Header and Section Layout
// =============================================================================

export { default as OverviewHeader } from './OverviewHeader';
export type { OverviewHeaderProps } from './OverviewHeader';

export { default as OverviewSectionHeader } from './OverviewSectionHeader';
export type { OverviewSectionHeaderProps } from './OverviewSectionHeader';


// =============================================================================
// Platform Metrics
// =============================================================================

export { default as OverviewMetricCard } from './OverviewMetricCard';
export type { OverviewMetricCardProps } from './OverviewMetricCard';

export { default as OverviewMetricGrid } from './OverviewMetricGrid';
export type {
  OverviewMetricGridProps,
  OverviewMetricId,
} from './OverviewMetricGrid';


// =============================================================================
// Operational Panels
// =============================================================================

export { default as OverviewOperationsPanel } from './OverviewOperationsPanel';
export type {
  OverviewOperationsPanelProps,
  OverviewOperationId,
} from './OverviewOperationsPanel';


// =============================================================================
// Navigation and Quick Actions
// =============================================================================

export { default as OverviewLinkCard } from './OverviewLinkCard';

export { default as AdminQuickActions } from './AdminQuickActions';
export type {
  AdminQuickAction,
  AdminQuickActionsProps,
} from './AdminQuickActions';


// =============================================================================
// Loading and Error States
// =============================================================================

export { default as OverviewLoadingState } from './OverviewLoadingState';
export type { OverviewLoadingStateProps } from './OverviewLoadingState';

export { default as OverviewErrorState } from './OverviewErrorState';
export type { OverviewErrorStateProps } from './OverviewErrorState';
