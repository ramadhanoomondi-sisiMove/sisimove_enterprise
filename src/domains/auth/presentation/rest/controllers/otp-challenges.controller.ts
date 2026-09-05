// -----------------------------------------------------------------------------
// OTP Challenge — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for OTP Challenge aggregate operations.
//
// Aggregate boundary:
//
//     OtpChallengeAggregate
//     └── OtpChallengeEntity
//
// -----------------------------------------------------------------------------
//
// SERVICE / APPLICATION OPERATIONS
//
// OTP challenges are primarily infrastructure for authentication and recovery
// workflows.
//
// Operations performed as part of an authenticated application/security
// workflow do NOT require domain-management permissions.
//
// Authentication:
//
//     JwtAuthGuard
//
// Authorization for service operations:
//
//     No PermissionsGuard
//     No @RequirePermissions(...)
//
// The authenticated Identity is derived from:
//
//     JWT
//       │
//       ▼
//     JwtStrategy
//       │
//       ▼
//     request.user.identityPublicId
//
// -----------------------------------------------------------------------------
//
// MANAGEMENT / REVIEWER OPERATIONS
//
// Administrative inspection of OTP challenges remains protected by:
//
//     JwtAuthGuard
//     PermissionsGuard
//     @RequirePermissions(...)
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
//
// - HTTP transport;
// - DTO binding and validation;
// - extraction of authenticated identity from JWT security context;
// - conversion of transport primitives into domain value objects;
// - generation of application correlation metadata;
// - dispatching application commands and queries;
// - mapping application/domain results into HTTP response models.
//
// This controller contains NO OTP business rules.
//
// Domain behavior remains inside:
//
// - OtpChallengeAggregate;
// - OtpChallengeEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - OtpChallengeRepository.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — AGGREGATE BOUNDARY
//
// OtpChallenge is an independent aggregate.
//
//     OtpChallengeAggregate
//     └── OtpChallengeEntity
//
// Identity remains an opaque external reference:
//
//     OtpChallenge
//     └── identityPublicId
//
// This controller does not:
//
// - resolve Identity;
// - load Identity aggregates;
// - mutate Identity;
// - modify Authentication;
// - modify Recovery;
// - manage Sessions;
// - access Prisma;
// - access repositories directly.
//
// -----------------------------------------------------------------------------
//
// OTP SECURITY BOUNDARY
//
// This controller does NOT:
//
// - generate OTP codes;
// - hash OTP codes;
// - compare plaintext OTP codes;
// - determine OTP policy;
// - determine attempt policy;
// - bypass maximum-attempt rules;
// - directly mutate OtpChallenge state;
// - send OTP messages.
//
// OTP generation, hashing, comparison, throttling and delivery belong to the
// appropriate application/security/infrastructure workflows.
//
// -----------------------------------------------------------------------------
//
// VERIFY IMPORTANT
//
// The VerifyOtpChallengeCommand represented here records the successful
// verification state of an OTP Challenge.
//
// It does NOT receive a plaintext OTP code.
//
// Therefore:
//
//     POST /otp-challenges/:publicId/verify
//
// MUST NOT be interpreted as the component that authenticates an OTP code.
//
// A higher-level application/security workflow must first:
//
//     1. receive the OTP;
//     2. load the challenge;
//     3. compare the supplied OTP against the protected representation;
//     4. enforce attempt/rate-limit policy;
//     5. determine that verification succeeded;
//     6. dispatch VerifyOtpChallengeCommand.
//
// This controller only transports the resulting domain command.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION VS AUTHORIZATION
//
// Authentication:
//
//     JwtAuthGuard
//
// Service/application operations:
//
//     JwtAuthGuard
//
// Management/reviewer operations:
//
//     JwtAuthGuard
//     PermissionsGuard
//     @RequirePermissions(...)
//
// Permissions are therefore NOT used as a generic requirement for every
// OtpChallenge operation.
//
// -----------------------------------------------------------------------------
//
// ENDPOINT SECURITY MODEL
//
// Service / application operations:
//
//     POST /otp-challenges
//         JwtAuthGuard
//
//     POST /otp-challenges/:publicId/verify
//         JwtAuthGuard
//
//     POST /otp-challenges/:publicId/fail
//         JwtAuthGuard
//
//     PATCH /otp-challenges/:publicId/cancel
//         JwtAuthGuard
//
//     PATCH /otp-challenges/:publicId/expire
//         JwtAuthGuard
//
// Management / reviewer queries:
//
//     GET /otp-challenges/active
//         JwtAuthGuard + PermissionsGuard
//         otp-challenge:read
//
//     GET /otp-challenges/:publicId
//         JwtAuthGuard + PermissionsGuard
//         otp-challenge:read
//
// -----------------------------------------------------------------------------
//
// OTP OWNERSHIP / SCOPE
//
// An OtpChallenge public ID is not an authorization credential.
//
// For service/application operations:
//
//     POST /otp-challenges/:publicId/verify
//     POST /otp-challenges/:publicId/fail
//     PATCH /otp-challenges/:publicId/cancel
//     PATCH /otp-challenges/:publicId/expire
//
// the application layer MUST ensure that the authenticated principal is
// permitted to operate on the referenced OtpChallenge.
//
// The controller does not implement ownership or scope policies.
//
// -----------------------------------------------------------------------------
//
// IDENTITY BINDING
//
// When an authenticated user creates an OTP Challenge through this HTTP
// service endpoint, the Identity reference is derived from:
//
//     JWT
//       │
//       ▼
//     JwtStrategy
//       │
//       ▼
//     request.user.identityPublicId
//       │
//       ▼
//     OtpChallengeIdentityPublicId
//
// The client must NOT be allowed to create a challenge for another Identity
// simply by submitting another identityPublicId.
//
// If an internal authentication/recovery workflow needs to create an OTP
// Challenge for a specific Identity, it should invoke the application
// capability directly rather than making an internal HTTP request.
//
// -----------------------------------------------------------------------------
//
// CORRELATION / CAUSATION
//
// HTTP-originated commands receive a server-generated correlation ID:
//
//     correlationId = randomUUID()
//
// The client may provide a causation ID when the command is part of a larger
// workflow.
//
// Correlation IDs are therefore controlled by the application boundary rather
// than trusted as client-controlled tracing identifiers.
//
// With:
//
//     exactOptionalPropertyTypes: true
//
// command constructors should receive undefined only where their signatures
// explicitly permit it.
//
// -----------------------------------------------------------------------------
//
// ROUTE ORDER
//
// The static route:
//
//     /active
//
// is declared before:
//
//     /:publicId
//
// so that "active" is always interpreted as the active-challenges route rather
// than being considered a challenge public ID.
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
//
// This controller does NOT:
//
// - verify JWTs;
// - decode JWTs;
// - inspect Authorization headers;
// - resolve permissions;
// - determine OTP ownership;
// - access Prisma;
// - access repositories;
// - generate OTP secrets;
// - hash OTP secrets;
// - compare OTP secrets;
// - send SMS/email OTP messages;
// - modify Identity;
// - modify Authentication;
// - modify Recovery;
// - create Sessions.
//
// =============================================================================

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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Express
// -----------------------------------------------------------------------------

