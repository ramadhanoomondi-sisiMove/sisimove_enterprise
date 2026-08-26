import type {
  FinancialAccount as PrismaFinancialAccount,
  FinancialAccountWithdrawal as PrismaFinancialAccountWithdrawal,
  FinancialAccountWithdrawalStatus as PrismaFinancialAccountWithdrawalStatus,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import { FinancialAccountWithdrawalAggregate } from '../../../../domain/aggregates/financial-account-withdrawal.aggregate';

import { FinancialAccountWithdrawalEntity } from '../../../../domain/entities/financial-account-withdrawal.entity';

import {
  Currency,
  FinancialAccountPublicId,
  FinancialAccountWithdrawalDestination,
  FinancialAccountWithdrawalPublicId,
  FinancialAccountWithdrawalStatus,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../../../../domain/value-objects';

import { FinancialAccountWithdrawalStatusValue } from '../../../../domain/value-objects';

function toDomainWithdrawalStatus(
  value: PrismaFinancialAccountWithdrawalStatus,
): FinancialAccountWithdrawalStatusValue {
  switch (value) {
    case 'PENDING':
      return FinancialAccountWithdrawalStatusValue.PENDING;

    case 'PROCESSING':
      return FinancialAccountWithdrawalStatusValue.PROCESSING;

    case 'COMPLETED':
      return FinancialAccountWithdrawalStatusValue.COMPLETED;

    case 'FAILED':
      return FinancialAccountWithdrawalStatusValue.FAILED;

    case 'CANCELLED':
      return FinancialAccountWithdrawalStatusValue.CANCELLED;

    default:
      throw new Error(
        `Invalid persisted Financial Account Withdrawal status "${String(value)}".`,
      );
  }
}

export type FinancialAccountWithdrawalWithRelations =
  PrismaFinancialAccountWithdrawal & {
    account?: PrismaFinancialAccount | null;
  };

export interface FinancialAccountWithdrawalPersistence {
  withdrawal: ReturnType<
    typeof FinancialAccountWithdrawalPrismaMapper.toPersistence
  >;
}

export class FinancialAccountWithdrawalPrismaMapper {
  public static toDomain(
    record: FinancialAccountWithdrawalWithRelations,
  ): FinancialAccountWithdrawalAggregate {
    const entity = this.toEntity(record);

    return FinancialAccountWithdrawalAggregate.rehydrate(entity);
  }

  public static toEntity(
    record: FinancialAccountWithdrawalWithRelations,
  ): FinancialAccountWithdrawalEntity {
    const account = this.resolveAccount(
      record.accountId,
      record.account,
      record.publicId,
    );

    const publicId = new FinancialAccountWithdrawalPublicId(record.publicId);

    const currency = Currency.create(record.currency);

    const amount = Money.create(record.amount, currency);

    const status = FinancialAccountWithdrawalStatus.create(
      toDomainWithdrawalStatus(record.status),
    );

    const destination = FinancialAccountWithdrawalDestination.create(
      String(record.destinationType),
      record.destinationValue,
    );

    const referenceType =
      record.referenceType !== null
        ? FinancialReferenceType.create(record.referenceType)
        : undefined;

    const referencePublicId =
      record.referencePublicId !== null
        ? FinancialReferencePublicId.create(record.referencePublicId)
        : undefined;

    return FinancialAccountWithdrawalEntity.rehydrate(
      {
        accountId: new UniqueEntityId(account.id),

        accountPublicId: new FinancialAccountPublicId(account.publicId),

        amount,

        destination,

        referenceType,

        referencePublicId,

        status,

        disbursementPublicId:
          record.disbursementPublicId !== null
            ? record.disbursementPublicId
            : undefined,

        requestedAt: record.requestedAt,

        completedAt:
          record.completedAt !== null ? record.completedAt : undefined,

        failedAt: record.failedAt !== null ? record.failedAt : undefined,

        cancelledAt:
          record.cancelledAt !== null ? record.cancelledAt : undefined,

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  public static toPersistence(entity: FinancialAccountWithdrawalEntity): {
    id: string;
    publicId: string;
    accountId: string;
    amount: number;
    currency: string;
    status: PrismaFinancialAccountWithdrawalStatus;
    destinationType: string;
    destinationValue: string;
    disbursementPublicId: string | null;
    referenceType: string | null;
    referencePublicId: string | null;
    requestedAt: Date;
    completedAt: Date | null;
    failedAt: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      accountId: entity.accountId.toString(),

      amount: entity.amountValue,

      currency: entity.currency,

      status: entity.status.value,

      destinationType: entity.destinationType,

      destinationValue: entity.destinationValue,

      disbursementPublicId: entity.disbursementPublicId ?? null,

      referenceType: entity.referenceType?.value ?? null,

      referencePublicId: entity.referencePublicId?.value ?? null,

      requestedAt: entity.requestedAt,

      completedAt: entity.completedAt ?? null,

      failedAt: entity.failedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  public static aggregateToPersistence(
    aggregate: FinancialAccountWithdrawalAggregate,
  ): FinancialAccountWithdrawalPersistence {
    return {
      withdrawal: this.toPersistence(aggregate.withdrawal),
    };
  }

  public static toDomainComponent(
    record: PrismaFinancialAccountWithdrawal,
    account: PrismaFinancialAccount,
  ): FinancialAccountWithdrawalEntity {
    return this.toEntity({
      ...record,
      account,
    });
  }

  private static resolveAccount(
    accountId: string,
    account: PrismaFinancialAccount | null | undefined,
    withdrawalPublicId: string,
  ): PrismaFinancialAccount {
    if (account === undefined || account === null) {
      throw new Error(
        `Financial Account Withdrawal "${withdrawalPublicId}" cannot be ` +
          `rehydrated without its Financial Account relation.`,
      );
    }

    if (account.id !== accountId) {
      throw new Error(
        `Financial Account Withdrawal "${withdrawalPublicId}" contains ` +
          `an inconsistent Financial Account relation.`,
      );
    }

    return account;
  }
}

export default FinancialAccountWithdrawalPrismaMapper;
