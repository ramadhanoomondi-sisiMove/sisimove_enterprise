/**
 * Safaricom Daraja 3.0 — M-PESA B2C Queue Timeout Callback
 *
 * Payload received at the QueueTimeOutURL configured in the
 * original B2C payment request.
 *
 * IMPORTANT:
 * - A queue timeout does NOT confirm that the payout failed.
 * - Do not mark the withdrawal as FAILED based only on this callback.
 * - Do not automatically resubmit the B2C request.
 * - Keep the disbursement unresolved until its outcome is reconciled.
 *
 * The timeout payload is represented flexibly to preserve provider
 * fields that may not yet be explicitly modelled.
 */

export interface MpesaB2CTimeout {
  /** Optional result notification type. */
  ResultType?: number | string;

  /** Optional result code supplied in the timeout notification. */
  ResultCode?: number | string;

  /** Optional timeout description. */
  ResultDesc?: string;

  /** Safaricom API-proxy correlation identifier, when supplied. */
  OriginatorConversationID?: string;

  /** Safaricom conversation correlation identifier, when supplied. */
  ConversationID?: string;

  /** Additional provider fields not yet explicitly modelled. */
  [key: string]: unknown;
}

/** Complete B2C queue-timeout callback body. */
export interface MpesaB2CTimeoutCallback {
  Result?: MpesaB2CTimeout;

  /** Additional provider fields not yet explicitly modelled. */
  [key: string]: unknown;
}
