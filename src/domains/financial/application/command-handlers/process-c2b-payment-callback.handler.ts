/**
 * -----------------------------------------------------------------------------
 * Financial Payment — Process C2B Payment Callback Handler
 * -----------------------------------------------------------------------------
 *
 * FinancialModule owns:
 * - Callback receipt persistence.
 * - Provider transaction deduplication.
 * - Provider configuration matching.
 * - Financial Account resolution.
 * - Payment and attempt lifecycle.
 * - Domain event publication.
 *
 * MpesaModule owns callback validation and normalization only.
 *
 * This handler does NOT:
 * - Initiate STK Push.
 * - Call Safaricom APIs.
 * - Resolve accounts using payer MSISDN.
 * - Modify account balances.
 * - Create or post Financial Transactions.
 * - Perform accounting or settlement.
 *
 * -----------------------------------------------------------------------------
 */

import { Inject, Injectable, Logger } from '@nestjs/common';

// Application tokens
import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';
import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../financial-payment-providers/application/financial-payment-providers.tokens';

import { FINANCIAL_PAYMENT_C2B_CALLBACK_TOKENS } from '../../../financial-payment-providers/application/financial-payment-c2b-callback.tokens';

// Provider configuration
import { FinancialPaymentProviderConfigurationService } from '../../../financial-payment-providers/application/services/financial-payment-provider-configuration.service';

// Foundation
import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

