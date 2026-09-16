// -----------------------------------------------------------------------------
// sisiMove — Prisma Infrastructure Module
// -----------------------------------------------------------------------------
//
// Infrastructure composition root for Prisma-backed persistence.
//
// Responsibilities:
//
// - provide the root PrismaService;
// - provide the transaction execution context;
// - provide the Prisma UnitOfWork implementation;
// - bind the Foundation UnitOfWork port to PrismaUnitOfWork.
//
// Architectural boundary:
//
//     Application
//         │
//         │ depends on
//         ▼
//     UnitOfWork interface
//         ▲
//         │ implemented by
//         │
//     PrismaUnitOfWork
//         │
//         ├── PrismaService
//         └── PrismaTransactionContext
//
// The application layer never imports PrismaUnitOfWork.
//
// -----------------------------------------------------------------------------

import { Global, Module } from '@nestjs/common';

import { UNIT_OF_WORK } from '../../../foundation/persistence/unit-of-work.token';

import { PrismaUnitOfWork } from '../../persistence/prisma-unit-of-work';

import { PrismaTransactionContext } from './prisma-transaction.context';
import { PrismaService } from './prisma.service';

// =============================================================================
// Prisma Module
// =============================================================================

@Global()
@Module({
  providers: [
    // -------------------------------------------------------------------------
    // Prisma infrastructure
    // -------------------------------------------------------------------------

    PrismaService,

    PrismaTransactionContext,

    PrismaUnitOfWork,

    // -------------------------------------------------------------------------
    // Foundation UnitOfWork port
    // -------------------------------------------------------------------------
    //
    // Application services request UNIT_OF_WORK.
    //
    // Infrastructure supplies PrismaUnitOfWork.
    //
    // -------------------------------------------------------------------------

    {
      provide: UNIT_OF_WORK,
      useExisting: PrismaUnitOfWork,
    },
  ],

  exports: [
    PrismaService,
    PrismaTransactionContext,
    PrismaUnitOfWork,
    UNIT_OF_WORK,
  ],
})
export class PrismaModule {}
