// -----------------------------------------------------------------------------
// Platform Financial Accounts Provisioner
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Ensure required system-owned Financial Accounts exist at application
//   startup.
// - Keep provisioning independent from development/test seed data.
// - Create accounts through the FinancialAccountAggregate creation boundary.
// - Never reset or modify existing balances.
// - Fail fast if an existing system account has an unexpected configuration.
//
// Operational account responsibilities:
// - SYSTEM-PLATFORM: General platform operations.
// - SYSTEM-HOLDING: Funds held by the platform.
// - SYSTEM-SETTLEMENT: Settlement operations.
// - SYSTEM-MPESA-CLEARING: Incoming M-PESA collection and wallet-funding flow.
// - SYSTEM-MPESA-DISBURSEMENT: Outgoing M-PESA B2C disbursement flow.
//
// This is application-level bootstrap orchestration.
// It does NOT contain financial transaction or balance logic.
// -----------------------------------------------------------------------------

import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Financial Account Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import { FinancialAccountAggregate } from '../../domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Domain — Repositories
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialAccountOwnerPublicId,
  FinancialAccountType,
} from '../../domain/value-objects';

@Injectable()
export class PlatformFinancialAccountsProvisioner implements OnApplicationBootstrap {
  private readonly logger = new Logger(
    PlatformFinancialAccountsProvisioner.name,
  );

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly financialAccountRepository: FinancialAccountRepository,
  ) {}

  // ===========================================================================
  // Application Bootstrap
  // ===========================================================================

  public async onApplicationBootstrap(): Promise<void> {
    await this.ensureSystemAccount({
      ownerPublicId: 'SYSTEM-PLATFORM',
      type: 'PLATFORM',
      label: 'platform',
    });

    await this.ensureSystemAccount({
      ownerPublicId: 'SYSTEM-HOLDING',
      type: 'HOLDING',
      label: 'holding',
    });

    await this.ensureSystemAccount({
      ownerPublicId: 'SYSTEM-SETTLEMENT',
      type: 'SETTLEMENT',
      label: 'settlement',
    });

    // Incoming M-PESA collections and wallet funding.
    await this.ensureSystemAccount({
      ownerPublicId: 'SYSTEM-MPESA-CLEARING',
      type: 'PLATFORM',
      label: 'mpesa clearing',
    });

    // Outgoing M-PESA B2C business payouts.
    await this.ensureSystemAccount({
      ownerPublicId: 'SYSTEM-MPESA-DISBURSEMENT',
      type: 'PLATFORM',
      label: 'mpesa disbursement',
    });

    this.logger.log('Required platform financial accounts are available.');
  }

  // ===========================================================================
  // Ensure Account
  // ===========================================================================

  private async ensureSystemAccount(props: {
    ownerPublicId: string;
    type: 'PLATFORM' | 'HOLDING' | 'SETTLEMENT';
    label: string;
  }): Promise<void> {
    const ownerPublicId = FinancialAccountOwnerPublicId.create(
      props.ownerPublicId,
    );

    const type = FinancialAccountType.create(props.type);
    const currency = Currency.create('KES');

    // -------------------------------------------------------------------------
    // Existing Account
    // -------------------------------------------------------------------------

    const existing =
      await this.financialAccountRepository.findByOwnerPublicId(ownerPublicId);

    if (existing !== null) {
      this.validateExistingAccount(
        existing,
        props.type,
        props.ownerPublicId,
        props.label,
      );

      this.logger.log(
        `System financial account "${props.label}" already exists ` +
          `(${existing.publicId.value}).`,
      );

      return;
    }

    // -------------------------------------------------------------------------
    // Create Account Through Domain Boundary
    // -------------------------------------------------------------------------

    const aggregate = FinancialAccountAggregate.create(
      {
        ownerPublicId,
        type,
        currency,
      },
      `SYSTEM_FINANCIAL_ACCOUNT_BOOTSTRAP_${props.type}`,
    );

    // -------------------------------------------------------------------------
    // Persist
    // -------------------------------------------------------------------------

    try {
      await this.financialAccountRepository.save(aggregate);
    } catch (error) {
      // -----------------------------------------------------------------------
      // Multi-instance Startup Race Protection
      // -----------------------------------------------------------------------

      const concurrent =
        await this.financialAccountRepository.findByOwnerPublicId(
          ownerPublicId,
        );

      if (concurrent !== null) {
        this.validateExistingAccount(
          concurrent,
          props.type,
          props.ownerPublicId,
          props.label,
        );

        this.logger.log(
          `System financial account "${props.label}" was created by ` +
            `another application instance.`,
        );

        return;
      }

      throw error;
    }

    this.logger.log(
      `Created system financial account "${props.label}" ` +
        `(${aggregate.publicId.value}).`,
    );
  }

  // ===========================================================================
  // Existing Account Validation
  // ===========================================================================

  private validateExistingAccount(
    account: FinancialAccountAggregate,
    expectedType: 'PLATFORM' | 'HOLDING' | 'SETTLEMENT',
    expectedOwnerPublicId: string,
    label: string,
  ): void {
    if (account.ownerPublicId?.value !== expectedOwnerPublicId) {
      throw new Error(
        `System financial account "${label}" has an unexpected owner.`,
      );
    }

    if (account.type.value !== expectedType) {
      throw new Error(
        `System financial account "${label}" has type ` +
          `"${account.type.value}" instead of "${expectedType}".`,
      );
    }

    if (account.currency.value !== 'KES') {
      throw new Error(
        `System financial account "${label}" has currency ` +
          `"${account.currency.value}" instead of "KES".`,
      );
    }

    if (!account.isActive()) {
      throw new Error(
        `System financial account "${label}" exists but is not ACTIVE.`,
      );
    }
  }
}