// Repositories
import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import type { FinancialPaymentProviderRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import type { FinancialPaymentC2BCallbackRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-c2b-callback.repository';

// Aggregates and entities
import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

import { FinancialPaymentEntity } from '../../domain/entities/financial-payment.entity';

import { FinancialPaymentAttemptEntity } from '../../domain/entities/financial-payment-attempt.entity';

// Value objects
import { FinancialAccountPublicId } from '../../domain/value-objects/financial-account-public-id.vo';

import { FinancialProvider } from '../../domain/value-objects/financial-provider.vo';

import { FinancialProviderReference } from '../../domain/value-objects/financial-provider-reference.vo';

import { FinancialPaymentChannel } from '../../domain/value-objects/financial-payment-channel.vo';

import { Currency } from '../../domain/value-objects/currency.vo';

import { Money } from '../../domain/value-objects/money.vo';

import { FinancialPaymentProviderCode } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

// Shared integration contract
import type { C2BCallbackEvent } from '../../../../mpesa/c2b/c2b-callback.handler';

// =============================================================================
// Result
// =============================================================================

export interface ProcessC2BPaymentCallbackResult {
  readonly processed: boolean;
  readonly duplicate: boolean;
  readonly requiresReconciliation: boolean;
  readonly paymentPublicId?: string;
  readonly attemptPublicId?: string;
  readonly message: string;
}

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ProcessC2BPaymentCallbackHandler {
  private readonly logger = new Logger(ProcessC2BPaymentCallbackHandler.name);

  private readonly paymentProvider = FinancialProvider.create('MPESA');

  private readonly mpesaCode = FinancialPaymentProviderCode.create('MPESA');

  private readonly c2bChannel = FinancialPaymentChannel.create('C2B');

  private readonly kes = Currency.create('KES');

  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly paymentRepository: FinancialPaymentRepository,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly accountRepository: FinancialAccountRepository,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    @Inject(FINANCIAL_PAYMENT_C2B_CALLBACK_TOKENS.REPOSITORY)
    private readonly callbackRepository: FinancialPaymentC2BCallbackRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Process Normalized C2B Callback
  // ===========================================================================

  public async execute(
    callback: C2BCallbackEvent,
  ): Promise<ProcessC2BPaymentCallbackResult> {
    this.validateCallback(callback);

    const transactionId = callback.transactionId.trim();

    const providerReference = FinancialProviderReference.create(transactionId);

    const correlationId = `MPESA-C2B-${transactionId}`;

    const causationId = transactionId;

    const completedAt = this.parseTransactionTime(callback.transactionTime);

    // Convert provider decimal KES into Financial domain minor units.
    const amount = Money.create(this.toMinorUnits(callback.amount), this.kes);

    // -------------------------------------------------------------------------
    // 1. Persist callback receipt before attempting account matching.
    //
    // The database unique constraint on provider + TransID prevents
    // duplicate callback receipts.
    //
    // Unmatched callbacks remain available for reconciliation.
    // -------------------------------------------------------------------------

    const callbackRecord = await this.callbackRepository.createIfNotExists({
      provider: this.paymentProvider.value,
      transId: transactionId,
      billRefNumber: callback.billReference?.trim() || null,
      businessShortCode: callback.businessShortCode,
      transTime: callback.transactionTime,

      // Current repository contract declares this field as number.
      transAmount: Number(callback.amount),

      msisdn: callback.phoneNumber,

      payload: {
        provider: callback.provider,
        transactionType: callback.transactionType,
        transactionId,
        transactionTime: callback.transactionTime,
        amount: callback.amount,
        businessShortCode: callback.businessShortCode,
        phoneNumber: callback.phoneNumber,
        billReference: callback.billReference ?? null,
        invoiceNumber: callback.invoiceNumber ?? null,
        thirdPartyTransactionId: callback.thirdPartyTransactionId ?? null,
      },
    });

    if (callbackRecord.status === 'PROCESSED') {
      return {
        processed: false,
        duplicate: true,
        requiresReconciliation: false,
        message: 'C2B callback has already been processed.',
      };
    }

    // -------------------------------------------------------------------------
    // 2. Check whether this provider transaction already created a payment.
    //
    // If it did, close the callback receipt transactionally.
    // -------------------------------------------------------------------------

    const existingPayment =
      await this.paymentRepository.findByProviderReference(
        this.paymentProvider,
        providerReference,
      );

    if (existingPayment !== null) {
      const successfulAttempt = existingPayment.getSuccessfulAttempt();

      if (successfulAttempt === undefined) {
        return {
          processed: false,
          duplicate: true,
          requiresReconciliation: true,
          paymentPublicId: existingPayment.publicId.toString(),
          message:
            'A payment exists for this M-PESA transaction but has no ' +
            'successful attempt. Reconciliation is required.',
        };
      }

      await this.unitOfWork.execute(async () => {
        await this.callbackRepository.markProcessed(
          callbackRecord.id,
          successfulAttempt.id.toString(),
          new Date(),
        );
      });

      return {
        processed: false,
        duplicate: true,
        requiresReconciliation: false,
        paymentPublicId: existingPayment.publicId.toString(),
        attemptPublicId: successfulAttempt.publicId.toString(),
        message: 'M-PESA transaction was already recorded.',
      };
    }

    // -------------------------------------------------------------------------
    // 3. Validate configured M-PESA C2B provider.
    // -------------------------------------------------------------------------

    const providerConfiguration = await this.resolveMpesaConfiguration(
      callback.businessShortCode,
    );

    if (providerConfiguration === null) {
      return {
        processed: false,
        duplicate: false,
        requiresReconciliation: true,
        message:
          'The C2B shortcode does not match an operational M-PESA ' +
          'provider configuration. The callback has been retained.',
      };
    }

    // -------------------------------------------------------------------------
    // 4. Resolve receiving Financial Account.
    //
    // BillRefNumber is the account reference.
    // MSISDN is never used for account resolution.
    // -------------------------------------------------------------------------

    const billReference = callback.billReference?.trim();

    if (!billReference) {
      return {
        processed: false,
        duplicate: false,
        requiresReconciliation: true,
        message:
          'C2B callback has no Financial Account reference. ' +
          'The callback receipt has been retained for reconciliation.',
      };
    }

    let accountPublicId: FinancialAccountPublicId;

    try {
      accountPublicId = new FinancialAccountPublicId(billReference);
    } catch {
      return {
        processed: false,
        duplicate: false,
        requiresReconciliation: true,
        message:
          'The supplied Financial Account reference is invalid. ' +
          'The callback receipt has been retained for reconciliation.',
      };
    }

    const account =
      await this.accountRepository.findByPublicId(accountPublicId);

    if (account === null) {
      return {
        processed: false,
        duplicate: false,
        requiresReconciliation: true,
        message:
          'No Financial Account matches the supplied BillRefNumber. ' +
          'The callback receipt has been retained for reconciliation.',
      };
    }

    if (!account.canOperate()) {
      return {
        processed: false,
        duplicate: false,
        requiresReconciliation: true,
        message: 'The receiving Financial Account is not operational.',
      };
    }

    if (!account.currency.isKes()) {
      return {
        processed: false,
        duplicate: false,
        requiresReconciliation: true,
        message: 'The receiving Financial Account does not use KES.',
      };
    }

    // -------------------------------------------------------------------------
    // 5. Create payment, attempt, callback status and outbox events atomically.
    // -------------------------------------------------------------------------

    try {
      const result = await this.unitOfWork.execute(async () => {
        // Recheck inside the transaction to reduce duplicate processing risk.
        const paymentAlreadyCreated =
          await this.paymentRepository.findByProviderReference(
            this.paymentProvider,
            providerReference,
          );

        if (paymentAlreadyCreated !== null) {
          const successfulAttempt =
            paymentAlreadyCreated.getSuccessfulAttempt();

          if (successfulAttempt === undefined) {
            throw new Error(
              'Existing M-PESA payment has no successful attempt.',
            );
          }

          // Close the callback receipt in the same transaction.
          await this.callbackRepository.markProcessed(
            callbackRecord.id,
            successfulAttempt.id.toString(),
            new Date(),
          );

          return {
            duplicate: true,
            paymentPublicId: paymentAlreadyCreated.publicId.toString(),
            attemptPublicId: successfulAttempt.publicId.toString(),
          };
        }

        // Create Financial Payment.
        const paymentEntity = FinancialPaymentEntity.create(
          account.publicId,
          amount,
          this.c2bChannel,
        );

        const payment = FinancialPaymentAggregate.create(paymentEntity);

        payment.emitCreatedEvent(correlationId, causationId);

        // Start payment processing lifecycle.
        payment.startProcessing(completedAt, correlationId, causationId);

        // Create successful M-PESA provider attempt.
        const attempt = FinancialPaymentAttemptEntity.create(
          payment.id,
          this.paymentProvider,
          amount,
          providerReference,
        );

        attempt.start(completedAt);
        attempt.succeed(completedAt);

        payment.addAttempt(attempt, correlationId, causationId);

        // Mark payment as succeeded.
        payment.succeed(completedAt, correlationId, causationId);

        // Persist payment and its owned attempts.
        await this.paymentRepository.create(payment);

        // Persist domain events through transactional EventPublisher.
        //
        // EventPublisher must append StoredEvent and OutboxMessage
        // using the active UnitOfWork transaction.
        //
        // Do not replace this with an in-memory EventBus.
        const domainEvents = payment.pullDomainEvents();

        await this.eventPublisher.publishAll(domainEvents);

        // Mark callback processed in the same transaction.
        await this.callbackRepository.markProcessed(
          callbackRecord.id,
          attempt.id.toString(),
          new Date(),
        );

        return {
          duplicate: false,
          paymentPublicId: payment.publicId.toString(),
          attemptPublicId: attempt.publicId.toString(),
        };
      });

      return {
        processed: !result.duplicate,
        duplicate: result.duplicate,
        requiresReconciliation: false,
        paymentPublicId: result.paymentPublicId,
        attemptPublicId: result.attemptPublicId,
        message: result.duplicate
          ? 'M-PESA transaction has already been recorded.'
          : 'C2B payment successfully recorded.',
      };
    } catch (error) {
      this.logger.error(
        'Failed to process M-PESA C2B payment callback.',
        error instanceof Error ? error.stack : undefined,
      );

      // Keep the callback receipt available for retry/reconciliation.
      // Do not mark it PROCESSED when payment or event persistence fails.
      throw error;
    }
  }

  // ===========================================================================
  // Resolve M-PESA Provider Configuration
  // ===========================================================================

  private async resolveMpesaConfiguration(businessShortCode: string) {
    const provider = await this.providerRepository.findByCode(this.mpesaCode);

    if (provider === null) {
      return null;
    }

    if (!provider.isEnabled || !provider.status.isReady()) {
      return null;
    }

    const environment = provider.environment;

    if (environment === null) {
      return null;
    }

    const configuration = await this.configurationService.getConfiguration(
      provider.id.toString(),
      environment,
    );

    if (configuration === null) {
      return null;
    }

    const configuredShortcode = configuration.c2bShortcode?.trim();

    if (!configuredShortcode) {
      return null;
    }

    if (configuredShortcode !== businessShortCode) {
      return null;
    }

    const businessType = configuration.c2bBusinessType;

    if (businessType !== 'PAYBILL' && businessType !== 'BUY_GOODS') {
      return null;
    }

    return configuration;
  }

  // ===========================================================================
  // Validate Normalized Callback
  // ===========================================================================

  private validateCallback(callback: C2BCallbackEvent): void {
    if (!callback || callback.provider !== 'MPESA') {
      throw new Error('Unsupported C2B payment provider.');
    }

    if (
      typeof callback.transactionId !== 'string' ||
      !callback.transactionId.trim()
    ) {
      throw new Error('M-PESA transaction ID is required.');
    }

    if (
      typeof callback.transactionTime !== 'string' ||
      !/^\d{14}$/.test(callback.transactionTime)
    ) {
      throw new Error('M-PESA transaction time is invalid.');
    }

    if (
      typeof callback.amount !== 'string' ||
      !/^\d+(\.\d{1,2})?$/.test(callback.amount) ||
      !/[1-9]/.test(callback.amount)
    ) {
      throw new Error('M-PESA transaction amount is invalid.');
    }

    if (
      !Number.isFinite(Number(callback.amount)) ||
      Number(callback.amount) <= 0
    ) {
      throw new Error('M-PESA transaction amount is invalid.');
    }

    if (
      typeof callback.businessShortCode !== 'string' ||
      !/^\d+$/.test(callback.businessShortCode)
    ) {
      throw new Error('M-PESA business shortcode is invalid.');
    }

    if (
      typeof callback.phoneNumber !== 'string' ||
      !/^254(?:7|1)\d{8}$/.test(callback.phoneNumber)
    ) {
      throw new Error('M-PESA payer phone number is invalid.');
    }

    if (
      callback.billReference !== undefined &&
      typeof callback.billReference !== 'string'
    ) {
      throw new Error('M-PESA BillRefNumber is invalid.');
    }
  }

  // ===========================================================================
  // Convert Decimal KES to Minor Units
  // ===========================================================================

  private toMinorUnits(value: string): number {
    const normalized = value.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
      throw new Error('Invalid monetary amount.');
    }

    const [wholePart = '0', fractionalPart = ''] = normalized.split('.');

    // Use decimal-string arithmetic instead of floating-point multiplication.
    const whole = BigInt(wholePart);
    const fraction = BigInt(fractionalPart.padEnd(2, '0'));

    const minorUnits = whole * 100n + fraction;

    if (minorUnits <= 0n) {
      throw new Error('C2B payment amount must be positive.');
    }

    if (minorUnits > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error('C2B amount exceeds the supported monetary range.');
    }

    return Number(minorUnits);
  }
  // ===========================================================================
  // Parse Daraja Transaction Time
  // ===========================================================================

  private parseTransactionTime(value: string): Date {
    if (!/^\d{14}$/.test(value)) {
      throw new Error('Invalid M-PESA transaction timestamp.');
    }

    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6));
    const day = Number(value.slice(6, 8));
    const hour = Number(value.slice(8, 10));
    const minute = Number(value.slice(10, 12));
    const second = Number(value.slice(12, 14));

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day ||
      date.getUTCHours() !== hour ||
      date.getUTCMinutes() !== minute ||
      date.getUTCSeconds() !== second
    ) {
      throw new Error('M-PESA transaction timestamp is not a valid date.');
    }

    return date;
  }
}

export default ProcessC2BPaymentCallbackHandler;
