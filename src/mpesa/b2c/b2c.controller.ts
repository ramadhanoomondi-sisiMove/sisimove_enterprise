/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 B2C Controller
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Receive Daraja B2C result callbacks.
 * - Receive Daraja B2C queue-timeout callbacks.
 * - Validate and normalize callback payloads through B2CCallbackHandler.
 * - Persist normalized callback events through FinancialModule.
 *
 * Architecture:
 * - FinancialModule owns payout initiation, callback persistence and
 *   financial state transitions.
 * - B2CService communicates with Safaricom Daraja.
 * - B2CCallbackHandler validates and normalizes provider callback payloads.
 * - ReceiveFinancialDisbursementCallbackService durably records callbacks.
 * - This controller does not execute financial business logic.
 *
 * Important:
 * - Daraja request acceptance is not payout completion.
 * - A result callback communicates the provider's final outcome.
 * - A queue timeout does not establish payout failure.
 *
 * Security:
 * - These endpoints are intentionally public.
 * - Safaricom must reach them without an application JWT.
 *
 * -----------------------------------------------------------------------------
 */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// B2C Callback Adapter
// -----------------------------------------------------------------------------

import {
  B2CCallbackHandler,
  type B2CResultCallbackEvent,
  type B2CQueueTimeoutCallbackEvent,
} from './b2c-callback.handler';

// -----------------------------------------------------------------------------
// Financial — Callback Intake
// -----------------------------------------------------------------------------

import { ReceiveFinancialDisbursementCallbackService } from '../../domains/financial/application/services/receive-financial-disbursement-callback.service';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('M-PESA B2C Callbacks')
@Controller('mpesa/b2c')
export class B2CController {
  public constructor(
    private readonly callbackHandler: B2CCallbackHandler,
    private readonly callbackIntakeService: ReceiveFinancialDisbursementCallbackService,
  ) {}

  // ===========================================================================
  // Daraja B2C Result Callback
  // ===========================================================================

  /**
   * Receives the final B2C result callback from Safaricom.
   *
   * ResultCode:
   * - 0: Provider reports successful payout.
   * - Non-zero: Provider reports an unsuccessful payout.
   *
   * The callback is normalized and durably persisted before acknowledgement.
   * FinancialModule subsequently processes its financial consequences.
   */

  @Post('result')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive M-PESA B2C result callback',
    description:
      'Public Safaricom Daraja callback. Persists the normalized provider result through FinancialModule. No application JWT is required.',
  })
  @ApiResponse({
    status: 200,
    description: 'B2C result callback durably accepted.',
    schema: {
      example: {
        accepted: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or malformed B2C result callback.',
  })
  @ApiResponse({
    status: 500,
    description: 'Callback intake failed.',
  })
  public async processResultCallback(
    @Body() body: unknown,
  ): Promise<{ accepted: true }> {
    const event: B2CResultCallbackEvent =
      this.callbackHandler.processResultCallback(body);

    await this.callbackIntakeService.receiveResultCallback(event, body);

    return { accepted: true };
  }

  // ===========================================================================
  // Daraja B2C Queue Timeout Callback
  // ===========================================================================

  /**
   * Receives the B2C queue-timeout callback from Safaricom.
   *
   * A queue timeout does not prove that the payout failed.
   * It is persisted as a distinct callback type for subsequent reconciliation.
   */

  @Post('queue-timeout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive M-PESA B2C queue-timeout callback',
    description:
      'Public Safaricom Daraja callback. Persists the timeout as a distinct callback event for subsequent reconciliation. A queue timeout does not establish payout failure.',
  })
  @ApiResponse({
    status: 200,
    description: 'B2C queue-timeout callback durably accepted.',
    schema: {
      example: {
        accepted: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or malformed B2C queue-timeout callback.',
  })
  @ApiResponse({
    status: 500,
    description: 'Callback intake failed.',
  })
  public async processQueueTimeoutCallback(
    @Body() body: unknown,
  ): Promise<{ accepted: true }> {
    const event: B2CQueueTimeoutCallbackEvent =
      this.callbackHandler.processQueueTimeoutCallback(body);

    await this.callbackIntakeService.receiveQueueTimeoutCallback(event, body);

    return { accepted: true };
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default B2CController;
