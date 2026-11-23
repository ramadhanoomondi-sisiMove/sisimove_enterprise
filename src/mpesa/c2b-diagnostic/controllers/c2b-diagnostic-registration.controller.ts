/**
 * -----------------------------------------------------------------------------
 * SisiMove — C2B Diagnostic Registration Controller
 * -----------------------------------------------------------------------------
 *
 * Temporary diagnostic endpoint for independently registering C2B callback
 * URLs with Safaricom Daraja.
 *
 * Security:
 * - Temporarily accessible without authentication during development.
 * - Must be protected before production deployment.
 *
 * -----------------------------------------------------------------------------
 */

import { Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import { C2BDiagnosticRegistrationService } from '../services/c2b-diagnostic-registration.service';

@Controller('mpesa/c2b-diagnostic')
export class C2BDiagnosticRegistrationController {
  private readonly logger = new Logger(
    C2BDiagnosticRegistrationController.name,
  );

  constructor(
    private readonly registrationService: C2BDiagnosticRegistrationService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register() {
    this.logger.warn('C2B_DIAGNOSTIC_REGISTRATION_REQUESTED');

    const response = await this.registrationService.register();

    return {
      success: true,
      message: 'C2B diagnostic callback URLs registered successfully.',
      response: {
        ResponseCode: response.ResponseCode,
        ResponseDescription: response.ResponseDescription,
        OriginatorConversationID: response.OriginatorConversationID,
        ConversationID: response.ConversationID,
      },
    };
  }
}

export default C2BDiagnosticRegistrationController;
