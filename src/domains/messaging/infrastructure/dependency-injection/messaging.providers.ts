// -----------------------------------------------------------------------------
// Messaging — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Messaging bounded
// context.
//
// The Messaging application layer depends on repository abstractions:
//
// - MessagingConversationRepository;
// - MessagingMessageRepository.
//
// This provider file binds those abstractions to their concrete Prisma
// persistence implementations.
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
//     Messaging Application
//              │
//              ▼
//       MESSAGING_TOKENS
//              │
//              └── REPOSITORIES
//                      │
//                      ├── MESSAGING_CONVERSATION
//                      │       │
//                      │       ▼
//                      │   PrismaMessagingConversationRepository
//                      │
//                      └── MESSAGING_MESSAGE
//                              │
//                              ▼
//                         PrismaMessagingMessageRepository
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// The application layer resolves repository abstractions through:
//
//     MESSAGING_TOKENS.REPOSITORIES.MESSAGING_CONVERSATION
//     MESSAGING_TOKENS.REPOSITORIES.MESSAGING_MESSAGE
//
// It does NOT import or depend on Prisma repository implementations.
//
// -----------------------------------------------------------------------------
//
// Concrete infrastructure implementations are provided here at the
// composition root.
//
// Domain behavior remains inside the Messaging domain.
//
// Application orchestration remains inside command/query handlers.
//
// Persistence remains inside infrastructure.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { MESSAGING_TOKENS } from '../../application/messaging.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Persistence
// -----------------------------------------------------------------------------

import { PrismaMessagingConversationRepository } from '../persistence/prisma/repositories/prisma-messaging-conversation.repository';

import { PrismaMessagingMessageRepository } from '../persistence/prisma/repositories/prisma-messaging-message.repository';

// =============================================================================
// Providers
// =============================================================================

export const MESSAGING_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Messaging Conversation Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     MESSAGING_TOKENS.REPOSITORIES.MESSAGING_CONVERSATION
  //
  // Infrastructure implementation:
  //
  //     PrismaMessagingConversationRepository
  //
  // ---------------------------------------------------------------------------

  {
    provide: MESSAGING_TOKENS.REPOSITORIES.MESSAGING_CONVERSATION,
    useClass: PrismaMessagingConversationRepository,
  },

  // ===========================================================================
  // Messaging Message Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     MESSAGING_TOKENS.REPOSITORIES.MESSAGING_MESSAGE
  //
  // Infrastructure implementation:
  //
  //     PrismaMessagingMessageRepository
  //
  // ---------------------------------------------------------------------------

  {
    provide: MESSAGING_TOKENS.REPOSITORIES.MESSAGING_MESSAGE,
    useClass: PrismaMessagingMessageRepository,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MESSAGING_PROVIDERS;
