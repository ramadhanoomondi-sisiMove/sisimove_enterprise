/**
 * Safaricom Daraja 3.0 — M-PESA B2C Payment Request Response
 *
 * Immediate response returned by:
 * POST /mpesa/b2c/v3/paymentrequest
 *
 * IMPORTANT:
 * - ResponseCode === '0' means Safaricom accepted the request
 *   for processing.
 * - Acceptance does NOT confirm that the recipient received funds.
 * - The final payout outcome must be determined from the
 *   asynchronous ResultURL callback.
 *
 * This interface describes the provider transport response only.
 */

// =============================================================================
// Response
// =============================================================================

export interface MpesaB2CResponse {
  /**
   * Safaricom-generated identifier for this request journey.
   * Persist against the corresponding Financial Disbursement Attempt.
   */
  ConversationID: string;

  /**
   * Correlation identifier returned by Safaricom.
   * Must match the OriginatorConversationID submitted by SisiMove.
   * Persist against the corresponding Financial Disbursement Attempt.
   */
  OriginatorConversationID: string;

  /**
   * Daraja response code.
   * '0' indicates acceptance for processing.
   * Other values indicate submission rejection.
   */
  ResponseCode: string;

  /** Human-readable acknowledgement or rejection description. */
  ResponseDescription: string;
}
