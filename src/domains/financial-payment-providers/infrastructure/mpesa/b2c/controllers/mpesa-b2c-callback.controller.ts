import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MpesaB2CCallbackService } from '../services/mpesa-b2c-callback.service';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('M-PESA B2C Callbacks')
@Controller('webhooks/mpesa/b2c')
export class MpesaB2CCallbackController {
  private readonly logger = new Logger(MpesaB2CCallbackController.name);

  public constructor(
    private readonly callbackService: MpesaB2CCallbackService,
  ) {}

  // ===========================================================================
  // Safe Callback Arrival Diagnostics
  // ===========================================================================

  private logCallbackArrival(
    callbackType: 'RESULT' | 'TIMEOUT',
    body: unknown,
  ): void {
    const root =
      typeof body === 'object' && body !== null && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : null;

    const result =
      root &&
      typeof root['Result'] === 'object' &&
      root['Result'] !== null &&
      !Array.isArray(root['Result'])
        ? (root['Result'] as Record<string, unknown>)
        : null;

    this.logger.log(
      `[B2C CALLBACK INBOUND] ${JSON.stringify({
        callbackType,
        received: true,
        bodyType: typeof body,
        topLevelKeys: root ? Object.keys(root) : [],
        resultFound: result !== null,
        resultKeys: result ? Object.keys(result) : [],
        originatorConversationId:
          typeof result?.['OriginatorConversationID'] === 'string'
            ? result['OriginatorConversationID']
            : null,
        conversationId:
          typeof result?.['ConversationID'] === 'string'
            ? result['ConversationID']
            : null,
        resultCode: result?.['ResultCode'] ?? null,
      })}`,
    );
  }

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
            'ResultType',
            'ResultCode',
            'ResultDesc',
            'OriginatorConversationID',
            'ConversationID',
            'TransactionID',
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
              required: ['ResultParameter'],
              properties: {
                ResultParameter: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['Key'],
                    properties: {
                      Key: { type: 'string' },
                      Value: {
                        oneOf: [
                          { type: 'string' },
                          { type: 'number' },
                          { type: 'boolean' },
                          { type: 'null' },
                        ],
                      },
                    },
                  },
                },
              },
            },
            ReferenceData: {
              type: 'object',
              additionalProperties: true,
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
    // 1. Log arrival BEFORE validation and processing.
    this.logCallbackArrival('RESULT', body);

    // 2. Process callback.
    try {
      const result = await this.callbackService.processResultCallback(body);

      if (result.duplicate) {
        this.logger.warn(
          '[B2C CALLBACK RESULT] Duplicate callback acknowledged.',
        );
      } else if (result.processed) {
        this.logger.log(
          '[B2C CALLBACK RESULT] Callback processed successfully.',
        );
      } else {
        this.logger.warn(
          '[B2C CALLBACK RESULT] Callback received but not fully reconciled.',
        );
      }

      // 3. Return Daraja acknowledgement.
      return {
        ResultCode: 0,
        ResultDesc: 'Accepted',
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown processing error';

      this.logger.error(`[B2C CALLBACK RESULT] Processing failed: ${message}`);

      throw error;
    }
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
          },
          additionalProperties: true,
        },
      },
    },
  })
  public async receiveTimeoutCallback(@Body() body: unknown): Promise<{
    ResultCode: number;
    ResultDesc: string;
  }> {
    // 1. Log arrival BEFORE validation and processing.
    this.logCallbackArrival('TIMEOUT', body);

    // 2. Process callback.
    try {
      const result =
        await this.callbackService.processQueueTimeoutCallback(body);

      if (result.duplicate) {
        this.logger.warn(
          '[B2C CALLBACK TIMEOUT] Duplicate callback acknowledged.',
        );
      } else if (result.processed) {
        this.logger.log(
          '[B2C CALLBACK TIMEOUT] Callback recorded successfully.',
        );
      } else {
        this.logger.warn(
          '[B2C CALLBACK TIMEOUT] Callback received but not fully reconciled.',
        );
      }

      // 3. Return Daraja acknowledgement.
      return {
        ResultCode: 0,
        ResultDesc: 'Accepted',
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown processing error';

      this.logger.error(`[B2C CALLBACK TIMEOUT] Processing failed: ${message}`);

      throw error;
    }
  }
}

export default MpesaB2CCallbackController;
