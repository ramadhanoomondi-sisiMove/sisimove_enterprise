// -----------------------------------------------------------------------------
// Infrastructure — Prisma Transaction Context
// -----------------------------------------------------------------------------
//
// Provides access to the Prisma client associated with the current execution
// context.
//
// The context supports two modes:
//
// 1. No active UnitOfWork
//    → returns the application's root PrismaService.
//
// 2. Active UnitOfWork transaction
//    → returns Prisma's transaction-scoped client (`tx`).
//
// This is an infrastructure concern only.
//
// It MUST NOT be imported by:
// - domain code;
// - application commands;
// - application handlers;
// - application interfaces;
// - Foundation contracts.
//
// Repository implementations may use it because repositories are infrastructure
// adapters.
//
// -----------------------------------------------------------------------------
//
// Why AsyncLocalStorage?
//
// Prisma's `$transaction()` supplies a transaction-scoped client:
//
//     $transaction(async (tx) => { ... })
//
// But repositories are normally injected independently and do not receive
// `tx` as a method argument.
//
// AsyncLocalStorage allows the UnitOfWork to establish:
//
//     current execution
//             │
//             ▼
//     Prisma transaction client
//             │
//       ┌─────┼─────┐
//       ▼     ▼     ▼
//   Identity Verification Authentication ...
//
// Every repository participating in the same UnitOfWork therefore resolves
// the same transaction-scoped Prisma client.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// This context does NOT create transactions.
//
// PrismaUnitOfWork owns transaction creation.
//
// This class only makes the current Prisma client available to infrastructure
// adapters.
//
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Prisma } from '@prisma/client';

import { PrismaService } from './prisma.service';

// =============================================================================
// Transaction Client
// =============================================================================
//
// A repository may operate either:
//
// - against the root PrismaService when no UnitOfWork is active; or
// - against Prisma's transaction-scoped client when a UnitOfWork is active.
//
// =============================================================================

export type PrismaClientLike = PrismaService | Prisma.TransactionClient;

// =============================================================================
// Context Store
// =============================================================================

interface PrismaTransactionStore {
  readonly client: Prisma.TransactionClient;
}

// =============================================================================
// Prisma Transaction Context
// =============================================================================

@Injectable()
export class PrismaTransactionContext {
  private readonly storage = new AsyncLocalStorage<PrismaTransactionStore>();

  public constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Get Client
  // ---------------------------------------------------------------------------
  //
  // Returns the transaction-scoped client when execution is currently inside
  // a Prisma UnitOfWork transaction.
  //
  // Otherwise returns the root PrismaService.
  //
  // This means existing repository operations continue to work normally
  // outside an explicit UnitOfWork.
  //
  // ---------------------------------------------------------------------------

  public getClient(): PrismaClientLike {
    const store = this.storage.getStore();

    if (store !== undefined) {
      return store.client;
    }

    return this.prisma;
  }

  // ---------------------------------------------------------------------------
  // Run In Transaction
  // ---------------------------------------------------------------------------
  //
  // Establishes the Prisma transaction client as the current client for the
  // asynchronous execution tree.
  //
  // PrismaUnitOfWork is the only infrastructure component that should call
  // this method.
  //
  // ---------------------------------------------------------------------------

  public run<T>(
    client: Prisma.TransactionClient,
    work: () => Promise<T>,
  ): Promise<T> {
    return this.storage.run(
      {
        client,
      },
      work,
    );
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaTransactionContext;
