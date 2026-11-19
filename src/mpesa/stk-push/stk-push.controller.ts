/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA STK Push Controller
 * -----------------------------------------------------------------------------
 *
 * Exposes HTTP endpoints for:
 * - Initiating M-PESA STK Push requests.
 * - Receiving Safaricom Daraja STK Push callbacks.
 *
 * Responsibilities:
 * - Handle HTTP requests and responses.
 * - Delegate STK Push initiation to StkPushService.
 * - Delegate callback validation and normalization to StkPushCallbackHandler.
 * - Forward normalized callbacks to FinancialModule's durable callback intake.
 * - Acknowledge Daraja only after the callback has been persisted.
 *
 * Financial correlation, payment lifecycle transitions and financial
 * consequences remain in FinancialModule.
 * -----------------------------------------------------------------------------
 */

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

import { StkPushService } from './stk-push.service';

import { StkPushCallbackHandler } from './stk-push-callback.handler';

import { ReceiveFinancialPaymentCallbackService } from '../../domains/financial/application/services/receive-financial-payment-callback.service';

import type { StkPushRequestDto } from './dto/stk-push-request.dto';

import type { StkPushResponseDto } from './dto/stk-push-response.dto';

// =============================================================================
// Daraja Callback Acknowledgement
// =============================================================================

interface DarajaCallbackAcknowledgement {
  readonly ResultCode: 0;
  readonly ResultDesc: 'Accepted';
}

// =============================================================================
// Controller
// =============================================================================

@Controller('mpesa/stk-push')
export class StkPushController {
  private readonly logger = new Logger(StkPushController.name);

  public constructor(
    private readonly stkPushService: StkPushService,
    private readonly callbackHandler: StkPushCallbackHandler,
    private readonly callbackIntake: ReceiveFinancialPaymentCallbackService,
  ) {}

  // ===========================================================================
  // Initiate STK Push
  // ===========================================================================

  /**
   * Initiates an M-PESA STK Push request.
   *
   * The Financial Payment workflow creates and persists the payment attempt
   * before invoking this provider integration service.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  public async initiate(
    @Body() dto: StkPushRequestDto,
  ): Promise<StkPushResponseDto> {
    return this.stkPushService.initiate(dto);
  }

  // ===========================================================================
  // Receive Daraja STK Push Callback
  // ===========================================================================

  /**
   * Receives a callback from Safaricom Daraja.
   *
   * Processing sequence:
   * 1. Validate and normalize the Daraja callback.
   * 2. Persist the normalized callback and original payload in FinancialModule.
   * 3. Acknowledge Daraja only after durable persistence succeeds.
   *
   * Payment correlation and lifecycle processing are deliberately not performed
   * in this HTTP controller. Pending callbacks are reconciled by the Financial
   * application recovery processor.
   */
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  public async handleCallback(
    @Body() body: unknown,
  ): Promise<DarajaCallbackAcknowledgement> {
    const event = this.callbackHandler.processCallback(body);

    this.logger.log(`Received M-PESA STK callback: ${event.checkoutRequestId}`);

    const callbackRecord = await this.callbackIntake.receiveStkPushCallback(
      {
        provider: event.provider,
        merchantRequestId: event.merchantRequestId,
        checkoutRequestId: event.checkoutRequestId,
        resultCode: event.resultCode,
        resultDescription: event.resultDescription,
      },
      body,
    );

    this.logger.log(
      `M-PESA STK callback durably recorded: ${event.checkoutRequestId}; ` +
        `status: ${callbackRecord.status}.`,
    );

    return {
      ResultCode: 0,
      ResultDesc: 'Accepted',
    };
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default StkPushController;
