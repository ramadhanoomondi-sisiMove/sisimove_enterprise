// -----------------------------------------------------------------------------
// M-PESA STK Push Types
// -----------------------------------------------------------------------------
//
// These types define the Daraja STK Push request, Safaricom API response,
// normalized application result, and caller-supplied input.
//
// Provider credentials, environment, and callback URL are deliberately
// excluded from MpesaStkPushInput. They are resolved internally by the
// M-PESA infrastructure service.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Transaction Types
// -----------------------------------------------------------------------------

export type MpesaStkPushTransactionType =
  'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';

// -----------------------------------------------------------------------------
// STK Push Request
// -----------------------------------------------------------------------------

export interface MpesaStkPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: MpesaStkPushTransactionType;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

// -----------------------------------------------------------------------------
// STK Push API Response
// -----------------------------------------------------------------------------
//
// Safaricom response fields are optional because an incomplete response must
// not automatically be interpreted as a rejected payment.
//
// -----------------------------------------------------------------------------

export interface MpesaStkPushApiResponse {
  MerchantRequestID?: string | null;
  CheckoutRequestID?: string | null;
  ResponseCode?: string | null;
  ResponseDescription?: string | null;
  CustomerMessage?: string | null;
}

// -----------------------------------------------------------------------------
// Normalized STK Push Result
// -----------------------------------------------------------------------------

export interface MpesaStkPushResultBase {
  merchantRequestId: string | null;
  checkoutRequestId: string | null;
  responseCode: string | null;
  responseDescription: string | null;
  customerMessage: string | null;
}

// -----------------------------------------------------------------------------
// Accepted Outcome
// -----------------------------------------------------------------------------
//
// Safaricom explicitly accepted the request.
//
// Missing identifiers do not change acceptance into rejection. The payment
// must remain pending reconciliation until its outcome is established.
//
// -----------------------------------------------------------------------------

export interface MpesaStkPushAcceptedResult extends MpesaStkPushResultBase {
  outcome: 'ACCEPTED';
  accepted: true;
}

// -----------------------------------------------------------------------------
// Rejected Outcome
// -----------------------------------------------------------------------------
//
// Safaricom explicitly rejected the request.
//
// -----------------------------------------------------------------------------

export interface MpesaStkPushRejectedResult extends MpesaStkPushResultBase {
  outcome: 'REJECTED';
  accepted: false;
}

// -----------------------------------------------------------------------------
// Uncertain Outcome
// -----------------------------------------------------------------------------
//
// The request may have reached Safaricom, but its acceptance or rejection
// could not be established reliably.
//
// The payment must remain PROCESSING and must not automatically submit
// another STK Push.
//
// -----------------------------------------------------------------------------

export interface MpesaStkPushUncertainResult extends MpesaStkPushResultBase {
  outcome: 'UNCERTAIN';
  accepted: false;
}

// -----------------------------------------------------------------------------
// Result Union
// -----------------------------------------------------------------------------

export type MpesaStkPushResult =
  | MpesaStkPushAcceptedResult
  | MpesaStkPushRejectedResult
  | MpesaStkPushUncertainResult;

// -----------------------------------------------------------------------------
// STK Push Input
// -----------------------------------------------------------------------------

export interface MpesaStkPushInput {
  providerPublicId: string;

  phoneNumber: string;
  amount: number;

  accountReference: string;
  transactionDescription: string;

  transactionType?: MpesaStkPushTransactionType;
}
