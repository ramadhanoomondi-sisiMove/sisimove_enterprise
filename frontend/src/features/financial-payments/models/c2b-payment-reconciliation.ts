

// =============================================================================
// sisiMove — C2B Payment Reconciliation Models
// =============================================================================
//
// The authenticated customer may ask SisiMove to check whether the M-PESA
// confirmation callback for an existing C2B payment has been received.
//
// This request is only a reconciliation trigger. It is not proof of payment
// and must never cause the frontend to transition the FinancialPayment status.
//
// The backend remains responsible for callback verification and all payment
// lifecycle transitions.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Reconcile C2B Payment Request
// -----------------------------------------------------------------------------

export interface ReconcileC2BPaymentRequest {
  /**
   * Payment-specific C2B reference returned by the backend when the
   * FinancialPayment was created.
   *
   * This is the existing payment reference. The frontend must not generate
   * or modify it.
   */
  reference: string;
}

// -----------------------------------------------------------------------------
// Reconcile C2B Payment Result
// -----------------------------------------------------------------------------

export interface ReconcileC2BPaymentResult {
  /**
   * True only when the backend successfully processed the verified callback.
   */
  processed: boolean;

  /**
   * True when the provider transaction or callback was already processed.
   */
  duplicate: boolean;

  /**
   * True when the payment still needs reconciliation.
   *
   * For example, the Safaricom callback may not have arrived yet. The
   * FinancialPayment remains in its existing lifecycle state.
   */
  requiresReconciliation: boolean;

  /**
   * Public identifier of the existing FinancialPayment, when resolved.
   */
  paymentPublicId?: string;

  /**
   * Public identifier of the successful or already-existing payment attempt,
   * when available.
   */
  attemptPublicId?: string;

  /**
   * Backend-provided explanation of the reconciliation outcome.
   */
  message: string;
}

