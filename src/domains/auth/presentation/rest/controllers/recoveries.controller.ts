// -----------------------------------------------------------------------------
// Recovery — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Recovery aggregate operations.
//
// Aggregate boundary:
//
//     RecoveryAggregate
//     └── RecoveryEntity
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion of transport primitives to domain value objects;
// - construction of application commands and queries;
// - dispatching application commands and queries;
// - mapping application/domain results to HTTP response models.
//
// This controller contains NO Recovery business rules.
//
// -----------------------------------------------------------------------------
//
// DOMAIN
// -----------------------------------------------------------------------------
//
// RecoveryAggregate
// └── RecoveryEntity
//
// The aggregate owns Recovery lifecycle invariants.
//
// -----------------------------------------------------------------------------
//
// APPLICATION
// -----------------------------------------------------------------------------
//
// Application orchestration is performed by:
//
// - command handlers;
// - query handlers.
//
// -----------------------------------------------------------------------------
//
// PERSISTENCE
// -----------------------------------------------------------------------------
//
// Persistence is performed by:
//
//     RecoveryRepository
//
// The controller never accesses Prisma or repositories directly.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — AGGREGATE BOUNDARY
// -----------------------------------------------------------------------------
//
// Recovery is an independent aggregate.
//
//     RecoveryAggregate
//     └── RecoveryEntity
//
// Related aggregates:
//
//     IdentityAggregate
//     └── IdentityEntity
//
//     AuthenticationAggregate
//     └── AuthenticationEntity
//
//     SessionAggregate
//     └── SessionEntity
//
//     DeviceAggregate
//     └── DeviceEntity
//
//     OtpChallengeAggregate
//     └── OtpChallengeEntity
//
// Recovery may contain opaque references to those aggregates, but this
// controller does not directly load or mutate them.
//
// -----------------------------------------------------------------------------
//
// RECOVERY SECURITY BOUNDARY
// -----------------------------------------------------------------------------
//
// This controller does NOT:
//
// - validate recovery tokens directly;
// - compare recovery secrets;
// - determine recovery eligibility;
// - determine recovery policy;
// - determine recovery expiration policy;
// - determine recovery completion policy;
// - modify Recovery state directly;
// - access Prisma;
// - access repositories directly;
// - create Authentication records;
// - create Sessions;
// - create Devices;
// - create OTP Challenges;
// - perform password-reset logic;
// - perform external side effects.
//
// Those responsibilities belong to the appropriate application, domain,
// security and infrastructure boundaries.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION VS AUTHORIZATION
// -----------------------------------------------------------------------------
//
// Authentication:
//
//     JwtAuthGuard
//
// Authorization:
//
//     PermissionsGuard
//     @RequirePermissions(...)
//
// Authentication is required for every Recovery endpoint that is not public.
//
// Authorization permissions are retained for administrative/query access,
// while authenticated Recovery lifecycle operations are JWT-only.
//
// This follows the same boundary used by other self-service/application
// operations in the Identity bounded context.
//
// -----------------------------------------------------------------------------
//
// ENDPOINT SECURITY MODEL
// -----------------------------------------------------------------------------
//
// Management / query operations:
//
//     GET /recoveries
//         JwtAuthGuard + PermissionsGuard
//         recovery:read
//
//     GET /recoveries/:recoveryPublicId
//         JwtAuthGuard + PermissionsGuard
//         recovery:read
//
// Authenticated Recovery operations:
//
//     POST /recoveries
//         JwtAuthGuard
//
//     PATCH /recoveries/:recoveryPublicId/complete
//         JwtAuthGuard
//
//     PATCH /recoveries/:recoveryPublicId/cancel
//         JwtAuthGuard
//
//     PATCH /recoveries/:recoveryPublicId/expire
//         JwtAuthGuard
//
// -----------------------------------------------------------------------------
//
// RECOVERY OWNERSHIP / SCOPE
// -----------------------------------------------------------------------------
//
// A Recovery public ID is not an authorization credential.
//
// For operations involving:
//
//     recoveryPublicId
//
// the application layer MUST ensure that the authenticated principal is
// permitted to operate on the referenced Recovery.
//
// Authentication answers:
//
//     "Who is this principal?"
//
// Authorization answers:
//
//     "May this principal perform this operation?"
//
// Ownership/scope answers:
//
//     "May this principal perform this operation on THIS Recovery?"
//
// The controller does not implement those policies.
//
// -----------------------------------------------------------------------------
//
// IDENTITY BINDING
// -----------------------------------------------------------------------------
//
// Recovery creation is bound to the authenticated Identity.
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
//     RecoveryIdentityPublicId
//
// Therefore the HTTP request MUST NOT be allowed to select another Identity
// simply by submitting an arbitrary identityPublicId.
//
// If an internal authentication or recovery workflow needs to create a
// Recovery for a particular Identity, that workflow should invoke the
// application capability directly rather than making an internal HTTP call.
//
// -----------------------------------------------------------------------------
//
// RECOVERY TYPE
// -----------------------------------------------------------------------------
//
// Recovery type is transport-level input and is converted at the application
// boundary:
//
//     string
//       │
//       ▼
//     RecoveryType
//
// The controller does not interpret the business meaning of the recovery type.
//
// -----------------------------------------------------------------------------
//
// COMPLETE RECOVERY
// -----------------------------------------------------------------------------
//
// Completing a Recovery is a lifecycle transition.
//
//     ACTIVE
//       │
//       ▼
//     COMPLETED
//
// The controller only converts the transport timestamp into
// RecoveryCompletedAt.
//
// It does not decide whether the Recovery is eligible for completion.
//
// -----------------------------------------------------------------------------
//
// CANCEL RECOVERY
// -----------------------------------------------------------------------------
//
// Cancelling a Recovery is a lifecycle transition.
//
//     ACTIVE
//       │
//       ▼
//     CANCELLED
//
// The controller does not determine whether cancellation is valid.
//
// -----------------------------------------------------------------------------
//
// EXPIRE RECOVERY
// -----------------------------------------------------------------------------
//
// Expiration is evaluated against a reference point in time:
//
//     referenceDate
//
// The controller supplies the reference timestamp.
//
// The Recovery aggregate/application layer determines whether the Recovery
// is actually eligible to transition into the expired state.
//
// `referenceDate` is NOT the Recovery's `expiresAt` value.
//
// -----------------------------------------------------------------------------
//
// CORRELATION / CAUSATION
// -----------------------------------------------------------------------------
//
// HTTP-originated commands receive a server-generated correlation ID:
//
//     correlationId = randomUUID()
//
// This prevents clients from controlling the application's primary
// correlation identity.
//
// An optional causation ID may be propagated when the HTTP operation is part
// of a larger workflow.
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
// -----------------------------------------------------------------------------
//
// This controller does NOT:
//
// - verify JWTs;
// - decode JWTs;
// - inspect Authorization headers;
// - resolve permissions;
// - determine Recovery ownership;
// - access Prisma;
// - access repositories;
// - validate recovery secrets;
// - modify Authentication;
// - modify Sessions;
// - modify Devices;
// - modify OTP Challenges.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Node
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
  // Get Recoveries
  // ---------------------------------------------------------------------------
  //
  // GET /recoveries
  //
  // GetRecoveriesQuery currently carries no filtering criteria.
  //
  // Therefore the application/query layer MUST apply the appropriate
  // authorization scope. A generic unscoped repository read must never become
  // an accidental cross-identity data exposure.
  //
  // ---------------------------------------------------------------------------

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get recoveries',
    description:
      'Returns Recovery aggregates accessible to the authenticated principal. Authorization and query scope are enforced by the application layer.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('recovery:read')
  public async getMany(): Promise<RecoveryResponse[]> {
    const query = new GetRecoveriesQuery();

    const aggregates = await this.getRecoveriesHandler.execute(query);

    return aggregates.map((aggregate) =>
      RecoveryResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Recovery
  // ---------------------------------------------------------------------------
  //
  // GET /recoveries/:recoveryPublicId
  //
  // The application layer MUST enforce ownership/scope where applicable.
  //
  // ---------------------------------------------------------------------------

  @Get(':recoveryPublicId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get recovery',
    description:
      'Returns a Recovery aggregate by public ID. The application layer enforces authorization and ownership scope.',
  })
  @ApiParam({
    name: 'recoveryPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Recovery aggregate.',
    example: 'REC-8VBLAO',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('recovery:read')
  public async get(
    @Param() dto: GetRecoveryQueryDto,
  ): Promise<RecoveryResponse | null> {
    const recoveryPublicId = new RecoveryPublicId(dto.recoveryPublicId);

    const query = new GetRecoveryQuery(recoveryPublicId);

    const aggregate = await this.getRecoveryHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return RecoveryResponseMapper.toResponse(aggregate);
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
  // Authenticated application operation.
  //
  // Identity is derived exclusively from the authenticated principal.
  //
  // The request DTO MUST NOT be trusted as the authoritative Identity binding.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create recovery',
    description:
      'Creates a Recovery for the authenticated identity. The identity is derived from the authenticated JWT and cannot be supplied by the client.',
  })
  @UseGuards(JwtAuthGuard)
  public async create(
    @Req() request: Request,
    @Body() dto: CreateRecoveryRequestDto,
  ): Promise<RecoveryResponse> {
    const identityPublicId = this.getAuthenticatedIdentityPublicId(request);

    const recoveryType = RecoveryType.create(
      dto.type as Parameters<typeof RecoveryType.create>[0],
    );

    const command = new CreateRecoveryCommand(
      identityPublicId,
      recoveryType,
      RecoveryExpiresAt.create(new Date(dto.expiresAt)),
      randomUUID(),
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
  // Authenticated Recovery lifecycle operation.
  //
  // The lifecycle transition is delegated to the application/domain layer.
  //
  // ---------------------------------------------------------------------------

  @Patch(':recoveryPublicId/complete')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Complete recovery',
    description:
      'Completes a Recovery identified by public ID. Recovery eligibility and ownership/scope are enforced by the application/domain layer.',
  })
  @ApiParam({
    name: 'recoveryPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Recovery aggregate.',
    example: 'REC-8VBLAO',
  })
  @UseGuards(JwtAuthGuard)
  public async complete(
    @Param('recoveryPublicId') recoveryPublicId: string,
    @Body() dto: CompleteRecoveryRequestDto,
  ): Promise<RecoveryResponse> {
    const recoveryId = new RecoveryPublicId(recoveryPublicId);

    const command = new CompleteRecoveryCommand(
      recoveryId,
      RecoveryCompletedAt.create(new Date(dto.completedAt)),
      randomUUID(),
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
  // Authenticated Recovery lifecycle operation.
  //
  // The application/domain layer determines whether cancellation is valid.
  //
  // ---------------------------------------------------------------------------

  @Patch(':recoveryPublicId/cancel')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancel recovery',
    description:
      'Cancels a Recovery identified by public ID. Cancellation eligibility and ownership/scope are enforced by the application/domain layer.',
  })
  @ApiParam({
    name: 'recoveryPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Recovery aggregate.',
    example: 'REC-8VBLAO',
  })
  @UseGuards(JwtAuthGuard)
  public async cancel(
    @Param('recoveryPublicId') recoveryPublicId: string,
    @Body() dto: CancelRecoveryRequestDto,
  ): Promise<RecoveryResponse> {
    const recoveryId = new RecoveryPublicId(recoveryPublicId);

    const command = new CancelRecoveryCommand(
      recoveryId,
      RecoveryCancelledAt.create(new Date(dto.cancelledAt)),
      randomUUID(),
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
  // Authenticated Recovery lifecycle operation.
  //
  // `referenceDate` is the evaluation timestamp.
  //
  // It is NOT the Recovery's expiresAt value.
  //
  // The aggregate/application layer determines whether expiration is valid.
  //
  // ---------------------------------------------------------------------------

  @Patch(':recoveryPublicId/expire')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Expire recovery',
    description:
      'Evaluates a Recovery for expiration using the supplied reference date. Expiration eligibility and ownership/scope are enforced by the application/domain layer.',
  })
  @ApiParam({
    name: 'recoveryPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Recovery aggregate.',
    example: 'REC-8VBLAO',
  })
  @UseGuards(JwtAuthGuard)
  public async expire(
    @Param('recoveryPublicId') recoveryPublicId: string,
    @Body() dto: ExpireRecoveryRequestDto,
  ): Promise<RecoveryResponse> {
    const recoveryId = new RecoveryPublicId(recoveryPublicId);

    const command = new ExpireRecoveryCommand(
      recoveryId,
      new Date(dto.referenceDate),
      randomUUID(),
      dto.causationId,
    );

    const aggregate = await this.expireRecoveryHandler.execute(command);

    return RecoveryResponseMapper.toResponse(aggregate);
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
  // It only validates the already-authenticated security principal and converts
  // its identity reference into the Recovery bounded-context value object.
  //
  // ---------------------------------------------------------------------------

  private getAuthenticatedIdentityPublicId(
    request: Request,
  ): RecoveryIdentityPublicId {
    const user = request.user as {
      identityPublicId?: unknown;
    };

    if (
      typeof user.identityPublicId !== 'string' ||
      user.identityPublicId.trim().length === 0
    ) {
      throw new UnauthorizedException(
        'Authenticated principal does not contain identityPublicId.',
      );
    }

    return new RecoveryIdentityPublicId(user.identityPublicId.trim());
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RecoveriesController;
