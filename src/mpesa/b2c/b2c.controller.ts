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
 * Diagnostics:
 * - Logs callback arrival, request metadata and raw payload.
 * - Logs normalization start, success and failure.
 * - Logs callback persistence start, success and failure.
 * - Logs unexpected exceptions with stack traces.
 *
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
  private readonly logger = new Logger(B2CController.name);

  public constructor(
    private readonly callbackHandler: B2CCallbackHandler,
    private readonly callbackIntakeService: ReceiveFinancialDisbursementCallbackService,
  ) {}

  // ===========================================================================
  // Diagnostic Helpers
  // ===========================================================================

  private createTraceId(callbackType: string): string {
    return `B2C-${callbackType}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
  }

  private logRawBody(
    traceId: string,
    callbackType: string,
    body: unknown,
  ): void {
    this.logger.warn(
      `[${traceId}] RAW ${callbackType} CALLBACK BODY:\n${this.safeStringify(body)}`,
    );
  }

  private safeStringify(value: unknown): string {
    try {
      const result = JSON.stringify(value, null, 2);
      return result ?? String(value);
    } catch (error: unknown) {
      return `[Unable to serialize callback body: ${this.errorMessage(error)}]`;
    }
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  private errorStack(error: unknown): string | undefined {
    return error instanceof Error ? error.stack : undefined;
  }

  private logCallbackError(
    traceId: string,
    stage: string,
    error: unknown,
  ): void {
    this.logger.error(
      `[${traceId}] ${stage} FAILED: ${this.errorMessage(error)}`,
      this.errorStack(error),
    );

    if (!(error instanceof Error)) {
      this.logger.error(
        `[${traceId}] NON-ERROR EXCEPTION DETAILS: ${this.safeStringify(error)}`,
      );
    }
  }

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
    const traceId = this.createTraceId('RESULT');
    const startedAt = Date.now();

    this.logger.warn(
      `[${traceId}] ==================================================`,
    );
    this.logger.warn(`[${traceId}] B2C RESULT CALLBACK RECEIVED`);
    this.logger.warn(`[${traceId}] RECEIVED AT: ${new Date().toISOString()}`);
    this.logger.warn(`[${traceId}] CALLBACK TYPE: RESULT`);
    this.logger.warn(`[${traceId}] BODY TYPE: ${typeof body}`);
    this.logger.warn(`[${traceId}] BODY IS NULL: ${body === null}`);
    this.logger.warn(`[${traceId}] BODY IS ARRAY: ${Array.isArray(body)}`);

    this.logRawBody(traceId, 'RESULT', body);

    try {
      // -----------------------------------------------------------------------
      // Stage 1: Normalize callback
      // -----------------------------------------------------------------------

      this.logger.warn(`[${traceId}] STAGE 1: CALLBACK NORMALIZATION STARTED`);

      const event: B2CResultCallbackEvent =
        this.callbackHandler.processResultCallback(body);

      this.logger.warn(
        `[${traceId}] STAGE 1: CALLBACK NORMALIZATION SUCCEEDED`,
      );

      this.logger.warn(
        `[${traceId}] NORMALIZED RESULT EVENT:\n${this.safeStringify(event)}`,
      );

      // -----------------------------------------------------------------------
      // Stage 2: Persist callback
      // -----------------------------------------------------------------------

      this.logger.warn(
        `[${traceId}] STAGE 2: FINANCIAL CALLBACK PERSISTENCE STARTED`,
      );

      await this.callbackIntakeService.receiveResultCallback(event, body);

      this.logger.warn(
        `[${traceId}] STAGE 2: FINANCIAL CALLBACK PERSISTENCE SUCCEEDED`,
      );

      // -----------------------------------------------------------------------
      // Stage 3: Acknowledge callback
      // -----------------------------------------------------------------------

      this.logger.warn(`[${traceId}] STAGE 3: CALLBACK ACKNOWLEDGEMENT READY`);

      this.logger.warn(
        `[${traceId}] B2C RESULT CALLBACK COMPLETED SUCCESSFULLY`,
      );

      this.logger.warn(
        `[${traceId}] TOTAL PROCESSING TIME: ${Date.now() - startedAt}ms`,
      );

      this.logger.warn(
        `[${traceId}] ==================================================`,
      );

      return { accepted: true };
    } catch (error: unknown) {
      this.logCallbackError(traceId, 'RESULT CALLBACK PROCESSING', error);

      this.logger.error(`[${traceId}] RESULT CALLBACK PROCESSING STOPPED`);

      this.logger.error(
        `[${traceId}] TOTAL TIME BEFORE FAILURE: ${Date.now() - startedAt}ms`,
      );

      this.logger.error(
        `[${traceId}] ==================================================`,
      );

      throw error;
    }
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
    const traceId = this.createTraceId('QUEUE-TIMEOUT');
    const startedAt = Date.now();

    this.logger.warn(
      `[${traceId}] ==================================================`,
    );
    this.logger.warn(`[${traceId}] B2C QUEUE TIMEOUT CALLBACK RECEIVED`);
    this.logger.warn(`[${traceId}] RECEIVED AT: ${new Date().toISOString()}`);
    this.logger.warn(`[${traceId}] CALLBACK TYPE: QUEUE TIMEOUT`);
    this.logger.warn(`[${traceId}] BODY TYPE: ${typeof body}`);
    this.logger.warn(`[${traceId}] BODY IS NULL: ${body === null}`);
    this.logger.warn(`[${traceId}] BODY IS ARRAY: ${Array.isArray(body)}`);

    this.logRawBody(traceId, 'QUEUE TIMEOUT', body);

    try {
      // -----------------------------------------------------------------------
      // Stage 1: Normalize callback
      // -----------------------------------------------------------------------

      this.logger.warn(`[${traceId}] STAGE 1: CALLBACK NORMALIZATION STARTED`);

      const event: B2CQueueTimeoutCallbackEvent =
        this.callbackHandler.processQueueTimeoutCallback(body);

      this.logger.warn(
        `[${traceId}] STAGE 1: CALLBACK NORMALIZATION SUCCEEDED`,
      );

      this.logger.warn(
        `[${traceId}] NORMALIZED QUEUE TIMEOUT EVENT:\n${this.safeStringify(event)}`,
      );

      // -----------------------------------------------------------------------
      // Stage 2: Persist callback
      // -----------------------------------------------------------------------

      this.logger.warn(
        `[${traceId}] STAGE 2: FINANCIAL CALLBACK PERSISTENCE STARTED`,
      );

      await this.callbackIntakeService.receiveQueueTimeoutCallback(event, body);

      this.logger.warn(
        `[${traceId}] STAGE 2: FINANCIAL CALLBACK PERSISTENCE SUCCEEDED`,
      );

      // -----------------------------------------------------------------------
      // Stage 3: Acknowledge callback
      // -----------------------------------------------------------------------

      this.logger.warn(`[${traceId}] STAGE 3: CALLBACK ACKNOWLEDGEMENT READY`);

      this.logger.warn(
        `[${traceId}] B2C QUEUE TIMEOUT CALLBACK COMPLETED SUCCESSFULLY`,
      );

      this.logger.warn(
        `[${traceId}] TOTAL PROCESSING TIME: ${Date.now() - startedAt}ms`,
      );

      this.logger.warn(
        `[${traceId}] ==================================================`,
      );

      return { accepted: true };
    } catch (error: unknown) {
      this.logCallbackError(
        traceId,
        'QUEUE TIMEOUT CALLBACK PROCESSING',
        error,
      );

      this.logger.error(
        `[${traceId}] QUEUE TIMEOUT CALLBACK PROCESSING STOPPED`,
      );

      this.logger.error(
        `[${traceId}] TOTAL TIME BEFORE FAILURE: ${Date.now() - startedAt}ms`,
      );

      this.logger.error(
        `[${traceId}] ==================================================`,
      );

      throw error;
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default B2CController;
