// -----------------------------------------------------------------------------
// Financial Payment Providers — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Financial Payment Providers bounded context.
//
// Registered capabilities:
//
// - Financial Payment Provider
// - Financial Payment Provider Capability
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository providers;
// - application command handlers;
// - application query handlers;
// - dependency-injection tokens.
//
// Domain behavior remains inside aggregate roots.
// Application handlers coordinate workflows.
// Persistence remains behind domain repository contracts.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure — Database
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation — Controllers
// -----------------------------------------------------------------------------

import { FinancialPaymentProvidersController } from './presentation/rest/controllers/financial-payment-providers.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_PROVIDER_PROVIDERS } from './infrastructure/dependency-injection';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from './application/financial-payment-providers.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  ChangeFinancialPaymentProviderStatusHandler,
  CreateFinancialPaymentProviderHandler,
  DisableFinancialPaymentProviderCapabilityHandler,
  DisableFinancialPaymentProviderHandler,
  EnableFinancialPaymentProviderCapabilityHandler,
  EnableFinancialPaymentProviderHandler,
  UpdateFinancialPaymentProviderHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetFinancialPaymentProviderByCodeHandler,
  GetFinancialPaymentProviderHandler,
  GetFinancialPaymentProvidersHandler,
} from './application/query-handlers';

// =============================================================================
// Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [PrismaModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [FinancialPaymentProvidersController],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Infrastructure — Repository Providers
    // =========================================================================

    ...FINANCIAL_PAYMENT_PROVIDER_PROVIDERS,

    // =========================================================================
    // Financial Payment Provider — Command Handlers
    // =========================================================================

    {
      provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateFinancialPaymentProviderHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.UPDATE,
      useClass: UpdateFinancialPaymentProviderHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.ENABLE,
      useClass: EnableFinancialPaymentProviderHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.DISABLE,
      useClass: DisableFinancialPaymentProviderHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.CHANGE_STATUS,
      useClass: ChangeFinancialPaymentProviderStatusHandler,
    },

    {
      provide:
        FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.ENABLE_CAPABILITY,
      useClass: EnableFinancialPaymentProviderCapabilityHandler,
    },

    {
      provide:
        FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.DISABLE_CAPABILITY,
      useClass: DisableFinancialPaymentProviderCapabilityHandler,
    },

    // =========================================================================
    // Financial Payment Provider — Query Handlers
    // =========================================================================

    {
      provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetFinancialPaymentProviderHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.QUERY_HANDLERS.GET_ALL,
      useClass: GetFinancialPaymentProvidersHandler,
    },

    {
      provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.QUERY_HANDLERS.GET_BY_CODE,
      useClass: GetFinancialPaymentProviderByCodeHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    // -------------------------------------------------------------------------
    // Financial Payment Provider Repository
    // -------------------------------------------------------------------------

    FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY,
  ],
})
export class FinancialPaymentProvidersModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialPaymentProvidersModule;
