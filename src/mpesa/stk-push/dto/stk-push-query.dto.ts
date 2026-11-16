/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 STK Push Query DTO
 * -----------------------------------------------------------------------------
 *
 * Defines the request and response contracts for querying the status
 * of an existing M-PESA STK Push transaction.
 *
 * Responsibilities:
 * - Define the STK Push query request.
 * - Validate the identifiers required by Daraja.
 * - Represent the provider's query response.
 *
 * Architectural boundary:
 * - This DTO represents provider transport data only.
 * - It does not determine or execute financial state transitions.
 * - FinancialModule exclusively owns payment status decisions.
 *
 * Important:
 * - Queries use the CheckoutRequestID returned during STK Push initiation.
 * - A query response is not itself a financial state transition.
 * - FinancialModule must validate and interpret the provider response.
 *
 * -----------------------------------------------------------------------------
 */

// =============================================================================
// STK Push Query Request
// =============================================================================

/**
 * Request payload sent to the Daraja STK Push Query endpoint.
 */
export class StkPushQueryRequestDto {
  /**
   * Public ID of the configured M-PESA provider.
   *
   * Used internally to resolve the provider configuration.
   * Not sent directly as a Daraja request field.
   */
  readonly providerPublicId!: string;

  /**
   * Checkout request identifier assigned by Safaricom.
   *
   * Obtained from the original STK Push initiation response.
   */
  readonly checkoutRequestId!: string;
}

// =============================================================================
// STK Push Query Provider Request
// =============================================================================

/**
 * Actual request payload sent to Safaricom.
 *
 * Internal transport contract.
 */
export interface StkPushDarajaQueryRequest {
  /**
   * M-PESA business shortcode.
   */
  readonly BusinessShortCode: string;

  /**
   * Generated STK Push password.
   */
  readonly Password: string;

  /**
   * Request timestamp in YYYYMMDDHHmmss format.
   */
  readonly Timestamp: string;

  /**
   * Original STK Push checkout request identifier.
   */
  readonly CheckoutRequestID: string;
}

// =============================================================================
// STK Push Query Response
// =============================================================================

/**
 * Immediate response returned by Safaricom after a query request.
 */
export class StkPushQueryResponseDto {
  /**
   * Result code returned by Daraja.
   */
  readonly responseCode!: string;

  /**
   * Description of the query request result.
   */
  readonly responseDescription!: string;

  /**
   * Merchant request identifier, when returned.
   */
  readonly merchantRequestId?: string;

  /**
   * Checkout request identifier, when returned.
   */
  readonly checkoutRequestId?: string;

  /**
   * STK Push transaction result code, when available.
   *
   * This is distinct from the immediate query ResponseCode.
   */
  readonly resultCode?: string | number;

  /**
   * STK Push transaction result description, when available.
   */
  readonly resultDescription?: string;
}

// =============================================================================
// Daraja Query Response
// =============================================================================

/**
 * Raw Daraja STK Push Query response.
 */
export interface StkPushDarajaQueryResponse {
  readonly ResponseCode?: string;
  readonly ResponseDescription?: string;
  readonly MerchantRequestID?: string;
  readonly CheckoutRequestID?: string;
  readonly ResultCode?: string | number;
  readonly ResultDesc?: string;
}

// =============================================================================
// Default Export
// =============================================================================

export default StkPushQueryRequestDto;
