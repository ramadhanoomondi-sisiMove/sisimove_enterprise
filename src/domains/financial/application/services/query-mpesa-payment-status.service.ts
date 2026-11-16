import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../financial-payment-providers/application/financial-payment-providers.tokens';

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

import type { FinancialPaymentProviderRepository } from '../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentPublicId } from '../../domain/value-objects/financial-payment-public-id.vo';

import { FinancialPaymentProviderCode } from '../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { MpesaStkQueryService } from '../../../../mpesa/stk-push/mpesa-stk-query.service';

import type { MpesaStkPushQueryResponse } from '../../../../mpesa/common/mpesa.types';

import { FinancialPaymentNotFoundException } from '../../domain/exceptions';

@Injectable()
export class QueryMpesaPaymentStatusService {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly paymentRepository: FinancialPaymentRepository,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly mpesaStkQueryService: MpesaStkQueryService,
  ) {}

  public async execute(
    paymentPublicId: string,
  ): Promise<MpesaStkPushQueryResponse> {
    const normalizedPaymentPublicId = paymentPublicId?.trim();

    if (!normalizedPaymentPublicId) {
      throw new Error('Financial Payment public ID is required.');
    }

    // 1. Find the Financial Payment.
    const payment = await this.paymentRepository.findByPublicId(
      new FinancialPaymentPublicId(normalizedPaymentPublicId),
    );

    if (payment === null) {
      throw new FinancialPaymentNotFoundException(normalizedPaymentPublicId);
    }

    // 2. Ensure this is an STK Push payment.
    if (!payment.channel.isStkPush()) {
      throw new Error(
        'M-PESA STK status can only be queried for STK Push payments.',
      );
    }

    // 3. Find the latest execution attempt.
    const attempt = payment.getLatestAttempt();

    if (attempt === undefined) {
      throw new Error('Financial Payment has no provider execution attempt.');
    }

    // 4. Verify that the attempt belongs to M-PESA.
    if (!attempt.provider.isMpesa()) {
      throw new Error(
        'The latest Financial Payment Attempt does not belong to M-PESA.',
      );
    }

    // 5. Retrieve the stored CheckoutRequestID.
    const checkoutRequestId = attempt.providerReference?.value;

    if (!checkoutRequestId?.trim()) {
      throw new Error(
        'The M-PESA attempt has no stored CheckoutRequestID. Manual reconciliation is required.',
      );
    }

    // 6. Resolve the configured M-PESA provider.
    const provider = await this.providerRepository.findByCode(
      FinancialPaymentProviderCode.create('MPESA'),
    );

    if (provider === null) {
      throw new Error(
        'The configured M-PESA payment provider could not be found.',
      );
    }

    // 7. Query Safaricom for the existing STK Push.
    // This does not initiate another payment or mutate financial records.
    return this.mpesaStkQueryService.query({
      providerPublicId: provider.publicId.value,
      checkoutRequestId: checkoutRequestId.trim(),
    });
  }
}

export default QueryMpesaPaymentStatusService;
