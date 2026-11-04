// -----------------------------------------------------------------------------
// Financial Payment Prisma Mapper
// -----------------------------------------------------------------------------

import type {
  FinancialAccount as PrismaFinancialAccount,
  FinancialPayment as PrismaFinancialPayment,
  FinancialPaymentAttempt as PrismaFinancialPaymentAttempt,
  FinancialPaymentAttemptStatus as PrismaFinancialPaymentAttemptStatus,
  FinancialPaymentMethod as PrismaFinancialPaymentMethod,
  FinancialPaymentStatus as PrismaFinancialPaymentStatus,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import { FinancialPaymentAggregate } from '../../../../domain/aggregates/financial-payment.aggregate';

import { FinancialPaymentEntity } from '../../../../domain/entities/financial-payment.entity';

import { FinancialPaymentAttemptEntity } from '../../../../domain/entities/financial-payment-attempt.entity';

import {
  Currency,
  FinancialAccountPublicId,
  FinancialPaymentAttemptPublicId,
  FinancialPaymentMethodPublicId,
  FinancialPaymentPublicId,
  FinancialPaymentStatus,
  FinancialPaymentAttemptStatus,
  FinancialProvider,
  FinancialProviderReference,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../../../domain/value-objects';

import type { FinancialPaymentAttemptStatusValue } from '../../../../domain/value-objects';

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

function toDomainPaymentAttemptStatus(
  value: PrismaFinancialPaymentAttemptStatus,
): FinancialPaymentAttemptStatusValue {
  switch (value) {
    case 'PENDING':
      return 'PENDING';

    case 'PROCESSING':
      return 'PROCESSING';

    case 'SUCCEEDED':
      return 'SUCCEEDED';

    case 'FAILED':
      return 'FAILED';

    case 'CANCELLED':
      return 'CANCELLED';

    case 'EXPIRED':
      return 'EXPIRED';

    default:
      throw new Error(
        `Invalid persisted Financial Payment Attempt status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma → Domain Payment Status
// =============================================================================

function toDomainPaymentStatus(
  value: PrismaFinancialPaymentStatus,
): FinancialPaymentStatus {
  switch (value) {
    case 'PENDING':
      return FinancialPaymentStatus.create('PENDING');

    case 'PROCESSING':
      return FinancialPaymentStatus.create('PROCESSING');

    case 'SUCCEEDED':
      return FinancialPaymentStatus.create('SUCCEEDED');

    case 'FAILED':
      return FinancialPaymentStatus.create('FAILED');

    case 'CANCELLED':
      return FinancialPaymentStatus.create('CANCELLED');

    case 'EXPIRED':
      return FinancialPaymentStatus.create('EXPIRED');

    default:
      throw new Error(
        `Invalid persisted Financial Payment status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Prisma Graph Types
// =============================================================================

export type FinancialPaymentWithRelations = PrismaFinancialPayment & {
  account: PrismaFinancialAccount | null;
  method: PrismaFinancialPaymentMethod | null;
  attempts: PrismaFinancialPaymentAttempt[];
};

// =============================================================================
// Persistence Types
// =============================================================================

export interface FinancialPaymentPersistence {
  payment: ReturnType<typeof FinancialPaymentPrismaMapper.toPersistence>;

  attempts: ReturnType<
    typeof FinancialPaymentPrismaMapper.attemptToPersistence
  >[];
}

// =============================================================================
// Mapper
// =============================================================================

export class FinancialPaymentPrismaMapper {
  // ===========================================================================
  // Prisma → Aggregate
  // ===========================================================================

  public static toDomain(
    record: FinancialPaymentWithRelations,
  ): FinancialPaymentAggregate {
    const payment = this.toEntity(record);

    return FinancialPaymentAggregate.rehydrate(payment);
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  public static toEntity(
    record: FinancialPaymentWithRelations,
  ): FinancialPaymentEntity {
    const account = this.resolveAccount(
      record.accountId,
      record.account,
      record.publicId,
    );

    const publicId = new FinancialPaymentPublicId(record.publicId);

    const amount = Money.create(
      record.amount,
      Currency.create(record.currency),
    );

    const status = toDomainPaymentStatus(record.status);

    const methodId =
      record.methodId !== null
        ? this.resolvePaymentMethodPublicId(
            record.methodId,
            record.method,
            record.publicId,
          )
        : undefined;

    const reference = this.resolveReference(
      record.referenceType,
      record.referencePublicId,
      record.publicId,
    );

    const attempts = record.attempts.map((attempt) =>
      this.attemptToEntity(attempt),
    );

    return new FinancialPaymentEntity(
      {
        accountId: new FinancialAccountPublicId(account.publicId),

        amount,

        status,

        methodId,

        attempts,

        transactionPublicId: record.transactionPublicId ?? undefined,

        referenceType: reference.referenceType,

        referencePublicId: reference.referencePublicId,

        initiatedAt: record.initiatedAt,

        completedAt: record.completedAt ?? undefined,

        failedAt: record.failedAt ?? undefined,

        cancelledAt: record.cancelledAt ?? undefined,

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Prisma → Payment Attempt Entity
  // ===========================================================================

  public static attemptToEntity(
    record: PrismaFinancialPaymentAttempt,
  ): FinancialPaymentAttemptEntity {
    const amount = Money.create(
      record.amount,
      Currency.create(record.currency),
    );

    const status = FinancialPaymentAttemptStatus.create(
      toDomainPaymentAttemptStatus(record.status),
    );

    const provider = FinancialProvider.create(record.provider);

    const providerReference =
      record.providerReference !== null
        ? FinancialProviderReference.create(record.providerReference)
        : undefined;

    // Preserve the Safaricom MerchantRequestID independently from
    // the CheckoutRequestID stored in providerReference.
    const merchantRequestId = record.merchantRequestId ?? undefined;

    return new FinancialPaymentAttemptEntity(
      {
        paymentId: new UniqueEntityId(record.paymentId),

        status,

        provider,

        providerReference,

        merchantRequestId,

        amount,

        failureCode: record.failureCode ?? undefined,

        failureMessage: record.failureMessage ?? undefined,

        startedAt: record.startedAt ?? undefined,

        completedAt: record.completedAt ?? undefined,

        failedAt: record.failedAt ?? undefined,

        cancelledAt: undefined,

        expiredAt: undefined,

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      new FinancialPaymentAttemptPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma
  // ===========================================================================

  public static toPersistence(
    entity: FinancialPaymentEntity,
    accountId: string,
    methodId?: string,
  ): {
    id: string;
    publicId: string;
    accountId: string;
    amount: number;
    currency: string;
    status: PrismaFinancialPaymentStatus;
    methodId: string | null;
    transactionPublicId: string | null;
    referenceType: string | null;
    referencePublicId: string | null;
    initiatedAt: Date;
    completedAt: Date | null;
    failedAt: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      accountId,

      amount: entity.amount.amount,

      currency: entity.amount.currency.value,

      status: entity.status.value,

      methodId: methodId ?? null,

      transactionPublicId: entity.transactionPublicId ?? null,

      referenceType: entity.referenceType?.value ?? null,

      referencePublicId: entity.referencePublicId?.value ?? null,

      initiatedAt: entity.initiatedAt,

      completedAt: entity.completedAt ?? null,

      failedAt: entity.failedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Payment Attempt → Prisma
  // ===========================================================================

  public static attemptToPersistence(entity: FinancialPaymentAttemptEntity): {
    id: string;
    publicId: string;
    paymentId: string;
    status: PrismaFinancialPaymentAttemptStatus;
    provider: string;
    providerReference: string | null;
    merchantRequestId: string | null;
    amount: number;
    currency: string;
    failureCode: string | null;
    failureMessage: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    failedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      paymentId: entity.paymentId.toString(),

      status: entity.status.value,

      provider: entity.provider.value,

      // CheckoutRequestID
      providerReference: entity.providerReference?.value ?? null,

      // MerchantRequestID
      merchantRequestId: entity.merchantRequestId ?? null,

      amount: entity.amount.amount,

      currency: entity.amount.currency.value,

      failureCode: entity.failureCode ?? null,

      failureMessage: entity.failureMessage ?? null,

      startedAt: entity.startedAt ?? null,

      completedAt: entity.completedAt ?? null,

      failedAt: entity.failedAt ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  public static aggregateToPersistence(
    aggregate: FinancialPaymentAggregate,
    accountId: string,
    methodId?: string,
  ): FinancialPaymentPersistence {
    return {
      payment: this.toPersistence(aggregate.payment, accountId, methodId),

      attempts: aggregate.attempts.map((attempt) =>
        this.attemptToPersistence(attempt),
      ),
    };
  }

  // ===========================================================================
  // Prisma Component → Domain Entity
  // ===========================================================================

  public static toDomainComponent(
    record: PrismaFinancialPayment,
    account: PrismaFinancialAccount,
    attempts: PrismaFinancialPaymentAttempt[] = [],
    method?: PrismaFinancialPaymentMethod | null,
  ): FinancialPaymentEntity {
    return this.toEntity({
      ...record,
      account,
      method: method ?? null,
      attempts,
    });
  }

  // ===========================================================================
  // Owning Financial Account Resolution
  // ===========================================================================

  private static resolveAccount(
    accountId: string,
    account: PrismaFinancialAccount | null,
    paymentPublicId: string,
  ): PrismaFinancialAccount {
    if (account === null) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" cannot be rehydrated without its Financial Account relation.`,
      );
    }

    if (account.id !== accountId) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" contains an inconsistent Financial Account relation.`,
      );
    }

    return account;
  }

  // ===========================================================================
  // Payment Method Public Identity Resolution
  // ===========================================================================

  private static resolvePaymentMethodPublicId(
    methodId: string,
    method: PrismaFinancialPaymentMethod | null,
    paymentPublicId: string,
  ): FinancialPaymentMethodPublicId {
    if (method === null) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" contains payment method "${methodId}", but the FinancialPaymentMethod relation was not loaded.`,
      );
    }

    if (method.id !== methodId) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" contains an inconsistent Financial Payment Method relation.`,
      );
    }

    return new FinancialPaymentMethodPublicId(method.publicId);
  }

  // ===========================================================================
  // Business Reference Resolution
  // ===========================================================================

  private static resolveReference(
    referenceType: string | null,
    referencePublicId: string | null,
    paymentPublicId: string,
  ): {
    referenceType: FinancialReferenceType | undefined;
    referencePublicId: FinancialReferencePublicId | undefined;
  } {
    const hasType = referenceType !== null;

    const hasPublicId = referencePublicId !== null;

    if (!hasType && !hasPublicId) {
      return {
        referenceType: undefined,
        referencePublicId: undefined,
      };
    }

    if (!hasType || !hasPublicId) {
      throw new Error(
        `Financial Payment "${paymentPublicId}" contains an incomplete business reference.`,
      );
    }

    return {
      referenceType: FinancialReferenceType.create(referenceType),

      referencePublicId: FinancialReferencePublicId.create(referencePublicId),
    };
  }
}
