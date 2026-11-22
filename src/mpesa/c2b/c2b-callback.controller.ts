/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Callback Controller
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Receive Safaricom C2B confirmation callbacks.
 * - Normalize incoming provider payloads.
 * - Delegate financial processing to FinancialModule.
 * - Expose the C2B validation endpoint.
 *
 * Public callback endpoints:
 *
 * POST /api/v1/payment-callbacks/c2b-confirmation
 * POST /api/v1/payment-callbacks/c2b-validation
 *
 * Architectural boundaries:
 * - This controller is an HTTP callback adapter.
 * - C2BCallbackHandler normalizes provider payloads.
 * - FinancialModule owns callback persistence and financial processing.
 * - This controller never creates payments, credits accounts or posts ledgers.
 *
 * Security:
 * - These endpoints are intentionally not protected by JWT authentication.
 * - Safaricom must be able to reach them without an application access token.
 * -----------------------------------------------------------------------------
 */

import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

// =============================================================================
// M-PESA Callback Normalization
// =============================================================================

import { C2BCallbackHandler } from './c2b-callback.handler';

// =============================================================================
// Financial C2B Callback Processing
// =============================================================================

import { ProcessC2BPaymentCallbackHandler } from '../../domains/financial/application/command-handlers/process-c2b-payment-callback.handler';

// =============================================================================
// Controller
// =============================================================================

@Controller('payment-callbacks')
export class C2BCallbackController {
  private readonly logger = new Logger(C2BCallbackController.name);

  public constructor(
    private readonly callbackHandler: C2BCallbackHandler,

    private readonly processC2BPaymentCallbackHandler: ProcessC2BPaymentCallbackHandler,
  ) {}

  // ===========================================================================
  // C2B Confirmation Callback
  // ===========================================================================

  /**
   * Receives C2B confirmation notifications from Daraja.
   *
   * Processing sequence:
   *
   * 1. Validate and normalize the Safaricom callback.
   * 2. Preserve the original provider payload.
   * 3. Delegate the event to FinancialModule.
   * 4. FinancialModule persists the callback and performs payment matching,
   *    duplicate detection, reconciliation and payment state transitions.
   * 5. Acknowledge only after FinancialModule confirms processing,
   *    duplicate detection or durable reconciliation acceptance.
   *
   * This controller does not:
   * - Create payments;
   * - Resolve financial accounts;
   * - Credit wallets;
   * - Post ledger entries;
   * - Publish domain events.
   */
  @Post('c2b-confirmation')
  @HttpCode(HttpStatus.OK)
  public async confirmation(@Body() body: unknown) {
    // -------------------------------------------------------------------------
    // Validate and normalize provider payload.
    // -------------------------------------------------------------------------

    const event = this.callbackHandler.processCallback(body);

    this.logger.log(
      `Received M-PESA C2B confirmation: ${event.transactionId}.`,
    );

    // -------------------------------------------------------------------------
    // Delegate financial processing to FinancialModule.
    // -------------------------------------------------------------------------

    const result = await this.processC2BPaymentCallbackHandler.execute(event);

    // -------------------------------------------------------------------------
    // Reconciliation acceptance.
    //
    // A reconciliation result may be acknowledged only when FinancialModule
    // has durably persisted the callback for subsequent reconciliation.
    // -------------------------------------------------------------------------

    if (result.requiresReconciliation) {
      this.logger.warn(
        `C2B transaction ${event.transactionId} requires reconciliation: ${result.message}`,
      );

      return {
        ResultCode: 0,
        ResultDesc: 'Accepted for reconciliation.',
      };
    }

    // -------------------------------------------------------------------------
    // Duplicate callback.
    // -------------------------------------------------------------------------

    if (result.duplicate) {
      this.logger.log(
        `C2B transaction ${event.transactionId} was already processed.`,
      );

      return {
        ResultCode: 0,
        ResultDesc: 'Duplicate callback acknowledged.',
      };
    }

    // -------------------------------------------------------------------------
    // Successfully processed callback.
    // -------------------------------------------------------------------------

    if (result.processed) {
      this.logger.log(
        `C2B transaction ${event.transactionId} processed successfully.`,
      );

      return {
        ResultCode: 0,
        ResultDesc: 'Accepted.',
      };
    }

    // -------------------------------------------------------------------------
    // Unprocessed callback.
    //
    // Do not acknowledge callbacks that FinancialModule has neither
    // processed nor durably accepted for reconciliation.
    // -------------------------------------------------------------------------

    this.logger.error(
      `C2B transaction ${event.transactionId} was not processed or accepted for reconciliation: ${result.message}`,
    );

    throw new HttpException(
      'C2B callback could not be durably accepted by FinancialModule.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  // ===========================================================================
  // C2B Validation Callback
  // ===========================================================================

  /**
   * Receives Daraja C2B validation requests.
   *
   * IMPORTANT:
   *
   * The dedicated FinancialModule validation workflow has not yet been
   * connected.
   *
   * This endpoint therefore deliberately rejects validation requests.
   * It must not be changed to unconditional acceptance without implementing
   * the appropriate FinancialModule validation policy.
   *
   * The C2B registration responseType and validation behaviour must be
   * configured consistently before accepting live payments.
   */
  @Post('c2b-validation')
  @HttpCode(HttpStatus.OK)
  public validation() {
    this.logger.warn(
      'Received C2B validation request, but the validation workflow is not configured.',
    );

    return {
      ResultCode: 1,
      ResultDesc: 'C2B validation workflow is not configured.',
    };
  }
}

export default C2BCallbackController;
