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
 * - Reconciliation of previously persisted C2B callbacks.
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

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';
import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../financial-payment-providers/application/financial-payment-providers.tokens';
import { FINANCIAL_PAYMENT_C2B_CALLBACK_TOKENS } from '../../../financial-payment-providers/application/financial-payment-c2b-callback.tokens';

import { FinancialPaymentProviderConfigurationService } from '../../../financial-payment-providers/application/services/financial-payment-provider-configuration.service';

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';
import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

import type { FinancialPaymentProviderRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';
import type { FinancialPaymentC2BCallbackRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-c2b-callback.repository';

import { FinancialPaymentAttemptEntity } from '../../domain/entities/financial-payment-attempt.entity';

import { FinancialAccountPublicId } from '../../domain/value-objects/financial-account-public-id.vo';
import { FinancialC2BReference } from '../../domain/value-objects/financial-c2b-reference.vo';
import { FinancialProvider } from '../../domain/value-objects/financial-provider.vo';
import { FinancialProviderReference } from '../../domain/value-objects/financial-provider-reference.vo';
import { FinancialPaymentChannel } from '../../domain/value-objects/financial-payment-channel.vo';
import { Currency } from '../../domain/value-objects/currency.vo';
import { Money } from '../../domain/value-objects/money.vo';

import { FinancialPaymentProviderCode } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

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
  // Reconcile Previously Received C2B Callbacks
  // ===========================================================================

  /**
   * Reconciliation entry point for an existing C2B FinancialPayment.
   *
   * The customer action that invokes this method is only a request to check
   * for an already-received provider callback. It is not proof of payment.
   *
   * This method:
   * - Does not create a FinancialPayment.
   * - Does not initiate STK Push.
   * - Does not trust the customer's assertion.
   * - Searches only persisted PENDING callbacks for the payment reference.
   * - Reuses execute() so callback verification and payment processing
   *   remain consistent with the normal callback path.
   */
  public async reconcilePendingPayment(
    reference: string,
  ): Promise<ProcessC2BPaymentCallbackResult> {
    let c2bReference: FinancialC2BReference;

    try {
      c2bReference = FinancialC2BReference.create(reference.trim());
    } catch {
      return this.reconciliationResult(
        'The supplied C2B payment reference is invalid.',
      );
    }

    const callbacks =
      await this.callbackRepository.findPendingByProviderAndBillRefNumber(
        this.paymentProvider.value,
        c2bReference.value,
      );

    if (callbacks.length === 0) {
      return this.reconciliationResult(
        'No pending M-PESA callback has been received for this payment reference yet. The payment remains pending.',
      );
    }

    let lastResult: ProcessC2BPaymentCallbackResult = this.reconciliationResult(
      'A matching callback was found but could not yet be reconciled.',
    );

    // The repository returns callbacks oldest first. Process them in that
    // deterministic order. Once the payment succeeds, do not process another
    // callback against the same payment.
    for (const callbackRecord of callbacks) {
      if (
        !callbackRecord.transTime ||
        !Number.isFinite(callbackRecord.transAmount) ||
        callbackRecord.transAmount <= 0 ||
        !callbackRecord.billRefNumber
      ) {
        lastResult = this.reconciliationResult(
          'A stored M-PESA callback is missing required transaction details. Manual reconciliation is required.',
        );
        continue;
      }

      const callback: C2BCallbackEvent = {
        provider: 'MPESA',

        transactionType: this.readRequiredPayloadString(
          callbackRecord.payload,
          'TransactionType',
        ),

        transactionId: callbackRecord.transId,
        transactionTime: callbackRecord.transTime,
        amount: callbackRecord.transAmount.toFixed(2),
        businessShortCode: callbackRecord.businessShortCode,
        phoneNumber: callbackRecord.msisdn,
        billReference: callbackRecord.billRefNumber,

        rawPayload: callbackRecord.payload as C2BCallbackEvent['rawPayload'],
      };

      lastResult = await this.execute(callback);

      if (lastResult.processed || lastResult.duplicate) {
        return lastResult;
      }
    }

    return lastResult;
  }

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
    const amount = Money.create(this.toMinorUnits(callback.amount), this.kes);
    const billReference = callback.billReference?.trim();

    // -------------------------------------------------------------------------
    // 1. Persist callback receipt before attempting payment matching.
    //
    // The unique provider + TransID constraint protects against duplicate
    // callback receipts. Unmatched callbacks remain PENDING for reconciliation.
    // -------------------------------------------------------------------------

    const callbackRecord = await this.callbackRepository.createIfNotExists({
      provider: this.paymentProvider.value,
      transId: transactionId,
      billRefNumber: billReference || null,
      businessShortCode: callback.businessShortCode,
      transTime: callback.transactionTime,
      transAmount: Number(callback.amount),
      msisdn: callback.phoneNumber,
      payload: callback.rawPayload,
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
    // 2. Provider transaction deduplication.
    // -------------------------------------------------------------------------

    const existingTransactionPayment =
      await this.paymentRepository.findByProviderReference(
        this.paymentProvider,
        providerReference,
      );

    if (existingTransactionPayment !== null) {
      const successfulAttempt =
        existingTransactionPayment.getSuccessfulAttempt();

      if (successfulAttempt === undefined) {
        return this.reconciliationResult(
          'The M-PESA transaction reference is already associated with a payment that has no successful attempt.',
          existingTransactionPayment.publicId.toString(),
        );
      }

      const sameAmount =
        existingTransactionPayment.amount.amount === amount.amount;

      const sameReference =
        existingTransactionPayment.c2bReference?.value ===
        billReference?.toUpperCase();

      if (!sameAmount || !sameReference) {
        return this.reconciliationResult(
          'The M-PESA transaction ID is already recorded, but the callback amount or payment reference does not match.',
          existingTransactionPayment.publicId.toString(),
        );
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
        paymentPublicId: existingTransactionPayment.publicId.toString(),
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
      return this.reconciliationResult(
        'The C2B shortcode does not match an operational M-PESA PayBill configuration. The callback has been retained.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Require payment-specific BillRefNumber.
    // -------------------------------------------------------------------------

    if (!billReference) {
      return this.reconciliationResult(
        'C2B callback has no payment-specific BillRefNumber. The callback has been retained.',
      );
    }

    let c2bReference: FinancialC2BReference;

    try {
      c2bReference = FinancialC2BReference.create(billReference);
    } catch {
      return this.reconciliationResult(
        'The supplied C2B payment reference is invalid. The callback has been retained.',
      );
    }

    // -------------------------------------------------------------------------
    // 5. Find the original pending FinancialPayment.
    //
    // Never create a new payment here.
    // -------------------------------------------------------------------------

    const matchedPayment =
      await this.paymentRepository.findByC2BReference(c2bReference);

    if (matchedPayment === null) {
      return this.reconciliationResult(
        'No FinancialPayment matches the supplied payment-specific BillRefNumber. The callback has been retained.',
      );
    }

    // -------------------------------------------------------------------------
    // 6. Validate the matched payment before locking.
    // -------------------------------------------------------------------------

    if (!matchedPayment.channel.isC2B()) {
      return this.reconciliationResult(
        'The BillRefNumber resolved to a payment that is not a C2B payment.',
        matchedPayment.publicId.toString(),
      );
    }

    if (!matchedPayment.isPending()) {
      return this.reconciliationResult(
        'The matched C2B payment is not pending. Manual reconciliation is required.',
        matchedPayment.publicId.toString(),
      );
    }

    if (!matchedPayment.hasC2BReference()) {
      return this.reconciliationResult(
        'The matched payment does not contain a C2B payment reference.',
        matchedPayment.publicId.toString(),
      );
    }

    if (matchedPayment.c2bReference?.value !== c2bReference.value) {
      return this.reconciliationResult(
        'The matched payment reference does not match the callback reference.',
        matchedPayment.publicId.toString(),
      );
    }

    if (
      matchedPayment.amount.amount !== amount.amount ||
      !matchedPayment.amount.currency.isKes()
    ) {
      return this.reconciliationResult(
        'The callback amount or currency does not match the pending C2B payment.',
        matchedPayment.publicId.toString(),
      );
    }

    // -------------------------------------------------------------------------
    // 7. Resolve and validate the receiving Financial Account.
    //
    // Resolve from the matched payment. Never use payer MSISDN.
    // -------------------------------------------------------------------------

    const accountPublicId = new FinancialAccountPublicId(
      matchedPayment.accountId.value,
    );

    const account =
      await this.accountRepository.findByPublicId(accountPublicId);

    if (account === null) {
      return this.reconciliationResult(
        'The receiving Financial Account associated with the payment was not found.',
        matchedPayment.publicId.toString(),
      );
    }

    if (!account.canOperate()) {
      return this.reconciliationResult(
        'The receiving Financial Account is not operational.',
        matchedPayment.publicId.toString(),
      );
    }

    if (!account.currency.isKes()) {
      return this.reconciliationResult(
        'The receiving Financial Account does not use KES.',
        matchedPayment.publicId.toString(),
      );
    }

    if (account.publicId.value !== matchedPayment.accountId.value) {
      return this.reconciliationResult(
        'The matched payment account identity is inconsistent.',
        matchedPayment.publicId.toString(),
      );
    }

    // -------------------------------------------------------------------------
    // 8. Complete the EXISTING payment transactionally.
    // -------------------------------------------------------------------------

    try {
      const result = await this.unitOfWork.execute(async () => {
        await this.paymentRepository.lockByPublicId(matchedPayment.publicId);

        const payment = await this.paymentRepository.findByPublicId(
          matchedPayment.publicId,
        );

        if (payment === null) {
          throw new Error('The matched FinancialPayment no longer exists.');
        }

        // Revalidate identity and lifecycle after acquiring the lock.
        if (
          !payment.channel.isC2B() ||
          !payment.hasC2BReference() ||
          payment.c2bReference?.value !== c2bReference.value
        ) {
          throw new Error(
            'The locked FinancialPayment no longer matches the C2B reference.',
          );
        }

        if (!payment.isPending()) {
          throw new Error('The locked C2B payment is no longer pending.');
        }

        if (
          payment.amount.amount !== amount.amount ||
          !payment.amount.currency.isKes()
        ) {
          throw new Error(
            'The locked C2B payment amount or currency does not match the callback.',
          );
        }

        // Recheck provider transaction uniqueness inside the transaction.
        const transactionAlreadyRecorded =
          await this.paymentRepository.findByProviderReference(
            this.paymentProvider,
            providerReference,
          );

        if (transactionAlreadyRecorded !== null) {
          const successfulAttempt =
            transactionAlreadyRecorded.getSuccessfulAttempt();

          if (successfulAttempt === undefined) {
            throw new Error(
              'The M-PESA transaction is already associated with a payment that has no successful attempt.',
            );
          }

          if (
            transactionAlreadyRecorded.publicId.value !== payment.publicId.value
          ) {
            throw new Error(
              'The M-PESA transaction ID is already associated with a different payment.',
            );
          }

          await this.callbackRepository.markProcessed(
            callbackRecord.id,
            successfulAttempt.id.toString(),
            new Date(),
          );

          return {
            duplicate: true,
            paymentPublicId: payment.publicId.toString(),
            attemptPublicId: successfulAttempt.publicId.toString(),
          };
        }

        if (payment.accountId.value !== account.publicId.value) {
          throw new Error(
            'The receiving account changed during C2B processing.',
          );
        }

        // Create the provider attempt against the existing payment.
        const attempt = FinancialPaymentAttemptEntity.create(
          payment.id,
          this.paymentProvider,
          amount,
          providerReference,
        );

        attempt.start(completedAt);

        payment.addAttempt(attempt, correlationId, causationId);

        // The provider callback is the verified payment event.
        payment.startProcessing(completedAt, correlationId, causationId);

        // succeedAttempt() transitions the attempt and parent payment.
        payment.succeedAttempt(
          attempt.publicId,
          completedAt,
          correlationId,
          causationId,
        );

        await this.paymentRepository.save(payment);

        // Publish domain events through the transactional publisher.
        const domainEvents = payment.pullDomainEvents();

        if (domainEvents.length > 0) {
          await this.eventPublisher.publishAll(domainEvents);
        }

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
          : 'Existing C2B payment successfully completed.',
      };
    } catch (error) {
      this.logger.error(
        `Failed to process M-PESA C2B transaction ${transactionId}.`,
        error instanceof Error ? error.stack : undefined,
      );

      // Do not mark the callback processed. Its durable receipt remains
      // available for retry/reconciliation.
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

    if (!configuredShortcode || configuredShortcode !== businessShortCode) {
      return null;
    }

    // SisiMove C2B supports PayBill only.
    if (configuration.c2bBusinessType !== 'PAYBILL') {
      return null;
    }

    return configuration;
  }

  // ===========================================================================
  // Reconciliation Result
  // ===========================================================================

  private reconciliationResult(
    message: string,
    paymentPublicId?: string,
  ): ProcessC2BPaymentCallbackResult {
    return {
      processed: false,
      duplicate: false,
      requiresReconciliation: true,
      ...(paymentPublicId ? { paymentPublicId } : {}),
      message,
    };
  }

  // ===========================================================================
  // Read Required Values from Persisted Callback Payload
  // ===========================================================================

  private readRequiredPayloadString(payload: unknown, field: string): string {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Stored M-PESA callback payload is invalid.');
    }

    const value = (payload as Record<string, unknown>)[field];

    if (
      (typeof value !== 'string' && typeof value !== 'number') ||
      (typeof value === 'number' && !Number.isFinite(value))
    ) {
      throw new Error(
        `Stored M-PESA callback is missing or has an invalid ${field}.`,
      );
    }

    const normalized = String(value).trim();

    if (!normalized) {
      throw new Error(`Stored M-PESA callback is missing ${field}.`);
    }

    return normalized;
  }

  // ===========================================================================
  // Validate Normalized Callback
  // ===========================================================================

  private validateCallback(callback: C2BCallbackEvent): void {
    if (!callback || callback.provider !== 'MPESA') {
      throw new Error('Unsupported C2B payment provider.');
    }

    if (
      typeof callback.transactionType !== 'string' ||
      !callback.transactionType.trim()
    ) {
      throw new Error('M-PESA transaction type is required.');
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
      !/^\d+(\.\d{1,2})?$/.test(callback.amount)
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

    if (
      !callback.rawPayload ||
      typeof callback.rawPayload !== 'object' ||
      Array.isArray(callback.rawPayload)
    ) {
      throw new Error(
        'Original M-PESA callback payload is missing or invalid.',
      );
    }
  }

  // ===========================================================================
  // Convert Decimal KES to Minor Units
  // ===========================================================================

  /**
   * Converts decimal KES into integer minor units without floating-point
   * multiplication.
   */
  private toMinorUnits(value: string): number {
    const normalized = value.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
      throw new Error('Invalid monetary amount.');
    }

    const [wholePart = '0', fractionalPart = ''] = normalized.split('.');

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

  /**
   * Parses Daraja YYYYMMDDHHmmss into a UTC Date.
   *
   * Calendar validity is checked to reject impossible dates and times.
   */
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
