/**
 * Financial Payment C2B Callback — Prisma Repository
 *
 * Persistence implementation for Financial Payment C2B Callback records.
 *
 * Responsibilities:
 *
 * - Persist C2B callbacks idempotently.
 * - Retrieve callbacks by provider and TransID.
 * - Retrieve pending callbacks by provider and BillRefNumber.
 * - Mark callbacks as processed.
 * - Mark callbacks as failed.
 * - Preserve the original callback payload.
 *
 * Transaction ownership remains with PrismaUnitOfWork.
 */

import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

import type {
  FinancialPaymentC2BCallbackRepository,
  FinancialPaymentC2BCallbackRecord,
  CreateFinancialPaymentC2BCallbackInput,
} from '../../../../domain/repositories/financial-payment-c2b-callback.repository';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaFinancialPaymentC2BCallbackRepository implements FinancialPaymentC2BCallbackRepository {
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
    input: CreateFinancialPaymentC2BCallbackInput,
  ): Promise<FinancialPaymentC2BCallbackRecord> {
    const provider = input.provider.trim();
    const transId = input.transId.trim();
    const billRefNumber = input.billRefNumber?.trim() || null;
    const businessShortCode = input.businessShortCode.trim();
    const msisdn = input.msisdn?.trim() || null;

    if (!provider || !transId || !businessShortCode) {
      throw new Error(
        'Provider and M-PESA C2B transaction identifiers are required.',
      );
    }

    if (!Number.isFinite(input.transAmount) || input.transAmount <= 0) {
      throw new Error('M-PESA C2B transaction amount must be positive.');
    }

    const record = await this.prisma.financialPaymentC2BCallback.upsert({
      where: {
        provider_transId: {
          provider,
          transId,
        },
      },

      // Never overwrite an existing callback or its original payload.
      update: {},

      create: {
        provider,
        transId,
        billRefNumber,
        businessShortCode,
        transTime: input.transTime?.trim() || null,
        transAmount: new Prisma.Decimal(input.transAmount),
        msisdn,
        payload: input.payload as Prisma.InputJsonValue,
        status: 'PENDING',
      },
    });

    return this.toRecord(record);
  }

  // ===========================================================================
  // Find By Provider And Transaction ID
  // ===========================================================================

  public async findByProviderTransId(
    provider: string,
    transId: string,
  ): Promise<FinancialPaymentC2BCallbackRecord | null> {
    const normalizedProvider = provider.trim();
    const normalizedTransId = transId.trim();

    if (!normalizedProvider || !normalizedTransId) {
      throw new Error('Provider and TransID must not be empty.');
    }

    const record = await this.prisma.financialPaymentC2BCallback.findUnique({
      where: {
        provider_transId: {
          provider: normalizedProvider,
          transId: normalizedTransId,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return this.toRecord(record);
  }

  // ===========================================================================
  // Find Pending By Provider And BillRefNumber
  // ===========================================================================

  public async findPendingByProviderAndBillRefNumber(
    provider: string,
    billRefNumber: string,
  ): Promise<FinancialPaymentC2BCallbackRecord[]> {
    const normalizedProvider = provider.trim();
    const normalizedBillRefNumber = billRefNumber.trim();

    if (!normalizedProvider || !normalizedBillRefNumber) {
      throw new Error('Provider and BillRefNumber must not be empty.');
    }

    const records = await this.prisma.financialPaymentC2BCallback.findMany({
      where: {
        provider: normalizedProvider,
        billRefNumber: normalizedBillRefNumber,
        status: 'PENDING',
      },

      // Deterministic reconciliation order.
      orderBy: [{ receivedAt: 'asc' }, { id: 'asc' }],
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

    await this.prisma.financialPaymentC2BCallback.update({
      where: {
        id: normalizedCallbackId,
      },

      data: {
        attemptId: normalizedAttemptId,
        status: 'PROCESSED',
        processedAt,
      },
    });
  }

  // ===========================================================================
  // Mark Failed
  // ===========================================================================

  public async markFailed(callbackId: string): Promise<void> {
    const normalizedCallbackId = callbackId.trim();

    if (!normalizedCallbackId) {
      throw new Error('Callback ID is required.');
    }

    await this.prisma.financialPaymentC2BCallback.update({
      where: {
        id: normalizedCallbackId,
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
    transId: string;
    billRefNumber: string | null;
    businessShortCode: string;
    transTime: string | null;
    transAmount: Prisma.Decimal;
    msisdn: string | null;
    attemptId: string | null;
    payload: Prisma.JsonValue;
    status: string;
    receivedAt: Date;
    processedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): FinancialPaymentC2BCallbackRecord {
    return {
      id: record.id,
      publicId: record.publicId,
      provider: record.provider,
      transId: record.transId,
      billRefNumber: record.billRefNumber,
      businessShortCode: record.businessShortCode,
      transTime: record.transTime,
      transAmount: record.transAmount.toNumber(),
      msisdn: record.msisdn,
      attemptId: record.attemptId,
      payload: record.payload,
      status: record.status as FinancialPaymentC2BCallbackRecord['status'],
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

export default PrismaFinancialPaymentC2BCallbackRepository;
