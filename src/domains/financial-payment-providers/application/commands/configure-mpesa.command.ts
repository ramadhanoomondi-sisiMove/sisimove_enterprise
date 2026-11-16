import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects/financial-payment-provider-public-id.vo';

// =============================================================================
// M-PESA C2B Configuration
// =============================================================================

export type MpesaC2BBusinessType = 'PAYBILL' | 'BUY_GOODS';

export interface MpesaC2BConfiguration {
  readonly shortcode: string;
  readonly businessType: MpesaC2BBusinessType;
}

// =============================================================================
// M-PESA B2C Configuration
// =============================================================================

export interface MpesaB2CConfiguration {
  readonly shortcode: string;
  readonly initiatorName: string;
  readonly securityCredential: string;
}

// =============================================================================
// Configure M-PESA Command
// =============================================================================
//
// Configures the shared Safaricom Daraja integration.
//
// Supported capabilities:
//
// - STK Push: customer payments into SisiMove.
// - C2B: customer payments into SisiMove through PayBill or Buy Goods.
// - B2C Disbursement: payments from SisiMove to beneficiaries.
//
// Shared Daraja authentication:
// - Consumer Key
// - Consumer Secret
//
// STK Push configuration:
// - Business Shortcode
// - Passkey
//
// C2B configuration (optional):
// - C2B Business Shortcode
// - Business Type: PAYBILL or BUY_GOODS
// - Confirmation and Validation URLs (where applicable)
//
// B2C configuration (optional):
// - B2C Party A Shortcode
// - Initiator Name
// - Security Credential
//
// Important:
// - C2B and B2C configurations are optional.
// - STK Push must work independently of C2B and B2C.
// - Existing STK shortcode and passkey remain unchanged.
// - C2B shortcode is independently configurable.
// - B2C shortcode is deliberately separate from the STK shortcode.
// - C2B business type must be explicitly configured.
// - B2C credentials are validated only when B2C is configured.
// - Plaintext credentials must be encrypted before persistence.
// - Callback URLs are derived from application configuration.
//
// =============================================================================

export class ConfigureMpesaCommand implements Command {
  public constructor(
    public readonly providerPublicId: FinancialPaymentProviderPublicId,

    public readonly environment: FinancialPaymentProviderEnvironment,

    // -------------------------------------------------------------------------
    // Shared Daraja Authentication
    // -------------------------------------------------------------------------

    public readonly consumerKey: string,
    public readonly consumerSecret: string,

    // -------------------------------------------------------------------------
    // STK Push Configuration
    // -------------------------------------------------------------------------

    public readonly shortcode: string,
    public readonly passkey: string,

    // -------------------------------------------------------------------------
    // Audit Metadata
    // -------------------------------------------------------------------------

    public readonly createdAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Optional C2B Customer Payment Configuration
    // -------------------------------------------------------------------------

    public readonly c2b?: MpesaC2BConfiguration,

    // -------------------------------------------------------------------------
    // Optional B2C Disbursement Configuration
    // -------------------------------------------------------------------------

    public readonly b2c?: MpesaB2CConfiguration,
  ) {}
}

export default ConfigureMpesaCommand;
