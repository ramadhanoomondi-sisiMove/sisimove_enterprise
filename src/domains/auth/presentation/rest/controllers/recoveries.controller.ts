// -----------------------------------------------------------------------------
// Recovery — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Recovery aggregate operations.
//
// Aggregate boundary:
//
// RecoveryAggregate
// └── RecoveryEntity
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
// - RecoveryAggregate;
// - RecoveryEntity.
//
// Application orchestration:
// - command handlers;
// - query handlers.
//
// Persistence:
// - RecoveryRepository.
//
// IMPORTANT:
//
// Recovery is an aggregate root.
//
// Related authentication boundaries:
//
// Authentication
// └── AuthenticationEntity
//
// Session
// └── SessionEntity
//
// Device
// └── DeviceEntity
//
// Recovery
// └── RecoveryEntity
//
// OtpChallenge
// └── OtpChallengeEntity
//
// This controller does NOT:
//
// - validate recovery tokens directly;
// - determine recovery eligibility;
// - determine recovery expiration policy;
// - determine recovery completion policy;
// - modify Recovery state directly;
// - access Prisma;
// - perform persistence directly;
// - create Authentication records directly;
// - create Sessions directly;
// - create Devices directly;
// - create OTP Challenges directly;
// - perform external side effects.
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
// Security
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
  CancelRecoveryCommand,
  CompleteRecoveryCommand,
  CreateRecoveryCommand,
  ExpireRecoveryCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetRecoveriesQuery,
  GetRecoveryQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { RecoveryAggregate } from '../../../domain/aggregates/recovery.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  RecoveryCancelledAt,
  RecoveryCompletedAt,
  RecoveryExpiresAt,
  RecoveryIdentityPublicId,
  RecoveryPublicId,
  RecoveryType,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CancelRecoveryRequestDto,
  CompleteRecoveryRequestDto,
  CreateRecoveryRequestDto,
  ExpireRecoveryRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetRecoveryQueryDto } from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Model
// -----------------------------------------------------------------------------

