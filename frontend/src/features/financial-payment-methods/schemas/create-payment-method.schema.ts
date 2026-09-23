// =============================================================================
// sisiMove — Create Financial Payment Method Schema
// =============================================================================
//
// Validation boundary for creating a FinancialPaymentMethod.
//
// Backend command flow:
//
//     Create Payment Method Request
//              │
//              ▼
//     AddFinancialPaymentMethodDto
//              │
//              ▼
//     AddFinancialPaymentMethodCommand
//
// The frontend supplies the Financial Account public identifier separately
// through the API operation. It is therefore intentionally NOT part of this
// form/request schema.
//
// Backend transport contract:
//
//     accountId          required
//     type               required
//     provider           required
//     correlationId      required
//     providerReference  optional
//     displayName        optional
//     lastFour           optional
//     isDefault          optional
//     causationId        optional
//
// Frontend API mapping will translate:
//
//     accountPublicId -> accountId
//
// This schema does NOT:
// - call the backend;
// - determine account ownership;
// - perform authorization;
// - persist payment methods;
// - execute payment-provider operations;
// - handle raw payment credentials.
//
// Backend authorization, ownership, domain validation, and provider rules
// remain server-side.
//
// =============================================================================

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Payment Method Type
// -----------------------------------------------------------------------------

const paymentMethodTypeSchema = z.enum([
  'MOBILE_MONEY',
  'BANK',
  'CARD',
  'WALLET',
  'OTHER',
]);

// -----------------------------------------------------------------------------
// Create Payment Method Schema
// -----------------------------------------------------------------------------

/**
 * Validates the frontend create-payment-method request.
 *
 * The Financial Account public identifier is intentionally excluded because
 * the API function receives it as a separate argument and maps it to the
 * backend DTO's `accountId` field.
 */
export const createPaymentMethodSchema = z.object({
  // ---------------------------------------------------------------------------
  // Payment Method Type
  // ---------------------------------------------------------------------------

  /**
   * Category of the payment method.
   */
  type: paymentMethodTypeSchema,

  // ---------------------------------------------------------------------------
  // Provider
  // ---------------------------------------------------------------------------

  /**
   * External payment provider identifier.
   */
  provider: z
    .string()
    .trim()
    .min(1, 'Payment provider is required.')
    .max(100, 'Payment provider is too long.'),

  // ---------------------------------------------------------------------------
  // Correlation
  // ---------------------------------------------------------------------------

  /**
   * Correlation identifier for tracing this application operation.
   *
   * This is generated/supplied by the application layer rather than being a
   * payment credential.
   */
  correlationId: z
    .string()
    .trim()
    .min(1, 'Correlation ID is required.')
    .max(255, 'Correlation ID is too long.'),

  // ---------------------------------------------------------------------------
  // Provider Reference
  // ---------------------------------------------------------------------------

  /**
   * Optional provider-side reference for the payment method.
   *
   * The backend controller explicitly allows this field to be undefined.
   *
   * Examples may include a provider-recognized mobile-money number or a
   * provider-side account/reference identifier.
   *
   * This must never contain a PIN, password, CVV, secret token, or other
   * authentication credential.
   */
  providerReference: z
    .string()
    .trim()
    .max(255, 'Payment method reference is too long.')
    .optional(),

  // ---------------------------------------------------------------------------
  // Display Name
  // ---------------------------------------------------------------------------

  /**
   * Optional member-facing name for identifying the payment method.
   */
  displayName: z
    .string()
    .trim()
    .max(100, 'Display name is too long.')
    .optional(),

  // ---------------------------------------------------------------------------
  // Last Four
  // ---------------------------------------------------------------------------

  /**
   * Optional safe display metadata.
   *
   * This should contain only the last four characters/digits intended for
   * member-facing identification.
   */
  lastFour: z
    .string()
    .trim()
    .max(4, 'Last four must contain at most 4 characters.')
    .optional(),

  // ---------------------------------------------------------------------------
  // Default
  // ---------------------------------------------------------------------------

  /**
   * Whether the newly created payment method should become the default.
   *
   * The backend remains authoritative for the final default state.
   */
  isDefault: z.boolean().default(false),

  // ---------------------------------------------------------------------------
  // Causation
  // ---------------------------------------------------------------------------

  /**
   * Optional causation identifier used for tracing the operation that caused
   * this command.
   */
  causationId: z
    .string()
    .trim()
    .max(255, 'Causation ID is too long.')
    .optional(),
});

// -----------------------------------------------------------------------------
// Form / Request Values
// -----------------------------------------------------------------------------

/**
 * Type inferred directly from the validation schema.
 *
 * Components, forms, and the create-payment-method API operation can use this
 * type instead of duplicating the request shape.
 */
export type CreatePaymentMethodFormValues = z.infer<
  typeof createPaymentMethodSchema
>;

