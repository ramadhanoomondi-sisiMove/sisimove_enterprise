// -----------------------------------------------------------------------------
// M-PESA B2C — Callback HTTP Controller
// -----------------------------------------------------------------------------
//
// REST endpoints for asynchronous Safaricom Daraja B2C callbacks.
//
// Responsibilities:
//
// - Receive B2C result callbacks.
// - Receive B2C queue-timeout callbacks.
// - Delegate callback processing to MpesaB2CCallbackService.
// - Return the Daraja callback acknowledgement.
//
// Security:
//
// - These endpoints do not use application JWT authentication.
// - Callback processing and reconciliation are delegated to the service.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// M-PESA B2C — Callback Service
// -----------------------------------------------------------------------------

import { MpesaB2CCallbackService } from '../services/mpesa-b2c-callback.service';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('M-PESA B2C Callbacks')
@Controller('webhooks/mpesa/b2c')
export class MpesaB2CCallbackController {
  private readonly logger = new Logger(MpesaB2CCallbackController.name);

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly callbackService: MpesaB2CCallbackService,
  ) {}

  // ===========================================================================
  // B2C Result Callback
  // ===========================================================================

  @Post('result')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive M-PESA B2C result callback',
    description:
      'Receives asynchronous B2C disbursement results from Safaricom Daraja.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['Result'],
      properties: {
        Result: {
          type: 'object',
          required: [
            'ResultCode',
            'ResultDesc',
            'OriginatorConversationID',
            'ConversationID',
          ],
          properties: {
            ResultType: { type: 'number' },
            ResultCode: {
              oneOf: [{ type: 'number' }, { type: 'string' }],
            },
            ResultDesc: { type: 'string' },
            OriginatorConversationID: { type: 'string' },
            ConversationID: { type: 'string' },
            TransactionID: { type: 'string' },
            ResultParameters: {
              type: 'object',
              properties: {
                ResultParameter: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      Key: { type: 'string' },
                      Value: {
                        oneOf: [{ type: 'string' }, { type: 'number' }],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  public async receiveResultCallback(@Body() body: unknown): Promise<{
    ResultCode: number;
    ResultDesc: string;
  }> {
    // -------------------------------------------------------------------------
    // 1. Process Safaricom B2C result callback
    // -------------------------------------------------------------------------

    const result = await this.callbackService.processResultCallback(body);

    // -------------------------------------------------------------------------
    // 2. Log processing outcome
    // -------------------------------------------------------------------------

    if (result.duplicate) {
      this.logger.warn('Duplicate M-PESA B2C result callback acknowledged.');
    } else if (result.processed) {
      this.logger.log('M-PESA B2C result callback processed successfully.');
    }

    // -------------------------------------------------------------------------
    // 3. Return Daraja acknowledgement
    // -------------------------------------------------------------------------

    return {
      ResultCode: 0,
      ResultDesc: 'Accepted',
    };
  }

  // ===========================================================================
  // B2C Queue Timeout Callback
  // ===========================================================================

  @Post('timeout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive M-PESA B2C queue-timeout callback',
    description:
      'Receives asynchronous B2C queue-timeout notifications from Safaricom Daraja.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['Result'],
      properties: {
        Result: {
          type: 'object',
          required: ['OriginatorConversationID'],
          properties: {
            ResultType: { type: 'number' },
            ResultCode: {
              oneOf: [{ type: 'number' }, { type: 'string' }],
            },
            ResultDesc: { type: 'string' },
            OriginatorConversationID: { type: 'string' },
            ConversationID: { type: 'string' },
            TransactionID: { type: 'string' },
          },
        },
      },
    },
  })
  public async receiveTimeoutCallback(@Body() body: unknown): Promise<{
    ResultCode: number;
    ResultDesc: string;
  }> {
    // -------------------------------------------------------------------------
    // 1. Process Safaricom B2C queue-timeout callback
    // -------------------------------------------------------------------------

    const result = await this.callbackService.processQueueTimeoutCallback(body);

    // -------------------------------------------------------------------------
    // 2. Log processing outcome
    // -------------------------------------------------------------------------

    if (result.duplicate) {
      this.logger.warn(
        'Duplicate M-PESA B2C queue-timeout callback acknowledged.',
      );
    } else if (result.processed) {
      this.logger.log(
        'M-PESA B2C queue-timeout callback recorded successfully.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Return Daraja acknowledgement
    // -------------------------------------------------------------------------

    return {
      ResultCode: 0,
      ResultDesc: 'Accepted',
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MpesaB2CCallbackController;
