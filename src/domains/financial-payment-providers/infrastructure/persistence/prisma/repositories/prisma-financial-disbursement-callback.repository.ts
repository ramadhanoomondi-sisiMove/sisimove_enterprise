// -----------------------------------------------------------------------------
// Financial Disbursement Callback — Prisma Repository
// -----------------------------------------------------------------------------
//
// Persistence implementation for Financial Disbursement Callback records.
//
// Responsibilities:
//
// - Persist callbacks idempotently.
// - Retrieve callbacks by provider, OriginatorConversationID and callback type.
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
  FinancialDisbursementCallbackRepository,
  FinancialDisbursementCallbackRecord,
  CreateFinancialDisbursementCallbackInput,
} from '../../../../domain/repositories/financial-disbursement-callback.repository';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaFinancialDisbursementCallbackRepository implements FinancialDisbursementCallbackRepository {
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
    input: CreateFinancialDisbursementCallbackInput,
  ): Promise<FinancialDisbursementCallbackRecord> {
    const provider = input.provider.trim();
    const originatorConversationId = input.originatorConversationId.trim();

    if (!provider || !originatorConversationId) {
      throw new Error('Provider and OriginatorConversationID are required.');
    }

    const record = await this.prisma.financialDisbursementCallback.upsert({
      where: {
        provider_originatorConversationId_type: {
          provider,
          originatorConversationId,
          type: input.type,
        },
      },

      // Never overwrite an existing callback's original payload.
      update: {},

      create: {
        provider,
        type: input.type,
        originatorConversationId,
        conversationId: input.conversationId?.trim() || null,
        transactionId: input.transactionId?.trim() || null,
        resultCode: input.resultCode ?? null,
        resultDesc: input.resultDesc ?? null,
        payload: input.payload as Prisma.InputJsonValue,
        status: 'PENDING',
      },
    });

    return this.toRecord(record);
  }

  // ===========================================================================
  // Find By Provider, Originator Conversation ID And Type
  // ===========================================================================

  public async findByProviderOriginatorConversationId(
    provider: string,
    originatorConversationId: string,
    type: FinancialDisbursementCallbackRecord['type'],
  ): Promise<FinancialDisbursementCallbackRecord | null> {
    const normalizedProvider = provider.trim();
    const normalizedOriginatorConversationId = originatorConversationId.trim();

    if (!normalizedProvider || !normalizedOriginatorConversationId) {
      throw new Error(
        'Provider and OriginatorConversationID must not be empty.',
      );
    }

    const record = await this.prisma.financialDisbursementCallback.findUnique({
      where: {
        provider_originatorConversationId_type: {
          provider: normalizedProvider,
          originatorConversationId: normalizedOriginatorConversationId,
          type,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return this.toRecord(record);
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
      throw new Error('Callback ID and Disbursement Attempt ID are required.');
    }

    await this.prisma.financialDisbursementCallback.update({
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

    await this.prisma.financialDisbursementCallback.update({
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
    type: string;
    originatorConversationId: string;
    conversationId: string | null;
    transactionId: string | null;
    attemptId: string | null;
    resultCode: number | null;
    resultDesc: string | null;
    payload: Prisma.JsonValue;
    status: string;
    receivedAt: Date;
    processedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): FinancialDisbursementCallbackRecord {
    return {
      id: record.id,
      publicId: record.publicId,
      provider: record.provider,
      type: record.type as FinancialDisbursementCallbackRecord['type'],
      originatorConversationId: record.originatorConversationId,
      conversationId: record.conversationId,
      transactionId: record.transactionId,
      attemptId: record.attemptId,
      resultCode: record.resultCode,
      resultDesc: record.resultDesc,
      payload: record.payload,
      status: record.status as FinancialDisbursementCallbackRecord['status'],
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

export default PrismaFinancialDisbursementCallbackRepository;
