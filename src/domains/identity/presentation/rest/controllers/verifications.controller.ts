// -----------------------------------------------------------------------------
// Verification — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Verification aggregate and Verification Request
// operations.
//
// Aggregate boundaries:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// Applicant flow:
//
// 1. POST   /verifications
//    Start verification for the authenticated identity.
//
// 2. POST   /verifications/:verificationPublicId/requests
//    Submit a verification request for the authenticated identity's
//    verification aggregate.
//
// Reviewer flow:
//
// 3. PATCH  /verifications/:verificationPublicId/requests/:requestId/approve
// 4. PATCH  /verifications/:verificationPublicId/requests/:requestId/reject
// 5. PATCH  /verifications/:verificationPublicId/grant-member
// 6. PATCH  /verifications/:verificationPublicId/grant-driver
// 7. PATCH  /verifications/:verificationPublicId/reject
// 8. PATCH  /verifications/:verificationPublicId/reopen
// 9. PATCH  /verifications/:verificationPublicId/expire
// 10. PATCH /verifications/:verificationPublicId/revoke
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - extraction of authenticated identity from JWT security context;
// - conversion of transport primitives to domain value objects;
// - generation of application correlation metadata;
// - dispatching application commands and queries;
// - mapping domain results to HTTP response models.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - VerificationAggregate;
// - VerificationRequestEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - VerificationRepository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

import type { AuthenticatedIdentity } from '../../../../../foundation/security/auth/authenticated-identity.interface';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../../../application/identity.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  ApproveVerificationRequestCommand,
  CancelVerificationRequestCommand,
  CreateVerificationCommand,
  CreateVerificationRequestCommand,
  ExpireVerificationCommand,
  GrantDriverVerificationCommand,
  GrantMemberVerificationCommand,
  RejectVerificationCommand,
  RejectVerificationRequestCommand,
  ReopenVerificationCommand,
  RevokeVerificationCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetVerificationQuery,
  GetVerificationRequestQuery,
  GetVerificationRequestsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { VerificationAggregate } from '../../../domain/aggregates/verification.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import type { VerificationRequestEntity } from '../../../domain/entities';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  IdentityPublicId,
  VerificationPublicId,
  VerificationRequestAssetPublicId,
  VerificationRequestPublicId,
  VerificationRequestType,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CreateVerificationRequestRequestDto,
  GrantDriverVerificationRequestDto,
  GrantMemberVerificationRequestDto,
  RejectVerificationRequestDto,
  RejectVerificationRequestRequestDto,
  RevokeVerificationRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import {
  GetVerificationQueryDto,
  GetVerificationRequestQueryDto,
  GetVerificationRequestsQueryDto,
} from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Models
// -----------------------------------------------------------------------------

import type {
  VerificationRequestResponse,
  VerificationResponse,
} from '../mappers/verification.response.mapper';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { VerificationResponseMapper } from '../mappers/verification.response.mapper';

// =============================================================================
// Authenticated Request
// =============================================================================
//
// JwtAuthGuard populates req.user from the value returned by JwtStrategy.
//
// The JWT itself contains:
//
//     sub = IdentityPublicId
//
// JwtStrategy validates that token and maps:
//
//     payload.sub
//          ↓
//     request.user.identityPublicId
//
// Therefore the controller must read:
//
//     req.user.identityPublicId
//
// and must NOT read:
//
//     req.user.sub
//
// The controller trusts only the authenticated security context for the actor
// identity. Identity must never be accepted from a caller-controlled DTO when
// it can be obtained from the JWT.
//
// -----------------------------------------------------------------------------

