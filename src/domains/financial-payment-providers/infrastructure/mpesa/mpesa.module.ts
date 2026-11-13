// -----------------------------------------------------------------------------
// M-PESA — NestJS Module
// -----------------------------------------------------------------------------
//
// Registered capabilities:
//
// - M-PESA OAuth authentication;
// - M-PESA HTTP communication;
// - M-PESA STK Push initiation;
// - M-PESA STK Query.
//
// Callback processing remains registered separately in FinancialModule.
//
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

import { FinancialPaymentProvidersModule } from '../../financial-payment-providers.module';

import { MpesaHttpModule } from './http/mpesa-http.module';

import { MpesaOAuthService } from './authentication/mpesa-oauth.service';

import { MpesaStkPushService } from './payments/mpesa-stk-push.service';

import { MpesaStkQueryService } from './payments/mpesa-stk-query.service';

// =============================================================================
// Module
// =============================================================================

@Module({
  imports: [FinancialPaymentProvidersModule, MpesaHttpModule],

  providers: [MpesaOAuthService, MpesaStkPushService, MpesaStkQueryService],

  exports: [
    MpesaOAuthService,
    MpesaStkPushService,
    MpesaStkQueryService,
    MpesaHttpModule,
  ],
})
export class MpesaModule {}

export default MpesaModule;
