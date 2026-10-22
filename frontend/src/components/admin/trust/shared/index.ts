//src/components/admin/trust/shared/index.ts
/**
 * sisiMove — Trust Shared Components
 *
 * Public exports for reusable Trust feature primitives.
 *
 * Keep this barrel limited to components that belong to the shared
 * Trust component layer. Layout, profile, moderation, badge, timeline,
 * and overview components should have their own exports where appropriate.
 */

export {
  TrustStatusBadge,
  type TrustStatusBadgeProps,
  type TrustStatusBadgeStatus,
} from './TrustStatusBadge';

export {
  TrustLoadingState,
  type TrustLoadingStateProps,
  type TrustLoadingVariant,
} from './TrustLoadingState';

export {
  TrustErrorState,
  type TrustErrorStateProps,
  type TrustErrorStateVariant,
} from './TrustErrorState';

export {
  TrustEmptyState,
  type TrustEmptyStateProps,
  type TrustEmptyStateVariant,
} from './TrustEmptyState';

export {
  TrustConfirmDialog,
  type TrustConfirmDialogProps,
  type TrustConfirmDialogTone,
} from './TrustConfirmDialog';
