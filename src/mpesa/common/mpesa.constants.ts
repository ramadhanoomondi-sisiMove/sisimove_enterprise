/**
 * -----------------------------------------------------------------------------
 * SisiMove — Safaricom M-PESA Daraja 3.0 Constants
 * -----------------------------------------------------------------------------
 *
 * Centralized constants for Daraja API communication.
 *
 * Responsibilities:
 * - Daraja environment base URLs.
 * - OAuth endpoint and token settings.
 * - STK Push endpoints and transaction types.
 * - C2B endpoints and command identifiers.
 * - B2C payment endpoint and command identifiers.
 * - Shared HTTP defaults.
 *
 * Architecture:
 * - Constants only.
 * - No NestJS dependencies.
 * - No HTTP client dependencies.
 * - No database dependencies.
 *
 * -----------------------------------------------------------------------------
 */

// =============================================================================
// Daraja Environment Base URLs
// =============================================================================

export const MPESA_BASE_URLS = {
  SANDBOX: 'https://sandbox.safaricom.co.ke',
  PRODUCTION: 'https://api.safaricom.co.ke',
} as const;

// =============================================================================
// OAuth 2.0
// =============================================================================

export const MPESA_OAUTH = {
  TOKEN_PATH: '/oauth/v1/generate',
  GRANT_TYPE: 'client_credentials',

  /**
   * Refresh the access token before its actual expiry.
   */
  TOKEN_EXPIRY_BUFFER_SECONDS: 60,
} as const;

// =============================================================================
// STK Push — M-PESA Express
// =============================================================================

export const MPESA_STK_PUSH = {
  PROCESS_REQUEST_PATH: '/mpesa/stkpush/v1/processrequest',
  QUERY_PATH: '/mpesa/stkpushquery/v1/query',
} as const;

/**
 * STK Push transaction types.
 */
export const MPESA_STK_TRANSACTION_TYPES = {
  CUSTOMER_PAYBILL_ONLINE: 'CustomerPayBillOnline',
  CUSTOMER_BUY_GOODS_ONLINE: 'CustomerBuyGoodsOnline',
} as const;

// =============================================================================
// C2B — Customer to Business
// =============================================================================

export const MPESA_C2B = {
  REGISTER_URL_PATH: '/mpesa/c2b/v2/registerurl',
  SIMULATE_PATH: '/mpesa/c2b/v2/simulate',
} as const;

/**
 * C2B simulation command identifiers.
 */
export const MPESA_C2B_COMMANDS = {
  CUSTOMER_PAYBILL_ONLINE: 'CustomerPayBillOnline',
  CUSTOMER_BUY_GOODS_ONLINE: 'CustomerBuyGoodsOnline',
} as const;

// =============================================================================
// B2C — Business to Customer
// =============================================================================

export const MPESA_B2C = {
  PAYMENT_REQUEST_PATH: '/mpesa/b2c/v3/paymentrequest',
} as const;

/**
 * B2C command identifiers.
 *
 * SisiMove uses BusinessPayment for business payouts:
 * - Journey earnings.
 * - Commissions.
 * - Settlements.
 *
 * Employee salaries and promotional rewards are outside
 * the scope of this integration.
 */
export const MPESA_B2C_COMMANDS = {
  BUSINESS_PAYMENT: 'BusinessPayment',
} as const;

// =============================================================================
// HTTP Defaults
// =============================================================================

export const MPESA_HTTP = {
  TIMEOUT_MS: 30_000,
  CONTENT_TYPE: 'application/json',
  ACCEPT: 'application/json',
} as const;
