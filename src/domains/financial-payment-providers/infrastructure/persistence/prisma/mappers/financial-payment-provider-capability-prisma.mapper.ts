// -----------------------------------------------------------------------------
// Financial Payment Provider Capability Prisma Mapper
// -----------------------------------------------------------------------------

import type {
  FinancialPaymentProviderCapability as PrismaCapability,
  FinancialPaymentProviderCapabilityType as PrismaCapabilityType,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import { FinancialPaymentProviderCapabilityEntity } from '../../../../domain/entities/financial-payment-provider-capability.entity';

import {
  FinancialPaymentProviderCapabilityPublicId,
  FinancialPaymentProviderCapabilityType,
  FinancialPaymentProviderConfigurationReference,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma to Domain Enum
// -----------------------------------------------------------------------------

function toDomainCapabilityType(value: PrismaCapabilityType) {
  switch (value) {
    case 'INITIATE_PAYMENT':
    case 'VERIFY_PAYMENT':
    case 'QUERY_PAYMENT':
    case 'REFUND_PAYMENT':
    case 'INITIATE_DISBURSEMENT':
    case 'VERIFY_DISBURSEMENT':
    case 'QUERY_BALANCE':
    case 'WEBHOOKS':
      return FinancialPaymentProviderCapabilityType.create(value);
    default:
      throw new Error(
        `Invalid persisted payment provider capability type: ${String(value)}`,
      );
  }
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class FinancialPaymentProviderCapabilityPrismaMapper {
  // ===========================================================================
  // Prisma to Domain
  // ===========================================================================

  public static toDomain(
    record: PrismaCapability,
  ): FinancialPaymentProviderCapabilityEntity {
    return FinancialPaymentProviderCapabilityEntity.rehydrate(
      {
        providerId: new UniqueEntityId(record.providerId),
        type: toDomainCapabilityType(record.type),
        isSupported: record.isSupported,
        isEnabled: record.isEnabled,
        configurationReference:
          record.configurationReference === null
            ? undefined
            : FinancialPaymentProviderConfigurationReference.create(
                record.configurationReference,
              ),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      new UniqueEntityId(record.id),
      new FinancialPaymentProviderCapabilityPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Domain to Persistence
  // ===========================================================================

  public static toPersistence(
    entity: FinancialPaymentProviderCapabilityEntity,
  ): {
    id: string;
    publicId: string;
    providerId: string;
    type: PrismaCapabilityType;
    isSupported: boolean;
    isEnabled: boolean;
    configurationReference: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: entity.id.toString(),
      publicId: entity.publicId.value,
      providerId: entity.providerId.toString(),
      type: entity.type.value,
      isSupported: entity.isSupported,
      isEnabled: entity.isEnabled,
      configurationReference: entity.configurationReference?.value ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
