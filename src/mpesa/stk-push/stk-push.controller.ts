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
 * - Delegate callback validation and normalization to
 *   StkPushCallbackHandler.
 * - Return the acknowledgement expected by Daraja.
 *
 * Financial processing belongs to FinancialModule workflows.
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
  ) {}

  // ===========================================================================
  // Initiate STK Push
  // ===========================================================================

  /**
   * Initiates an M-PESA STK Push request.
   *
   * The financial payment workflow is responsible for creating the payment
   * and attempt before invoking the provider integration.
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
   * The callback handler validates and normalizes the provider payload.
   * The normalized event is intended for the FinancialModule callback
   * workflow, which owns correlation and financial processing.
   *
   * Do not perform financial updates in this controller.
   */
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  public handleCallback(@Body() body: unknown): DarajaCallbackAcknowledgement {
    const event = this.callbackHandler.processCallback(body);

    this.logger.log(`Received M-PESA STK callback: ${event.checkoutRequestId}`);

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
