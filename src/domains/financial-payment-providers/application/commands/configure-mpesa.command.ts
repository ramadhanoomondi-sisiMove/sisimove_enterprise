import type { Command } from '../../../../foundation/kernel/application/command';
import type { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';
import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects/financial-payment-provider-public-id.vo';

// =============================================================================
// M-PESA Top-up Configuration
// =============================================================================

export type MpesaC2BBusinessType = 'PAYBILL' | 'BUY_GOODS';

export interface MpesaC2BConfiguration {
  readonly shortcode: string;
  readonly businessType: MpesaC2BBusinessType;
}

// =============================================================================
// M-PESA Available-Funds Withdrawal Configuration
// =============================================================================

export interface MpesaB2CConfiguration {
  /** Safaricom Party A shortcode used to initiate customer withdrawals. */
  readonly shortcode: string;
  readonly initiatorName: string;
  /** Encrypted Safaricom B2C security credential, not the STK passkey. */
  readonly securityCredential: string;
}

// =============================================================================
// Configure M-PESA Command
// =============================================================================
//
// SisiMove supports exactly two M-PESA purposes:
//
// 1. TOP-UP — customer pays SisiMove through STK Push or C2B.
// 2. WITHDRAWAL — SisiMove pays a customer's available funds through B2C.
//
// The M-PESA integration reports provider events. FinancialModule owns payment
// authorization, wallet/ledger changes, withdrawal authorization, completion,
// failure handling and reconciliation.
//
// Shared Daraja authentication:
// - Consumer Key
// - Consumer Secret
//
// STK Push top-up:
// - Business Shortcode
// - STK Passkey
//
// C2B top-up (optional):
// - C2B Business Shortcode
// - Business Type: PAYBILL or BUY_GOODS
//
// B2C available-funds withdrawal (optional):
// - Party A Shortcode
// - Initiator Name
// - B2C Security Credential
//
// Security and configuration rules:
// - STK Push remains independently configurable and must not depend on B2C.
// - C2B and B2C settings are optional during staged configuration.
// - C2B and B2C shortcodes may differ from the STK shortcode.
// - The STK Passkey must never be used as the B2C Security Credential.
// - Plaintext credentials must be encrypted before persistence.
// - Callback URLs are managed through application configuration.
// - No provider callback in this module directly credits or debits a wallet.
//
// =============================================================================

export class ConfigureMpesaCommand implements Command {
  public constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,
    public readonly environment: FinancialPaymentProviderEnvironment,

    // Shared Daraja authentication.
    public readonly consumerKey: string,
    public readonly consumerSecret: string,

    // STK Push top-up configuration.
    public readonly shortcode: string,
    public readonly passkey: string,

    // Audit metadata.
    public readonly createdAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,

    // Optional C2B top-up configuration.
    public readonly c2b?: MpesaC2BConfiguration,

    // Optional B2C available-funds withdrawal configuration.
    public readonly b2c?: MpesaB2CConfiguration,
  ) {}
}

export default ConfigureMpesaCommand;
