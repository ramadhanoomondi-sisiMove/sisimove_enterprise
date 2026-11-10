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
// - B2C Disbursement: payments from SisiMove to customer phone numbers.
//
// Shared credentials:
// - Consumer Key
// - Consumer Secret
// - Business Shortcode
//
// STK Push credentials:
// - Passkey
//
// B2C credentials:
// - Initiator Name
// - Security Credential
//
// Callback URLs are derived from the application's public API base URL.
// Plaintext credentials are encrypted by the configuration service before
// persistence.
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
    public readonly shortcode: string,

    // -------------------------------------------------------------------------
    // STK Push
    // -------------------------------------------------------------------------

    public readonly passkey: string,

    // -------------------------------------------------------------------------
    // B2C Disbursement
    // -------------------------------------------------------------------------

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