import type { Request } from 'express';

// -----------------------------------------------------------------------------
// Security — Authentication & Authorization
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
// Application — Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../../../application/auth.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CancelOtpChallengeCommand,
  CreateOtpChallengeCommand,
  ExpireOtpChallengeCommand,
  FailOtpChallengeCommand,
  VerifyOtpChallengeCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetActiveOtpChallengesQuery,
  GetOtpChallengeQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { OtpChallengeAggregate } from '../../../domain/aggregates/otp-challenge.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  OtpChallengeDestination,
  OtpChallengeExpiresAt,
  OtpChallengeIdentityPublicId,
  OtpChallengeMaxAttempts,
  OtpChallengePublicId,
  OtpChallengePurpose,
  OtpChallengeVerifiedAt,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelOtpChallengeRequestDto,
  CreateOtpChallengeRequestDto,
  VerifyOtpChallengeRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetOtpChallengeQueryDto } from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Model
// -----------------------------------------------------------------------------

import type { OtpChallengeResponse } from '../mappers/otp-challenge.response.mapper';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { OtpChallengeResponseMapper } from '../mappers/otp-challenge.response.mapper';

// =============================================================================
// Authenticated Request
// =============================================================================
//
// JwtAuthGuard populates req.user from JwtStrategy.
//
// JWT:
//
//     sub = IdentityPublicId
//
// JwtStrategy:
//
//     payload.sub
//          ↓
//     request.user.identityPublicId
//
// =============================================================================

interface AuthenticatedRequest extends Request {
  user: AuthenticatedIdentity;
}

// =============================================================================
// Controller
// =============================================================================

