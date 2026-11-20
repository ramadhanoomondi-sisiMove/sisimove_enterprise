/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Controller
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Return authenticated customer PayBill instructions.
 * - Expose protected C2B URL registration.
 * - Expose protected sandbox payment simulation.
 * - Receive and normalize Daraja C2B callbacks.
 * - Delegate all financial callback processing to FinancialModule.
 *
 * Important:
 * - PayBill is the only supported C2B payment method.
 * - The account reference is generated for each FinancialPayment.
 * - This controller never generates or substitutes a payment reference.
 * - FinancialModule exclusively owns payment matching, reconciliation,
 *   payment state transitions and financial effects.
 * -----------------------------------------------------------------------------
 */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// M-PESA Services and Callback Handler
// -----------------------------------------------------------------------------

import { C2BService } from './c2b.service';
import { C2BCallbackHandler } from './c2b-callback.handler';

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import {
  CurrentIdentity,
  JwtAuthGuard,
  type AuthenticatedIdentity,
} from '../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Financial Account Application
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../../domains/financial/application/financial-account.tokens';

import type { QueryHandler } from '../../foundation/kernel/application/query-handler';

import { GetMyFinancialAccountQuery } from '../../domains/financial/application/queries/get-my-financial-account.query';

import { FinancialAccountOwnerPublicId } from '../../domains/financial/domain/value-objects/financial-account-owner-public-id.vo';

import type { FinancialAccountAggregate } from '../../domains/financial/domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Financial C2B Callback Processing
// -----------------------------------------------------------------------------

import { ProcessC2BPaymentCallbackHandler } from '../../domains/financial/application/command-handlers/process-c2b-payment-callback.handler';

// -----------------------------------------------------------------------------
// DTOs
// -----------------------------------------------------------------------------

import C2BRegisterUrlDto from './dto/c2b-register-urls.dto';

import C2BSimulateRequestDto from './dto/c2b-simulate-request.dto';

// =============================================================================
// Controller
// =============================================================================

@Controller('mpesa/c2b')
export class C2BController {
  private readonly logger = new Logger(C2BController.name);

  public constructor(
    private readonly c2bService: C2BService,

    private readonly callbackHandler: C2BCallbackHandler,

    private readonly processC2BPaymentCallbackHandler: ProcessC2BPaymentCallbackHandler,

    @Inject(FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_ME)
    private readonly getMyFinancialAccountHandler: QueryHandler<
      GetMyFinancialAccountQuery,
      FinancialAccountAggregate
    >,
  ) {}

  // ===========================================================================
  // Customer PayBill Payment Instructions
  // ===========================================================================

  /**
   * Returns the configured PayBill details for the authenticated customer.
   *
   * This endpoint returns general provider instructions only.
   *
   * It deliberately does not return the Financial Account public ID as the
   * PayBill account reference. The account reference must come from the
   * payment-specific c2bReference returned when FinancialModule creates
   * the pending FinancialPayment.
   *
   * The frontend must display:
   * - PayBill shortcode from this endpoint;
   * - payment.c2bReference from the payment-creation response;
   * - the amount from that same payment.
   */
  @Get('payment-instructions')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getPaymentInstructions(
    @CurrentIdentity() identity: AuthenticatedIdentity,
  ) {
    const query = new GetMyFinancialAccountQuery(
      FinancialAccountOwnerPublicId.create(identity.identityPublicId),
    );

    const account = await this.getMyFinancialAccountHandler.execute(query);

    account.ensureOperational();

    if (!account.currency.isKes()) {
      throw new BadRequestException(
        'M-PESA C2B payments are currently supported only for KES accounts.',
      );
    }

    const mpesa = await this.c2bService.getPaymentInstructions();

    if (mpesa.businessType !== 'PAYBILL') {
      throw new BadRequestException(
        'SisiMove C2B payments are configured for PayBill only.',
      );
    }

    return {
      provider: 'MPESA',
      paymentMethod: 'PayBill',
      businessType: 'PAYBILL',
      shortcode: mpesa.shortcode,
      currency: 'KES',
      referenceType: 'PAYMENT_SPECIFIC',
      instructions: [
        'Open M-PESA on your phone.',
        'Select Lipa na M-PESA.',
        'Select PayBill.',
        `Enter the business number: ${mpesa.shortcode}.`,
        'Enter the unique account reference displayed on your SisiMove payment screen.',
        'Enter the exact payment amount displayed on your SisiMove payment screen.',
        'Confirm the details and complete the payment.',
      ],
    };
  }

