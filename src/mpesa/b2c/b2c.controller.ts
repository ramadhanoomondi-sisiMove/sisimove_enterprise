/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 B2C Controller
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Receive Daraja B2C result callbacks.
 * - Receive Daraja B2C queue-timeout callbacks.
 * - Validate and normalize callback payloads through B2CCallbackHandler.
 *
 * Architecture:
 * - FinancialModule owns payout initiation and financial state transitions.
 * - B2CService communicates with Safaricom Daraja.
 * - B2CCallbackHandler validates and normalizes provider callback payloads.
 * - This controller does not create or update financial records.
 *
 * Important:
 * - Daraja request acceptance is not payout completion.
 * - A result callback communicates the provider's final outcome.
 * - A queue timeout does not establish payout failure.
 *
 * -----------------------------------------------------------------------------
 */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

// -----------------------------------------------------------------------------
// B2C Callback Adapter
// -----------------------------------------------------------------------------

import {
  B2CCallbackHandler,
  type B2CResultCallbackEvent,
  type B2CQueueTimeoutCallbackEvent,
} from './b2c-callback.handler';

// =============================================================================
// Controller
// =============================================================================

@Controller('mpesa/b2c')
export class B2CController {
  public constructor(private readonly callbackHandler: B2CCallbackHandler) {}

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
   * The handler validates and normalizes the callback.
   *
   * FinancialModule must subsequently process the normalized event and
   * determine the financial consequences.
   */

  @Post('result')
  @HttpCode(HttpStatus.OK)
  public processResultCallback(@Body() body: unknown): B2CResultCallbackEvent {
    return this.callbackHandler.processResultCallback(body);
  }

  // ===========================================================================
  // Daraja B2C Queue Timeout Callback
  // ===========================================================================

  /**
   * Receives the B2C queue-timeout callback from Safaricom.
   *
   * A queue timeout does not prove that the payout failed.
   * The event must remain distinguishable from a final result callback.
   *
   * FinancialModule owns subsequent reconciliation and payout-state decisions.
   */

  @Post('queue-timeout')
  @HttpCode(HttpStatus.OK)
  public processQueueTimeoutCallback(
    @Body() body: unknown,
  ): B2CQueueTimeoutCallbackEvent {
    return this.callbackHandler.processQueueTimeoutCallback(body);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default B2CController;
