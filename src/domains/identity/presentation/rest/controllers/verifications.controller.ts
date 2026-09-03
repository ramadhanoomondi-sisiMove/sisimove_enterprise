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
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion of transport primitives to domain value objects;
// - dispatching application commands and queries;
// - mapping domain results to HTTP response models.
//
// The controller contains no business rules.
//
// Domain behavior:
// - VerificationAggregate;
// - VerificationRequestEntity.
//
// Application orchestration:
// - command handlers;
// - query handlers.
//
// Persistence:
// - VerificationRepository.
//
// IMPORTANT:
//
// Verification and VerificationRequest are distinct responsibilities.
//
// Verification commands operate on the Verification aggregate:
//
// - create verification;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - reject verification;
// - reopen verification;
// - expire verification;
// - revoke verification.
//
// Verification Request commands operate on an individual child request:
//
// - create request;
// - approve request;
// - reject request;
// - cancel request.
//
// VerificationRequest does NOT have an independent expiration operation.
//
// There is intentionally no generic APPROVE_VERIFICATION command.
//
// Approving a VerificationRequest and granting Verification are different
// business operations.
//
// VerificationRequest is owned by VerificationAggregate.
//
// -----------------------------------------------------------------------------

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
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Identity — Authentication & Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

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
  ApproveVerificationRequestRequestDto,
  CancelVerificationRequestRequestDto,
  CreateVerificationRequestDto,
  CreateVerificationRequestRequestDto,
  ExpireVerificationRequestDto,
  GrantDriverVerificationRequestDto,
  GrantMemberVerificationRequestDto,
  RejectVerificationRequestDto,
  RejectVerificationRequestRequestDto,
  ReopenVerificationRequestDto,
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
// Controller
// =============================================================================

