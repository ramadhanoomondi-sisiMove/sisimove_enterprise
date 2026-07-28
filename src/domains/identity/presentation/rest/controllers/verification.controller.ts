// src/domains/identity/presentation/rest/verification.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

//
// Guards
//
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';

//
// Security
//
import { RequirePermissions } from '../../auth/require-permissions.decorator';

//
// DTOs
//
import { StartVerificationDto } from '../dto/start-verification.dto';
import { SubmitVerificationRequestDto } from '../dto/submit-verification-request.dto';
import { ApproveVerificationRequestDto } from '../dto/approve-verification-request.dto';
import { RejectVerificationRequestDto } from '../dto/reject-verification-request.dto';
import { RevokeVerificationDto } from '../dto/revoke-verification.dto';

//
// Response DTOs
//
import { SuccessResponseDto } from '../responses/success-response.dto';
import { VerificationCreatedResponseDto } from '../responses/verification-created-response.dto';
import { VerificationRequestCreatedResponseDto } from '../responses/verification-request-created-response.dto';

//
// Commands
//
import { StartVerificationCommand } from '../../../application/commands/start-verification.command';
import { SubmitVerificationRequestCommand } from '../../../application/commands/submit-verification-request.command';
import { ApproveVerificationRequestCommand } from '../../../application/commands/approve-verification-request.command';
import { RejectVerificationRequestCommand } from '../../../application/commands/reject-verification-request.command';
import { RenewVerificationCommand } from '../../../application/commands/renew-verification.command';
import { ExpireVerificationCommand } from '../../../application/commands/expire-verification.command';
import { RevokeVerificationCommand } from '../../../application/commands/revoke-verification.command';

//
// Queries
//
import { GetVerificationQuery } from '../../../application/queries/get-verification.query';
import { GetVerificationSummaryQuery } from '../../../application/queries/get-verification-summary.query';
import { GetVerificationRequestQuery } from '../../../application/queries/get-verification-request.query';
import { GetVerificationReviewQuery } from '../../../application/queries/get-verification-review.query';
import { ListVerificationsQuery } from '../../../application/queries/list-verifications.query';
import { ListPendingVerificationsQuery } from '../../../application/queries/list-pending-verifications.query';
import { ListExpiredVerificationsQuery } from '../../../application/queries/list-expired-verifications.query';

//
// Contracts
//
import type { VerificationResult } from '../../../application/contracts/verification-result';
import type { VerificationSummary } from '../../../application/contracts/verification-summary';
import type { VerificationRequestResult } from '../../../application/contracts/verification-request-result';
import type { VerificationReviewResult } from '../../../application/contracts/verification-review-result';
import type { VerificationListItem } from '../../../application/contracts/verification-list-item';

//
// Command Handlers
//
import { StartVerificationHandler } from '../../../application/handlers/start-verification.handler';
import { SubmitVerificationRequestHandler } from '../../../application/handlers/submit-verification-request.handler';
import { ApproveVerificationRequestHandler } from '../../../application/handlers/approve-verification-request.handler';
import { RejectVerificationRequestHandler } from '../../../application/handlers/reject-verification-request.handler';
import { RenewVerificationHandler } from '../../../application/handlers/renew-verification.handler';
import { ExpireVerificationHandler } from '../../../application/handlers/expire-verification.handler';
import { RevokeVerificationHandler } from '../../../application/handlers/revoke-verification.handler';

//
// Query Handlers
//
import { GetVerificationHandler } from '../../../application/handlers/query-handlers/get-verification.handler';
import { GetVerificationSummaryHandler } from '../../../application/handlers/query-handlers/get-verification-summary.handler';
import { GetVerificationRequestHandler } from '../../../application/handlers/query-handlers/get-verification-request.handler';
import { GetVerificationReviewHandler } from '../../../application/handlers/query-handlers/get-verification-review.handler';
import { ListVerificationsHandler } from '../../../application/handlers/query-handlers/list-verifications.handler';
import { ListPendingVerificationsHandler } from '../../../application/handlers/query-handlers/list-pending-verifications.handler';
import { ListExpiredVerificationsHandler } from '../../../application/handlers/query-handlers/list-expired-verifications.handler';

//
// Value Objects
//
import { CorrelationId } from '../../../domain/value-objects/correlation-id.vo';

