
// =============================================================================
// sisiMove — Create Payment Request Model
// =============================================================================
//
// Frontend request model for initiating a FinancialPayment.
//
// Supported payment channels:
//
//     STK_PUSH — Uses a registered Financial Payment Method.
//     C2B      — Customer pays using PayBill or Buy Goods/Till.
//
// Monetary amounts are transported as strings at the API boundary.
//
//     "100"  = KES 100
//     "1250" = KES 1,250
//
// The amount represents whole major currency units (KES).
// No conversion to minor units occurs in this model.
//
// The backend converts the amount into minor units at its API boundary.
//
// Ownership:
//
// The authenticated member's FinancialAccount is resolved by the backend.
// The account public identifier is supplied separately to the API adapter
// where required by the existing backend endpoint.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Payment Channel
// -----------------------------------------------------------------------------

export type FinancialPaymentChannel =
  | 'STK_PUSH'
  | 'C2B';

// -----------------------------------------------------------------------------
// CreatePaymentRequest
// -----------------------------------------------------------------------------

export interface CreatePaymentRequest {
  /**
   * Payment execution channel.
   *
   * STK_PUSH:
   * Requires methodPublicId identifying the saved payment method.
   *
   * C2B:
   * Does not use a registered payment method.
   */
  channel: FinancialPaymentChannel;

  /**
   * Amount to fund the Financial Account.
   *
   * Whole KES in major currency units.
   *
   * Examples:
   *
   *     "100"  = KES 100
   *     "500"  = KES 500
   *     "1250" = KES 1,250
   */
  amount: string;

  /**
   * ISO currency code.
   *
   * sisiMove currently uses KES for member wallet funding.
   */
  currency: string;

  /**
   * Correlation identifier supplied by the initiating workflow.
   */
  correlationId: string;

  /**
   * Public identifier of the registered payment method.
   *
   * Required for STK_PUSH.
   * Must be omitted for C2B.
   *
   * The API adapter maps this to the backend's methodId field.
   */
  methodPublicId?: string;

  /**
   * Optional type of the business object associated with the payment.
   */
  referenceType?: string;

  /**
   * Public identifier of the associated business object.
   */
  referencePublicId?: string;

  /**
   * Optional identifier linking this payment to the operation that caused it.
   */
  causationId?: string;
}
