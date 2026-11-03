// -----------------------------------------------------------------------------
// Financial Payment Method — Add Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../financial-payment-method.tokens';
import { FINANCIAL_ACCOUNT_TOKENS } from '../../application/financial-account.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { AddFinancialPaymentMethodCommand } from '../commands/add-financial-payment-method.command';

import { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';
import { FinancialPaymentMethodEntity } from '../../domain/entities/financial-payment-method.entity';

import { FinancialPaymentMethodException } from '../../domain/exceptions/financial-payment-method.exception';

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';
import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

@Injectable()
export class AddFinancialPaymentMethodHandler implements CommandHandler<
  AddFinancialPaymentMethodCommand,
  FinancialPaymentMethodAggregate
> {
  public constructor(
    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly financialAccountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY)
    private readonly financialPaymentMethodRepository: FinancialPaymentMethodRepository,
  ) {}

  public async execute(
    command: AddFinancialPaymentMethodCommand,
  ): Promise<FinancialPaymentMethodAggregate> {
    console.log('[ADD PAYMENT METHOD] START', {
      accountId: command.accountId.value,
      provider: command.provider,
      type: command.type,
      isDefault: command.isDefault,
    });

    // -------------------------------------------------------------------------
    // 1. Load owning Financial Account
    // -------------------------------------------------------------------------

    console.log('[ADD PAYMENT METHOD] STEP 1: Looking up account');

    const account = await this.financialAccountRepository.findByPublicId(
      command.accountId,
    );

    console.log('[ADD PAYMENT METHOD] STEP 1 RESULT', {
      accountFound: account !== null,
      accountInternalId: account?.id.toString(),
      accountPublicId: account?.publicId.value,
    });

    // -------------------------------------------------------------------------
    // 2. Ensure Financial Account exists
    // -------------------------------------------------------------------------

    if (account === null) {
      console.error('[ADD PAYMENT METHOD] FAILED: Account not found');

      throw new FinancialPaymentMethodException(
        `Financial Account "${command.accountId.value}" was not found`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Validate provider-reference uniqueness
    // -------------------------------------------------------------------------

    if (command.providerReference !== undefined) {
      console.log(
        '[ADD PAYMENT METHOD] STEP 2: Checking provider-reference uniqueness',
      );

      const existing =
        await this.financialPaymentMethodRepository.findByProviderAndProviderReference(
          command.provider,
          command.providerReference,
        );

      console.log('[ADD PAYMENT METHOD] STEP 2 RESULT', {
        existingMethodFound: existing !== null,
        existingMethodPublicId: existing?.publicId.value,
      });

      if (existing !== null) {
        console.error(
          '[ADD PAYMENT METHOD] FAILED: Provider reference already exists',
        );

        throw new FinancialPaymentMethodException(
          `Financial Payment Method with provider reference "${command.providerReference.value}" already exists`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // 4. Coordinate account-level default invariant
    // -------------------------------------------------------------------------

    if (command.isDefault === true) {
      console.log('[ADD PAYMENT METHOD] STEP 3: Looking for existing default', {
        accountPublicId: account.publicId.value,
      });

      const existingDefault =
        await this.financialPaymentMethodRepository.findDefaultByAccountPublicId(
          command.accountId,
        );

      console.log('[ADD PAYMENT METHOD] STEP 3 RESULT', {
        existingDefaultFound: existingDefault !== null,
        existingDefaultInternalId: existingDefault?.id.toString(),
        existingDefaultPublicId: existingDefault?.publicId.value,
        existingDefaultIsDefault: existingDefault?.isDefault,
      });

      if (existingDefault !== null) {
        console.log('[ADD PAYMENT METHOD] STEP 4: Clearing existing default', {
          internalId: existingDefault.id.toString(),
          publicId: existingDefault.publicId.value,
        });

        existingDefault.clearDefault();

        console.log(
          '[ADD PAYMENT METHOD] STEP 4 RESULT: Default cleared in domain',
          {
            internalId: existingDefault.id.toString(),
            publicId: existingDefault.publicId.value,
            isDefault: existingDefault.isDefault,
          },
        );

        console.log('[ADD PAYMENT METHOD] STEP 5: Saving existing default', {
          internalId: existingDefault.id.toString(),
          publicId: existingDefault.publicId.value,
        });

        await this.financialPaymentMethodRepository.save(existingDefault);

        console.log(
          '[ADD PAYMENT METHOD] STEP 5 SUCCESS: Existing default saved',
        );
      } else {
        console.log(
          '[ADD PAYMENT METHOD] No existing default found; continuing',
        );
      }
    }

    // -------------------------------------------------------------------------
    // 5. Create Financial Payment Method Entity
    // -------------------------------------------------------------------------

    console.log('[ADD PAYMENT METHOD] STEP 6: Creating payment method entity');

    const paymentMethod = FinancialPaymentMethodEntity.create(
      account.id,
      account.publicId,
      command.type,
      command.provider,
      command.providerReference,
      command.displayName,
      command.lastFour,
      command.isDefault ?? false,
      command.phoneNumber,
    );

    // -------------------------------------------------------------------------
    // 6. Create Financial Payment Method Aggregate
    // -------------------------------------------------------------------------

    const aggregate = FinancialPaymentMethodAggregate.create(paymentMethod);

    console.log('[ADD PAYMENT METHOD] STEP 6 RESULT', {
      internalId: aggregate.id.toString(),
      publicId: aggregate.publicId.value,
      isDefault: aggregate.isDefault,
    });

    // -------------------------------------------------------------------------
    // 7. Record creation domain event
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 8. Persist new aggregate
    // -------------------------------------------------------------------------
    await this.financialPaymentMethodRepository.create(aggregate);

    // -------------------------------------------------------------------------
    // 9. Return created aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

export default AddFinancialPaymentMethodHandler;
