/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 STK Push Callback DTO
 * -----------------------------------------------------------------------------
 *
 * Represents the callback payload received from Safaricom after an STK Push
 * transaction has been processed.
 *
 * Responsibilities:
 * - Define the Daraja STK Push callback envelope.
 * - Represent transaction result information.
 * - Represent optional payment metadata.
 * - Preserve provider identifiers for correlation.
 *
 * Architectural boundary:
 * - This contract represents provider-supplied transport data.
 * - It does not determine financial payment status.
 * - FinancialModule exclusively owns financial state transitions.
 * - Callback processing must be idempotent.
 *
 * Important:
 * - ResultCode 0 indicates a successful provider transaction result.
 * - A non-zero ResultCode indicates an unsuccessful provider result.
 * - Callback metadata is optional because unsuccessful transactions
 *   may not contain payment receipt details.
 * - A successful provider result must still be validated and correlated
 *   by FinancialModule before financial consequences are executed.
 *
 * -----------------------------------------------------------------------------
 */

// =============================================================================
// Callback Metadata Item
// =============================================================================

export interface StkPushCallbackMetadataItem {
  /**
   * Metadata field name.
   *
   * Examples:
   * - Amount
   * - MpesaReceiptNumber
   * - TransactionDate
   * - PhoneNumber
   */
  readonly Name: string;

  /**
   * Metadata value returned by Daraja.
   */
  readonly Value?: string | number;
}

// =============================================================================
// Callback Metadata
// =============================================================================

export interface StkPushCallbackMetadata {
  /**
   * Collection of transaction metadata items.
   */
  readonly Item: readonly StkPushCallbackMetadataItem[];
}

// =============================================================================
// STK Push Callback Body
// =============================================================================

export interface StkPushCallbackBody {
  /**
   * Merchant request identifier assigned by Safaricom.
   */
  readonly MerchantRequestID: string;

  /**
   * Checkout request identifier assigned by Safaricom.
   */
  readonly CheckoutRequestID: string;

  /**
   * Provider transaction result code.
   *
   * 0 = successful provider transaction result.
   * Non-zero = unsuccessful provider transaction result.
   */
  readonly ResultCode: number;

  /**
   * Provider transaction result description.
   */
  readonly ResultDesc: string;

  /**
   * Optional transaction metadata.
   *
   * May be absent for unsuccessful transactions.
   */
  readonly CallbackMetadata?: StkPushCallbackMetadata;
}

// =============================================================================
// STK Push Callback Envelope
// =============================================================================

export interface StkPushCallbackDto {
  readonly Body: {
    readonly stkCallback: StkPushCallbackBody;
  };
}

// =============================================================================
// Default Export
// =============================================================================

export default StkPushCallbackDto;
