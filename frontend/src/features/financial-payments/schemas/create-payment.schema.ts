// =============================================================================
// sisiMove — Create Payment Schema
// =============================================================================
//
// Validation schema for initiating a FinancialPayment.
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
// Monetary amounts are represented as strings containing whole KES
// in major currency units.
//
// Examples:
//
//     "100"  = KES 100
//     "500"  = KES 500
//     "1250" = KES 1,250
//
// The amount is not multiplied by 100 at this boundary.
//
// Payment channels:
//
//     STK_PUSH
//         Requires an existing saved FinancialPaymentMethod.
//
//     C2B
//         Does not require or accept a FinancialPaymentMethod.
//         The member pays using PayBill or Buy Goods instructions.
//
// =============================================================================

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Payment Channel
// -----------------------------------------------------------------------------

export const financialPaymentChannelSchema = z.enum([
  'STK_PUSH',
  'C2B',
]);

// -----------------------------------------------------------------------------
// Create Payment Schema
// -----------------------------------------------------------------------------

export const createPaymentSchema = z
  .object({
    /**
     * Payment channel.
     *
     * STK_PUSH: Initiate a prompt using an existing saved payment method.
     * C2B: Customer makes an external PayBill or Buy Goods payment.
     */
    channel: financialPaymentChannelSchema,

    /**
     * Payment amount in whole KES (major currency units).
     *
     * The value is transmitted as entered by the member.
     *
     * Examples:
     *
     *     "100"  = KES 100
     *     "500"  = KES 500
     *     "1250" = KES 1,250
     *
     * Decimal amounts, negative values, and non-numeric values are rejected.
     */
    amount: z
      .string()
      .trim()
      .regex(/^[0-9]+$/, {
        message: 'Amount must be a whole number in KES.',
      })
      .refine((value) => Number.isSafeInteger(Number(value)), {
        message: 'Amount is too large.',
      })
      .refine((value) => Number(value) > 0, {
        message: 'Amount must be greater than zero.',
      }),

    /**
     * ISO currency code.
     *
     * sisiMove currently operates member wallet payments in KES.
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
     * Required for STK_PUSH.
     * Must be omitted for C2B.
     */
    methodPublicId: z
      .string()
      .trim()
      .min(1, {
        message: 'Payment method ID cannot be empty.',
      })
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
     * Optional causation identifier linking this payment to the operation
     * that caused it.
     */
    causationId: z
      .string()
      .trim()
      .min(1)
      .optional(),
  })
  .superRefine((value, ctx) => {
    // STK Push must use an existing saved payment method.
    if (value.channel === 'STK_PUSH' && !value.methodPublicId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['methodPublicId'],
        message: 'A saved payment method is required for STK Push.',
      });
    }

    // C2B is customer-initiated and must not include a payment method.
    if (value.channel === 'C2B' && value.methodPublicId !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['methodPublicId'],
        message: 'A payment method must not be provided for C2B payments.',
      });
    }
  });

// -----------------------------------------------------------------------------
// Inferred Form Type
// -----------------------------------------------------------------------------

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
