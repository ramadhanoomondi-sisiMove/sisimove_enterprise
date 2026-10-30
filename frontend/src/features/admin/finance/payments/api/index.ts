// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payments API Exports
// -----------------------------------------------------------------------------

// API Adapter
export {
  AdminFinancialPaymentsApi,
  adminFinancialPaymentsApi,
} from './admin-financial-payments.api';

// Request Contracts
export type {
  CreateAdminFinancialPaymentPayload,
  AdminFinancialPaymentLifecyclePayload,
  LinkAdminFinancialPaymentTransactionPayload,
} from './admin-financial-payments.api';

// Endpoint Definitions
export {
  ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS,
} from './admin-financial-payments.endpoints';