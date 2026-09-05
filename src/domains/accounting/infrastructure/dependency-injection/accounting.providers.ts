// -----------------------------------------------------------------------------
// Accounting — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Accounting bounded
// context.
//
// The Accounting application layer depends on repository abstractions:
//
// - AccountingAccountRepository;
// - AccountingPeriodRepository;
// - AccountingJournalRepository.
//
// This provider file binds those abstractions to their concrete Prisma
// persistence implementations.
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
//     Accounting Application
//              │
//              ▼
//       ACCOUNTING_TOKENS
//              │
//              └── REPOSITORIES
//                      │
//                      ├── ACCOUNTING_ACCOUNT
//                      │       │
//                      │       ▼
//                      │   PrismaAccountingAccountRepository
//                      │
//                      ├── ACCOUNTING_PERIOD
//                      │       │
//                      │       ▼
//                      │   PrismaAccountingPeriodRepository
//                      │
//                      └── ACCOUNTING_JOURNAL
//                              │
//                              ▼
//                         PrismaAccountingJournalRepository
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// The application layer resolves repository abstractions through:
//
//     ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT
//     ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_PERIOD
//     ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL
//
// It does NOT import or depend on Prisma repository implementations.
//
// -----------------------------------------------------------------------------
//
// Concrete infrastructure implementations are provided here at the
// composition root.
//
// Domain behavior remains inside the Accounting domain.
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

import { ACCOUNTING_TOKENS } from '../../application/accounting.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Persistence
// -----------------------------------------------------------------------------

import { PrismaAccountingAccountRepository } from '../persistence/prisma/repositories/prisma-accounting-account.repository';

import { PrismaAccountingPeriodRepository } from '../persistence/prisma/repositories/prisma-accounting-period.repository';

import { PrismaAccountingJournalRepository } from '../persistence/prisma/repositories/prisma-accounting-journal.repository';

// =============================================================================
// Providers
// =============================================================================

export const ACCOUNTING_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Accounting Account Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT
  //
  // Infrastructure implementation:
  //
  //     PrismaAccountingAccountRepository
  //
  // ---------------------------------------------------------------------------

  {
    provide: ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_ACCOUNT,
    useClass: PrismaAccountingAccountRepository,
  },

  // ===========================================================================
  // Accounting Period Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_PERIOD
  //
  // Infrastructure implementation:
  //
  //     PrismaAccountingPeriodRepository
  //
  // ---------------------------------------------------------------------------

  {
    provide: ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_PERIOD,
    useClass: PrismaAccountingPeriodRepository,
  },

  // ===========================================================================
  // Accounting Journal Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL
  //
  // Infrastructure implementation:
  //
  //     PrismaAccountingJournalRepository
  //
  // ---------------------------------------------------------------------------

  {
    provide: ACCOUNTING_TOKENS.REPOSITORIES.ACCOUNTING_JOURNAL,
    useClass: PrismaAccountingJournalRepository,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ACCOUNTING_PROVIDERS;
