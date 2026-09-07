// -----------------------------------------------------------------------------
// Support — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Support bounded context.
//
// Registered capabilities:
//
// - Support Case aggregate;
// - Support Case Participant child entities;
// - Support Case Message child entities;
// - Support Case Note child entities;
// - Support Case Evidence child entities;
// - Support Case Resolution child entity;
// - Support Case lifecycle;
// - Support Case assignment;
// - Support Case priority and category;
// - Support Case participant lifecycle;
// - Support Case message lifecycle;
// - Support Case note lifecycle;
// - Support Case evidence lifecycle;
// - Support Case resolution lifecycle;
// - Support Case queries.
//
// The module wires:
//
// - REST controller;
// - infrastructure repository provider;
// - application command handlers;
// - application query handlers.
//
// -----------------------------------------------------------------------------
//
// Domain behavior remains inside:
//
// - SupportCaseAggregate;
// - SupportCaseEntity;
// - SupportCaseParticipantEntity;
// - SupportCaseMessageEntity;
// - SupportCaseNoteEntity;
// - SupportCaseEvidenceEntity;
// - SupportCaseResolutionEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains inside infrastructure.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// All child entities belong to the SupportCaseAggregate and are therefore
// NOT registered as independent aggregate repositories.
//
// -----------------------------------------------------------------------------
//
// Infrastructure boundary:
//
// Support Application
//          │
//          ▼
//   SUPPORT_TOKENS
//          │
//          └── REPOSITORIES
//                  │
//                  └── SUPPORT_CASE
//                          │
//                          ▼
//                  PrismaSupportCaseRepository
//
// -----------------------------------------------------------------------------
//
// Prisma:
//
// PrismaModule provides PrismaService to the concrete Support Prisma
// repository.
//
// The repository remains hidden behind:
//
//     SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE
//
// -----------------------------------------------------------------------------
//
// Application command handlers:
//
// Support Case:
//
// - CreateSupportCaseHandler
// - AssignSupportCaseHandler
// - UnassignSupportCaseHandler
// - ChangeSupportCasePriorityHandler
// - ChangeSupportCaseCategoryHandler
// - StartSupportCaseHandler
// - WaitForMemberSupportCaseHandler
// - WaitForInternalActionSupportCaseHandler
// - ResolveSupportCaseHandler
// - CloseSupportCaseHandler
// - CancelSupportCaseHandler
//
// Participants:
//
// - AddSupportCaseParticipantHandler
// - RemoveSupportCaseParticipantHandler
//
// Messages:
//
// - AddSupportCaseMessageHandler
// - EditSupportCaseMessageHandler
// - DeleteSupportCaseMessageHandler
//
// Notes:
//
// - AddSupportCaseNoteHandler
//
// Evidence:
//
// - AddSupportCaseEvidenceHandler
//
// Resolution:
//
// - CreateSupportCaseResolutionHandler
//
// -----------------------------------------------------------------------------
//
// Application query handlers:
//
// Support Case:
//
// - GetSupportCaseHandler
// - GetSupportCasesHandler
// - GetSupportCasesByRequesterHandler
// - GetSupportCasesByAssigneeHandler
// - GetSupportCasesByReferenceHandler
// - GetSupportCasesByStatusHandler
// - GetSupportCasesByCategoryHandler
// - GetSupportCasesByPriorityHandler
//
// Participants:
//
// - GetSupportCaseParticipantsHandler
//
// Messages:
//
// - GetSupportCaseMessagesHandler
//
// Notes:
//
// - GetSupportCaseNotesHandler
//
// Evidence:
//
// - GetSupportCaseEvidenceHandler
//
// Resolution:
//
// - GetSupportCaseResolutionHandler
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
// Presentation
//      │
//      ▼
// Application
//      │
//      ├── Support Case repository abstraction
//      │
//      ▼
// Infrastructure DI
//      │
//      └── PrismaSupportCaseRepository
//
// The application layer does not import concrete infrastructure
// implementations.
//
// -----------------------------------------------------------------------------
//
// Module boundary:
//
// SupportModule owns:
//
// - controller registration;
// - repository registration;
// - command-handler registration;
// - query-handler registration.
//
// Concrete Prisma repositories remain private to SupportModule.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Handler registrations MUST use the exact tokens defined in:
//
//     application/support.tokens.ts
//
// No additional or inferred tokens are introduced here.
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

