/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 Shared Types
 * -----------------------------------------------------------------------------
 *
 * Shared request and response contracts for Safaricom Daraja APIs.
 *
 * These types describe transport-level data only.
 * Business entities and payment domain models belong in the
 * Financial module.
 *
 * -----------------------------------------------------------------------------
 */

// =============================================================================
// Environment
// =============================================================================

export type { MpesaEnvironment } from './mpesa.config';
import type { MpesaC2BResponseType } from './mpesa.config';
// =============================================================================
// OAuth
// =============================================================================

export interface MpesaOAuthTokenResponse {
  readonly access_token: string;
  readonly expires_in: string | number;
}

export interface MpesaOAuthToken {
  readonly accessToken: string;
  readonly expiresAt: number;
}

// =============================================================================
// Common Daraja API Response
// =============================================================================

export interface MpesaApiResponse {
  readonly OriginatorConversationID?: string;
  readonly ConversationID?: string;
  readonly ResponseCode?: string;
  readonly ResponseDescription?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
}

// =============================================================================
// Daraja Error Response
// =============================================================================

export interface MpesaErrorResponse {
  readonly requestId?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly error?: string;
  readonly error_description?: string;
}

// =============================================================================
// Shared Callback Parameter
// =============================================================================

export interface MpesaCallbackParameter {
  readonly Name?: string;
  readonly Key?: string;
  readonly Value?: string | number;
}

// =============================================================================
// STK Push — M-PESA Express
// =============================================================================

export interface MpesaStkPushRequest {
  readonly BusinessShortCode: string;
  readonly Password: string;
  readonly Timestamp: string;
  readonly TransactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  readonly Amount: number;
  readonly PartyA: string;
  readonly PartyB: string;
  readonly PhoneNumber: string;
  readonly CallBackURL: string;
  readonly AccountReference: string;
  readonly TransactionDesc: string;
}

export interface MpesaStkPushResponse extends MpesaApiResponse {
  readonly MerchantRequestID?: string;
  readonly CheckoutRequestID?: string;
  readonly CustomerMessage?: string;
}

export interface MpesaStkPushCallback {
  readonly Body: {
    readonly stkCallback: {
      readonly MerchantRequestID: string;
      readonly CheckoutRequestID: string;
      readonly ResultCode: number;
      readonly ResultDesc: string;
      readonly CallbackMetadata?: {
        readonly Item: ReadonlyArray<{
          readonly Name: string;
          readonly Value?: string | number;
        }>;
      };
    };
  };
}

export interface MpesaStkPushQueryRequest {
  readonly BusinessShortCode: string;
  readonly Password: string;
  readonly Timestamp: string;
  readonly CheckoutRequestID: string;
}

export interface MpesaStkPushQueryResponse extends MpesaApiResponse {
  readonly MerchantRequestID?: string;
  readonly CheckoutRequestID?: string;
  readonly ResultCode?: string | number;
  readonly ResultDesc?: string;
}

// =============================================================================
// C2B — Customer to Business
// =============================================================================

export type MpesaC2BCommandId =
  'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';

export interface MpesaC2BRegisterUrlRequest {
  readonly ShortCode: string;
  readonly ResponseType: MpesaC2BResponseType;
  readonly ConfirmationURL: string;
  readonly ValidationURL: string;
}

export interface MpesaC2BRegisterUrlResponse extends MpesaApiResponse {
  readonly OriginatorConversationID?: string;
}

export interface MpesaC2BSimulationRequest {
  readonly ShortCode: string;
  readonly CommandID: MpesaC2BCommandId;
  readonly Amount: number;
  readonly Msisdn: string;
  readonly BillRefNumber?: string;
}

/**
 * C2B confirmation callback payload.
 *
 * This represents the provider's transaction notification.
 * It must not directly update financial balances.
 */
export interface MpesaC2BConfirmationCallback {
  readonly TransactionType?: string;
  readonly TransID: string;
  readonly TransTime: string;
  readonly TransAmount: string;
  readonly BusinessShortCode: string;
  readonly BillRefNumber?: string;
  readonly MSISDN: string;
  readonly FirstName?: string;
  readonly MiddleName?: string;
  readonly LastName?: string;
}

// =============================================================================
// B2C — Business to Customer
// =============================================================================

export type MpesaB2CCommandId = 'BusinessPayment';

export interface MpesaB2CRequest {
  readonly InitiatorName: string;
  readonly SecurityCredential: string;
  readonly CommandID: MpesaB2CCommandId;
  readonly Amount: number;
  readonly PartyA: string;
  readonly PartyB: string;
  readonly Remarks: string;
  readonly QueueTimeOutURL: string;
  readonly ResultURL: string;
  readonly Occasion?: string;
}

export type MpesaB2CResponse = MpesaApiResponse;
/**
 * B2C result callback.
 *
 * Transaction-specific details, including the transaction receipt,
 * are represented in ResultParameters when supplied by Daraja.
 */
export interface MpesaB2CResultCallback {
  readonly Result: {
    readonly ResultType: number;
    readonly ResultCode: number;
    readonly ResultDesc: string;
    readonly OriginatorConversationID: string;
    readonly ConversationID: string;
    readonly TransactionID?: string;
    readonly ResultParameters?: {
      readonly ResultParameter: ReadonlyArray<{
        readonly Key: string;
        readonly Value?: string | number;
      }>;
    };
  };
}

/**
 * B2C queue-timeout callback.
 *
 * Kept separate from the result callback because a queue timeout
 * is a different provider event and must be handled independently.
 */
export interface MpesaB2CQueueTimeoutCallback {
  readonly Result: {
    readonly ResultType: number;
    readonly ResultCode: number;
    readonly ResultDesc: string;
    readonly OriginatorConversationID: string;
    readonly ConversationID: string;
  };
}

// =============================================================================
// Phone Numbers
// =============================================================================

export type MpesaPhoneNumber = string;

// =============================================================================
// Monetary Values
// =============================================================================

export type MpesaAmount = number;
