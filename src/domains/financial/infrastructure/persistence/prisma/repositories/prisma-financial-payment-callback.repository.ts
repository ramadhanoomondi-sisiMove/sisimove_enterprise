// -----------------------------------------------------------------------------
// Financial Payment Callback — Prisma Repository
// -----------------------------------------------------------------------------
//
// Persistence implementation for Financial Payment Callback records.
//
// Responsibilities:
//
// - Persist callbacks idempotently.
// - Retrieve callbacks by provider and CheckoutRequestID.
// - Retrieve pending callbacks in bounded, oldest-first batches.
// - Mark callbacks as processed.
// - Mark callbacks as failed.
// - Preserve the original callback payload.
//
// Transaction ownership remains with PrismaUnitOfWork.
//
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

import type {
  FinancialPaymentCallbackRepository,
  FinancialPaymentCallbackRecord,
  CreateFinancialPaymentCallbackInput,
} from '../../../../../financial-payment-providers/domain/repositories/financial-payment-callback.repository';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaFinancialPaymentCallbackRepository implements FinancialPaymentCallbackRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  // ===========================================================================
  // Ambient Prisma Client
  // ===========================================================================

  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Create If Not Exists
  // ===========================================================================

  public async createIfNotExists(
    input: CreateFinancialPaymentCallbackInput,
  ): Promise<FinancialPaymentCallbackRecord> {
    const provider = input.provider.trim();
    const merchantRequestId = input.merchantRequestId.trim();
    const checkoutRequestId = input.checkoutRequestId.trim();

    if (!provider || !merchantRequestId || !checkoutRequestId) {
      throw new Error(
        'Provider and M-PESA callback request identifiers are required.',
      );
    }

    const record = await this.prisma.financialPaymentCallback.upsert({
      where: {
        provider_checkoutRequestId: {
          provider,
          checkoutRequestId,
        },
      },

      // Preserve the first received callback, including its original payload.
      update: {},

      create: {
        provider,
        merchantRequestId,
        checkoutRequestId,
        resultCode: input.resultCode,
        resultDesc: input.resultDesc,
        payload: input.payload as Prisma.InputJsonValue,
        status: 'PENDING',
      },
    });

    return this.toRecord(record);
  }

  // ===========================================================================
  // Find By Provider And Checkout Request ID
  // ===========================================================================

  public async findByProviderCheckoutRequestId(
    provider: string,
    checkoutRequestId: string,
  ): Promise<FinancialPaymentCallbackRecord | null> {
    const normalizedProvider = provider.trim();
    const normalizedCheckoutRequestId = checkoutRequestId.trim();

    if (!normalizedProvider || !normalizedCheckoutRequestId) {
      throw new Error('Provider and CheckoutRequestID must not be empty.');
    }

    const record = await this.prisma.financialPaymentCallback.findUnique({
      where: {
        provider_checkoutRequestId: {
          provider: normalizedProvider,
          checkoutRequestId: normalizedCheckoutRequestId,
        },
      },
    });

    return record === null ? null : this.toRecord(record);
  }

  // ===========================================================================
  // Find Pending — Oldest First
  // ===========================================================================

  public async findPending(
    limit: number,
  ): Promise<FinancialPaymentCallbackRecord[]> {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error('Pending callback limit must be a positive integer.');
    }

    // Keep recovery batches bounded even if a caller supplies an excessive
    // value. The application service can request smaller batches as needed.
    const boundedLimit = Math.min(limit, 500);

    const records = await this.prisma.financialPaymentCallback.findMany({
      where: {
        status: 'PENDING',
      },
      orderBy: [{ receivedAt: 'asc' }, { id: 'asc' }],
      take: boundedLimit,
    });

    return records.map((record) => this.toRecord(record));
  }

  // ===========================================================================
  // Mark Processed
  // ===========================================================================

  public async markProcessed(
    callbackId: string,
    attemptId: string,
    processedAt: Date,
  ): Promise<void> {
    const normalizedCallbackId = callbackId.trim();
    const normalizedAttemptId = attemptId.trim();

    if (!normalizedCallbackId || !normalizedAttemptId) {
      throw new Error('Callback ID and Payment Attempt ID are required.');
    }

    const result = await this.prisma.financialPaymentCallback.updateMany({
      where: {
        id: normalizedCallbackId,
        status: 'PENDING',
      },
      data: {
        attemptId: normalizedAttemptId,
        status: 'PROCESSED',
        processedAt,
      },
    });

    if (result.count > 0) {
      return;
    }

    // Treat an identical retry as idempotent, but do not silently accept a
    // conflicting terminal state or a different attempt association.
    const existing = await this.prisma.financialPaymentCallback.findUnique({
      where: { id: normalizedCallbackId },
      select: {
        attemptId: true,
        status: true,
      },
    });

    if (
      existing?.status === 'PROCESSED' &&
      existing.attemptId === normalizedAttemptId
    ) {
      return;
    }

    throw new Error(
      `Callback ${normalizedCallbackId} could not be marked processed because it is missing or already terminal.`,
    );
  }

  // ===========================================================================
  // Mark Failed
  // ===========================================================================

  public async markFailed(callbackId: string): Promise<void> {
    const normalizedCallbackId = callbackId.trim();

    if (!normalizedCallbackId) {
      throw new Error('Callback ID is required.');
    }

    // Only a pending callback may transition to FAILED. Repeated failure
    // marking is harmless, and a processed callback is never downgraded.
    await this.prisma.financialPaymentCallback.updateMany({
      where: {
        id: normalizedCallbackId,
        status: 'PENDING',
      },
      data: {
        status: 'FAILED',
      },
    });
  }

  // ===========================================================================
  // Persistence Mapping
  // ===========================================================================

  private toRecord(record: {
    id: string;
    publicId: string;
    provider: string;
    merchantRequestId: string;
    checkoutRequestId: string;
    attemptId: string | null;
    resultCode: number;
    resultDesc: string;
    payload: Prisma.JsonValue;
    status: string;
    receivedAt: Date;
    processedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): FinancialPaymentCallbackRecord {
    return {
      id: record.id,
      publicId: record.publicId,
      provider: record.provider,
      merchantRequestId: record.merchantRequestId,
      checkoutRequestId: record.checkoutRequestId,
      attemptId: record.attemptId,
      resultCode: record.resultCode,
      resultDesc: record.resultDesc,
      payload: record.payload,
      status: record.status as FinancialPaymentCallbackRecord['status'],
      receivedAt: record.receivedAt,
      processedAt: record.processedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaFinancialPaymentCallbackRepository;
