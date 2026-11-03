// =============================================================================
// sisiMove — Create Financial Payment Method Schema
// =============================================================================
//
// Validation boundary for creating a FinancialPaymentMethod.
//
// Current supported payment method:
//
//     MOBILE_MONEY / MPESA
//
// The Financial Account public identifier is supplied separately through
// the API operation and is intentionally NOT part of this schema.
//
// The member-facing form collects the M-PESA phone number.
// Provider and payment method type are fixed by the application.
//
// =============================================================================

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Payment Method Type
// -----------------------------------------------------------------------------

const paymentMethodTypeSchema = z.literal('MOBILE_MONEY');

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

const paymentProviderSchema = z.literal('MPESA');

// -----------------------------------------------------------------------------
// Kenyan M-PESA Phone Number
// -----------------------------------------------------------------------------

const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, 'M-PESA phone number is required.')
  .refine(
    (value) => {
      const normalized = value.replace(/[\s()-]/g, '');

      return /^(?:0[17]\d{8}|254[17]\d{8}|\+254[17]\d{8})$/.test(
        normalized,
      );
    },
    {
      message:
        'Enter a valid Kenyan mobile number, for example 0712345678 or +254712345678.',
    },
  );

// -----------------------------------------------------------------------------
// Create Payment Method Schema
// -----------------------------------------------------------------------------

export const createPaymentMethodSchema = z.object({
  // ---------------------------------------------------------------------------
  // Payment Method Type
  // ---------------------------------------------------------------------------

  type: paymentMethodTypeSchema,

  // ---------------------------------------------------------------------------
  // Provider
  // ---------------------------------------------------------------------------

  provider: paymentProviderSchema,

  // ---------------------------------------------------------------------------
  // M-PESA Phone Number
  // ---------------------------------------------------------------------------

  /**
   * Member's M-PESA phone number.
   *
   * Accepted formats:
   * - 0712345678
   * - 0112345678
   * - 254712345678
   * - +254712345678
   *
   * The backend FinancialPaymentMethodPhoneNumber value object is responsible
   * for normalization into international format.
   */
  phoneNumber: phoneNumberSchema,

  // ---------------------------------------------------------------------------
  // Correlation
  // ---------------------------------------------------------------------------

  correlationId: z
    .string()
    .trim()
    .min(1, 'Correlation ID is required.')
    .max(255, 'Correlation ID is too long.'),

  // ---------------------------------------------------------------------------
  // Optional Provider Reference
  // -----------------------------------------------------------------------------

  /**
   * Provider-issued reference, when applicable.
   *
   * This is not the member's phone number.
   */
  providerReference: z
    .string()
    .trim()
    .max(255, 'Payment method reference is too long.')
    .optional(),

  // ---------------------------------------------------------------------------
  // Optional Display Name
  // ---------------------------------------------------------------------------

  displayName: z
    .string()
    .trim()
    .max(100, 'Display name is too long.')
    .optional(),

  // ---------------------------------------------------------------------------
  // Optional Last Four
  // ---------------------------------------------------------------------------

  lastFour: z
    .string()
    .trim()
    .max(4, 'Last four must contain at most 4 characters.')
    .optional(),

  // ---------------------------------------------------------------------------
  // Default
  // ---------------------------------------------------------------------------

  isDefault: z.boolean().default(false),

  // ---------------------------------------------------------------------------
  // Optional Causation
  // ---------------------------------------------------------------------------

  causationId: z
    .string()
    .trim()
    .max(255, 'Causation ID is too long.')
    .optional(),
});

// -----------------------------------------------------------------------------
// Form / Request Values
// -----------------------------------------------------------------------------

export type CreatePaymentMethodFormValues = z.infer<
  typeof createPaymentMethodSchema
>;