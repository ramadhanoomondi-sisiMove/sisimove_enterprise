// -----------------------------------------------------------------------------
// M-PESA — Callback HTTP Controller
// -----------------------------------------------------------------------------
//
// REST endpoint for asynchronous Safaricom Daraja STK Push callbacks.
//
// Responsibilities:
//
// - Receive Safaricom callback notifications.
// - Delegate callback processing to MpesaCallbackService.
// - Return the Daraja callback acknowledgement.
//
// Security:
//
// - This endpoint does not use application JWT authentication.
// - Callback processing is delegated to the application service.
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
// Payments — Callback Service
// -----------------------------------------------------------------------------

import { MpesaCallbackService } from './mpesa-callback.service';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('M-PESA Callbacks')
@Controller('webhooks/mpesa')
export class MpesaCallbackController {
  private readonly logger = new Logger(MpesaCallbackController.name);

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly callbackService: MpesaCallbackService) {}

  // ===========================================================================
  // STK Push Callback
  // ===========================================================================

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive M-PESA STK Push callback',
    description: 'Receives asynchronous payment results from Safaricom Daraja.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['Body'],
      properties: {
        Body: {
          type: 'object',
          required: ['stkCallback'],
          properties: {
            stkCallback: {
              type: 'object',
              properties: {
                MerchantRequestID: { type: 'string' },
                CheckoutRequestID: { type: 'string' },
                ResultCode: { type: 'number' },
                ResultDesc: { type: 'string' },
                CallbackMetadata: {
                  type: 'object',
                  properties: {
                    Item: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          Name: { type: 'string' },
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
      },
    },
  })
  public async receiveCallback(
    @Body()
    body: unknown,
  ): Promise<{
    ResultCode: number;
    ResultDesc: string;
  }> {
    // -------------------------------------------------------------------------
    // 1. Process Safaricom callback
    // -------------------------------------------------------------------------

    const result = await this.callbackService.processCallback(body);

    // -------------------------------------------------------------------------
    // 2. Log processing outcome
    // -------------------------------------------------------------------------

    if (result.duplicate) {
      this.logger.warn('Duplicate M-PESA callback acknowledged.');
    } else if (result.processed) {
      this.logger.log('M-PESA callback processed successfully.');
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

export default MpesaCallbackController;
