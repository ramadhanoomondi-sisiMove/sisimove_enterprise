// -----------------------------------------------------------------------------
// Messaging — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Messaging bounded context.
//
// Registered capabilities:
//
// - Messaging Conversation aggregate;
// - Messaging Conversation Participant entities;
// - Messaging Message aggregate;
// - conversation lifecycle;
// - conversation participant lifecycle;
// - conversation read state;
// - message lifecycle;
// - message content editing;
// - message deletion;
// - message moderation;
// - messaging queries.
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository providers;
// - application command handlers;
// - application query handlers.
//
// Domain behavior remains inside:
//
// - MessagingConversationAggregate;
// - MessagingConversationEntity;
// - MessagingConversationParticipantEntity;
// - MessagingMessageAggregate;
// - MessagingMessageEntity.
//
// Application handlers coordinate use cases and depend only on:
//
// - MessagingConversationRepository;
// - MessagingMessageRepository.
//
// Infrastructure implements those abstractions through:
//
// - PrismaMessagingConversationRepository;
// - PrismaMessagingMessageRepository.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundaries:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// -----------------------------------------------------------------------------
//
// Infrastructure boundary:
//
// Messaging Application
//          │
//          ▼
//   MESSAGING_TOKENS
//          │
//          └── REPOSITORIES
//                  │
//                  ├── MESSAGING_CONVERSATION
//                  │       │
//                  │       ▼
//                  │   PrismaMessagingConversationRepository
//                  │
//                  └── MESSAGING_MESSAGE
//                          │
//                          ▼
//                     PrismaMessagingMessageRepository
//
// -----------------------------------------------------------------------------
//
// Prisma:
//
// PrismaModule provides PrismaService to the concrete Messaging Prisma
// repositories.
//
// The repositories remain hidden behind:
//
//     MESSAGING_TOKENS.REPOSITORIES.*
//
// -----------------------------------------------------------------------------
//
// Application command handlers:
//
// Messaging Conversation:
//
// - CreateMessagingConversationHandler
// - CloseMessagingConversationHandler
//
// Messaging Conversation Participants:
//
// - AddMessagingParticipantHandler
// - LeaveMessagingConversationHandler
// - RemoveMessagingParticipantHandler
// - MarkMessagingConversationReadHandler
//
// Messaging Message:
//
// - SendMessagingMessageHandler
// - EditMessagingMessageHandler
// - DeleteMessagingMessageHandler
// - ModerateMessagingMessageHandler
//
// -----------------------------------------------------------------------------
//
// Application query handlers:
//
// Messaging Conversation:
//
// - GetMessagingConversationHandler
// - GetMessagingConversationsHandler
// - GetMessagingConversationByJourneyHandler
// - GetMessagingConversationByBookingHandler
//
// Messaging Message:
//
// - GetMessagingMessageHandler
// - GetMessagingMessagesHandler
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
//      ├── Messaging repository abstractions
//      │
//      ▼
// Infrastructure DI
//      │
//      ├── PrismaMessagingConversationRepository
//      └── PrismaMessagingMessageRepository
//
// The application layer does not import concrete infrastructure
// implementations.
//
// -----------------------------------------------------------------------------
//
// Module boundary:
//
// MessagingModule owns:
//
// - controller registration;
// - repository registration;
// - command-handler registration;
// - query-handler registration.
//
// Concrete Prisma repositories remain internal to MessagingModule.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Handler registrations MUST use the exact tokens defined in:
//
//     application/messaging.tokens.ts
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

import {
  MessagingConversationsController,
  MessagingMessagesController,
} from './presentation/rest/controllers';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { MESSAGING_PROVIDERS } from './infrastructure/dependency-injection/messaging.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { MESSAGING_TOKENS } from './application/messaging.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  AddMessagingParticipantHandler,
  CloseMessagingConversationHandler,
  CreateMessagingConversationHandler,
  DeleteMessagingMessageHandler,
  EditMessagingMessageHandler,
  LeaveMessagingConversationHandler,
  MarkMessagingConversationReadHandler,
  ModerateMessagingMessageHandler,
  RemoveMessagingParticipantHandler,
  SendMessagingMessageHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetMessagingConversationByBookingHandler,
  GetMessagingConversationByJourneyHandler,
  GetMessagingConversationHandler,
  GetMessagingConversationsHandler,
  GetMessagingMessageHandler,
  GetMessagingMessagesHandler,
} from './application/query-handlers';