import type { RecoveryResponse } from '../mappers/recovery.response.mapper';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { RecoveryResponseMapper } from '../mappers/recovery.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Recoveries')
@Controller('recoveries')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RecoveriesController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Recovery Command Handlers
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CREATE_RECOVERY)
    private readonly createRecoveryHandler: CommandHandler<
      CreateRecoveryCommand,
      RecoveryAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.COMPLETE_RECOVERY)
    private readonly completeRecoveryHandler: CommandHandler<
      CompleteRecoveryCommand,
      RecoveryAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CANCEL_RECOVERY)
    private readonly cancelRecoveryHandler: CommandHandler<
      CancelRecoveryCommand,
      RecoveryAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_RECOVERY)
    private readonly expireRecoveryHandler: CommandHandler<
      ExpireRecoveryCommand,
      RecoveryAggregate
    >,

    // -------------------------------------------------------------------------
    // Recovery Query Handlers
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_RECOVERY)
    private readonly getRecoveryHandler: QueryHandler<
      GetRecoveryQuery,
      RecoveryAggregate | null
    >,

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_RECOVERIES)
    private readonly getRecoveriesHandler: QueryHandler<
      GetRecoveriesQuery,
      RecoveryAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Recovery
  // ---------------------------------------------------------------------------
  //
  // GET /recoveries/:recoveryPublicId
  //
  // Query:
  //
  // GetRecoveryQuery
  // └── recoveryPublicId
  //
  // ---------------------------------------------------------------------------

  @Get(':recoveryPublicId')
  @RequirePermissions('recovery:read')
  public async get(
    @Param() dto: GetRecoveryQueryDto,
  ): Promise<RecoveryResponse | null> {
    const query = new GetRecoveryQuery(
      new RecoveryPublicId(dto.recoveryPublicId),
    );

    const aggregate = await this.getRecoveryHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return RecoveryResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Recoveries
  // ---------------------------------------------------------------------------
  //
  // GET /recoveries
  //
  // Query:
  //
  // GetRecoveriesQuery
  //
  // GetRecoveriesQuery currently carries no filtering criteria.
  //
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('recovery:read')
  public async getMany(): Promise<RecoveryResponse[]> {
    const query = new GetRecoveriesQuery();

    const aggregates = await this.getRecoveriesHandler.execute(query);

    return aggregates.map((aggregate) =>
      RecoveryResponseMapper.toResponse(aggregate),
    );
  }

  // ===========================================================================
  // Recovery Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Recovery
  // ---------------------------------------------------------------------------
  //
  // POST /recoveries
  //
  // CreateRecoveryCommand:
  //
  //   identityPublicId
  //   type
  //   expiresAt
  //   correlationId
  //   causationId?
  //
  // IMPORTANT:
  //
  // CreateRecoveryRequestDto contains only transport primitives.
  //
  // The controller converts the primitive `type` into RecoveryType.
  //
  // The DTO must therefore remain:
  //
  //   type: string
  //
  // while the application/domain boundary receives:
  //
  //   RecoveryType
  //
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('recovery:create')
  public async create(
    @Body() dto: CreateRecoveryRequestDto,
  ): Promise<RecoveryResponse> {
    const recoveryType = RecoveryType.create(
      dto.type as Parameters<typeof RecoveryType.create>[0],
    );

    const command = new CreateRecoveryCommand(
      new RecoveryIdentityPublicId(dto.identityPublicId),

      recoveryType,

      RecoveryExpiresAt.create(new Date(dto.expiresAt)),

      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.createRecoveryHandler.execute(command);

    return RecoveryResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Complete Recovery
  // ---------------------------------------------------------------------------
  //
  // PATCH /recoveries/:recoveryPublicId/complete
  //
  // CompleteRecoveryCommand:
  //
  //   recoveryPublicId
  //   completedAt
  //   correlationId
  //   causationId?
  //
  // The controller converts the transport timestamp into
  // RecoveryCompletedAt.
  //
  // ---------------------------------------------------------------------------

  @Patch(':recoveryPublicId/complete')
  @RequirePermissions('recovery:complete')
  public async complete(
    @Param('recoveryPublicId') recoveryPublicId: string,
    @Body() dto: CompleteRecoveryRequestDto,
  ): Promise<RecoveryResponse> {
    const command = new CompleteRecoveryCommand(
      new RecoveryPublicId(recoveryPublicId),

      RecoveryCompletedAt.create(new Date(dto.completedAt)),

      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.completeRecoveryHandler.execute(command);

    return RecoveryResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel Recovery
  // ---------------------------------------------------------------------------
  //
  // PATCH /recoveries/:recoveryPublicId/cancel
  //
  // CancelRecoveryCommand:
  //
  //   recoveryPublicId
  //   cancelledAt
  //   correlationId
  //   causationId?
  //
  // The controller converts the transport timestamp into
  // RecoveryCancelledAt.
  //
  // ---------------------------------------------------------------------------

  @Patch(':recoveryPublicId/cancel')
  @RequirePermissions('recovery:cancel')
  public async cancel(
    @Param('recoveryPublicId') recoveryPublicId: string,
    @Body() dto: CancelRecoveryRequestDto,
  ): Promise<RecoveryResponse> {
    const command = new CancelRecoveryCommand(
      new RecoveryPublicId(recoveryPublicId),

      RecoveryCancelledAt.create(new Date(dto.cancelledAt)),

      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.cancelRecoveryHandler.execute(command);

    return RecoveryResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Expire Recovery
  // ---------------------------------------------------------------------------
  //
  // PATCH /recoveries/:recoveryPublicId/expire
  //
  // ExpireRecoveryCommand:
  //
  //   recoveryPublicId
  //   referenceDate
  //   correlationId
  //   causationId?
  //
  // IMPORTANT:
  //
  // `referenceDate` is the point in time against which the Recovery aggregate
  // evaluates expiration.
  //
  // It is NOT the Recovery's `expiresAt` value.
  //
  // The controller does not determine whether the Recovery has expired.
  //
  // ---------------------------------------------------------------------------

  @Patch(':recoveryPublicId/expire')
  @RequirePermissions('recovery:expire')
  public async expire(
    @Param('recoveryPublicId') recoveryPublicId: string,
    @Body() dto: ExpireRecoveryRequestDto,
  ): Promise<RecoveryResponse> {
    const command = new ExpireRecoveryCommand(
      new RecoveryPublicId(recoveryPublicId),

      new Date(dto.referenceDate),

      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.expireRecoveryHandler.execute(command);

    return RecoveryResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RecoveriesController;
