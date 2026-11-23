/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Callback Controller
 * -----------------------------------------------------------------------------
 *
 * DEVELOPMENT DIAGNOSTICS ENABLED
 *
 * Responsibilities:
 * - Receive Safaricom C2B confirmation callbacks.
 * - Display incoming callback evidence in the terminal.
 * - Normalize incoming provider payloads.
 * - Delegate processing to FinancialModule.
 * - Acknowledge confirmation callbacks during the diagnostic phase,
 *   even when internal processing fails.
 * - Expose the C2B validation endpoint.
 *
 * IMPORTANT:
 * Diagnostic acknowledgement does not prove database persistence.
 * Do not use unconditional acknowledgement in production.
 *
 * -----------------------------------------------------------------------------
 */

import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { C2BCallbackHandler } from './c2b-callback.handler';

import { ProcessC2BPaymentCallbackHandler } from '../../domains/financial/application/command-handlers/process-c2b-payment-callback.handler';

import type { C2BCallbackEvent } from './c2b-callback.handler';

@ApiTags('M-PESA C2B Callbacks')
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

  @Post('c2b-confirmation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive M-PESA C2B confirmation callback',
    description:
      'Public Safaricom Daraja callback. No application JWT is required.',
  })
  @ApiResponse({
    status: 200,
    description: 'C2B callback acknowledged during the diagnostic phase.',
  })
  public async confirmation(
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    const requestId = `C2B-${Date.now()}`;

    // -------------------------------------------------------------------------
    // 0. Confirm HTTP arrival
    // -------------------------------------------------------------------------

    this.logger.warn(
      `[${requestId}] ==================================================`,
    );

    this.logger.warn(`[${requestId}] C2B CONFIRMATION CALLBACK RECEIVED`);

    this.logger.warn(`[${requestId}] Received At: ${new Date().toISOString()}`);

    this.logger.warn(`[${requestId}] Method: POST`);

    this.logger.warn(
      `[${requestId}] Endpoint: /api/v1/payment-callbacks/c2b-confirmation`,
    );

    // Do not expose authorization, cookie or API-key headers.
    const safeHeaders = { ...headers };

    for (const key of Object.keys(safeHeaders)) {
      if (/authorization|cookie|token|api[-_]?key|secret/i.test(key)) {
        safeHeaders[key] = '[REDACTED]';
      }
    }

    this.logger.warn(
      `[${requestId}] INCOMING HEADERS:\n${JSON.stringify(safeHeaders, null, 2)}`,
    );

    this.logger.warn(
      `[${requestId}] RAW CALLBACK BODY:\n${JSON.stringify(body, null, 2)}`,
    );

    this.logger.warn(
      `[${requestId}] BODY TYPE: ${
        body === null ? 'null' : Array.isArray(body) ? 'array' : typeof body
      }`,
    );

    // -------------------------------------------------------------------------
    // 1. Normalize provider payload
    // -------------------------------------------------------------------------

    this.logger.warn(`[${requestId}] STARTING C2B PAYLOAD NORMALIZATION`);

    let event: C2BCallbackEvent;

    try {
      event = this.callbackHandler.processCallback(body);

      this.logger.warn(`[${requestId}] NORMALIZATION SUCCESS`);

      this.logger.warn(
        `[${requestId}] NORMALIZED CALLBACK EVIDENCE:\n${JSON.stringify(
          {
            provider: event.provider,
            transactionType: event.transactionType,
            transactionId: event.transactionId,
            transactionTime: event.transactionTime,
            amount: event.amount,
            businessShortCode: event.businessShortCode,
            billReference: event.billReference,
            phoneNumber: event.phoneNumber,
          },
          null,
          2,
        )}`,
      );
    } catch (error) {
      this.logger.error(
        `[${requestId}] NORMALIZATION FAILED`,
        error instanceof Error ? error.stack : String(error),
      );

      this.logger.warn(
        `[${requestId}] DIAGNOSTIC ACKNOWLEDGEMENT: NORMALIZATION FAILED; CALLBACK NOT CONFIRMED AS PERSISTED.`,
      );

      return {
        ResultCode: 0,
        ResultDesc: 'Callback received for diagnostic inspection.',
      };
    }

    // -------------------------------------------------------------------------
    // 2. Delegate to FinancialModule
    // -------------------------------------------------------------------------

    this.logger.warn(`[${requestId}] STARTING FINANCIAL CALLBACK HANDLER`);

    this.logger.warn(`[${requestId}] TRANSACTION ID: ${event.transactionId}`);

    try {
      const result = await this.processC2BPaymentCallbackHandler.execute(event);

      this.logger.warn(`[${requestId}] FINANCIAL HANDLER RETURNED`);

      this.logger.warn(
        `[${requestId}] FINANCIAL HANDLER RESULT:\n${JSON.stringify(
          result,
          null,
          2,
        )}`,
      );

      if (result.processed) {
        this.logger.warn(`[${requestId}] CALLBACK PROCESSING REPORTED SUCCESS`);
      } else if (result.duplicate) {
        this.logger.warn(`[${requestId}] DUPLICATE CALLBACK IDENTIFIED`);
      } else if (result.requiresReconciliation) {
        this.logger.warn(
          `[${requestId}] CALLBACK REQUIRES RECONCILIATION: ${result.message}`,
        );
      } else {
        this.logger.warn(
          `[${requestId}] CALLBACK RETURNED WITHOUT PROCESSING CONFIRMATION`,
        );
      }
    } catch (error) {
      this.logger.error(
        `[${requestId}] FINANCIAL HANDLER THREW AN ERROR`,
        error instanceof Error ? error.stack : String(error),
      );

      this.logger.error(
        `[${requestId}] DATABASE RECEIPT PERSISTENCE IS NOT CONFIRMED.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Diagnostic acknowledgement
    // -------------------------------------------------------------------------

    this.logger.warn(
      `[${requestId}] C2B CALLBACK ACKNOWLEDGED FOR DIAGNOSTIC TESTING`,
    );

    this.logger.warn(
      `[${requestId}] IMPORTANT: ACKNOWLEDGEMENT DOES NOT PROVE DATABASE PERSISTENCE.`,
    );

    this.logger.warn(
      `[${requestId}] ==================================================`,
    );

    return {
      ResultCode: 0,
      ResultDesc: 'Callback received for diagnostic inspection.',
    };
  }

  // ===========================================================================
  // C2B Validation Callback
  // ===========================================================================

  /**
   * Validation workflow remains unchanged.
   *
   * The dedicated FinancialModule validation workflow has not yet
   * been connected.
   */
  @Post('c2b-validation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive M-PESA C2B validation callback',
    description:
      'Public Safaricom Daraja validation endpoint. The FinancialModule validation workflow is not yet configured.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation request rejected by the current validation policy.',
  })
  public validation(
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    this.logger.warn(
      '========== C2B VALIDATION HTTP REQUEST RECEIVED ==========',
    );

    this.logger.debug(
      `C2B VALIDATION HEADERS:\n${JSON.stringify(headers, null, 2)}`,
    );

    this.logger.debug(`C2B VALIDATION BODY:\n${JSON.stringify(body, null, 2)}`);

    this.logger.warn('C2B validation workflow is not configured.');

    return {
      ResultCode: 1,
      ResultDesc: 'C2B validation workflow is not configured.',
    };
  }
}

export default C2BCallbackController;