import { SupportCasesController } from './presentation/rest/controllers/support-cases.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { SUPPORT_PROVIDERS } from './infrastructure/dependency-injection/support.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { SUPPORT_TOKENS } from './application/support.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  AddSupportCaseEvidenceHandler,
  AddSupportCaseMessageHandler,
  AddSupportCaseNoteHandler,
  AddSupportCaseParticipantHandler,
  AssignSupportCaseHandler,
  CancelSupportCaseHandler,
  ChangeSupportCaseCategoryHandler,
  ChangeSupportCasePriorityHandler,
  CloseSupportCaseHandler,
  CreateSupportCaseHandler,
  CreateSupportCaseResolutionHandler,
  DeleteSupportCaseMessageHandler,
  EditSupportCaseMessageHandler,
  RemoveSupportCaseParticipantHandler,
  ResolveSupportCaseHandler,
  StartSupportCaseHandler,
  UnassignSupportCaseHandler,
  WaitForInternalActionSupportCaseHandler,
  WaitForMemberSupportCaseHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetSupportCaseEvidenceHandler,
  GetSupportCaseHandler,
  GetSupportCaseMessagesHandler,
  GetSupportCaseNotesHandler,
  GetSupportCaseParticipantsHandler,
  GetSupportCaseResolutionHandler,
  GetSupportCasesByAssigneeHandler,
  GetSupportCasesByCategoryHandler,
  GetSupportCasesByPriorityHandler,
  GetSupportCasesByReferenceHandler,
  GetSupportCasesByRequesterHandler,
  GetSupportCasesByStatusHandler,
  GetSupportCasesHandler,
} from './application/query-handlers';

