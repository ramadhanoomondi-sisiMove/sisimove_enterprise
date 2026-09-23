// =============================================================================
// sisiMove — Create Payment Schema
// =============================================================================
//
// Validation schema for initiating a FinancialPayment.
//
// This schema validates member-provided payment input before the request
// reaches the authenticated API boundary.
//
// Architectural boundary:
//
//     UI form
//         ↓
//     CreatePaymentSchema
//         ↓
//     CreatePaymentRequest
//         ↓
//     createPayment()
//         ↓
//     authenticated API
//
// The schema performs input validation only.
//
// It does not:
//
//     - create payments;
//     - resolve financial accounts;
//     - select payment providers;
//     - process provider requests;
//     - mutate wallet balances;
//     - transition payment status.
//
// Monetary amounts are represented as integer minor-unit strings.
//
// Example:
//
//     "125000" = KES 1,250.00
//
// =============================================================================

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Create Payment Schema
// -----------------------------------------------------------------------------

export const createPaymentSchema = z.object({
  /**
   * Payment amount in integer minor units.
   *
   * Examples:
   *
   *     "10000"  = KES 100.00
   *     "125000" = KES 1,250.00
   *
   * Decimal amounts and floating-point values are deliberately rejected.
   */
  amount: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: 'Amount must be a whole number in minor units.',
    })
    .refine((value) => Number(value) > 0, {
      message: 'Amount must be greater than zero.',
    }),

  /**
   * ISO currency code.
   *
   * SisiMove currently operates member wallet payments in KES.
   */
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .length(3, {
      message: 'Currency must be a valid three-letter currency code.',
    }),

  /**
   * Correlation identifier for tracing the initiating workflow.
   */
  correlationId: z
    .string()
    .trim()
    .min(1, {
      message: 'Correlation ID is required.',
    }),

  /**
   * Public identifier of an existing payment method.
   *
   * This is optional because the backend may allow the payment workflow to
   * determine or initiate the appropriate method separately.
   */
  methodPublicId: z
    .string()
    .trim()
    .min(1)
    .optional(),

  /**
   * Optional business reference type.
   */
  referenceType: z
    .string()
    .trim()
    .min(1)
    .optional(),

  /**
   * Optional public identifier of the referenced business object.
   */
  referencePublicId: z
    .string()
    .trim()
    .min(1)
    .optional(),

  /**
   * Optional causation identifier linking this payment to the operation that
   * caused it.
   */
  causationId: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

// -----------------------------------------------------------------------------
// Inferred Form Type
// -----------------------------------------------------------------------------

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;

