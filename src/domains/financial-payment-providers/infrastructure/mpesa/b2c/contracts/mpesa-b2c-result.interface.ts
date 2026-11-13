/**
 * Safaricom Daraja 3.0 — M-PESA B2C Result Callback
 *
 * Payload sent by Safaricom to the ResultURL configured in the
 * original B2C payment request.
 *
 * IMPORTANT:
 * - ResultCode === 0 means the payout succeeded.
 * - Any other ResultCode means the payout failed.
 * - The immediate B2C API acknowledgement is not proof of payment.
 * - ResultParameters are optional and normally contain additional
 *   transaction details for successful payouts.
 */

// =============================================================================
// Result Parameters
// =============================================================================

export interface MpesaB2CResultParameter {
  /** Name of the additional transaction detail. */
  Key: string;

  /** Value may be text, numeric, boolean, or null. */
  Value?: string | number | boolean | null;
}

export interface MpesaB2CResultParameters {
  ResultParameter: MpesaB2CResultParameter[];
}

// =============================================================================
// Reference Data
// =============================================================================

export interface MpesaB2CReferenceItem {
  Key: string;
  Value?: string | number | boolean | null;
}

export interface MpesaB2CReferenceData {
  ReferenceItem: MpesaB2CReferenceItem;
}

// =============================================================================
// Result
// =============================================================================

export interface MpesaB2CResult {
  /** Result notification type. */
  ResultType: number;

  /**
   * Final transaction processing result.
   * 0 = successful payout.
   * Any non-zero value = unsuccessful payout.
   */
  ResultCode: number | string;

  /** Safaricom's description of the transaction outcome. */
  ResultDesc: string;

  /** Safaricom API-proxy correlation identifier. */
  OriginatorConversationID: string;

  /** Safaricom conversation correlation identifier. */
  ConversationID: string;

  /** Safaricom transaction identifier. */
  TransactionID: string;

  /**
   * Additional transaction details, normally present on successful
   * transactions. May be absent on unsuccessful transactions.
   */
  ResultParameters?: MpesaB2CResultParameters;

  /** Optional provider reference information. */
  ReferenceData?: MpesaB2CReferenceData;
}

// =============================================================================
// Callback Envelope
// =============================================================================

/** Complete callback body received at the B2C ResultURL. */
export interface MpesaB2CResultCallback {
  Result: MpesaB2CResult;
}
