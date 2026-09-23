// =============================================================================
// sisiMove — Create Payment Request Model
// =============================================================================
//
// Frontend request model for initiating a FinancialPayment.
//
// This model represents the HTTP/application input required to create a
// payment. It is intentionally kept separate from the FinancialPayment
// response model.
//
// Monetary amounts are transported as strings at the API boundary.
//
// This is deliberate:
//
//     "125000" = KES 1,250.00
//
// Using a string prevents JavaScript floating-point behavior from becoming
// part of the payment request contract.
//
// Ownership:
//
// The authenticated member's FinancialAccount is resolved by the backend.
// The frontend therefore does not expose an owner identity and should not
// obtain or submit an arbitrary database account ID.
//
// The backend controller currently accepts `accountId`, so the API adapter may
// resolve the authenticated member's public account identifier before sending
// the request, depending on the exact backend DTO contract. This model keeps
// the feature-level request focused on member intent rather than persistence.
//
// =============================================================================

// -----------------------------------------------------------------------------
// CreatePaymentRequest
// -----------------------------------------------------------------------------

export interface CreatePaymentRequest {
  /**
   * Amount to fund the Financial Account.
   *
   * String representation of integer minor units.
   *
   * Example:
   *
   *     "125000" = KES 1,250.00
   */
  amount: string;

  /**
   * ISO currency code for the payment.
   *
   * SisiMove currently uses KES for member wallet funding.
   */
  currency: string;

  /**
   * Correlation identifier supplied by the initiating application workflow.
   *
   * This allows related operations to be traced without exposing database
   * identifiers or embedding workflow logic in the frontend model.
   */
  correlationId: string;

  /**
   * Public identifier of the selected payment method, when a specific
   * previously configured payment method is being used.
   */
  methodPublicId?: string;

  /**
   * Optional reference describing the business object associated with the
   * payment.
   *
   * Example:
   *
   *     referenceType: "WALLET_TOP_UP"
   */
  referenceType?: string;

  /**
   * Public identifier of the business object associated with the payment.
   */
  referencePublicId?: string;

  /**
   * Optional causation identifier linking this payment to the operation that
   * caused it.
   *
   * This remains an opaque identifier at the frontend boundary.
   */
  causationId?: string;
}
