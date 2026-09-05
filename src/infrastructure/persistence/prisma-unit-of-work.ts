// -----------------------------------------------------------------------------
// Infrastructure — Prisma Unit of Work
// -----------------------------------------------------------------------------
//
// Provides the infrastructure implementation of the Foundation UnitOfWork.
//
// Responsibilities:
//
// - establish a Prisma transaction;
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
// Important:
//
// Prisma's `$transaction()` provides a transaction-scoped Prisma client (`tx`).
//
// Repository implementations that participate in this Unit of Work must use
// that transaction-scoped client when performing database operations.
//
// Merely wrapping work in `$transaction()` is NOT enough if repositories
// continue using the root PrismaService internally.
//
// The repository/transaction integration is therefore an infrastructure
// concern and can be introduced without changing the Foundation contract.
//
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import type { UnitOfWork } from '../../foundation/persistence/unit-of-work.interface';

// =============================================================================
// Prisma Unit of Work
// =============================================================================

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(private readonly prisma: PrismaService) {}

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
  // ---------------------------------------------------------------------------

  public async execute<T>(work: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async () => {
      return work();
    });
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaUnitOfWork;
