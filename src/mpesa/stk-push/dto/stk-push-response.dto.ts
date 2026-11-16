/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 STK Push Response DTO
 * -----------------------------------------------------------------------------
 *
 * Represents the immediate response returned by Safaricom after an STK Push
 * request has been submitted.
 *
 * Responsibilities:
 * - Represent the Daraja STK Push initiation response.
 * - Expose Safaricom request identifiers.
 * - Preserve the internal Financial Payment correlation reference.
 *
 * Important:
 * - This response confirms request acceptance, not payment completion.
 * - ResultCode "0" indicates successful request acceptance.
 * - Final payment status is determined through callback processing.
 * - FinancialModule exclusively owns financial state transitions.
 *
 * Security:
 * - Never expose OAuth access tokens.
 * - Never expose consumer credentials or security credentials.
 *
 * -----------------------------------------------------------------------------
 */

export class StkPushResponseDto {
  /**
   * Result code returned by Daraja.
   *
   * "0" indicates successful request acceptance.
   */
  readonly responseCode!: string;

  /**
   * Description of the request result.
   */
  readonly responseDescription!: string;

  /**
   * Merchant request identifier assigned by Safaricom.
   */
  readonly merchantRequestId!: string;

  /**
   * Checkout request identifier assigned by Safaricom.
   */
  readonly checkoutRequestId!: string;

  /**
   * Customer-facing description returned by Daraja, when available.
   */
  readonly customerMessage?: string;

  /**
   * Internal Financial Payment reference.
   *
   * Used for correlation only.
   * It does not represent or determine the financial payment status.
   */
  readonly paymentReference?: string;
}

// =============================================================================
// Default Export
// =============================================================================

export default StkPushResponseDto;