@ApiTags('Identity Verification')
@ApiBearerAuth()
@Controller('verifications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VerificationController {
  constructor(
    //
    // Command Handlers
    //
    private readonly startVerificationHandler: StartVerificationHandler,
    private readonly submitVerificationRequestHandler: SubmitVerificationRequestHandler,
    private readonly approveVerificationRequestHandler: ApproveVerificationRequestHandler,
    private readonly rejectVerificationRequestHandler: RejectVerificationRequestHandler,
    private readonly renewVerificationHandler: RenewVerificationHandler,
    private readonly expireVerificationHandler: ExpireVerificationHandler,
    private readonly revokeVerificationHandler: RevokeVerificationHandler,

    //
    // Query Handlers
    //
    private readonly getVerificationHandler: GetVerificationHandler,
    private readonly getVerificationSummaryHandler: GetVerificationSummaryHandler,
    private readonly getVerificationRequestHandler: GetVerificationRequestHandler,
    private readonly getVerificationReviewHandler: GetVerificationReviewHandler,
    private readonly listVerificationsHandler: ListVerificationsHandler,
    private readonly listPendingVerificationsHandler: ListPendingVerificationsHandler,
    private readonly listExpiredVerificationsHandler: ListExpiredVerificationsHandler,
  ) {}

  @Post()
  @RequirePermissions('VERIFICATION_CREATE')
  @ApiOperation({
    summary: 'Start verification',
    description: 'Starts a new identity verification.',
  })
  @ApiCreatedResponse({
    description: 'Verification started successfully.',
    type: VerificationCreatedResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async startVerification(
    @Body() dto: StartVerificationDto,
  ): Promise<VerificationCreatedResponseDto> {
    const verificationPublicId = await this.startVerificationHandler.execute(
      new StartVerificationCommand(
        dto.identityPublicId,
        CorrelationId.generate().value,
      ),
    );

    return {
      verificationPublicId,
    };
  }

  @Post(':verificationPublicId/requests')
  @RequirePermissions('VERIFICATION_SUBMIT')
  @ApiOperation({
    summary: 'Submit verification request',
    description: 'Submits a verification artifact for review.',
  })
  @ApiCreatedResponse({
    description: 'Verification request submitted.',
    type: VerificationRequestCreatedResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Verification not found.',
  })
  async submitVerificationRequest(
    @Param('verificationPublicId')
    verificationPublicId: string,

    @Body()
    dto: SubmitVerificationRequestDto,
  ): Promise<VerificationRequestCreatedResponseDto> {
    const requestPublicId = await this.submitVerificationRequestHandler.execute(
      new SubmitVerificationRequestCommand(
        verificationPublicId,
        dto.type,
        dto.assetPublicId,
        dto.metadata,
        CorrelationId.generate().value,
      ),
    );

    return {
      requestPublicId,
    };
  }

  @Post(':verificationPublicId/requests/:requestPublicId/approve')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('VERIFICATION_APPROVE')
  @ApiOperation({
    summary: 'Approve verification request',
  })
  @ApiOkResponse({
    description: 'Verification request approved.',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Verification or request not found.',
  })
  async approveVerificationRequest(
    @Param('verificationPublicId')
    verificationPublicId: string,

    @Param('requestPublicId')
    requestPublicId: string,

    @Body()
    dto: ApproveVerificationRequestDto,
  ): Promise<SuccessResponseDto> {
    await this.approveVerificationRequestHandler.execute(
      new ApproveVerificationRequestCommand(
        verificationPublicId,
        requestPublicId,
        dto.reviewerIdentityPublicId,
        CorrelationId.generate().value,
      ),
    );

    return {
      message: 'Verification request approved successfully.',
    };
  }

  @Post(':verificationPublicId/requests/:requestPublicId/reject')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('VERIFICATION_REJECT')
  @ApiOperation({
    summary: 'Reject verification request',
  })
  @ApiOkResponse({
    description: 'Verification request rejected.',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Verification or request not found.',
  })
  async rejectVerificationRequest(
    @Param('verificationPublicId')
    verificationPublicId: string,

    @Param('requestPublicId')
    requestPublicId: string,

    @Body()
    dto: RejectVerificationRequestDto,
  ): Promise<SuccessResponseDto> {
    await this.rejectVerificationRequestHandler.execute(
      new RejectVerificationRequestCommand(
        verificationPublicId,
        requestPublicId,
        dto.reviewerIdentityPublicId,
        dto.rejectionReason,
        CorrelationId.generate().value,
      ),
    );

    return {
      message: 'Verification request rejected successfully.',
    };
  }

  @Post(':verificationPublicId/renew')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('VERIFICATION_RENEW')
  @ApiOperation({
    summary: 'Renew verification',
    description: 'Renews an expired verification.',
  })
  @ApiOkResponse({
    description: 'Verification renewed successfully.',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Verification not found.',
  })
  async renewVerification(
    @Param('verificationPublicId')
    verificationPublicId: string,
  ): Promise<SuccessResponseDto> {
    await this.renewVerificationHandler.execute(
      new RenewVerificationCommand(
        verificationPublicId,
        CorrelationId.generate().value,
      ),
    );

    return {
      message: 'Verification renewed successfully.',
    };
  }

  @Post(':verificationPublicId/expire')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('VERIFICATION_EXPIRE')
  @ApiOperation({
    summary: 'Expire verification',
    description: 'Expires an active verification.',
  })
  @ApiOkResponse({
    description: 'Verification expired successfully.',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Verification not found.',
  })
  async expireVerification(
    @Param('verificationPublicId')
    verificationPublicId: string,
  ): Promise<SuccessResponseDto> {
    await this.expireVerificationHandler.execute(
      new ExpireVerificationCommand(
        verificationPublicId,
        CorrelationId.generate().value,
      ),
    );

    return {
      message: 'Verification expired successfully.',
    };
  }

  @Post(':verificationPublicId/revoke')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('VERIFICATION_REVOKE')
  @ApiOperation({
    summary: 'Revoke verification',
    description: 'Revokes a verification and records the revocation reason.',
  })
  @ApiOkResponse({
    description: 'Verification revoked successfully.',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Verification not found.',
  })
  async revokeVerification(
    @Param('verificationPublicId')
    verificationPublicId: string,

    @Body()
    dto: RevokeVerificationDto,
  ): Promise<SuccessResponseDto> {
    await this.revokeVerificationHandler.execute(
      new RevokeVerificationCommand(
        verificationPublicId,
        dto.reviewerIdentityPublicId,
        dto.revocationReason,
        CorrelationId.generate().value,
      ),
    );

    return {
      message: 'Verification revoked successfully.',
    };
  }

  @Get()
  @RequirePermissions('VERIFICATION_VIEW')
  @ApiOperation({
    summary: 'List verifications',
    description: 'Returns all verification records.',
  })
  @ApiOkResponse({
    description: 'Verification list retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async listVerifications(): Promise<VerificationListItem[]> {
    return this.listVerificationsHandler.execute(new ListVerificationsQuery());
  }

  @Get('pending')
  @RequirePermissions('VERIFICATION_REVIEW')
  @ApiOperation({
    summary: 'List pending verifications',
    description: 'Returns verifications awaiting review.',
  })
  @ApiOkResponse({
    description: 'Pending verifications retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async listPendingVerifications(): Promise<VerificationListItem[]> {
    return this.listPendingVerificationsHandler.execute(
      new ListPendingVerificationsQuery(),
    );
  }

  @Get('expired')
  @RequirePermissions('VERIFICATION_VIEW')
  @ApiOperation({
    summary: 'List expired verifications',
    description: 'Returns expired verifications.',
  })
  @ApiOkResponse({
    description: 'Expired verifications retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async listExpiredVerifications(): Promise<VerificationListItem[]> {
    return this.listExpiredVerificationsHandler.execute(
      new ListExpiredVerificationsQuery(),
    );
  }

  @Get(':verificationPublicId')
  @RequirePermissions('VERIFICATION_VIEW')
  @ApiOperation({
    summary: 'Get verification',
    description: 'Returns a verification projection.',
  })
  @ApiOkResponse({
    description: 'Verification retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Verification not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async getVerification(
    @Param('verificationPublicId')
    verificationPublicId: string,
  ): Promise<VerificationResult | null> {
    return this.getVerificationHandler.execute(
      new GetVerificationQuery(verificationPublicId),
    );
  }

  @Get(':verificationPublicId/summary')
  @RequirePermissions('VERIFICATION_VIEW')
  @ApiOperation({
    summary: 'Get verification summary',
    description: 'Returns a lightweight verification summary.',
  })
  @ApiOkResponse({
    description: 'Verification summary retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Verification not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async getVerificationSummary(
    @Param('verificationPublicId')
    verificationPublicId: string,
  ): Promise<VerificationSummary | null> {
    return this.getVerificationSummaryHandler.execute(
      new GetVerificationSummaryQuery(verificationPublicId),
    );
  }

  @Get('requests/:requestPublicId')
  @RequirePermissions('VERIFICATION_VIEW')
  @ApiOperation({
    summary: 'Get verification request',
    description: 'Returns a verification request.',
  })
  @ApiOkResponse({
    description: 'Verification request retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Verification request not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async getVerificationRequest(
    @Param('requestPublicId')
    requestPublicId: string,
  ): Promise<VerificationRequestResult | null> {
    return this.getVerificationRequestHandler.execute(
      new GetVerificationRequestQuery(requestPublicId),
    );
  }

  @Get('requests/:requestPublicId/review')
  @RequirePermissions('VERIFICATION_VIEW')
  @ApiOperation({
    summary: 'Get verification review',
    description: 'Returns the review outcome for a verification request.',
  })
  @ApiOkResponse({
    description: 'Verification review retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Verification review not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async getVerificationReview(
    @Param('requestPublicId')
    requestPublicId: string,
  ): Promise<VerificationReviewResult | null> {
    return this.getVerificationReviewHandler.execute(
      new GetVerificationReviewQuery(requestPublicId),
    );
  }
}
