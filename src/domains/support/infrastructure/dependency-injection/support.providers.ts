// -----------------------------------------------------------------------------
// Support — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Support bounded
// context.
//
// The Support application layer depends on repository abstractions:
//
// - SupportCaseRepository.
//
// This provider file binds those abstractions to their concrete Prisma
// persistence implementations.
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
//     Support Application
//              │
//              ▼
//     SUPPORT_TOKENS
//              │
//              └── REPOSITORIES
//                       │
//                       └── SUPPORT_CASE
//                               │
//                               ▼
//                    PrismaSupportCaseRepository
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// The application layer resolves the Support Case repository abstraction
// through:
//
//     SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE
//
// It does NOT import or depend on the Prisma repository implementation.
//
// -----------------------------------------------------------------------------
//
// Concrete infrastructure implementations are provided here at the
// composition root.
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
// Support aggregate boundary:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// All child entities are persisted and rehydrated through the
// SupportCaseRepository.
//
// No independent child-entity repositories are registered here.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { SUPPORT_TOKENS } from '../../application/support.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Persistence
// -----------------------------------------------------------------------------

import { PrismaSupportCaseRepository } from '../persistence/prisma/repositories/prisma-support-case.repository';

// =============================================================================
// Providers
// =============================================================================

export const SUPPORT_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Support Case Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE
  //
  // Infrastructure implementation:
  //
  //     PrismaSupportCaseRepository
  //
  // The repository persists and rehydrates the complete SupportCaseAggregate,
  // including all owned child entities.
  //
  // ---------------------------------------------------------------------------

  {
    provide: SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE,
    useClass: PrismaSupportCaseRepository,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SUPPORT_PROVIDERS;