// =============================================================================
// Messaging Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================
  //
  // PrismaModule provides PrismaService to the concrete Messaging Prisma
  // repositories registered through MESSAGING_PROVIDERS.
  //
  // ---------------------------------------------------------------------------

  imports: [PrismaModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================
  //
  // Messaging REST transport boundary.
  //
  // Controllers contain no domain business rules.
  //
  // ---------------------------------------------------------------------------

  controllers: [MessagingConversationsController, MessagingMessagesController],

  // ===========================================================================
  // Providers
  // ===========================================================================
  //
  // Infrastructure repository bindings are supplied by
  // MESSAGING_PROVIDERS.
  //
  // Application handlers are bound to their exact Messaging DI tokens.
  //
  // ---------------------------------------------------------------------------

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    ...MESSAGING_PROVIDERS,

    // =========================================================================
    // Messaging Conversation — Command Handlers
    // =========================================================================

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.CREATE_MESSAGING_CONVERSATION,
      useClass: CreateMessagingConversationHandler,
    },

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.CLOSE_MESSAGING_CONVERSATION,
      useClass: CloseMessagingConversationHandler,
    },

    // =========================================================================
    // Messaging Conversation Participant — Command Handlers
    // =========================================================================

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.ADD_MESSAGING_PARTICIPANT,
      useClass: AddMessagingParticipantHandler,
    },

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.LEAVE_MESSAGING_CONVERSATION,
      useClass: LeaveMessagingConversationHandler,
    },

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.REMOVE_MESSAGING_PARTICIPANT,
      useClass: RemoveMessagingParticipantHandler,
    },

    {
      provide:
        MESSAGING_TOKENS.COMMAND_HANDLERS.MARK_MESSAGING_CONVERSATION_READ,
      useClass: MarkMessagingConversationReadHandler,
    },

    // =========================================================================
    // Messaging Message — Command Handlers
    // =========================================================================

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.SEND_MESSAGING_MESSAGE,
      useClass: SendMessagingMessageHandler,
    },

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.EDIT_MESSAGING_MESSAGE,
      useClass: EditMessagingMessageHandler,
    },

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.DELETE_MESSAGING_MESSAGE,
      useClass: DeleteMessagingMessageHandler,
    },

    {
      provide: MESSAGING_TOKENS.COMMAND_HANDLERS.MODERATE_MESSAGING_MESSAGE,
      useClass: ModerateMessagingMessageHandler,
    },

    // =========================================================================
    // Messaging Conversation — Query Handlers
    // =========================================================================

    {
      provide: MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION,
      useClass: GetMessagingConversationHandler,
    },

    {
      provide: MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATIONS,
      useClass: GetMessagingConversationsHandler,
    },

    {
      provide:
        MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION_BY_JOURNEY,
      useClass: GetMessagingConversationByJourneyHandler,
    },

    {
      provide:
        MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION_BY_BOOKING,
      useClass: GetMessagingConversationByBookingHandler,
    },

    // =========================================================================
    // Messaging Message — Query Handlers
    // =========================================================================

    {
      provide: MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_MESSAGE,
      useClass: GetMessagingMessageHandler,
    },

    {
      provide: MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_MESSAGES,
      useClass: GetMessagingMessagesHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Expose application-facing tokens only.
  //
  // Concrete Prisma repositories remain private to MessagingModule.
  //
  // ---------------------------------------------------------------------------

  exports: [
    // =========================================================================
    // Repositories
    // =========================================================================

    MESSAGING_TOKENS.REPOSITORIES.MESSAGING_CONVERSATION,

    MESSAGING_TOKENS.REPOSITORIES.MESSAGING_MESSAGE,

    // =========================================================================
    // Messaging Conversation — Command Handlers
    // =========================================================================

    MESSAGING_TOKENS.COMMAND_HANDLERS.CREATE_MESSAGING_CONVERSATION,

    MESSAGING_TOKENS.COMMAND_HANDLERS.CLOSE_MESSAGING_CONVERSATION,

    // =========================================================================
    // Messaging Conversation Participant — Command Handlers
    // =========================================================================

    MESSAGING_TOKENS.COMMAND_HANDLERS.ADD_MESSAGING_PARTICIPANT,

    MESSAGING_TOKENS.COMMAND_HANDLERS.LEAVE_MESSAGING_CONVERSATION,

    MESSAGING_TOKENS.COMMAND_HANDLERS.REMOVE_MESSAGING_PARTICIPANT,

    MESSAGING_TOKENS.COMMAND_HANDLERS.MARK_MESSAGING_CONVERSATION_READ,

    // =========================================================================
    // Messaging Message — Command Handlers
    // =========================================================================

    MESSAGING_TOKENS.COMMAND_HANDLERS.SEND_MESSAGING_MESSAGE,

    MESSAGING_TOKENS.COMMAND_HANDLERS.EDIT_MESSAGING_MESSAGE,

    MESSAGING_TOKENS.COMMAND_HANDLERS.DELETE_MESSAGING_MESSAGE,

    MESSAGING_TOKENS.COMMAND_HANDLERS.MODERATE_MESSAGING_MESSAGE,

    // =========================================================================
    // Messaging Conversation — Query Handlers
    // =========================================================================

    MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION,

    MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATIONS,

    MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION_BY_JOURNEY,

    MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_CONVERSATION_BY_BOOKING,

    // =========================================================================
    // Messaging Message — Query Handlers
    // =========================================================================

    MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_MESSAGE,

    MESSAGING_TOKENS.QUERY_HANDLERS.GET_MESSAGING_MESSAGES,
  ],
})
export class MessagingModule {}

// =============================================================================
// Default Export
// =============================================================================

export default MessagingModule;
