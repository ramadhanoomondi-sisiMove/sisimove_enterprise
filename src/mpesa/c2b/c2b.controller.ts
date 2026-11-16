/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Controller
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Return authenticated customer C2B payment instructions.
 * - Expose protected C2B URL registration.
 * - Expose protected sandbox payment simulation.
 * - Receive Daraja C2B callbacks and delegate payload validation and
 *   normalization to C2BCallbackHandler.
 *
 * This controller does not perform financial state transitions.
 * FinancialModule exclusively owns payment processing and financial effects.
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
// C2B Services and Callback Handler
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

    @Inject(FINANCIAL_ACCOUNT_TOKENS.QUERY_HANDLERS.GET_ME)
    private readonly getMyFinancialAccountHandler: QueryHandler<
      GetMyFinancialAccountQuery,
      FinancialAccountAggregate
    >,
  ) {}

  // ===========================================================================
  // Customer Payment Instructions
  // ===========================================================================

  /**
   * Returns C2B payment instructions for the authenticated customer.
   *
   * The Financial Account reference is resolved from the authenticated
   * identity. Customers cannot supply another account reference.
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

    const accountReference = account.account.publicId.value;

    if (mpesa.businessType === 'PAYBILL') {
      return {
        provider: 'MPESA',
        paymentMethod: 'PayBill',
        businessType: mpesa.businessType,
        shortcode: mpesa.shortcode,
        accountReference,
        currency: 'KES',
        instructions: [
          'Open M-PESA on your phone.',
          'Select PayBill.',
          `Enter the business number: ${mpesa.shortcode}.`,
          `Enter your account number: ${accountReference}.`,
          'Enter the amount you want to deposit and complete the payment.',
        ],
      };
    }

    return {
      provider: 'MPESA',
      paymentMethod: 'Buy Goods',
      businessType: mpesa.businessType,
      shortcode: mpesa.shortcode,
      currency: 'KES',
      instructions: [
        'Open M-PESA on your phone.',
        'Select Buy Goods and Services.',
        `Enter the Till number: ${mpesa.shortcode}.`,
        'Enter the amount you want to pay and complete the payment.',
      ],
    };
  }

  // ===========================================================================
  // Register C2B Confirmation and Validation URLs
  // ===========================================================================

  /**
   * Registers the configured C2B callback URLs with Daraja.
   *
   * Requires authentication. Restrict this endpoint to authorized
   * administrators through the application's existing authorization guard.
   */
  @Post('register-urls')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async registerUrls(@Body() dto: C2BRegisterUrlDto) {
    return this.c2bService.registerUrls(dto);
  }

  // ===========================================================================
  // Simulate C2B Payment
  // ===========================================================================

  /**
   * Initiates a sandbox C2B simulation.
   *
   * C2BService enforces the sandbox-only restriction.
   * Restrict this endpoint to authorized operators.
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
   * The callback handler validates and normalizes the provider payload.
   * It does not persist or process financial records.
   *
   * The normalized event must be handed to the existing FinancialModule
   * callback workflow before this endpoint can safely acknowledge receipt.
   */
  @Post('confirmation')
  @HttpCode(HttpStatus.OK)
  public confirmation(@Body() body: unknown) {
    const event = this.callbackHandler.processCallback(body);

    this.logger.log(
      `Received M-PESA C2B confirmation: ${event.transactionId}.`,
    );

    // Integration point:
    // Forward the normalized event to the existing FinancialModule
    // callback workflow before acknowledging the provider.
    //
    // Do not perform financial processing in this controller.

    return {
      ResultCode: 0,
      ResultDesc: 'Accepted',
    };
  }

  // ===========================================================================
  // C2B Validation Callback
  // ===========================================================================

  /**
   * Daraja validation endpoint.
   *
   * FinancialModule must make the payment acceptance decision.
   * This controller must not automatically approve payment validation.
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
