/**
 * Safaricom Daraja 3.0 — M-PESA B2C Payment Request Response
 *
 * Immediate response returned by:
 * POST /mpesa/b2c/v3/paymentrequest
 *
 * IMPORTANT:
 * ResponseCode === '0' means Safaricom accepted the request for processing.
 * It does NOT confirm that the recipient has received the funds.
 *
 * The final outcome must be determined from the asynchronous ResultURL
 * callback.
 */

export interface MpesaB2CResponse {
  /**
   * Safaricom-generated identifier for this request journey.
   * Persist against the corresponding disbursement attempt.
   */
  ConversationID: string;

  /**
   * Correlation identifier returned by Safaricom.
   * Persist against the corresponding disbursement attempt.
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
