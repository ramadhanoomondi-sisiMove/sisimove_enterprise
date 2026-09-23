// -----------------------------------------------------------------------------
// sisiMove — Register User Validation Schema
// -----------------------------------------------------------------------------
//
// Validation boundary for the registration form.
//
// Important distinction:
//
// 1. RegisterUserFormValues
//    Mutable UI state. `termsAccepted` is boolean because the checkbox can
//    legitimately be false while the user is filling out the form.
//
// 2. RegisterUserValidatedValues
//    Output of the schema. `termsAccepted` is guaranteed to be `true` because
//    registration is only valid after the user accepts the terms.
//
// Phone number:
//
// - Users must enter the phone number in international format.
// - The value MUST begin with `+`.
// - The frontend does NOT silently convert local numbers.
// - Example:
//       +254 700 000 000
//
// The API request is deliberately NOT defined by this schema.
// The registration API model remains the authoritative HTTP contract.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

export const registerUserSchema = z
  .object({
    travellerName: z
      .string()
      .trim()
      .min(2, 'Enter your name.')
      .max(100, 'Your name is too long.'),

    countryCode: z
      .string()
      .trim()
      .length(2, 'Select a valid country.')
      .transform((value) => value.toUpperCase()),

    email: z
      .string()
      .trim()
      .email('Enter a valid email address.'),

    phoneNumber: z
      .string()
      .trim()
      .min(1, 'Enter your phone number.')
      .max(20, 'Your phone number is too long.')
      .regex(
        /^\+[1-9][0-9\s()-]{6,18}[0-9]$/,
        'Use international format, starting with +. Example: +254 700 000 000',
      ),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(128, 'Password is too long.'),

    confirmPassword: z
      .string()
      .min(1, 'Confirm your password.'),

    termsAccepted: z.literal(true, {
      error: 'You must accept the Terms and Privacy Policy.',
    }),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      });
    }
  });

// -----------------------------------------------------------------------------
// Mutable registration form state
// -----------------------------------------------------------------------------
//
// Do NOT use z.infer<typeof registerUserSchema> for the form state.
//
// Because termsAccepted uses z.literal(true), the inferred output type has:
//     termsAccepted: true
//
// That is correct for validated data but incorrect for an interactive
// checkbox whose initial state is false.
// -----------------------------------------------------------------------------

export interface RegisterUserFormValues {
  readonly travellerName: string;
  readonly countryCode: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly termsAccepted: boolean;
}

// -----------------------------------------------------------------------------
// Validated schema output
// -----------------------------------------------------------------------------
//
// This is the type produced after successful schema validation.
// -----------------------------------------------------------------------------

export type RegisterUserValidatedValues = z.infer<
  typeof registerUserSchema
>;

