import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_TOKENS } from '../../../../financial/application';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../application/financial-payment-providers.tokens';

import type { FinancialPaymentRepository } from '../../../../financial/domain/repositories/financial-payment.repository';

import type { FinancialPaymentProviderRepository } from '../../../../financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentPublicId } from '../../../../financial/domain/value-objects/financial-payment-public-id.vo';

import { FinancialPaymentProviderCode } from '../../../../financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { MpesaStkQueryService } from '../../../../financial-payment-providers/infrastructure/mpesa/payments/mpesa-stk-query.service';

import type { MpesaStkQueryApiResponse } from '../../../../financial-payment-providers/infrastructure/mpesa/payments/mpesa-stk-query.types';

import { FinancialPaymentNotFoundException } from '../../../../financial/domain/exceptions';

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
  ): Promise<MpesaStkQueryApiResponse> {
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

    // 2. Find its latest execution attempt.
    const attempt = payment.getLatestAttempt();

    if (attempt === undefined) {
      throw new Error('Financial Payment has no provider execution attempt.');
    }

    // 3. Verify that the attempt belongs to M-PESA.
    if (attempt.provider.value !== 'MPESA') {
      throw new Error(
        'The latest Financial Payment Attempt does not belong to M-PESA.',
      );
    }

    // 4. Retrieve the stored CheckoutRequestID.
    const checkoutRequestId = attempt.providerReference?.value;

    if (!checkoutRequestId?.trim()) {
      throw new Error(
        'The M-PESA attempt has no stored CheckoutRequestID. Manual reconciliation is required.',
      );
    }

    // 5. Resolve the configured M-PESA provider.
    const provider = await this.providerRepository.findByCode(
      FinancialPaymentProviderCode.create('MPESA'),
    );

    if (provider === null) {
      throw new Error(
        'The configured M-PESA payment provider could not be found.',
      );
    }

    // 6. Query Safaricom for the existing STK Push.
    // This operation does not initiate another payment.
    return this.mpesaStkQueryService.query({
      providerPublicId: provider.publicId.value,
      checkoutRequestId: checkoutRequestId.trim(),
    });
  }
}

export default QueryMpesaPaymentStatusService;
