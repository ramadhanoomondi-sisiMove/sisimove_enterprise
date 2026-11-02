// -----------------------------------------------------------------------------
// Financial Payment Provider — Dependency Injection Providers
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../application/financial-payment-providers.tokens';

import { FinancialPaymentProviderConfigurationService } from '../../application/services/financial-payment-provider-configuration.service';

import { PrismaFinancialPaymentProviderRepository } from '../persistence/prisma/repositories/prisma-financial-payment-provider.repository';

import { PrismaFinancialPaymentProviderConfigurationRepository } from '../persistence/prisma/repositories/prisma-financial-payment-provider-configuration.repository';

import type { EncryptionService } from '../../../../foundation/security';

import { SECURITY_ENCRYPTION } from '../../../../infrastructure/security/security.tokens';

import { MpesaOAuthService } from '../mpesa/authentication/mpesa-oauth.service';

// =============================================================================
// Providers
// =============================================================================

export const FINANCIAL_PAYMENT_PROVIDER_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Provider Aggregate Repository
  // ===========================================================================

  {
    provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY,
    useClass: PrismaFinancialPaymentProviderRepository,
  },

  // ===========================================================================
  // Secure Configuration Repository
  // ===========================================================================

  {
    provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.CONFIGURATION_PORT,
    useClass: PrismaFinancialPaymentProviderConfigurationRepository,
  },

  // ===========================================================================
  // Encryption Service Bridge
  // ===========================================================================

  {
    provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.ENCRYPTION_SERVICE,
    useFactory: (encryptionService: EncryptionService): EncryptionService =>
      encryptionService,
    inject: [SECURITY_ENCRYPTION],
  },

  // ===========================================================================
  // Configuration Application Service
  // ===========================================================================

  {
    provide: FinancialPaymentProviderConfigurationService,
    useClass: FinancialPaymentProviderConfigurationService,
  },

  // ===========================================================================
  // M-PESA OAuth Authentication Service
  // ===========================================================================

  MpesaOAuthService,
];
