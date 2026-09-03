// -----------------------------------------------------------------------------
// OTP Challenge — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for OTP Challenge aggregate operations.
//
// Aggregate boundary:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
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
// - OtpChallengeAggregate;
// - OtpChallengeEntity.
//
// Application orchestration:
// - command handlers;
// - query handlers.
//
// Persistence:
// - OtpChallengeRepository.
//
// IMPORTANT:
//
// OtpChallenge is an independent aggregate.
//
// The Identity reference remains opaque:
//
// OtpChallenge
// └── identityPublicId
//
// This controller does NOT:
//
// - generate OTP codes;
// - hash OTP codes;
// - compare OTP codes;
// - determine OTP policy;
// - modify OtpChallenge state directly;
// - access Prisma;
// - perform persistence directly;
// - send OTP messages;
// - resolve Identity;
// - modify Authentication;
// - modify Recovery;
// - manage Sessions.
//
// Those responsibilities belong to their respective application, domain,
// security, and infrastructure boundaries.
//
// -----------------------------------------------------------------------------
//
// Supported OTP Challenge operations:
//
// OTP Challenge definition:
// - create OTP challenge.
//
// OTP Challenge verification:
// - verify OTP challenge;
// - record failed OTP verification.
//
// OTP Challenge lifecycle:
// - expire OTP challenge;
// - cancel OTP challenge.
//
// OTP Challenge queries:
// - get OTP challenge;
// - get active OTP challenges.
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
// Controller
// =============================================================================

@ApiTags('OTP Challenges')
@Controller('otp-challenges')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get OTP Challenge
  // ---------------------------------------------------------------------------
  //
  // GET /otp-challenges/:publicId
  //
  // Query:
  //
  // GetOtpChallengeQuery
  // └── publicId
  //
  // ---------------------------------------------------------------------------

  @Get(':publicId')
  @RequirePermissions('otp-challenge:read')
  public async get(
    @Param() dto: GetOtpChallengeQueryDto,
  ): Promise<OtpChallengeResponse | null> {
    const query = new GetOtpChallengeQuery(
      new OtpChallengePublicId(dto.publicId),
    );

    const aggregate = await this.getOtpChallengeHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return OtpChallengeResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Active OTP Challenges
  // ---------------------------------------------------------------------------
  //
  // GET /otp-challenges/active
  //
  // GetActiveOtpChallengesQuery has no input.
  //
  // Therefore this endpoint intentionally has no DTO parameter.
  //
  // IMPORTANT:
  //
  // This route is declared before:
  //
  //     /:publicId
  //
  // so "active" is never interpreted as an OTP Challenge public ID.
  //
  // ---------------------------------------------------------------------------

  @Get('active')
  @RequirePermissions('otp-challenge:read')
  public async getActive(): Promise<OtpChallengeResponse[]> {
    const query = new GetActiveOtpChallengesQuery();

    const aggregates = await this.getActiveOtpChallengesHandler.execute(query);

    return aggregates.map((aggregate) =>
      OtpChallengeResponseMapper.toResponse(aggregate),
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create OTP Challenge
  // ---------------------------------------------------------------------------
  //
  // POST /otp-challenges
  //
  // CreateOtpChallengeCommand:
  //
  //   identityPublicId
  //   purpose
  //   destination
  //   maxAttempts
  //   expiresAt
  //   correlationId
  //   causationId?
  //
  // IMPORTANT:
  //
  // The controller:
  //
  // - converts transport primitives into domain Value Objects;
  // - does not generate OTP codes;
  // - does not hash OTP codes;
  // - does not receive OTP hashes;
  // - does not construct attempts;
  // - does not construct public IDs;
  // - does not establish lifecycle state.
  //
  // Those responsibilities belong to the appropriate application/domain
  // creation workflow.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('otp-challenge:create')
  public async create(
    @Body() dto: CreateOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const command = new CreateOtpChallengeCommand(
      new OtpChallengeIdentityPublicId(dto.identityPublicId),

      OtpChallengePurpose.fromString(dto.purpose),

      OtpChallengeDestination.create(dto.destination),

      OtpChallengeMaxAttempts.create(dto.maxAttempts),

      OtpChallengeExpiresAt.create(new Date(dto.expiresAt)),

      dto.correlationId,
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
  // VerifyOtpChallengeCommand:
  //
  //   otpChallengePublicId
  //   verifiedAt
  //   correlationId
  //   causationId?
  //
  // IMPORTANT:
  //
  // The plaintext OTP code is intentionally not part of the domain command.
  //
  // The application/security workflow is responsible for:
  //
  // 1. receiving the OTP;
  // 2. loading the challenge;
  // 3. comparing the supplied OTP with the persisted hash;
  // 4. determining successful verification;
  // 5. dispatching VerifyOtpChallengeCommand.
  //
  // ---------------------------------------------------------------------------

  @Post(':publicId/verify')
  @RequirePermissions('otp-challenge:verify')
  public async verify(
    @Param('publicId') publicId: string,
    @Body() dto: VerifyOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const command = new VerifyOtpChallengeCommand(
      new OtpChallengePublicId(publicId),

      OtpChallengeVerifiedAt.create(
        dto.verifiedAt !== undefined ? new Date(dto.verifiedAt) : new Date(),
      ),

      dto.correlationId,
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
  // CancelOtpChallengeCommand:
  //
  //   otpChallengePublicId
  //   correlationId
  //   causationId?
  //
  // ---------------------------------------------------------------------------

  @Patch(':publicId/cancel')
  @RequirePermissions('otp-challenge:cancel')
  public async cancel(
    @Param('publicId') publicId: string,
    @Body() dto: CancelOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const command = new CancelOtpChallengeCommand(
      new OtpChallengePublicId(publicId),
      dto.correlationId,
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
  // FailOtpChallengeCommand:
  //
  //   otpChallengePublicId
  //   correlationId
  //   causationId?
  //
  // The fail handler returns void.
  //
  // Therefore the controller reloads the aggregate after the command
  // completes.
  //
  // ---------------------------------------------------------------------------

  @Post(':publicId/fail')
  @RequirePermissions('otp-challenge:fail')
  public async fail(
    @Param('publicId') publicId: string,
    @Body() dto: CancelOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const otpChallengePublicId = new OtpChallengePublicId(publicId);

    const command = new FailOtpChallengeCommand(
      otpChallengePublicId,
      dto.correlationId,
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
  // ExpireOtpChallengeCommand:
  //
  //   otpChallengePublicId
  //   referenceDate
  //   correlationId
  //   causationId?
  //
  // The reference timestamp is supplied by the HTTP/application boundary.
  //
  // The aggregate remains responsible for determining whether expiration
  // is valid.
  //
  // ---------------------------------------------------------------------------

  @Patch(':publicId/expire')
  @RequirePermissions('otp-challenge:expire')
  public async expire(
    @Param('publicId') publicId: string,
    @Body() dto: CancelOtpChallengeRequestDto,
  ): Promise<OtpChallengeResponse> {
    const otpChallengePublicId = new OtpChallengePublicId(publicId);

    const command = new ExpireOtpChallengeCommand(
      otpChallengePublicId,
      new Date(),
      dto.correlationId,
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
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default OtpChallengesController;
