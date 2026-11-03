// =============================================================================
// sisiMove — Financial Payment Provider Model
// =============================================================================
//
// Member-facing representation of an available FinancialPaymentProvider.
//
// This model represents the provider registry API response.
//
// Frontend rules:
// - Only public identifiers are exposed.
// - Provider codes are business identifiers, not database IDs.
// - Provider configuration and credentials are never exposed.
// - Provider operational rules remain in the backend.
//
// =============================================================================

import type { FinancialPaymentProviderType } from './financial-payment-provider-type';

/**
 * Member-facing FinancialPaymentProvider.
 *
 * Represents a registered provider available for payment-method selection.
 */
export interface FinancialPaymentProvider {
  /**
   * Public identifier of the provider.
   */
  publicId: string;

  /**
   * Stable business code of the provider.
   *
   * Example: MPESA.
   */
  code: string;

  /**
   * Human-readable provider name.
   *
   * Example: M-PESA.
   */
  name: string;

  /**
   * Registered provider category.
   */
  type: FinancialPaymentProviderType;
}