interface AuthenticatedRequest extends Request {
  user: AuthenticatedIdentity;
}

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Verifications')
@Controller('verifications')
export class VerificationsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Verification Command Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_VERIFICATION)
    private readonly createVerificationHandler: CommandHandler<
      CreateVerificationCommand,
      VerificationAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.GRANT_MEMBER_VERIFICATION)
    private readonly grantMemberVerificationHandler: CommandHandler<
      GrantMemberVerificationCommand,
      VerificationAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.GRANT_DRIVER_VERIFICATION)
    private readonly grantDriverVerificationHandler: CommandHandler<
      GrantDriverVerificationCommand,
      VerificationAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.REJECT_VERIFICATION)
    private readonly rejectVerificationHandler: CommandHandler<
      RejectVerificationCommand,
      VerificationAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.REOPEN_VERIFICATION)
    private readonly reopenVerificationHandler: CommandHandler<
      ReopenVerificationCommand,
      VerificationAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.EXPIRE_VERIFICATION)
    private readonly expireVerificationHandler: CommandHandler<
      ExpireVerificationCommand,
      VerificationAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.REVOKE_VERIFICATION)
    private readonly revokeVerificationHandler: CommandHandler<
      RevokeVerificationCommand,
      VerificationAggregate
    >,

    // -------------------------------------------------------------------------
    // Verification Request Command Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_VERIFICATION_REQUEST)
    private readonly createVerificationRequestHandler: CommandHandler<
      CreateVerificationRequestCommand,
      VerificationRequestEntity
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.APPROVE_VERIFICATION_REQUEST)
    private readonly approveVerificationRequestHandler: CommandHandler<
      ApproveVerificationRequestCommand,
      VerificationRequestEntity
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.REJECT_VERIFICATION_REQUEST)
    private readonly rejectVerificationRequestHandler: CommandHandler<
      RejectVerificationRequestCommand,
      VerificationRequestEntity
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CANCEL_VERIFICATION_REQUEST)
    private readonly cancelVerificationRequestHandler: CommandHandler<
      CancelVerificationRequestCommand,
      VerificationRequestEntity
    >,

    // -------------------------------------------------------------------------
    // Verification Query Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_VERIFICATION)
    private readonly getVerificationHandler: QueryHandler<
      GetVerificationQuery,
      VerificationAggregate | null
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_VERIFICATION_REQUESTS)
    private readonly getVerificationRequestsHandler: QueryHandler<
      GetVerificationRequestsQuery,
      readonly VerificationRequestEntity[]
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_VERIFICATION_REQUEST)
    private readonly getVerificationRequestHandler: QueryHandler<
      GetVerificationRequestQuery,
      VerificationRequestEntity | null
    >,
  ) {}

  // ===========================================================================
  // Verification Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Verification
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get a verification',
    description: 'Returns a verification aggregate by its public ID.',
  })
  @Get(':verificationPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification:read')
  public async get(
    @Param() dto: GetVerificationQueryDto,
  ): Promise<VerificationResponse | null> {
    const query = new GetVerificationQuery(
      new VerificationPublicId(dto.verificationPublicId),
    );

    const aggregate = await this.getVerificationHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Verification Requests
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List verification requests',
    description:
      'Returns all verification requests belonging to the specified verification.',
  })
  @Get(':verificationPublicId/requests')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification-request:read')
  public async getRequests(
    @Param() dto: GetVerificationRequestsQueryDto,
  ): Promise<VerificationRequestResponse[]> {
    const query = new GetVerificationRequestsQuery(
      new VerificationPublicId(dto.verificationPublicId),
    );

    const requests = await this.getVerificationRequestsHandler.execute(query);

    return VerificationResponseMapper.requestsFromEntities(requests);
  }

  // ---------------------------------------------------------------------------
  // Get Verification Request
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get a verification request',
    description:
      'Returns a single verification request belonging to the specified verification.',
  })
  @Get(':verificationPublicId/requests/:verificationRequestPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification-request:read')
  public async getRequest(
    @Param() dto: GetVerificationRequestQueryDto,
  ): Promise<VerificationRequestResponse | null> {
    const query = new GetVerificationRequestQuery(
      new VerificationPublicId(dto.verificationPublicId),
      new VerificationRequestPublicId(dto.verificationRequestPublicId),
    );

    const request = await this.getVerificationRequestHandler.execute(query);

    if (request === null) {
      return null;
    }

    return VerificationResponseMapper.requestFromEntity(request);
  }

  // ===========================================================================
  // Applicant — Verification
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Start Verification
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Start verification',
    description:
      'Creates the verification aggregate for the authenticated identity. This is the first step in the verification flow.',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(
    @Req() req: AuthenticatedRequest,
  ): Promise<VerificationResponse> {
    const command = new CreateVerificationCommand(
      new IdentityPublicId(req.user.identityPublicId),
      randomUUID(),
    );

    const aggregate = await this.createVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Reviewer — Verification
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Grant Member Verification
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Grant member verification',
    description:
      'Grants member verification after a verification request has been reviewed and approved.',
  })
  @Patch(':verificationPublicId/grant-member')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification:grant-member')
  public async grantMember(
    @Param('verificationPublicId') verificationPublicId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: GrantMemberVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const reviewerPublicId = new IdentityPublicId(req.user.identityPublicId);

    const command = new GrantMemberVerificationCommand(
      reviewerPublicId,
      new VerificationPublicId(verificationPublicId),
      new VerificationRequestPublicId(dto.verificationRequestPublicId),
      reviewerPublicId,
      randomUUID(),
    );

    const aggregate =
      await this.grantMemberVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Grant Driver Verification
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Grant driver verification',
    description:
      'Grants driver verification after a verification request has been reviewed and approved.',
  })
  @Patch(':verificationPublicId/grant-driver')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification:grant-driver')
  public async grantDriver(
    @Param('verificationPublicId') verificationPublicId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: GrantDriverVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const reviewerPublicId = new IdentityPublicId(req.user.identityPublicId);

    const command = new GrantDriverVerificationCommand(
      reviewerPublicId,
      new VerificationPublicId(verificationPublicId),
      new VerificationRequestPublicId(dto.verificationRequestPublicId),
      reviewerPublicId,
      randomUUID(),
    );

    const aggregate =
      await this.grantDriverVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Reject Verification
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Reject verification',
    description: 'Rejects the verification aggregate after review.',
  })
  @Patch(':verificationPublicId/reject')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification:reject')
  public async reject(
    @Req() req: AuthenticatedRequest,
    @Body() dto: RejectVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const reviewerPublicId = new IdentityPublicId(req.user.identityPublicId);

    const command = new RejectVerificationCommand(
      reviewerPublicId,
      new VerificationRequestPublicId(dto.requestPublicId),
      reviewerPublicId,
      dto.reason,
      randomUUID(),
    );

    const aggregate = await this.rejectVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Reopen Verification
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Reopen verification',
    description:
      'Reopens a verification that was previously rejected or expired according to domain rules.',
  })
  @Patch(':verificationPublicId/reopen')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification:reopen')
  public async reopen(
    @Param('verificationPublicId') verificationPublicId: string,
  ): Promise<VerificationResponse> {
    const command = new ReopenVerificationCommand(
      new VerificationPublicId(verificationPublicId),
      randomUUID(),
    );

    const aggregate = await this.reopenVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Expire Verification
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Expire verification',
    description:
      'Expires a verification according to the application workflow.',
  })
  @Patch(':verificationPublicId/expire')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification:expire')
  public async expire(
    @Req() req: AuthenticatedRequest,
  ): Promise<VerificationResponse> {
    const command = new ExpireVerificationCommand(
      new IdentityPublicId(req.user.identityPublicId),
      randomUUID(),
    );

    const aggregate = await this.expireVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Revoke Verification
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Revoke verification',
    description: 'Revokes an existing verification.',
  })
  @Patch(':verificationPublicId/revoke')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification:revoke')
  public async revoke(
    @Req() req: AuthenticatedRequest,
    @Body() dto: RevokeVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const actorPublicId = new IdentityPublicId(req.user.identityPublicId);

    const command = new RevokeVerificationCommand(
      actorPublicId,
      actorPublicId,
      dto.reason,
      randomUUID(),
    );

    const aggregate = await this.revokeVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Applicant — Verification Requests
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Verification Request
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Submit verification request',
    description:
      'Creates a verification request for the authenticated identity. Start verification first with POST /verifications.',
  })
  @Post(':verificationPublicId/requests')
  @UseGuards(JwtAuthGuard)
  public async createRequest(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateVerificationRequestRequestDto,
  ): Promise<VerificationRequestResponse> {
    const command = new CreateVerificationRequestCommand(
      new IdentityPublicId(req.user.identityPublicId),
      VerificationRequestType.create(dto.type),
      new VerificationRequestAssetPublicId(dto.assetPublicId),
      randomUUID(),
    );

    const request =
      await this.createVerificationRequestHandler.execute(command);

    return VerificationResponseMapper.requestFromEntity(request);
  }

  // ===========================================================================
  // Reviewer — Verification Requests
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Approve Verification Request
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Approve verification request',
    description: 'Approves a verification request after reviewer validation.',
  })
  @Patch(':verificationPublicId/requests/:verificationRequestPublicId/approve')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification-request:approve')
  public async approveRequest(
    @Param('verificationRequestPublicId')
    verificationRequestPublicId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<VerificationRequestResponse> {
    const reviewerPublicId = new IdentityPublicId(req.user.identityPublicId);

    const command = new ApproveVerificationRequestCommand(
      reviewerPublicId,
      new VerificationRequestPublicId(verificationRequestPublicId),
      reviewerPublicId,
      randomUUID(),
    );

    const request =
      await this.approveVerificationRequestHandler.execute(command);

    return VerificationResponseMapper.requestFromEntity(request);
  }

  // ---------------------------------------------------------------------------
  // Reject Verification Request
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Reject verification request',
    description: 'Rejects a verification request after reviewer validation.',
  })
  @Patch(':verificationPublicId/requests/:verificationRequestPublicId/reject')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('verification-request:reject')
  public async rejectRequest(
    @Param('verificationRequestPublicId')
    verificationRequestPublicId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: RejectVerificationRequestRequestDto,
  ): Promise<VerificationRequestResponse> {
    const reviewerPublicId = new IdentityPublicId(req.user.identityPublicId);

    const command = new RejectVerificationRequestCommand(
      reviewerPublicId,
      new VerificationRequestPublicId(verificationRequestPublicId),
      reviewerPublicId,
      dto.reason,
      randomUUID(),
    );

    const request =
      await this.rejectVerificationRequestHandler.execute(command);

    return VerificationResponseMapper.requestFromEntity(request);
  }

  // ---------------------------------------------------------------------------
  // Cancel Verification Request
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancel verification request',
    description:
      'Cancels a pending verification request belonging to the authenticated identity.',
  })
  @Patch(':verificationPublicId/requests/:verificationRequestPublicId/cancel')
  @UseGuards(JwtAuthGuard)
  public async cancelRequest(
    @Param('verificationRequestPublicId') verificationRequestPublicId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<VerificationRequestResponse> {
    const command = new CancelVerificationRequestCommand(
      new IdentityPublicId(req.user.identityPublicId),
      new VerificationRequestPublicId(verificationRequestPublicId),
      randomUUID(),
    );

    const request =
      await this.cancelVerificationRequestHandler.execute(command);

    return VerificationResponseMapper.requestFromEntity(request);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default VerificationsController;
