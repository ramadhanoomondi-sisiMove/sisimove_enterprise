// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payments API Endpoints
// -----------------------------------------------------------------------------
//
// Centralized routes for administrative Financial Payment operations.
//
// Keep these paths aligned with FinancialPaymentsController.
//
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENTS_BASE = '/financial-payments';

export const ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS = {
  // ===========================================================================
  // Queries
  // ===========================================================================

  GET_ALL: FINANCIAL_PAYMENTS_BASE,

  COUNT: `${FINANCIAL_PAYMENTS_BASE}/count`,

  GET_BY_PUBLIC_ID: (paymentPublicId: string) =>
    `${FINANCIAL_PAYMENTS_BASE}/${encodeURIComponent(paymentPublicId)}`,

  // ===========================================================================
  // Commands
  // ===========================================================================

  CREATE: FINANCIAL_PAYMENTS_BASE,

  PROCESS: (paymentPublicId: string) =>
    `${FINANCIAL_PAYMENTS_BASE}/${encodeURIComponent(paymentPublicId)}/process`,

  SUCCEED: (paymentPublicId: string) =>
    `${FINANCIAL_PAYMENTS_BASE}/${encodeURIComponent(paymentPublicId)}/succeed`,

  FAIL: (paymentPublicId: string) =>
    `${FINANCIAL_PAYMENTS_BASE}/${encodeURIComponent(paymentPublicId)}/fail`,

  CANCEL: (paymentPublicId: string) =>
    `${FINANCIAL_PAYMENTS_BASE}/${encodeURIComponent(paymentPublicId)}/cancel`,

  EXPIRE: (paymentPublicId: string) =>
    `${FINANCIAL_PAYMENTS_BASE}/${encodeURIComponent(paymentPublicId)}/expire`,

  LINK_TRANSACTION: (paymentPublicId: string) =>
    `${FINANCIAL_PAYMENTS_BASE}/${encodeURIComponent(paymentPublicId)}/transaction`,
} as const;

export default ADMIN_FINANCIAL_PAYMENTS_ENDPOINTS;