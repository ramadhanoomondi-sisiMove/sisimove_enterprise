
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Payment Methods API Endpoints
 // -----------------------------------------------------------------------------
 //
 // Responsibilities:
 // - Define endpoint paths for admin payment-method operations.
 // - Centralize public-ID path construction.
 // - Keep endpoint definitions independent of HTTP execution.
 //
 // Non-responsibilities:
 // - Making HTTP requests.
 // - Authentication and authorization.
 // - Request or response mapping.
 // -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_METHODS_BASE = '/financial-payment-methods';

// -----------------------------------------------------------------------------
// Endpoints
// -----------------------------------------------------------------------------

export const ADMIN_PAYMENT_METHODS_ENDPOINTS = {
  /**
   * Retrieve all financial payment methods.
   */
  GET_ALL: FINANCIAL_PAYMENT_METHODS_BASE,

  /**
   * Retrieve one payment method by its public identifier.
   */
  GET_BY_PUBLIC_ID: (paymentMethodPublicId: string): string =>
    `${FINANCIAL_PAYMENT_METHODS_BASE}/${encodeURIComponent(paymentMethodPublicId)}`,

  /**
   * Retrieve the default payment method for an account.
   */
  GET_DEFAULT_BY_ACCOUNT: (accountPublicId: string): string =>
    `${FINANCIAL_PAYMENT_METHODS_BASE}/accounts/${encodeURIComponent(accountPublicId)}/default`,

  /**
   * Register a payment method.
   */
  ADD: FINANCIAL_PAYMENT_METHODS_BASE,

  /**
   * Set a payment method as the account default.
   */
  SET_DEFAULT: (paymentMethodPublicId: string): string =>
    `${FINANCIAL_PAYMENT_METHODS_BASE}/${encodeURIComponent(paymentMethodPublicId)}/default`,

  /**
   * Deactivate a payment method.
   */
  DEACTIVATE: (paymentMethodPublicId: string): string =>
    `${FINANCIAL_PAYMENT_METHODS_BASE}/${encodeURIComponent(paymentMethodPublicId)}/deactivate`,
} as const;

export default ADMIN_PAYMENT_METHODS_ENDPOINTS;
