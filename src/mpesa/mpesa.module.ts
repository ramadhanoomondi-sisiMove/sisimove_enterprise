/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Integration Module
 * -----------------------------------------------------------------------------
 *
 * Reusable M-PESA Daraja integration module.
 *
 * Responsibilities:
 * - OAuth authentication;
 * - shared HTTP transport;
 * - STK Push integration and status querying;
 * - C2B integration;
 * - B2C integration;
 * - provider callback validation and normalization;
 * - M-PESA connection testing.
 *
 * Architecture:
 * - FinancialPaymentProvidersModule supplies provider configuration and
 *   repository dependencies.
 * - HttpModule supplies NestJS HttpService for shared HTTP transport.
 * - M-PESA services communicate with Safaricom Daraja.
 * - Callback handlers validate and normalize provider callback payloads.
 * - FinancialModule registers the HTTP controllers and owns payment and
 *   disbursement lifecycle transitions, reconciliation, ledger entries
 *   and account balances.
 *
 * This module does not own financial business rules or financial state.
 *
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

// -----------------------------------------------------------------------------
// Financial Payment Provider Dependencies
// -----------------------------------------------------------------------------

import { FinancialPaymentProvidersModule } from '../domains/financial-payment-providers/financial-payment-providers.module';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import { TestMpesaConnectionHandler } from '../domains/financial-payment-providers/application/command-handlers/test-mpesa-connection.handler';

// -----------------------------------------------------------------------------
// Shared M-PESA Infrastructure
// -----------------------------------------------------------------------------

import { MpesaHttpService } from './common/mpesa-http.service';

// -----------------------------------------------------------------------------
// OAuth Authentication
// -----------------------------------------------------------------------------

import { MpesaOAuthService } from './auth/mpesa-oauth.service';

// -----------------------------------------------------------------------------
// STK Push
// -----------------------------------------------------------------------------

import { StkPushService } from './stk-push/stk-push.service';
import { MpesaStkQueryService } from './stk-push/mpesa-stk-query.service';
import { StkPushCallbackHandler } from './stk-push/stk-push-callback.handler';

// -----------------------------------------------------------------------------
// C2B
// -----------------------------------------------------------------------------

import { C2BService } from './c2b/c2b.service';
import { C2BCallbackHandler } from './c2b/c2b-callback.handler';

// -----------------------------------------------------------------------------
// B2C
// -----------------------------------------------------------------------------

import { B2CService } from './b2c/b2c.service';
import { B2CCallbackHandler } from './b2c/b2c-callback.handler';

// =============================================================================
// Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [HttpModule, FinancialPaymentProvidersModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================
  //
  // M-PESA HTTP controllers are registered by FinancialModule.
  // This module provides their integration dependencies only.
  //

  controllers: [],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Shared Infrastructure
    // =========================================================================

    MpesaHttpService,

    // =========================================================================
    // OAuth Authentication
    // =========================================================================

    MpesaOAuthService,

    // =========================================================================
    // STK Push
    // =========================================================================

    StkPushService,
    MpesaStkQueryService,
    StkPushCallbackHandler,

    // =========================================================================
    // C2B
    // =========================================================================

    C2BService,
    C2BCallbackHandler,

    // =========================================================================
    // B2C
    // =========================================================================

    B2CService,
    B2CCallbackHandler,

    // =========================================================================
    // M-PESA Connection Testing
    // =========================================================================

    {
      provide:
        FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS
          .TEST_MPESA_CONNECTION,
      useClass: TestMpesaConnectionHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    // -------------------------------------------------------------------------
    // Shared Infrastructure
    // -------------------------------------------------------------------------

    MpesaHttpService,

    // -------------------------------------------------------------------------
    // OAuth Authentication
    // -------------------------------------------------------------------------

    MpesaOAuthService,

    // -------------------------------------------------------------------------
    // STK Push
    // -------------------------------------------------------------------------

    StkPushService,
    MpesaStkQueryService,
    StkPushCallbackHandler,

    // -------------------------------------------------------------------------
    // C2B
    // -------------------------------------------------------------------------

    C2BService,
    C2BCallbackHandler,

    // -------------------------------------------------------------------------
    // B2C
    // -------------------------------------------------------------------------

    B2CService,
    B2CCallbackHandler,

    // -------------------------------------------------------------------------
    // Connection Testing
    // -------------------------------------------------------------------------

    FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.TEST_MPESA_CONNECTION,
  ],
})
export class MpesaModule {}

// =============================================================================
// Default Export
// =============================================================================

export default MpesaModule;
