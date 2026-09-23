// =============================================================================
// sisiMove — Financial Payment Method Model
// =============================================================================
//
// Member-facing representation of a FinancialPaymentMethod.
//
// This model intentionally represents the API/read-model boundary rather than
// the Prisma persistence model.
//
// Backend persistence model:
//
//     FinancialPaymentMethod
//     ├── id
//     ├── publicId
//     ├── accountId
//     ├── type
//     ├── provider
//     ├── providerReference
//     ├── displayName
//     ├── lastFour
//     ├── isDefault
//     ├── isActive
//     ├── createdAt
//     └── updatedAt
//
// Frontend rules:
// - `publicId` is the only payment-method identifier exposed to the UI.
// - Database `id` is never represented.
// - `accountId` is never represented.
// - Provider references may be returned only when safe for the member-facing
//   API.
// - Sensitive payment credentials must never be represented here.
// - Money is not represented by this model, so no amount conversion is
//   required.
//
// =============================================================================

import type { PaymentMethodType } from './payment-method-type';

/**
 * Member-facing FinancialPaymentMethod.
 *
 * This is intentionally a plain TypeScript interface. Business rules remain
 * in the backend and API orchestration layer.
 */
export interface FinancialPaymentMethod {
  /**
   * Stable public identifier of the payment method.
   */
  publicId: string;

  /**
   * Category of the payment method.
   */
  type: PaymentMethodType;

  /**
   * External payment provider.
   *
   * Example values may include provider-specific identifiers such as
   * `MPESA`, depending on the backend contract.
   */
  provider: string;

  /**
   * Provider-side reference when the backend considers it safe to expose.
   *
   * This should never contain raw credentials, secrets, PINs, tokens, or
   * other sensitive payment information.
   */
  providerReference?: string;

  /**
   * Human-readable display name supplied by the provider or member.
   */
  displayName?: string;

  /**
   * Last four visible digits/characters where applicable.
   *
   * This is intended for safe UI identification of a payment method.
   */
  lastFour?: string;

  /**
   * Whether this payment method is currently the member's default method.
   */
  isDefault: boolean;

  /**
   * Whether this payment method is currently active and usable.
   */
  isActive: boolean;

  /**
   * Creation timestamp returned by the API.
   */
  createdAt: string;

  /**
   * Last modification timestamp returned by the API.
   */
  updatedAt: string;
}