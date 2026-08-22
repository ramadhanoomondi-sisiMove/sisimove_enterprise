// -----------------------------------------------------------------------------
// Commercial — NestJS Module
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain Dependencies
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import { CommercialCommissionRuleController } from './presentation/rest/controllers/commercial-commission-rule.controller';

import { CommercialBookingCommissionController } from './presentation/rest/controllers/commercial-booking-commission.controller';

import { CommercialEarningCommissionController } from './presentation/rest/controllers/commercial-earning-commission.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import {
  COMMERCIAL_COMMISSION_RULE_PROVIDERS,
  COMMERCIAL_BOOKING_COMMISSION_PROVIDERS,
  COMMERCIAL_EARNING_COMMISSION_PROVIDERS,
} from './infrastructure/dependency-injection';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_COMMISSION_RULE_TOKENS } from './application/commercial-commission-rule.tokens';

import { COMMERCIAL_BOOKING_COMMISSION_TOKENS } from './application/commercial-booking-commission.tokens';

import { COMMERCIAL_EARNING_COMMISSION_TOKENS } from './application/commercial-earning-commission.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  // ---------------------------------------------------------------------------
  // Commercial Commission Rule
  // ---------------------------------------------------------------------------

  ActivateCommercialCommissionRuleHandler,
  CreateCommercialCommissionRuleHandler,
  DeactivateCommercialCommissionRuleHandler,
  UpdateCommercialCommissionRuleHandler,

  // ---------------------------------------------------------------------------
  // Commercial Booking Commission
  // ---------------------------------------------------------------------------
  AssessCommercialBookingCommissionHandler,
  CancelCommercialBookingCommissionHandler,
  CreateCommercialBookingCommissionHandler,

  // ---------------------------------------------------------------------------
  // Commercial Earning Commission
  // ---------------------------------------------------------------------------
  AssessCommercialEarningCommissionHandler,
  CancelCommercialEarningCommissionHandler,
  CreateCommercialEarningCommissionHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  // ---------------------------------------------------------------------------
  // Commercial Commission Rule
  // ---------------------------------------------------------------------------

  GetActiveCommercialCommissionRuleHandler,
  GetCommercialCommissionRuleByTypeHandler,
  GetCommercialCommissionRuleHandler,
  ListCommercialCommissionRulesHandler,

  // ---------------------------------------------------------------------------
  // Commercial Booking Commission
  // ---------------------------------------------------------------------------
  GetCommercialBookingCommissionByBookingHandler,
  GetCommercialBookingCommissionHandler,
  GetCommercialBookingCommissionsByJourneyHandler,
  ListCommercialBookingCommissionsHandler,

  // ---------------------------------------------------------------------------
  // Commercial Earning Commission
  // ---------------------------------------------------------------------------
  GetCommercialEarningCommissionBySettlementHandler,
  GetCommercialEarningCommissionHandler,
  GetCommercialEarningCommissionsByJourneyHandler,
  GetCommercialEarningCommissionsByProviderHandler,
  ListCommercialEarningCommissionsHandler,
} from './application/query-handlers';

