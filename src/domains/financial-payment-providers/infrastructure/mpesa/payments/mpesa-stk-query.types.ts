// -----------------------------------------------------------------------------
// M-PESA STK Query Types
// -----------------------------------------------------------------------------

export interface MpesaStkQueryInput {
  providerPublicId: string;
  checkoutRequestId: string;
}

export interface MpesaStkQueryRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  CheckoutRequestID: string;
}

export interface MpesaStkQueryApiResponse {
  ResponseCode?: string;
  ResponseDescription?: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResultCode?: string | number;
  ResultDesc?: string;
}

export default MpesaStkQueryApiResponse;