  // ===========================================================================
  // Register C2B Confirmation and Validation URLs
  // ===========================================================================

  /**
   * Registers the configured C2B callback URLs with Daraja.
   *
   * Requires authentication.
   *
   * Before production, restrict this endpoint to authorized administrators
   * using the application's existing authorization mechanism.
   */
  @Post('register-urls')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async registerUrls(@Body() dto: C2BRegisterUrlDto) {
    return this.c2bService.registerUrls(dto);
  }

  // ===========================================================================
  // Simulate C2B Payment — Sandbox Only
  // ===========================================================================

  /**
   * Initiates a sandbox C2B simulation.
   *
   * C2BService enforces the sandbox-only restriction and validates that
   * the simulation command matches the configured business type.
   *
   * Before production, restrict this endpoint to authorized operators.
   */
  @Post('simulate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async simulatePayment(@Body() dto: C2BSimulateRequestDto) {
    return this.c2bService.simulatePayment(dto);
  }

  // ===========================================================================
  // C2B Confirmation Callback
  // ===========================================================================

  /**
   * Receives C2B confirmation notifications from Daraja.
   *
   * Processing sequence:
   * 1. Validate and normalize the Safaricom callback.
   * 2. Delegate the normalized event to FinancialModule.
   * 3. FinancialModule records the callback and performs payment matching,
   *    duplicate detection, reconciliation and financial state transitions.
   * 4. Acknowledge the callback after the FinancialModule handler completes.
   *
   * This controller does not create payments, resolve accounts, credit
   * wallets or post ledger entries.
   */
  @Post('confirmation')
  @HttpCode(HttpStatus.OK)
  public async confirmation(@Body() body: unknown) {
    const event = this.callbackHandler.processCallback(body);

    this.logger.log(
      `Received M-PESA C2B confirmation: ${event.transactionId}.`,
    );

    const result = await this.processC2BPaymentCallbackHandler.execute(event);

    if (result.requiresReconciliation) {
      this.logger.warn(
        `C2B transaction ${event.transactionId} requires reconciliation: ${result.message}`,
      );
    } else if (result.duplicate) {
      this.logger.log(
        `C2B transaction ${event.transactionId} was already processed.`,
      );
    } else if (result.processed) {
      this.logger.log(
        `C2B transaction ${event.transactionId} processed successfully.`,
      );
    } else {
      this.logger.warn(
        `C2B transaction ${event.transactionId} was not processed: ${result.message}`,
      );
    }

    return {
      ResultCode: 0,
      ResultDesc: result.requiresReconciliation
        ? 'Accepted for reconciliation.'
        : result.duplicate
          ? 'Duplicate callback acknowledged.'
          : 'Accepted',
    };
  }

  // ===========================================================================
  // C2B Validation Callback
  // ===========================================================================

  /**
   * Daraja validation endpoint.
   *
   * FinancialModule must make the payment acceptance decision.
   *
   * This endpoint deliberately rejects validation while the dedicated
   * FinancialModule validation workflow is not configured.
   *
   * Do not change this to unconditional acceptance. Implement and connect
   * the FinancialModule validation handler before enabling validation.
   */
  @Post('validation')
  @HttpCode(HttpStatus.OK)
  public validation() {
    return {
      ResultCode: 1,
      ResultDesc: 'C2B validation workflow is not configured.',
    };
  }
}

export default C2BController;
