// -----------------------------------------------------------------------------
// Journey Completion — NestJS Module
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

import { JourneyCompletionController } from './presentation/rest/controllers/journey-completion.controller';

import { JourneySettlementController } from './presentation/rest/controllers/journey-settlement.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import {
  JOURNEY_COMPLETION_PROVIDERS,
  JOURNEY_SETTLEMENT_PROVIDERS,
} from './infrastructure/dependency-injection';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from './application/journey-completion.tokens';

import { JOURNEY_SETTLEMENT_TOKENS } from './application/journey-settlement.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  // Journey Completion
  CancelJourneyCompletionHandler,
  ConfirmJourneyCompletionHandler,
  CreateJourneyCompletionHandler,
  OpenJourneyCompletionDisputeHandler,
  RejectJourneyCompletionDisputeHandler,
  RequestJourneyCompletionHandler,
  ResolveJourneyCompletionDisputeHandler,
  ReviewJourneyCompletionDisputeHandler,
  WithdrawJourneyCompletionConfirmationHandler,
  WithdrawJourneyCompletionDisputeHandler,

  // Journey Settlement
  CancelJourneySettlementHandler,
  CompleteJourneySettlementHandler,
  CreateJourneySettlementHandler,
  FailJourneySettlementHandler,
  HoldJourneySettlementHandler,
  ProcessJourneySettlementHandler,
  SubmitJourneySettlementHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  // Journey Completion
  CountJourneyCompletionsByStatusQueryHandler,
  GetJourneyCompletionByJourneyHandler,
  GetJourneyCompletionConfirmationHandler,
  GetJourneyCompletionConfirmationsHandler,
  GetJourneyCompletionDisputeHandler,
  GetJourneyCompletionDisputesHandler,
  GetJourneyCompletionHandler,
  ListJourneyCompletionsByProviderHandler,
  ListJourneyCompletionsByStatusHandler,
  ListJourneyCompletionsHandler,

  // Journey Settlement
  CountJourneySettlementsByStatusQueryHandler,
  GetJourneySettlementByCompletionHandler,
  GetJourneySettlementHandler,
  ListJourneySettlementsHandler,
} from './application/query-handlers';

// -----------------------------------------------------------------------------
// Module
// -----------------------------------------------------------------------------

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [IdentityModule, PrismaModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [JourneyCompletionController, JourneySettlementController],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // Infrastructure — Repositories
    ...JOURNEY_COMPLETION_PROVIDERS,
    ...JOURNEY_SETTLEMENT_PROVIDERS,

    // =========================================================================
    // Journey Completion Lifecycle
    // =========================================================================

    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateJourneyCompletionHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.REQUEST,
      useClass: RequestJourneyCompletionHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.CONFIRM,
      useClass: ConfirmJourneyCompletionHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.WITHDRAW_CONFIRMATION,
      useClass: WithdrawJourneyCompletionConfirmationHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelJourneyCompletionHandler,
    },

    // =========================================================================
    // Journey Completion Disputes
    // =========================================================================

    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.OPEN_DISPUTE,
      useClass: OpenJourneyCompletionDisputeHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.REVIEW_DISPUTE,
      useClass: ReviewJourneyCompletionDisputeHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.RESOLVE_DISPUTE,
      useClass: ResolveJourneyCompletionDisputeHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.REJECT_DISPUTE,
      useClass: RejectJourneyCompletionDisputeHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.COMMAND_HANDLERS.WITHDRAW_DISPUTE,
      useClass: WithdrawJourneyCompletionDisputeHandler,
    },

    // =========================================================================
    // Journey Completion Queries
    // =========================================================================

    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetJourneyCompletionHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY,
      useClass: GetJourneyCompletionByJourneyHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.LIST,
      useClass: ListJourneyCompletionsHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.LIST_BY_PROVIDER,
      useClass: ListJourneyCompletionsByProviderHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.LIST_BY_STATUS,
      useClass: ListJourneyCompletionsByStatusHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.COUNT_BY_STATUS,
      useClass: CountJourneyCompletionsByStatusQueryHandler,
    },

    // =========================================================================
    // Journey Completion Confirmation Queries
    // =========================================================================

    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_CONFIRMATIONS,
      useClass: GetJourneyCompletionConfirmationsHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_CONFIRMATION,
      useClass: GetJourneyCompletionConfirmationHandler,
    },

    // =========================================================================
    // Journey Completion Dispute Queries
    // =========================================================================

    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_DISPUTES,
      useClass: GetJourneyCompletionDisputesHandler,
    },
    {
      provide: JOURNEY_COMPLETION_TOKENS.QUERY_HANDLERS.GET_DISPUTE,
      useClass: GetJourneyCompletionDisputeHandler,
    },

    // =========================================================================
    // Journey Settlement Lifecycle
    // =========================================================================

    {
      provide: JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateJourneySettlementHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.SUBMIT,
      useClass: SubmitJourneySettlementHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.PROCESS,
      useClass: ProcessJourneySettlementHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.COMPLETE,
      useClass: CompleteJourneySettlementHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.FAIL,
      useClass: FailJourneySettlementHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.HOLD,
      useClass: HoldJourneySettlementHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelJourneySettlementHandler,
    },

    // =========================================================================
    // Journey Settlement Queries
    // =========================================================================

    {
      provide: JOURNEY_SETTLEMENT_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetJourneySettlementHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.QUERY_HANDLERS.GET_BY_COMPLETION,
      useClass: GetJourneySettlementByCompletionHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.QUERY_HANDLERS.LIST,
      useClass: ListJourneySettlementsHandler,
    },
    {
      provide: JOURNEY_SETTLEMENT_TOKENS.QUERY_HANDLERS.COUNT_BY_STATUS,
      useClass: CountJourneySettlementsByStatusQueryHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    JOURNEY_COMPLETION_TOKENS.REPOSITORY,
    JOURNEY_SETTLEMENT_TOKENS.REPOSITORY,
  ],
})
export class JourneyCompletionModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyCompletionModule;
