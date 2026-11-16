import { Controller, Inject, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../foundation/security/auth';

import type { CommandHandler } from '../foundation/kernel/application/command-handler';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import { TestMpesaConnectionCommand } from '../domains/financial-payment-providers/application/commands';

import { FinancialPaymentProviderPublicId } from '../domains/financial-payment-providers/domain/value-objects';

import type { MpesaOAuthAuthenticationResult } from './auth/mpesa-token.interface';

@ApiTags('Financial Payment Providers')
@Controller('financial-payment-providers')
export class MpesaConnectionController {
  public constructor(
    @Inject(
      FINANCIAL_PAYMENT_PROVIDER_TOKENS.COMMAND_HANDLERS.TEST_MPESA_CONNECTION,
    )
    private readonly testMpesaConnectionHandler: CommandHandler<
      TestMpesaConnectionCommand,
      MpesaOAuthAuthenticationResult
    >,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Test M-PESA connection',
    description:
      'Validates M-PESA Daraja OAuth authentication using stored credentials. Access tokens and credentials are never returned.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the M-PESA provider.',
  })
  @Post(':providerPublicId/test-connection')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('financial:manage')
  public async testMpesaConnection(
    @Param('providerPublicId') providerPublicId: string,
  ): Promise<MpesaOAuthAuthenticationResult> {
    const command = new TestMpesaConnectionCommand(
      new FinancialPaymentProviderPublicId(providerPublicId),
    );

    return this.testMpesaConnectionHandler.execute(command);
  }
}

export default MpesaConnectionController;
