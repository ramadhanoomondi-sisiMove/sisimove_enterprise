//src/components/admin/paymemnts/payments-methods/shared
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Methods Shared Components
 * -----------------------------------------------------------------------------
 *
 * Public barrel for reusable payment-method presentation components.
 *
 * Responsibilities:
 * - Export payment-method badges and display components.
 * - Export payment-method empty, error, and loading states.
 * - Export component prop types for consuming modules.
 *
 * Components reuse the existing sisiMove design-system primitives and
 * payment-method models without duplicating domain logic.
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// Status Badge
// -----------------------------------------------------------------------------

export {
  PaymentMethodStatusBadge,
  type PaymentMethodStatusBadgeProps,
} from './PaymentMethodStatusBadge';

// -----------------------------------------------------------------------------
// Type Badge
// -----------------------------------------------------------------------------

export {
  PaymentMethodTypeBadge,
  type PaymentMethodTypeBadgeProps,
} from './PaymentMethodTypeBadge';

// -----------------------------------------------------------------------------
// Provider Badge
// -----------------------------------------------------------------------------

export {
  PaymentMethodProviderBadge,
  type PaymentMethodProviderBadgeProps,
} from './PaymentMethodProviderBadge';

// -----------------------------------------------------------------------------
// Public Identifier
// -----------------------------------------------------------------------------

export {
  PaymentMethodPublicId,
  type PaymentMethodPublicIdProps,
} from './PaymentMethodPublicId';

// -----------------------------------------------------------------------------
// Display Name
// -----------------------------------------------------------------------------

export {
  PaymentMethodDisplayName,
  type PaymentMethodDisplayNameProps,
} from './PaymentMethodDisplayName';

// -----------------------------------------------------------------------------
// Masked Identifier
// -----------------------------------------------------------------------------

export {
  PaymentMethodLastFour,
  type PaymentMethodLastFourProps,
} from './PaymentMethodLastFour';

// -----------------------------------------------------------------------------
// Default Badge
// -----------------------------------------------------------------------------

export {
  PaymentMethodDefaultBadge,
  type PaymentMethodDefaultBadgeProps,
} from './PaymentMethodDefaultBadge';

// -----------------------------------------------------------------------------
// Date Display
// -----------------------------------------------------------------------------

export {
  PaymentMethodDate,
  type PaymentMethodDateProps,
} from './PaymentMethodDate';

// -----------------------------------------------------------------------------
// Empty State
// -----------------------------------------------------------------------------

export {
  PaymentMethodEmptyState,
  type PaymentMethodEmptyStateProps,
} from './PaymentMethodEmptyState';

// -----------------------------------------------------------------------------
// Error State
// -----------------------------------------------------------------------------

export {
  PaymentMethodErrorState,
  type PaymentMethodErrorStateProps,
} from './PaymentMethodErrorState';

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

export {
  PaymentMethodLoadingState,
  type PaymentMethodLoadingStateProps,
} from './PaymentMethodLoadingState';
