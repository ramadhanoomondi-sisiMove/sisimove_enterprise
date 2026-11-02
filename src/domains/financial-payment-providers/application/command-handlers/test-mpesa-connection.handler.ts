import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { TestMpesaConnectionCommand } from '../commands/test-mpesa-connection.command';

import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentProviderCode } from '../../domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderException } from '../../domain/exceptions/financial-payment-provider.exception';

import { MpesaOAuthService } from '../../infrastructure/mpesa/authentication/mpesa-oauth.service';

import type { MpesaOAuthAuthenticationResult } from '../../infrastructure/mpesa/authentication/mpesa-oauth.types';

@Injectable()
export class TestMpesaConnectionHandler implements CommandHandler<
  TestMpesaConnectionCommand,
  MpesaOAuthAuthenticationResult
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly mpesaOAuthService: MpesaOAuthService,
  ) {}

  public async execute(
    command: TestMpesaConnectionCommand,
  ): Promise<MpesaOAuthAuthenticationResult> {
    const provider = await this.providerRepository.findByPublicId(
      command.providerPublicId,
    );

    if (provider === null) {
      throw new FinancialPaymentProviderException(
        'M-PESA payment provider was not found.',
      );
    }

    const mpesaCode = FinancialPaymentProviderCode.create('MPESA');

    if (!provider.code.equals(mpesaCode)) {
      throw new FinancialPaymentProviderException(
        'The selected payment provider is not M-PESA.',
      );
    }

    return this.mpesaOAuthService.authenticate(command.providerPublicId);
  }
}

export default TestMpesaConnectionHandler;