// -----------------------------------------------------------------------------
// Module
// -----------------------------------------------------------------------------

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------
    //
    // Provides authentication and authorization infrastructure required by the
    // Commercial HTTP presentation boundaries.
    // -------------------------------------------------------------------------

    IdentityModule,

    // -------------------------------------------------------------------------
    // Prisma
    // -------------------------------------------------------------------------
    //
    // Provides the Prisma client required by Commercial persistence.
    // -------------------------------------------------------------------------

    PrismaModule,
  ],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [
    CommercialCommissionRuleController,
    CommercialBookingCommissionController,
    CommercialEarningCommissionController,
  ],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // -------------------------------------------------------------------------
    // Infrastructure — Repositories
    // -------------------------------------------------------------------------

    ...COMMERCIAL_COMMISSION_RULE_PROVIDERS,

    ...COMMERCIAL_BOOKING_COMMISSION_PROVIDERS,

    ...COMMERCIAL_EARNING_COMMISSION_PROVIDERS,

    // =========================================================================
    // Commercial Commission Rule Lifecycle
    // =========================================================================

    {
      provide: COMMERCIAL_COMMISSION_RULE_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateCommercialCommissionRuleHandler,
    },

    {
      provide: COMMERCIAL_COMMISSION_RULE_TOKENS.COMMAND_HANDLERS.UPDATE,
      useClass: UpdateCommercialCommissionRuleHandler,
    },

    {
      provide: COMMERCIAL_COMMISSION_RULE_TOKENS.COMMAND_HANDLERS.ACTIVATE,
      useClass: ActivateCommercialCommissionRuleHandler,
    },

    {
      provide: COMMERCIAL_COMMISSION_RULE_TOKENS.COMMAND_HANDLERS.DEACTIVATE,
      useClass: DeactivateCommercialCommissionRuleHandler,
    },

    // =========================================================================
    // Commercial Commission Rule Queries
    // =========================================================================

    {
      provide: COMMERCIAL_COMMISSION_RULE_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetCommercialCommissionRuleHandler,
    },

    {
      provide: COMMERCIAL_COMMISSION_RULE_TOKENS.QUERY_HANDLERS.GET_BY_TYPE,
      useClass: GetCommercialCommissionRuleByTypeHandler,
    },

    {
      provide: COMMERCIAL_COMMISSION_RULE_TOKENS.QUERY_HANDLERS.GET_ACTIVE,
      useClass: GetActiveCommercialCommissionRuleHandler,
    },

    {
      provide: COMMERCIAL_COMMISSION_RULE_TOKENS.QUERY_HANDLERS.LIST,
      useClass: ListCommercialCommissionRulesHandler,
    },

    // =========================================================================
    // Commercial Booking Commission Lifecycle
    // =========================================================================

    {
      provide: COMMERCIAL_BOOKING_COMMISSION_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateCommercialBookingCommissionHandler,
    },

    {
      provide: COMMERCIAL_BOOKING_COMMISSION_TOKENS.COMMAND_HANDLERS.ASSESS,
      useClass: AssessCommercialBookingCommissionHandler,
    },

    {
      provide: COMMERCIAL_BOOKING_COMMISSION_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelCommercialBookingCommissionHandler,
    },

    // =========================================================================
    // Commercial Booking Commission Queries
    // =========================================================================

    {
      provide: COMMERCIAL_BOOKING_COMMISSION_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetCommercialBookingCommissionHandler,
    },

    {
      provide:
        COMMERCIAL_BOOKING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_BOOKING,
      useClass: GetCommercialBookingCommissionByBookingHandler,
    },

    {
      provide:
        COMMERCIAL_BOOKING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY,
      useClass: GetCommercialBookingCommissionsByJourneyHandler,
    },

    {
      provide: COMMERCIAL_BOOKING_COMMISSION_TOKENS.QUERY_HANDLERS.LIST,
      useClass: ListCommercialBookingCommissionsHandler,
    },

    // =========================================================================
    // Commercial Earning Commission Lifecycle
    // =========================================================================

    {
      provide: COMMERCIAL_EARNING_COMMISSION_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateCommercialEarningCommissionHandler,
    },

    {
      provide: COMMERCIAL_EARNING_COMMISSION_TOKENS.COMMAND_HANDLERS.ASSESS,
      useClass: AssessCommercialEarningCommissionHandler,
    },

    {
      provide: COMMERCIAL_EARNING_COMMISSION_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelCommercialEarningCommissionHandler,
    },

    // =========================================================================
    // Commercial Earning Commission Queries
    // =========================================================================

    {
      provide: COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetCommercialEarningCommissionHandler,
    },

    {
      provide:
        COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_SETTLEMENT,
      useClass: GetCommercialEarningCommissionBySettlementHandler,
    },

    {
      provide:
        COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY,
      useClass: GetCommercialEarningCommissionsByJourneyHandler,
    },

    {
      provide:
        COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER,
      useClass: GetCommercialEarningCommissionsByProviderHandler,
    },

    {
      provide: COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.LIST,
      useClass: ListCommercialEarningCommissionsHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Keep the bounded-context boundary narrow.
  //
  // Controllers and application handlers remain private to this module.
  //
  // Repository tokens are exported so other bounded contexts can integrate
  // through application/domain contracts rather than directly depending on
  // Prisma persistence.
  // ===========================================================================

  exports: [
    COMMERCIAL_COMMISSION_RULE_TOKENS.REPOSITORY,
    COMMERCIAL_BOOKING_COMMISSION_TOKENS.REPOSITORY,
    COMMERCIAL_EARNING_COMMISSION_TOKENS.REPOSITORY,
  ],
})
export class CommercialModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CommercialModule;