@ApiTags('Verifications')
@Controller('verifications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Verification
  // ---------------------------------------------------------------------------

  @Get(':verificationPublicId')
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

  @Get(':verificationPublicId/requests')
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

  @Get(':verificationPublicId/requests/:verificationRequestPublicId')
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
  // Verification Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Verification
  // ---------------------------------------------------------------------------
  //
  // CreateVerificationCommand:
  //
  //   identityPublicId
  //   correlationId
  //   causationId?
  //   createdAt?
  //
  // VerificationPublicId is generated by the aggregate.
  //

  @Post()
  @RequirePermissions('verification:create')
  public async create(
    @Body() dto: CreateVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const command = new CreateVerificationCommand(
      new IdentityPublicId(dto.identityPublicId),
      dto.correlationId,
      dto.causationId,
      dto.createdAt !== undefined ? new Date(dto.createdAt) : undefined,
    );

    const aggregate = await this.createVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Grant Member Verification
  // ---------------------------------------------------------------------------
  //
  // GrantMemberVerificationCommand constructor order:
  //
  //   identityPublicId
  //   verificationPublicId
  //   verificationRequestPublicId
  //   reviewedByPublicId
  //   correlationId
  //   causationId?
  //   verifiedAt?
  //   expiresAt?
  //
  // The verificationRequestPublicId identifies the approved VerificationRequest
  // that provides the evidence required for MEMBER verification.
  //
  // The controller converts transport primitives into domain value objects.
  // Aggregate-level eligibility and request validation remain inside the
  // VerificationAggregate.
  //
  // ---------------------------------------------------------------------------

  @Patch(':verificationPublicId/grant-member')
  @RequirePermissions('verification:grant-member')
  public async grantMember(
    @Param('verificationPublicId') verificationPublicId: string,
    @Body() dto: GrantMemberVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const command = new GrantMemberVerificationCommand(
      new IdentityPublicId(dto.identityPublicId),
      new VerificationPublicId(verificationPublicId),
      new VerificationRequestPublicId(dto.verificationRequestPublicId),
      new IdentityPublicId(dto.reviewedByPublicId),
      dto.correlationId,
      dto.causationId,
      dto.verifiedAt,
      dto.expiresAt,
    );

    const aggregate =
      await this.grantMemberVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Grant Driver Verification
  // ---------------------------------------------------------------------------
  //
  // GrantDriverVerificationCommand constructor order:
  //
  //   identityPublicId
  //   verificationPublicId
  //   verificationRequestPublicId
  //   reviewedByPublicId
  //   correlationId
  //   causationId?
  //   verifiedAt?
  //   expiresAt?
  //
  // The verificationRequestPublicId identifies the approved DRIVER_LICENSE
  // VerificationRequest that provides the evidence required for DRIVER
  // verification.
  //
  // The controller converts transport primitives into domain value objects.
  // Aggregate-level eligibility and request validation remain inside the
  // VerificationAggregate.
  //
  // ---------------------------------------------------------------------------

  @Patch(':verificationPublicId/grant-driver')
  @RequirePermissions('verification:grant-driver')
  public async grantDriver(
    @Param('verificationPublicId') verificationPublicId: string,
    @Body() dto: GrantDriverVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const command = new GrantDriverVerificationCommand(
      new IdentityPublicId(dto.identityPublicId),
      new VerificationPublicId(verificationPublicId),
      new VerificationRequestPublicId(dto.verificationRequestPublicId),
      new IdentityPublicId(dto.reviewedByPublicId),
      dto.correlationId,
      dto.causationId,
      dto.verifiedAt,
      dto.expiresAt,
    );

    const aggregate =
      await this.grantDriverVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Reject Verification
  // ---------------------------------------------------------------------------
  //
  // RejectVerificationCommand:
  //
  //   identityPublicId
  //   requestPublicId
  //   reviewedByPublicId
  //   reason
  //   correlationId
  //   causationId?
  //   reviewedAt?
  //
  // This command targets the Verification aggregate-level rejection operation.
  //

  @Patch(':verificationPublicId/reject')
  @RequirePermissions('verification:reject')
  public async reject(
    @Body() dto: RejectVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const command = new RejectVerificationCommand(
      new IdentityPublicId(dto.identityPublicId),
      new VerificationRequestPublicId(dto.requestPublicId),
      new IdentityPublicId(dto.reviewedByPublicId),
      dto.reason,
      dto.correlationId,
      dto.causationId,
      dto.reviewedAt !== undefined ? new Date(dto.reviewedAt) : undefined,
    );

    const aggregate = await this.rejectVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Reopen Verification
  // ---------------------------------------------------------------------------
  //
  // ReopenVerificationCommand:
  //
  //   verificationPublicId
  //   correlationId
  //   reopenedAt?
  //   causationId?
  //
  // No reviewer is required by the command.
  //

  @Patch(':verificationPublicId/reopen')
  @RequirePermissions('verification:reopen')
  public async reopen(
    @Param('verificationPublicId') verificationPublicId: string,
    @Body() dto: ReopenVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const command = new ReopenVerificationCommand(
      new VerificationPublicId(verificationPublicId),
      dto.correlationId,
      dto.reopenedAt !== undefined ? new Date(dto.reopenedAt) : undefined,
      dto.causationId,
    );

    const aggregate = await this.reopenVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Expire Verification
  // ---------------------------------------------------------------------------
  //
  // ExpireVerificationCommand:
  //
  //   identityPublicId
  //   correlationId
  //   causationId?
  //   expiredAt?
  //

  @Patch(':verificationPublicId/expire')
  @RequirePermissions('verification:expire')
  public async expire(
    @Body() dto: ExpireVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const command = new ExpireVerificationCommand(
      new IdentityPublicId(dto.identityPublicId),
      dto.correlationId,
      dto.causationId,
      dto.expiredAt !== undefined ? new Date(dto.expiredAt) : undefined,
    );

    const aggregate = await this.expireVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Revoke Verification
  // ---------------------------------------------------------------------------
  //
  // RevokeVerificationCommand:
  //
  //   identityPublicId
  //   revokedByPublicId
  //   reason
  //   correlationId
  //   causationId?
  //   revokedAt?
  //

  @Patch(':verificationPublicId/revoke')
  @RequirePermissions('verification:revoke')
  public async revoke(
    @Body() dto: RevokeVerificationRequestDto,
  ): Promise<VerificationResponse> {
    const command = new RevokeVerificationCommand(
      new IdentityPublicId(dto.identityPublicId),
      new IdentityPublicId(dto.revokedByPublicId),
      dto.reason,
      dto.correlationId,
      dto.causationId,
      dto.revokedAt !== undefined ? new Date(dto.revokedAt) : undefined,
    );

    const aggregate = await this.revokeVerificationHandler.execute(command);

    return VerificationResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Verification Request Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Verification Request
  // ---------------------------------------------------------------------------
  //
  // CreateVerificationRequestCommand:
  //
  //   identityPublicId
  //   type
  //   assetPublicId
  //   correlationId
  //   causationId?
  //   submittedAt?
  //
  // The Verification aggregate is resolved through the owning Identity.
  //

  @Post(':verificationPublicId/requests')
  @RequirePermissions('verification-request:create')
  public async createRequest(
    @Body() dto: CreateVerificationRequestRequestDto,
  ): Promise<VerificationRequestResponse> {
    const command = new CreateVerificationRequestCommand(
      new IdentityPublicId(dto.identityPublicId),
      VerificationRequestType.create(dto.type),
      new VerificationRequestAssetPublicId(dto.assetPublicId),
      dto.correlationId,
      dto.causationId,
      dto.submittedAt !== undefined ? new Date(dto.submittedAt) : undefined,
    );

    const request =
      await this.createVerificationRequestHandler.execute(command);

    return VerificationResponseMapper.requestFromEntity(request);
  }

  // ---------------------------------------------------------------------------
  // Approve Verification Request
  // ---------------------------------------------------------------------------
  //
  // ApproveVerificationRequestCommand:
  //
  //   identityPublicId
  //   requestPublicId
  //   reviewedByPublicId
  //   correlationId
  //   expiresAt?
  //   causationId?
  //   reviewedAt?
  //
  // Approval is a VerificationRequest operation.
  //

  @Patch(':verificationPublicId/requests/:verificationRequestPublicId/approve')
  @RequirePermissions('verification-request:approve')
  public async approveRequest(
    @Param('verificationRequestPublicId')
    verificationRequestPublicId: string,

    @Body()
    dto: ApproveVerificationRequestRequestDto,
  ): Promise<VerificationRequestResponse> {
    const command = new ApproveVerificationRequestCommand(
      new IdentityPublicId(dto.identityPublicId),
      new VerificationRequestPublicId(verificationRequestPublicId),
      new IdentityPublicId(dto.reviewedByPublicId),
      dto.correlationId,
      dto.causationId,
      dto.reviewedAt,
    );

    const request =
      await this.approveVerificationRequestHandler.execute(command);

    return VerificationResponseMapper.requestFromEntity(request);
  }

  // ---------------------------------------------------------------------------
  // Reject Verification Request
  // ---------------------------------------------------------------------------
  //
  // RejectVerificationRequestCommand:
  //
  //   identityPublicId
  //   requestPublicId
  //   reviewedByPublicId
  //   reason
  //   correlationId
  //   causationId?
  //   reviewedAt?
  //

  @Patch(':verificationPublicId/requests/:verificationRequestPublicId/reject')
  @RequirePermissions('verification-request:reject')
  public async rejectRequest(
    @Param('verificationRequestPublicId') verificationRequestPublicId: string,
    @Body() dto: RejectVerificationRequestRequestDto,
  ): Promise<VerificationRequestResponse> {
    const command = new RejectVerificationRequestCommand(
      new IdentityPublicId(dto.identityPublicId),
      new VerificationRequestPublicId(verificationRequestPublicId),
      new IdentityPublicId(dto.reviewedByPublicId),
      dto.reason,
      dto.correlationId,
      dto.causationId,
      dto.reviewedAt !== undefined ? new Date(dto.reviewedAt) : undefined,
    );

    const request =
      await this.rejectVerificationRequestHandler.execute(command);

    return VerificationResponseMapper.requestFromEntity(request);
  }

  // ---------------------------------------------------------------------------
  // Cancel Verification Request
  // ---------------------------------------------------------------------------
  //
  // CancelVerificationRequestCommand:
  //
  //   identityPublicId
  //   requestPublicId
  //   correlationId
  //   causationId?
  //   cancelledAt?
  //
  // No reviewer or cancellation reason exists in the command.
  //

  @Patch(':verificationPublicId/requests/:verificationRequestPublicId/cancel')
  @RequirePermissions('verification-request:cancel')
  public async cancelRequest(
    @Param('verificationRequestPublicId') verificationRequestPublicId: string,
    @Body() dto: CancelVerificationRequestRequestDto,
  ): Promise<VerificationRequestResponse> {
    const command = new CancelVerificationRequestCommand(
      new IdentityPublicId(dto.identityPublicId),
      new VerificationRequestPublicId(verificationRequestPublicId),
      dto.correlationId,
      dto.causationId,
      dto.cancelledAt !== undefined ? new Date(dto.cancelledAt) : undefined,
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
