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

export interface MpesaStkPushApiResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

// -----------------------------------------------------------------------------
// Normalized STK Push Result
// -----------------------------------------------------------------------------

export interface MpesaStkPushResult {
  merchantRequestId: string;
  checkoutRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
  accepted: boolean;
}

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