@ApiTags('OTP Challenges')
@Controller('otp-challenges')
export class OtpChallengesController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // OTP Challenge Command Handlers
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CREATE_OTP_CHALLENGE)
    private readonly createOtpChallengeHandler: CommandHandler<
      CreateOtpChallengeCommand,
      OtpChallengeAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.VERIFY_OTP_CHALLENGE)
    private readonly verifyOtpChallengeHandler: CommandHandler<
      VerifyOtpChallengeCommand,
      OtpChallengeAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.FAIL_OTP_CHALLENGE)
    private readonly failOtpChallengeHandler: CommandHandler<
      FailOtpChallengeCommand,
      void
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_OTP_CHALLENGE)
    private readonly expireOtpChallengeHandler: CommandHandler<
      ExpireOtpChallengeCommand,
      void
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CANCEL_OTP_CHALLENGE)
    private readonly cancelOtpChallengeHandler: CommandHandler<
      CancelOtpChallengeCommand,
      OtpChallengeAggregate
    >,

    // -------------------------------------------------------------------------
    // OTP Challenge Query Handlers
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_OTP_CHALLENGE)
    private readonly getOtpChallengeHandler: QueryHandler<
      GetOtpChallengeQuery,
      OtpChallengeAggregate | null
    >,

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_OTP_CHALLENGES)
    private readonly getActiveOtpChallengesHandler: QueryHandler<
      GetActiveOtpChallengesQuery,
      OtpChallengeAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Management / Reviewer Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Active OTP Challenges
  // ---------------------------------------------------------------------------
  //
  // GET /otp-challenges/active
  //
  // Management/reviewer query.
  //
  // Requires:
  //
  //     JwtAuthGuard
  //     PermissionsGuard
  //     otp-challenge:read
  //
  // IMPORTANT:
  //
  // This route is declared BEFORE:
  //
  //     /:publicId
  //
  // ---------------------------------------------------------------------------

  @Get('active')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List active OTP challenges',
    description:
      'Returns active OTP challenges for authorized management or reviewer access.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('otp-challenge:read')
  public async getActive(): Promise<OtpChallengeResponse[]> {
    const query = new GetActiveOtpChallengesQuery();

    const aggregates = await this.getActiveOtpChallengesHandler.execute(query);

    return aggregates.map((aggregate) =>
      OtpChallengeResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get OTP Challenge
  // ---------------------------------------------------------------------------
  //
  // GET /otp-challenges/:publicId
  //
  // Management/reviewer query.
  //
  // Requires:
  //
  //     JwtAuthGuard
  //     PermissionsGuard
  //     otp-challenge:read
  //
  // The application layer remains responsible for any additional scope rules.
  //
  // ---------------------------------------------------------------------------

  @Get(':publicId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get an OTP challenge',
    description:
      'Returns an OTP challenge by public ID for authorized management or reviewer access.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the OTP Challenge.',
    example: 'OTP-8VBLAO',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('otp-challenge:read')
  public async get(
    @Param() dto: GetOtpChallengeQueryDto,
  ): Promise<OtpChallengeResponse | null> {
    const otpChallengePublicId = new OtpChallengePublicId(dto.publicId);

    const query = new GetOtpChallengeQuery(otpChallengePublicId);

    const aggregate = await this.getOtpChallengeHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return OtpChallengeResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Service / Application Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create OTP Challenge
  // ---------------------------------------------------------------------------
  //
  // POST /otp-challenges
  //
  // Service/application operation.
  //
  // Authentication only.
  //
  // No permission is required because the Identity is derived from the
  // authenticated security principal.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create an OTP challenge',
    description:
      'Creates an OTP challenge for the authenticated identity. The identity is derived from the authenticated JWT and cannot be supplied by the client.',
  })
  @UseGuards(JwtAuthGuard)
  public async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const identityPublicId = this.getAuthenticatedIdentityPublicId(request);

    const command = new CreateOtpChallengeCommand(
      identityPublicId,

      OtpChallengePurpose.fromString(dto.purpose),

      OtpChallengeDestination.create(dto.destination),

      OtpChallengeMaxAttempts.create(dto.maxAttempts),

      OtpChallengeExpiresAt.create(new Date(dto.expiresAt)),

      randomUUID(),

      dto.causationId,
    );

    const aggregate = await this.createOtpChallengeHandler.execute(command);

    return OtpChallengeResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Verify OTP Challenge
  // ---------------------------------------------------------------------------
  //
  // POST /otp-challenges/:publicId/verify
  //
  // Service/application operation.
  //
  // Authentication only.
  //
  // No permission is required.
  //
  // IMPORTANT:
  //
  // This endpoint does not receive or compare a plaintext OTP.
  //
  // The higher-level authentication/security workflow is responsible for
  // validating the OTP before dispatching VerifyOtpChallengeCommand.
  //
  // ---------------------------------------------------------------------------

  @Post(':publicId/verify')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Verify an OTP challenge',
    description:
      'Records successful OTP challenge verification after the OTP has already been validated by the appropriate application or security workflow.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the OTP Challenge.',
    example: 'OTP-8VBLAO',
  })
  @UseGuards(JwtAuthGuard)
  public async verify(
    @Param('publicId') publicId: string,
    @Body() dto: VerifyOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const otpChallengePublicId = new OtpChallengePublicId(publicId);

    const verifiedAt = OtpChallengeVerifiedAt.create(
      dto.verifiedAt !== undefined ? new Date(dto.verifiedAt) : new Date(),
    );

    const command = new VerifyOtpChallengeCommand(
      otpChallengePublicId,
      verifiedAt,
      randomUUID(),
      dto.causationId,
    );

    const aggregate = await this.verifyOtpChallengeHandler.execute(command);

    return OtpChallengeResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel OTP Challenge
  // ---------------------------------------------------------------------------
  //
  // PATCH /otp-challenges/:publicId/cancel
  //
  // Service/application operation.
  //
  // Authentication only.
  //
  // No permission is required.
  //
  // The application layer MUST enforce ownership/scope.
  //
  // ---------------------------------------------------------------------------

  @Patch(':publicId/cancel')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancel an OTP challenge',
    description:
      'Cancels an OTP challenge within the authenticated application or security workflow. The application layer enforces ownership and scope.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the OTP Challenge.',
    example: 'OTP-8VBLAO',
  })
  @UseGuards(JwtAuthGuard)
  public async cancel(
    @Param('publicId') publicId: string,
    @Body() dto: CancelOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const otpChallengePublicId = new OtpChallengePublicId(publicId);

    const command = new CancelOtpChallengeCommand(
      otpChallengePublicId,
      randomUUID(),
      dto.causationId,
    );

    const aggregate = await this.cancelOtpChallengeHandler.execute(command);

    return OtpChallengeResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Fail OTP Challenge
  // ---------------------------------------------------------------------------
  //
  // POST /otp-challenges/:publicId/fail
  //
  // Service/application operation.
  //
  // Authentication only.
  //
  // No permission is required.
  //
  // The fail handler returns void, so the controller reloads the aggregate.
  //
  // ---------------------------------------------------------------------------

  @Post(':publicId/fail')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Fail an OTP challenge',
    description:
      'Records an OTP challenge failure within the authenticated application or security workflow.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the OTP Challenge.',
    example: 'OTP-8VBLAO',
  })
  @UseGuards(JwtAuthGuard)
  public async fail(
    @Param('publicId') publicId: string,
    @Body() dto: CancelOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const otpChallengePublicId = new OtpChallengePublicId(publicId);

    const command = new FailOtpChallengeCommand(
      otpChallengePublicId,
      randomUUID(),
      dto.causationId,
    );

    await this.failOtpChallengeHandler.execute(command);

    const aggregate = await this.getOtpChallengeHandler.execute(
      new GetOtpChallengeQuery(otpChallengePublicId),
    );

    if (aggregate === null) {
      throw new Error('OTP Challenge could not be found after failure.');
    }

    return OtpChallengeResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Expire OTP Challenge
  // ---------------------------------------------------------------------------
  //
  // PATCH /otp-challenges/:publicId/expire
  //
  // Service/application operation.
  //
  // Authentication only.
  //
  // No permission is required.
  //
  // The aggregate remains responsible for lifecycle transition rules.
  //
  // ---------------------------------------------------------------------------

  @Patch(':publicId/expire')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Expire an OTP challenge',
    description:
      'Expires an OTP challenge within the authenticated application or security workflow.',
  })
  @ApiParam({
    name: 'publicId',
    type: String,
    required: true,
    description: 'Public ID of the OTP Challenge.',
    example: 'OTP-8VBLAO',
  })
  @UseGuards(JwtAuthGuard)
  public async expire(
    @Param('publicId') publicId: string,
    @Body() dto: CancelOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const otpChallengePublicId = new OtpChallengePublicId(publicId);

    const command = new ExpireOtpChallengeCommand(
      otpChallengePublicId,
      new Date(),
      randomUUID(),
      dto.causationId,
    );

    await this.expireOtpChallengeHandler.execute(command);

    const aggregate = await this.getOtpChallengeHandler.execute(
      new GetOtpChallengeQuery(otpChallengePublicId),
    );

    if (aggregate === null) {
      throw new Error('OTP Challenge could not be found after expiration.');
    }

    return OtpChallengeResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Authenticated Identity
  // ---------------------------------------------------------------------------
  //
  // JwtStrategy transforms:
  //
  //     JWT.sub
  //        ↓
  //     request.user.identityPublicId
  //
  // This helper does NOT:
  //
  // - decode the JWT;
  // - verify the JWT;
  // - inspect the Authorization header;
  // - resolve Identity from persistence.
  //
  // It only validates the already-authenticated security principal.
  //
  // ---------------------------------------------------------------------------

  private getAuthenticatedIdentityPublicId(
    request: AuthenticatedRequest,
  ): OtpChallengeIdentityPublicId {
    const identityPublicId = request.user.identityPublicId;

    if (
      typeof identityPublicId !== 'string' ||
      identityPublicId.trim().length === 0
    ) {
      throw new UnauthorizedException(
        'Authenticated principal does not contain identityPublicId.',
      );
    }

    return new OtpChallengeIdentityPublicId(identityPublicId.trim());
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default OtpChallengesController;
