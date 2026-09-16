// -----------------------------------------------------------------------------
// Infrastructure — Prisma Unit of Work
// -----------------------------------------------------------------------------
//
// Provides the infrastructure implementation of the Foundation UnitOfWork.
//
// Responsibilities:
//
// - establish a Prisma transaction;
// - establish the transaction-scoped Prisma client in the current execution
//   context;
// - execute application work inside that transaction;
// - commit when the work succeeds;
// - rollback when the work throws.
//
// This class contains infrastructure concerns only.
//
// It does NOT:
// - contain domain logic;
// - contain application business rules;
// - publish domain events directly;
// - expose Prisma to the domain layer.
//
// -----------------------------------------------------------------------------
//
// Transaction flow:
//
//     UnitOfWork.execute()
//             │
//             ▼
//     prisma.$transaction()
//             │
//             │ tx
//             ▼
//     PrismaTransactionContext.run(tx)
//             │
//             ▼
//     application work
//             │
//       ┌─────┼─────────────────────┐
//       ▼     ▼                     ▼
//   Identity Verification ... Authentication
//       │     │                     │
//       └─────┴─────────────────────┘
//             │
//             ▼
//          commit
//
// If any operation throws, Prisma rolls the entire transaction back.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// Repositories must resolve their Prisma client through
// PrismaTransactionContext.
//
// Merely wrapping the handler in `$transaction()` is insufficient if a
// repository continues writing through the root PrismaService.
//
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { PrismaTransactionContext } from '../database/prisma/prisma-transaction.context';

import type { UnitOfWork } from '../../foundation/persistence/unit-of-work.interface';

// =============================================================================
// Prisma Unit of Work
// =============================================================================

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    private readonly prisma: PrismaService,
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // Executes the supplied application work inside a Prisma transaction.
  //
  // Prisma automatically:
  //
  // - commits when `work` resolves successfully;
  // - rolls back when `work` throws.
  //
  // The transaction-scoped client is registered in the transaction context
  // before application work begins.
  //
  // ---------------------------------------------------------------------------

  public async execute<T>(work: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return this.transactionContext.run(tx, work);
    });
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaUnitOfWork;
