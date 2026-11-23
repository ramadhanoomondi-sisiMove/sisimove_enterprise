import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import express from 'express';

@Controller('/c2b-diagnostic')
export class C2BDiagnosticCallbackController {
  private readonly logger = new Logger(C2BDiagnosticCallbackController.name);

  @Post('confirmation')
  @HttpCode(HttpStatus.OK)
  handleConfirmation(
    @Body() payload: Record<string, unknown>,
    @Req() request: express.Request,
  ) {
    this.logger.log(
      JSON.stringify({
        event: 'C2B_DIAGNOSTIC_CONFIRMATION_RECEIVED',
        receivedAt: new Date().toISOString(),
        method: request.method,
        path: request.originalUrl,
        contentType: request.headers['content-type'],
        userAgent: request.headers['user-agent'],
        payloadFields: Object.keys(payload ?? {}),
        transactionId: payload?.TransID ?? null,
        transactionTime: payload?.TransTime ?? null,
        amount: payload?.TransAmount ?? null,
        businessShortCode: payload?.BusinessShortCode ?? null,
        billReference: payload?.BillRefNumber ?? null,
        phoneLastFour:
          typeof payload?.MSISDN === 'string' ? payload.MSISDN.slice(-4) : null,
      }),
    );

    return {
      ResultCode: 0,
      ResultDesc: 'Diagnostic confirmation received',
    };
  }

  @Post('validation')
  @HttpCode(HttpStatus.OK)
  handleValidation(
    @Body() payload: Record<string, unknown>,
    @Req() request: express.Request,
  ) {
    this.logger.log(
      JSON.stringify({
        event: 'C2B_DIAGNOSTIC_VALIDATION_RECEIVED',
        receivedAt: new Date().toISOString(),
        method: request.method,
        path: request.originalUrl,
        contentType: request.headers['content-type'],
        userAgent: request.headers['user-agent'],
        payloadFields: Object.keys(payload ?? {}),
        billReference: payload?.BillRefNumber ?? null,
        businessShortCode: payload?.BusinessShortCode ?? null,
      }),
    );

    return {
      ResultCode: 0,
      ResultDesc: 'Diagnostic validation received',
    };
  }
}
