// =============================================================================
// sisiMove — Financial Payment Method Model
// =============================================================================
//
// Member-facing representation of a FinancialPaymentMethod.
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
//     ├── phoneNumber
//     ├── displayName
//     ├── lastFour
//     ├── isDefault
//     ├── isActive
//     ├── createdAt
//     └── updatedAt
//
// Current member-facing support:
// - M-PESA mobile money payment methods.
// - Multiple registered M-PESA numbers.
// - One default active payment method at a time.
//
// Frontend rules:
// - publicId is the only payment-method identifier exposed to the UI.
// - Database id is never represented.
// - accountId is never represented.
// - M-PESA phone numbers use normalized international format.
// - Provider references are optional and exposed only when safe.
// - Sensitive payment credentials must never be represented.
//
// =============================================================================

import type { PaymentMethodType } from './payment-method-type';
import type { FinancialPaymentProviderType } from './financial-payment-provider-type';

/**
 * Supported member-facing payment provider.
 */
export type FinancialPaymentProvider = 'MPESA';

/**
 * Member-facing FinancialPaymentMethod.
 *
 * Business rules and lifecycle transitions remain in the backend.
 */
export interface FinancialPaymentMethod {
  /**
   * Stable public identifier of the payment method.
   */
  publicId: string;

  /**
   * Category of the payment method.
   *
   * For M-PESA, this is MOBILE_MONEY.
   */
  type: PaymentMethodType & FinancialPaymentProviderType;

  /**
   * External payment provider.
   *
   * Current member-facing provider: MPESA.
   */
  provider: FinancialPaymentProvider;

  /**
   * Customer's registered M-PESA phone number.
   *
   * Returned in normalized international format.
   *
   * Example: +254712345678
   */
  phoneNumber: string;

  /**
   * Provider-side reference when safe for member-facing exposure.
   */
  providerReference?: string;

  /**
   * Human-readable display name, if supplied.
   */
  displayName?: string;

  /**
   * Last four visible digits/characters where applicable.
   */
  lastFour?: string;

  /**
   * Whether this payment method is the member's default method.
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