import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialPaymentProviderEnvironment } from '../../domain/value-objects/financial-payment-provider-environment.vo';

import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects/financial-payment-provider-public-id.vo';

// =============================================================================
// Configure M-PESA Command
// =============================================================================
//
// Configures the shared Safaricom Daraja integration.
//
// Supported capabilities:
//
// - STK Push: customer payments into SisiMove.
// - C2B: customer payments into SisiMove.
// - B2C Disbursement: payments from SisiMove to customer phone numbers.
//
// Shared credentials:
// - Consumer Key
// - Consumer Secret
//
// STK Push / C2B:
// - Business Shortcode
// - Passkey (STK Push)
//
// B2C credentials:
// - B2C Party A Shortcode
// - Initiator Name
// - Security Credential
//
// Important:
// - shortcode and b2cShortcode are deliberately separate.
// - Existing STK Push/C2B configuration remains unchanged.
// - Callback URLs are derived from application configuration.
// - Plaintext credentials are encrypted before persistence.
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
    // STK Push / C2B
    // -------------------------------------------------------------------------

    public readonly shortcode: string,
    public readonly passkey: string,

    // -------------------------------------------------------------------------
    // B2C Disbursement
    // -------------------------------------------------------------------------

    public readonly b2cShortcode: string,
    public readonly initiatorName: string,
    public readonly securityCredential: string,

    // -------------------------------------------------------------------------
    // Audit Metadata
    // -------------------------------------------------------------------------

    public readonly createdAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}

export default ConfigureMpesaCommand;
