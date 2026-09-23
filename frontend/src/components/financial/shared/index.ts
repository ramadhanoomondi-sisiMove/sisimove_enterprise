// -----------------------------------------------------------------------------
// sisiMove — Financial Shared Components
// -----------------------------------------------------------------------------
//
// Public exports for financial-specific shared presentation components.
//
// These components are intentionally limited to financial concerns:
//
// - FinancialAmount
// - FinancialStatusBadge
//
// Generic UI primitives such as Badge, Spinner, Skeleton, Button, EmptyState,
// and ErrorState remain under components/ui and are not re-exported here.
// -----------------------------------------------------------------------------

export {
  FinancialAmount,
} from './financial-amount';

export type {
  FinancialAmountProps,
  FinancialAmountTone,
} from './financial-amount';

export {
  FinancialStatusBadge,
} from './financial-status-badge';

export type {
  FinancialStatusBadgeProps,
  FinancialStatusTone,
} from './financial-status-badge';