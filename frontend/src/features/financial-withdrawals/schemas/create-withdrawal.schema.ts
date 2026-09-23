// =============================================================================
// sisiMove — Create Withdrawal Schema
// =============================================================================
//
// Frontend UX validation schema for creating a financial withdrawal.
//
// IMPORTANT:
//
// This schema exists only to provide immediate, user-friendly form
// validation. It is NOT the security or business-rule boundary.
//
// The backend remains authoritative for:
// - authorization;
// - account ownership;
// - balance availability;
// - withdrawal limits;
// - currency support;
// - destination validation;
// - destination security;
// - domain invariants;
// - lifecycle transitions.
//
// Monetary amounts are transported as integer minor-unit strings to avoid
// JavaScript floating-point precision problems.
//
// =============================================================================

import { z } from 'zod';

export const createWithdrawalSchema = z.object({
  /**
   * Integer minor-unit amount.
   *
   * Example:
   *     "125000" => KES 1,250.00
   */
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required.')
    .regex(/^\d+$/, 'Amount must be a whole-number minor-unit amount.')
    .refine((value) => /[1-9]/.test(value), {
      message: 'Amount must be greater than zero.',
    }),

  /**
   * ISO currency code.
   */
  currency: z
    .string()
    .trim()
    .length(3, 'Currency must contain 3 characters.')
    .regex(/^[A-Z]{3}$/, 'Currency must be an uppercase ISO currency code.'),

  /**
   * External withdrawal destination category.
   */
  destinationType: z.enum([
    'MOBILE_MONEY',
    'BANK_ACCOUNT',
    'OTHER',
  ]),

  /**
   * Destination value supplied for the withdrawal snapshot.
   *
   * The backend remains responsible for validating its actual format.
   */
  destinationValue: z
    .string()
    .trim()
    .min(1, 'Destination is required.'),

  /**
   * Request correlation identifier.
   */
  correlationId: z
    .string()
    .trim()
    .min(1, 'Correlation ID is required.'),

  /**
   * Optional initiating domain reference type.
   */
  referenceType: z
    .string()
    .trim()
    .min(1)
    .optional(),

  /**
   * Optional initiating domain reference public identifier.
   */
  referencePublicId: z
    .string()
    .trim()
    .min(1)
    .optional(),

  /**
   * Optional causation identifier.
   */
  causationId: z
    .string()
    .trim()
    .min(1)
    .optional(),
});

export type CreateWithdrawalSchemaInput = z.infer<
  typeof createWithdrawalSchema
>;

