import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects/financial-payment-provider-public-id.vo';

// =============================================================================
// M-PESA Top-up Configuration
// =============================================================================

export type MpesaC2BBusinessType = 'PAYBILL' | 'BUY_GOODS';

export interface MpesaC2BConfiguration {
  /** Safaricom C2B business shortcode. */
  readonly shortcode: string;

  /** C2B business type registered with Safaricom. */
  readonly businessType: MpesaC2BBusinessType;
}

// =============================================================================
// M-PESA Available-Funds Withdrawal Configuration
// =============================================================================

export interface MpesaB2CConfiguration {
  /**
   * Safaricom Party A shortcode used to initiate customer withdrawals.
   *
   * This is configured independently from the STK Push and C2B shortcodes.
   */
  readonly shortcode: string;

  /**
   * B2C initiator username registered with Safaricom.
   *
   * This is not the initiator password.
   */
  readonly initiatorName: string;

  /**
   * RSA-encrypted B2C initiator credential generated using the
   * appropriate Safaricom Sandbox or Production certificate.
   *
   * IMPORTANT:
   * - This value is already RSA-encrypted before entering SisiMove.
   * - It is not the ordinary plaintext initiator password.
   * - It is not the STK Push Passkey.
   * - It must not be RSA-encrypted again by the backend.
   * - It must be stored under b2cSecurityCredential.
   *
   * The configuration service applies separate application-level
   * encryption when protecting the complete configuration payload
   * at rest.
   *
   * The M-PESA B2C integration must send the decrypted configuration
   * value directly as Daraja's SecurityCredential request field.
   */
  readonly securityCredential: string;
}

// =============================================================================
// Configure M-PESA Command
// =============================================================================
//
// SisiMove supports exactly two M-PESA purposes:
//
// 1. TOP-UP
//    Customer pays SisiMove through STK Push or C2B.
//
// 2. WITHDRAWAL
//    SisiMove pays a customer's available funds through B2C.
//
// Architectural responsibilities:
//
// M-PESA integration:
// - Provider authentication.
// - Provider request submission.
// - Provider callback handling.
// - Normalization and reporting of external payment events.
//
// FinancialModule:
// - Payment authorization and processing.
// - Withdrawal authorization and processing.
// - Customer account balance changes.
// - Ledger posting.
// - Payment and withdrawal lifecycle management.
// - Failure handling and reconciliation.
//
// =============================================================================
// SHARED DARAJA AUTHENTICATION
// =============================================================================
//
// - Consumer Key
// - Consumer Secret
//
// =============================================================================
// STK PUSH TOP-UP
// =============================================================================
//
// - STK Business Shortcode
// - STK Passkey
//
// =============================================================================
// C2B TOP-UP (OPTIONAL)
// =============================================================================
//
// - C2B Business Shortcode
// - Business Type: PAYBILL or BUY_GOODS
//
// =============================================================================
// B2C AVAILABLE-FUNDS WITHDRAWAL (OPTIONAL)
// =============================================================================
//
// - Party A Shortcode
// - Initiator Name
// - RSA-encrypted B2C Security Credential
//
// =============================================================================
// SECURITY AND CONFIGURATION RULES
// =============================================================================
//
// 1. STK Push remains independently configurable and must not depend
//    on B2C configuration.
//
// 2. C2B and B2C settings are optional during staged configuration.
//
// 3. C2B and B2C shortcodes may differ from the STK Push shortcode.
//
// 4. The STK Passkey must never be used as the B2C SecurityCredential.
//
// 5. The B2C SecurityCredential supplied by the administrator is
//    already RSA-encrypted using the appropriate Safaricom certificate.
//
// 6. The backend must preserve that RSA-encrypted value unchanged
//    when mapping it to b2cSecurityCredential.
//
// 7. The backend must never interpret securityCredential as a
//    plaintext initiator password.
//
// 8. The backend must not RSA-encrypt the B2C SecurityCredential again.
//
// 9. The configuration service applies application-level encryption
//    to the complete configuration payload before persistence.
//
// 10. Sandbox and Production configurations must remain isolated.
//
// 11. Callback URLs are managed through application configuration.
//
// 12. No provider callback in this module directly credits or debits
//     a customer wallet.
//
// 13. Configuration changes must respect the provider lifecycle
//     and authorization rules.
//
// =============================================================================

export class ConfigureMpesaCommand implements Command {
  public constructor(
    // -------------------------------------------------------------------------
    // Provider identity and environment
    // -------------------------------------------------------------------------

    public readonly providerPublicId: FinancialPaymentProviderPublicId,

    public readonly environment: FinancialPaymentProviderEnvironment,

    // -------------------------------------------------------------------------
    // Shared Daraja authentication
    // -------------------------------------------------------------------------

    public readonly consumerKey: string,

    public readonly consumerSecret: string,

    // -------------------------------------------------------------------------
    // STK Push top-up configuration
    // -------------------------------------------------------------------------

    public readonly shortcode: string,

    public readonly passkey: string,

    // -------------------------------------------------------------------------
    // Audit metadata
    // -------------------------------------------------------------------------

    public readonly createdAt: Date,

    public readonly correlationId: string,

    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Optional C2B top-up configuration
    // -------------------------------------------------------------------------

    public readonly c2b?: MpesaC2BConfiguration,

    // -------------------------------------------------------------------------
    // Optional B2C available-funds withdrawal configuration
    // -------------------------------------------------------------------------

    public readonly b2c?: MpesaB2CConfiguration,
  ) {}
}

export default ConfigureMpesaCommand;
