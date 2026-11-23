/**
 * -----------------------------------------------------------------------------
 * SisiMove — C2B Diagnostic Module
 * -----------------------------------------------------------------------------
 *
 * Isolated diagnostic environment for investigating Safaricom Daraja C2B.
 *
 * Responsibilities:
 * - Independent C2B URL registration diagnostics.
 * - Independent C2B simulation diagnostics.
 * - Confirmation and validation callback observation.
 * - Diagnostic event logging.
 *
 * This module does not:
 * - Create financial payments.
 * - Credit customer wallets.
 * - Modify FinancialModule records.
 * - Change existing STK or C2B workflows.
 * -----------------------------------------------------------------------------
 */

import { Module } from '@nestjs/common';

import { MpesaModule } from '../mpesa.module';

import { FinancialPaymentProvidersModule } from '../../domains/financial-payment-providers/financial-payment-providers.module';

import { C2BDiagnosticRegistrationService } from './services/c2b-diagnostic-registration.service';

import { C2BDiagnosticCallbackController } from './controllers/c2b-diagnostic-callback.controller';

import { C2BDiagnosticRegistrationController } from './controllers/c2b-diagnostic-registration.controller';

@Module({
  imports: [MpesaModule, FinancialPaymentProvidersModule],

  controllers: [
    C2BDiagnosticCallbackController,
    C2BDiagnosticRegistrationController,
  ],

  providers: [C2BDiagnosticRegistrationService],

  exports: [C2BDiagnosticRegistrationService],
})
export class C2BDiagnosticModule {}

export default C2BDiagnosticModule;
