import { Injectable } from '@nestjs/common';

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

import type {
  FinancialPaymentProviderConfigurationPort,
  FinancialPaymentProviderConfigurationData,
  StoredFinancialPaymentProviderConfiguration,
} from '../../../../application/ports/financial-payment-provider-configuration.port';

import { FinancialPaymentProviderEnvironment } from '../../../../domain/value-objects/financial-payment-provider-environment.vo';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaFinancialPaymentProviderConfigurationRepository implements FinancialPaymentProviderConfigurationPort {
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  // ===========================================================================
  // Transaction-Aware Prisma Client
  // ===========================================================================

  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Save Configuration
  // ===========================================================================

  public async save(
    configuration: FinancialPaymentProviderConfigurationData,
  ): Promise<string> {
    if (!configuration.providerId.trim()) {
      throw new Error('Financial Payment Provider ID is required.');
    }

    if (!configuration.encryptedPayload.trim()) {
      throw new Error('Encrypted provider configuration is required.');
    }

    const record =
      await this.prisma.financialPaymentProviderConfiguration.upsert({
        where: {
          providerId_environment: {
            providerId: configuration.providerId,
            environment: configuration.environment.value,
          },
        },
        create: {
          providerId: configuration.providerId,
          environment: configuration.environment.value,
          encryptedPayload: configuration.encryptedPayload,
        },
        update: {
          encryptedPayload: configuration.encryptedPayload,
        },
        select: {
          reference: true,
        },
      });

    return record.reference;
  }

  // ===========================================================================
  // Find Configuration
  // ===========================================================================

  public async findByProviderAndEnvironment(
    providerId: string,
    environment: FinancialPaymentProviderEnvironment,
  ): Promise<StoredFinancialPaymentProviderConfiguration | null> {
    const normalizedProviderId = providerId.trim();

    if (!normalizedProviderId) {
      throw new Error('Financial Payment Provider ID is required.');
    }

    const record =
      await this.prisma.financialPaymentProviderConfiguration.findUnique({
        where: {
          providerId_environment: {
            providerId: normalizedProviderId,
            environment: environment.value,
          },
        },
        select: {
          reference: true,
          providerId: true,
          environment: true,
          encryptedPayload: true,
        },
      });

    if (record === null) {
      return null;
    }

    return {
      reference: record.reference,
      providerId: record.providerId,
      environment: FinancialPaymentProviderEnvironment.create(
        record.environment,
      ),
      encryptedPayload: record.encryptedPayload,
    };
  }
}

export default PrismaFinancialPaymentProviderConfigurationRepository;