// =============================================================================
// Support Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================
  //
  // PrismaModule provides PrismaService to the concrete Support Prisma
  // repository registered through SUPPORT_PROVIDERS.
  //
  // ---------------------------------------------------------------------------

  imports: [PrismaModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================
  //
  // Support REST transport boundary.
  //
  // The controller contains no domain business rules.
  //
  // ---------------------------------------------------------------------------

  controllers: [SupportCasesController],

  // ===========================================================================
  // Providers
  // ===========================================================================
  //
  // Infrastructure repository bindings are supplied by SUPPORT_PROVIDERS.
  //
  // Application handlers are bound to their exact Support DI tokens.
  //
  // ---------------------------------------------------------------------------

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    ...SUPPORT_PROVIDERS,

    // =========================================================================
    // Support Case — Command Handlers
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.CREATE_SUPPORT_CASE,
      useClass: CreateSupportCaseHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.ASSIGN_SUPPORT_CASE,
      useClass: AssignSupportCaseHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.UNASSIGN_SUPPORT_CASE,
      useClass: UnassignSupportCaseHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.CHANGE_SUPPORT_CASE_PRIORITY,
      useClass: ChangeSupportCasePriorityHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.CHANGE_SUPPORT_CASE_CATEGORY,
      useClass: ChangeSupportCaseCategoryHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.START_SUPPORT_CASE,
      useClass: StartSupportCaseHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.WAIT_FOR_MEMBER_SUPPORT_CASE,
      useClass: WaitForMemberSupportCaseHandler,
    },

    {
      provide:
        SUPPORT_TOKENS.COMMAND_HANDLERS.WAIT_FOR_INTERNAL_ACTION_SUPPORT_CASE,
      useClass: WaitForInternalActionSupportCaseHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.RESOLVE_SUPPORT_CASE,
      useClass: ResolveSupportCaseHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.CLOSE_SUPPORT_CASE,
      useClass: CloseSupportCaseHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.CANCEL_SUPPORT_CASE,
      useClass: CancelSupportCaseHandler,
    },

    // =========================================================================
    // Support Case Participant — Command Handlers
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_PARTICIPANT,
      useClass: AddSupportCaseParticipantHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.REMOVE_SUPPORT_CASE_PARTICIPANT,
      useClass: RemoveSupportCaseParticipantHandler,
    },

    // =========================================================================
    // Support Case Message — Command Handlers
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_MESSAGE,
      useClass: AddSupportCaseMessageHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.EDIT_SUPPORT_CASE_MESSAGE,
      useClass: EditSupportCaseMessageHandler,
    },

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.DELETE_SUPPORT_CASE_MESSAGE,
      useClass: DeleteSupportCaseMessageHandler,
    },

    // =========================================================================
    // Support Case Note — Command Handlers
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_NOTE,
      useClass: AddSupportCaseNoteHandler,
    },

    // =========================================================================
    // Support Case Evidence — Command Handlers
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_EVIDENCE,
      useClass: AddSupportCaseEvidenceHandler,
    },

    // =========================================================================
    // Support Case Resolution — Command Handlers
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.COMMAND_HANDLERS.CREATE_SUPPORT_CASE_RESOLUTION,
      useClass: CreateSupportCaseResolutionHandler,
    },

    // =========================================================================
    // Support Case — Query Handlers
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE,
      useClass: GetSupportCaseHandler,
    },

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES,
      useClass: GetSupportCasesHandler,
    },

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_REQUESTER,
      useClass: GetSupportCasesByRequesterHandler,
    },

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_ASSIGNEE,
      useClass: GetSupportCasesByAssigneeHandler,
    },

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_REFERENCE,
      useClass: GetSupportCasesByReferenceHandler,
    },

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_STATUS,
      useClass: GetSupportCasesByStatusHandler,
    },

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_CATEGORY,
      useClass: GetSupportCasesByCategoryHandler,
    },

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_PRIORITY,
      useClass: GetSupportCasesByPriorityHandler,
    },

    // =========================================================================
    // Support Case Participant — Query Handler
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_PARTICIPANTS,
      useClass: GetSupportCaseParticipantsHandler,
    },

    // =========================================================================
    // Support Case Message — Query Handler
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_MESSAGES,
      useClass: GetSupportCaseMessagesHandler,
    },

    // =========================================================================
    // Support Case Note — Query Handler
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_NOTES,
      useClass: GetSupportCaseNotesHandler,
    },

    // =========================================================================
    // Support Case Evidence — Query Handler
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_EVIDENCE,
      useClass: GetSupportCaseEvidenceHandler,
    },

    // =========================================================================
    // Support Case Resolution — Query Handler
    // =========================================================================

    {
      provide: SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_RESOLUTION,
      useClass: GetSupportCaseResolutionHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Expose application-facing tokens only.
  //
  // Concrete Prisma repositories remain private to SupportModule.
  //
  // ---------------------------------------------------------------------------

  exports: [
    // =========================================================================
    // Repository
    // =========================================================================

    SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE,

    // =========================================================================
    // Support Case — Command Handlers
    // =========================================================================

    SUPPORT_TOKENS.COMMAND_HANDLERS.CREATE_SUPPORT_CASE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.ASSIGN_SUPPORT_CASE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.UNASSIGN_SUPPORT_CASE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.CHANGE_SUPPORT_CASE_PRIORITY,

    SUPPORT_TOKENS.COMMAND_HANDLERS.CHANGE_SUPPORT_CASE_CATEGORY,

    SUPPORT_TOKENS.COMMAND_HANDLERS.START_SUPPORT_CASE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.WAIT_FOR_MEMBER_SUPPORT_CASE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.WAIT_FOR_INTERNAL_ACTION_SUPPORT_CASE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.RESOLVE_SUPPORT_CASE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.CLOSE_SUPPORT_CASE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.CANCEL_SUPPORT_CASE,

    // =========================================================================
    // Support Case Participant — Command Handlers
    // =========================================================================

    SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_PARTICIPANT,

    SUPPORT_TOKENS.COMMAND_HANDLERS.REMOVE_SUPPORT_CASE_PARTICIPANT,

    // =========================================================================
    // Support Case Message — Command Handlers
    // =========================================================================

    SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_MESSAGE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.EDIT_SUPPORT_CASE_MESSAGE,

    SUPPORT_TOKENS.COMMAND_HANDLERS.DELETE_SUPPORT_CASE_MESSAGE,

    // =========================================================================
    // Support Case Note — Command Handler
    // =========================================================================

    SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_NOTE,

    // =========================================================================
    // Support Case Evidence — Command Handler
    // =========================================================================

    SUPPORT_TOKENS.COMMAND_HANDLERS.ADD_SUPPORT_CASE_EVIDENCE,

    // =========================================================================
    // Support Case Resolution — Command Handler
    // =========================================================================

    SUPPORT_TOKENS.COMMAND_HANDLERS.CREATE_SUPPORT_CASE_RESOLUTION,

    // =========================================================================
    // Support Case — Query Handlers
    // =========================================================================

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE,

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES,

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_REQUESTER,

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_ASSIGNEE,

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_REFERENCE,

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_STATUS,

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_CATEGORY,

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASES_BY_PRIORITY,

    // =========================================================================
    // Support Case Participant — Query Handler
    // =========================================================================

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_PARTICIPANTS,

    // =========================================================================
    // Support Case Message — Query Handler
    // =========================================================================

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_MESSAGES,

    // =========================================================================
    // Support Case Note — Query Handler
    // =========================================================================

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_NOTES,

    // =========================================================================
    // Support Case Evidence — Query Handler
    // =========================================================================

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_EVIDENCE,

    // =========================================================================
    // Support Case Resolution — Query Handler
    // =========================================================================

    SUPPORT_TOKENS.QUERY_HANDLERS.GET_SUPPORT_CASE_RESOLUTION,
  ],
})
export class SupportModule {}

// =============================================================================
// Default Export
// =============================================================================

export default SupportModule;
