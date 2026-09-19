// -----------------------------------------------------------------------------
// sisiMove — Journey Demand HTTP Controller
// -----------------------------------------------------------------------------
//
// Transport boundary for the Journey Demand bounded context.
//
// The controller is responsible for:
//
// - binding HTTP requests;
// - converting HTTP primitives into domain Value Objects where required;
// - constructing application Commands / Queries;
// - dispatching application handlers;
// - declaring authentication / authorization;
// - mapping authenticated owner results into transport-safe responses.
//
// The controller does NOT:
//
// - access Prisma;
// - implement business rules;
// - compose Traveller / Trust;
// - determine public marketplace visibility;
// - perform ownership checks itself;
// - construct public marketplace projections;
// - expose domain entities as the authenticated owner contract when a
//   dedicated response projection exists.
//
// -----------------------------------------------------------------------------
//
// PUBLIC MARKETPLACE
// -----------------
//
// GET /journey-demands
//      |
//      v
// GetPublicJourneyDemandsQuery
//      |
//      v
// GetPublicJourneyDemandsQueryHandler
//      |
//      v
// PublicJourneyDemandResponse[]
//
// GET /journey-demands/:journeyDemandPublicId
//      |
//      v
// GetPublicJourneyDemandQuery
//      |
//      v
// GetPublicJourneyDemandQueryHandler
//      |
//      v
// PublicJourneyDemandResponse
//
// The collection and detail endpoints therefore remain part of the same
// application-level public marketplace boundary.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED OWNER SURFACE
// ---------------------------
//
// GET /journey-demands/me
//      |
//      v
// AuthenticatedIdentity.identityPublicId
//      |
//      v
// RequesterPublicId
//      |
//      v
// GetMyJourneyDemandsQuery
//      |
//      v
// GetMyJourneyDemandsQueryHandler
//      |
//      v
// JourneyDemandEntity[]
//      |
//      v
// MyJourneyDemandMapper
//      |
//      v
// MyJourneyDemandResponse[]
//
// IMPORTANT:
//
// The client does NOT provide requesterPublicId for /me.
//
// The authenticated identity establishes the requester scope. This prevents
// a caller from selecting another requester's Journey Demands by changing a
// query-string or route parameter.
//
// The query handler establishes the ownership boundary. The mapper only
// transforms the already-scoped domain result into transport primitives.
//
// -----------------------------------------------------------------------------
//
// PUBLIC MARKETPLACE AND OWNER SURFACES REMAIN DISTINCT:
//
// /journey-demands
//     -> anonymous marketplace discovery
//
// /journey-demands/:journeyDemandPublicId
//     -> anonymous public marketplace detail
//
// /journey-demands/me
//     -> authenticated requester's own Journey Demands
//
// -----------------------------------------------------------------------------
//
// RESPONSE BOUNDARIES
// -------------------
//
// Public marketplace:
//
//     PublicJourneyDemandResponse
//
// Authenticated owner:
//
//     MyJourneyDemandResponse
//
// Generic/domain query endpoints:
//
//     Existing domain/application response contracts remain unchanged.
//
// The My Journey Demand response intentionally does not reuse the public
// marketplace projection because the two surfaces have different purposes.
//
// -----------------------------------------------------------------------------
//
// ROUTE ORDER
// -----------
//
// Static collection routes such as:
//
//     /me
//     /open
//     /matchable
//     /corridor/:corridorId
//     /schedule/:scheduleId
//     /requester/:requesterPublicId
//
// are declared before:
//
//     /:journeyDemandPublicId
//
// so that static paths cannot be interpreted as Journey Demand public IDs.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT ARCHITECTURAL NOTE
// ----------------------------
//
// This controller currently preserves the existing command/query contracts.
//
// In particular, CreateJourneyDemandCommand still receives the requester
// supplied by CreateJourneyDemandDto because changing that command contract
// would be a separate application-layer ownership refactor.
//
// The /me read boundary, however, is explicitly identity-derived and does
// not accept requesterPublicId from the client.
// -----------------------------------------------------------------------------

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Authentication / Authorization
// -----------------------------------------------------------------------------

import * as auth from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../../../application/journey-demand.tokens';

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

import {
  AddJourneyDemandParticipantCommand,
  AddJourneyDemandWaypointCommand,
  CancelJourneyDemandCommand,
  ConvertJourneyDemandCommand,
  CreateJourneyDemandCommand,
  ExpireJourneyDemandCommand,
  FulfillJourneyDemandCommand,
  MatchJourneyDemandCommand,
  PublishJourneyDemandCommand,
  RemoveJourneyDemandParticipantCommand,
  RemoveJourneyDemandWaypointCommand,
  UpdateJourneyDemandCapacityCommand,
  UpdateJourneyDemandCommand,
  UpdateJourneyDemandCorridorCommand,
  UpdateJourneyDemandParticipantCommand,
  UpdateJourneyDemandPricingCommand,
  UpdateJourneyDemandScheduleCommand,
  UpdateJourneyDemandWaypointCommand,
  WithdrawJourneyDemandParticipantCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

import {
  FindJourneyDemandsByCorridorQuery,
  FindJourneyDemandsByRequesterQuery,
  FindJourneyDemandsByScheduleQuery,
  FindMatchableJourneyDemandsQuery,
  FindOpenJourneyDemandsQuery,
  GetJourneyDemandByPublicIdQuery,
  GetJourneyDemandCapacityQuery,
  GetJourneyDemandCorridorQuery,
  GetJourneyDemandParticipantQuery,
  GetJourneyDemandParticipantsQuery,
  GetJourneyDemandPricingQuery,
  GetJourneyDemandScheduleQuery,
  GetJourneyDemandWaypointsQuery,
  GetMyJourneyDemandsQuery,
  GetPublicJourneyDemandQuery,
  GetPublicJourneyDemandsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Authenticated Owner Response
// -----------------------------------------------------------------------------

import {
  MyJourneyDemandMapper,
  type MyJourneyDemandResponse,
} from '../../mappers/my-journey-demand.mapper';

// -----------------------------------------------------------------------------
// Public Journey Demand Responses
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandResponse } from '../../../application/query-handlers/get-public-journey-demand.query-handler';

import type { PublicJourneyDemandResponse as PublicJourneyDemandCollectionResponse } from '../../../application/query-handlers/get-public-journey-demands.query-handler';

// -----------------------------------------------------------------------------
// Domain Aggregate / Entities
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../../../domain/aggregates/journey-demand.aggregate';

import type { JourneyDemandCapacityEntity } from '../../../domain/entities/journey-demand-capacity.entity';
import type { JourneyDemandCorridorEntity } from '../../../domain/entities/journey-demand-corridor.entity';
import type { JourneyDemandEntity } from '../../../domain/entities/journey-demand.entity';
import type { JourneyDemandParticipantEntity } from '../../../domain/entities/journey-demand-participant.entity';
import type { JourneyDemandPricingEntity } from '../../../domain/entities/journey-demand-pricing.entity';
import type { JourneyDemandScheduleEntity } from '../../../domain/entities/journey-demand-schedule.entity';
import type { JourneyDemandWaypointEntity } from '../../../domain/entities/journey-demand-waypoint.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandCorridorId,
  JourneyDemandParticipantPublicId,
  JourneyDemandPublicId,
  JourneyDemandScheduleId,
  RequesterPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Request DTOs
// -----------------------------------------------------------------------------

import {
  AddJourneyDemandParticipantDto,
  AddJourneyDemandWaypointDto,
  CancelJourneyDemandDto,
  ConvertJourneyDemandDto,
  CreateJourneyDemandDto,
  ExpireJourneyDemandDto,
  FulfillJourneyDemandDto,
  MatchJourneyDemandDto,
  PublishJourneyDemandDto,
  RemoveJourneyDemandParticipantDto,
  RemoveJourneyDemandWaypointDto,
  UpdateJourneyDemandCapacityDto,
  UpdateJourneyDemandCorridorDto,
  UpdateJourneyDemandDto,
  UpdateJourneyDemandParticipantDto,
  UpdateJourneyDemandPricingDto,
  UpdateJourneyDemandScheduleDto,
  UpdateJourneyDemandWaypointDto,
  WithdrawJourneyDemandParticipantDto,
} from '../dto';

// -----------------------------------------------------------------------------
// Query DTOs
// -----------------------------------------------------------------------------

import {
  FindJourneyDemandsByCorridorQueryDto,
  FindJourneyDemandsByRequesterQueryDto,
  FindJourneyDemandsByScheduleQueryDto,
  FindMatchableJourneyDemandsQueryDto,
  FindOpenJourneyDemandsQueryDto,
  GetMyJourneyDemandsQueryDto,
  GetPublicJourneyDemandsQueryDto,
} from '../dto/queries';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Journey Demands')
@Controller('journey-demands')
export class JourneyDemandController {
  constructor(
    // =========================================================================
    // Lifecycle Command Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createJourneyDemandHandler: CommandHandler<
      CreateJourneyDemandCommand,
      JourneyDemandAggregate
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE)
    private readonly updateJourneyDemandHandler: CommandHandler<
      UpdateJourneyDemandCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.PUBLISH)
    private readonly publishJourneyDemandHandler: CommandHandler<
      PublishJourneyDemandCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.MATCH)
    private readonly matchJourneyDemandHandler: CommandHandler<
      MatchJourneyDemandCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.CONVERT)
    private readonly convertJourneyDemandHandler: CommandHandler<
      ConvertJourneyDemandCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.FULFILL)
    private readonly fulfillJourneyDemandHandler: CommandHandler<
      FulfillJourneyDemandCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelJourneyDemandHandler: CommandHandler<
      CancelJourneyDemandCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.EXPIRE)
    private readonly expireJourneyDemandHandler: CommandHandler<
      ExpireJourneyDemandCommand,
      void
    >,

    // =========================================================================
    // Corridor Command Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_CORRIDOR)
    private readonly updateCorridorHandler: CommandHandler<
      UpdateJourneyDemandCorridorCommand,
      void
    >,

    // =========================================================================
    // Waypoint Command Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.ADD_WAYPOINT)
    private readonly addWaypointHandler: CommandHandler<
      AddJourneyDemandWaypointCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_WAYPOINT)
    private readonly updateWaypointHandler: CommandHandler<
      UpdateJourneyDemandWaypointCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.REMOVE_WAYPOINT)
    private readonly removeWaypointHandler: CommandHandler<
      RemoveJourneyDemandWaypointCommand,
      void
    >,

    // =========================================================================
    // Schedule Command Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_SCHEDULE)
    private readonly updateScheduleHandler: CommandHandler<
      UpdateJourneyDemandScheduleCommand,
      void
    >,

    // =========================================================================
    // Capacity Command Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_CAPACITY)
    private readonly updateCapacityHandler: CommandHandler<
      UpdateJourneyDemandCapacityCommand,
      void
    >,

    // =========================================================================
    // Pricing Command Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_PRICING)
    private readonly updatePricingHandler: CommandHandler<
      UpdateJourneyDemandPricingCommand,
      void
    >,

    // =========================================================================
    // Participant Command Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.ADD_PARTICIPANT)
    private readonly addParticipantHandler: CommandHandler<
      AddJourneyDemandParticipantCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_PARTICIPANT)
    private readonly updateParticipantHandler: CommandHandler<
      UpdateJourneyDemandParticipantCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.WITHDRAW_PARTICIPANT)
    private readonly withdrawParticipantHandler: CommandHandler<
      WithdrawJourneyDemandParticipantCommand,
      void
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.REMOVE_PARTICIPANT)
    private readonly removeParticipantHandler: CommandHandler<
      RemoveJourneyDemandParticipantCommand,
      void
    >,

    // =========================================================================
    // Public Marketplace Query Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PUBLIC_MANY)
    private readonly getPublicJourneyDemandsHandler: QueryHandler<
      GetPublicJourneyDemandsQuery,
      readonly PublicJourneyDemandCollectionResponse[]
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PUBLIC)
    private readonly getPublicJourneyDemandHandler: QueryHandler<
      GetPublicJourneyDemandQuery,
      PublicJourneyDemandResponse | null
    >,

    // =========================================================================
    // Generic / Protected Query Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID)
    private readonly getJourneyDemandByPublicIdHandler: QueryHandler<
      GetJourneyDemandByPublicIdQuery,
      JourneyDemandAggregate
    >,

    /**
     * Returns Journey Demands belonging to the authenticated requester.
     *
     * The requester scope is established by the controller from the
     * authenticated identity.
     *
     * The handler therefore receives a RequesterPublicId derived from the
     * authenticated JWT rather than from client-controlled input.
     */
    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_MY)
    private readonly getMyJourneyDemandsHandler: QueryHandler<
      GetMyJourneyDemandsQuery,
      JourneyDemandEntity[]
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_OPEN)
    private readonly findOpenJourneyDemandsHandler: QueryHandler<
      FindOpenJourneyDemandsQuery,
      JourneyDemandEntity[]
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_MATCHABLE)
    private readonly findMatchableJourneyDemandsHandler: QueryHandler<
      FindMatchableJourneyDemandsQuery,
      JourneyDemandEntity[]
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_BY_CORRIDOR)
    private readonly findJourneyDemandsByCorridorHandler: QueryHandler<
      FindJourneyDemandsByCorridorQuery,
      JourneyDemandEntity[]
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_BY_SCHEDULE)
    private readonly findJourneyDemandsByScheduleHandler: QueryHandler<
      FindJourneyDemandsByScheduleQuery,
      JourneyDemandEntity[]
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.FIND_BY_REQUESTER)
    private readonly findJourneyDemandsByRequesterHandler: QueryHandler<
      FindJourneyDemandsByRequesterQuery,
      JourneyDemandEntity[]
    >,

    // =========================================================================
    // Component Query Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_CORRIDOR)
    private readonly getCorridorHandler: QueryHandler<
      GetJourneyDemandCorridorQuery,
      JourneyDemandCorridorEntity
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_WAYPOINTS)
    private readonly getWaypointsHandler: QueryHandler<
      GetJourneyDemandWaypointsQuery,
      JourneyDemandWaypointEntity[]
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_SCHEDULE)
    private readonly getScheduleHandler: QueryHandler<
      GetJourneyDemandScheduleQuery,
      JourneyDemandScheduleEntity
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_CAPACITY)
    private readonly getCapacityHandler: QueryHandler<
      GetJourneyDemandCapacityQuery,
      JourneyDemandCapacityEntity
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PRICING)
    private readonly getPricingHandler: QueryHandler<
      GetJourneyDemandPricingQuery,
      JourneyDemandPricingEntity
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PARTICIPANT)
    private readonly getParticipantHandler: QueryHandler<
      GetJourneyDemandParticipantQuery,
      JourneyDemandParticipantEntity
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_PARTICIPANTS)
    private readonly getParticipantsHandler: QueryHandler<
      GetJourneyDemandParticipantsQuery,
      JourneyDemandParticipantEntity[]
    >,
  ) {}

  // ===========================================================================
  // PUBLIC MARKETPLACE DISCOVERY
  // ===========================================================================

  /**
   * Returns the public Journey Demand marketplace collection.
   *
   * An empty query means:
   *
   *     "Return all publicly discoverable Journey Demands."
   *
   * Optional filters narrow the collection.
   *
   * No authentication is required because this is the anonymous marketplace
   * read boundary.
   */
  @Get()
  @ApiOperation({
    summary: 'Get public journey demands',
    description:
      'Returns publicly discoverable Journey Demands for marketplace browsing and optional filtering.',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Origin location filter.',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Destination location filter.',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Requested travel date in YYYY-MM-DD format.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of public Journey Demands to return.',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of public Journey Demands to skip.',
  })
  public async getPublic(
    @Query() dto: GetPublicJourneyDemandsQueryDto,
  ): Promise<readonly PublicJourneyDemandCollectionResponse[]> {
    return this.getPublicJourneyDemandsHandler.execute(
      new GetPublicJourneyDemandsQuery(
        dto.from,
        dto.to,
        dto.date,
        dto.limit,
        dto.offset,
      ),
    );
  }

  // ===========================================================================
  // AUTHENTICATED OWNER COLLECTION
  // ===========================================================================

  /**
   * Returns Journey Demands belonging to the currently authenticated
   * requester.
   *
   * Ownership flow:
   *
   *     JWT
   *       ↓
   *     AuthenticatedIdentity
   *       ↓
   *     identity.identityPublicId
   *       ↓
   *     RequesterPublicId
   *       ↓
   *     GetMyJourneyDemandsQuery
   *       ↓
   *     JourneyDemandEntity[]
   *       ↓
   *     MyJourneyDemandMapper
   *       ↓
   *     MyJourneyDemandResponse[]
   *
   * The client cannot provide requesterPublicId for this endpoint.
   *
   * This is intentionally parallel to:
   *
   *     GET /journeys/me
   */
  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard)
  @ApiOperation({
    summary: 'Get my journey demands',
    description:
      'Returns journey demands belonging to the currently authenticated requester.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of Journey Demands to return.',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of Journey Demands to skip.',
  })
  public async getMyJourneyDemands(
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
    @Query() dto: GetMyJourneyDemandsQueryDto,
  ): Promise<readonly MyJourneyDemandResponse[]> {
    const entities = await this.getMyJourneyDemandsHandler.execute(
      new GetMyJourneyDemandsQuery(
        new RequesterPublicId(identity.identityPublicId),
        dto.limit,
        dto.offset,
      ),
    );

    return entities.map((entity) => MyJourneyDemandMapper.fromEntity(entity));
  }

  // ===========================================================================
  // OTHER PROTECTED COLLECTION QUERIES
  // ===========================================================================

  /**
   * Returns open Journey Demands for authorized domain operations.
   *
   * This is deliberately distinct from /me and remains an operational query
   * rather than an authenticated owner projection.
   */
  @Get('open')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Find open journey demands',
    description:
      'Returns open Journey Demands for authorized domain operations.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  public async findOpen(
    @Query() dto: FindOpenJourneyDemandsQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.findOpenJourneyDemandsHandler.execute(
      new FindOpenJourneyDemandsQuery(dto.limit, dto.offset),
    );
  }

  /**
   * Returns Journey Demands that are currently eligible for matching.
   */
  @Get('matchable')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Find matchable journey demands',
    description:
      'Returns Journey Demands available for authorized matching operations.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  public async findMatchable(
    @Query() dto: FindMatchableJourneyDemandsQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.findMatchableJourneyDemandsHandler.execute(
      new FindMatchableJourneyDemandsQuery(dto.limit, dto.offset),
    );
  }

  /**
   * Returns Journey Demands associated with a specific corridor.
   *
   * This is a protected domain query and is not the public marketplace
   * collection boundary.
   */
  @Get('corridor/:corridorId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Find journey demands by corridor',
    description: 'Returns Journey Demands associated with a specific corridor.',
  })
  @ApiParam({
    name: 'corridorId',
    description: 'Journey Demand corridor identifier.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  public async findByCorridor(
    @Param('corridorId') corridorId: string,
    @Query() dto: FindJourneyDemandsByCorridorQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.findJourneyDemandsByCorridorHandler.execute(
      new FindJourneyDemandsByCorridorQuery(
        new JourneyDemandCorridorId(corridorId),
        dto.limit,
        dto.offset,
      ),
    );
  }

  /**
   * Returns Journey Demands associated with a specific schedule.
   */
  @Get('schedule/:scheduleId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Find journey demands by schedule',
    description: 'Returns Journey Demands associated with a specific schedule.',
  })
  @ApiParam({
    name: 'scheduleId',
    description: 'Journey Demand schedule identifier.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  public async findBySchedule(
    @Param('scheduleId') scheduleId: string,
    @Query() dto: FindJourneyDemandsByScheduleQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.findJourneyDemandsByScheduleHandler.execute(
      new FindJourneyDemandsByScheduleQuery(
        new JourneyDemandScheduleId(scheduleId),
        dto.limit,
        dto.offset,
      ),
    );
  }

  /**
   * Generic requester lookup.
   *
   * This remains distinct from /me.
   *
   * /me:
   *     requester scope comes from the authenticated identity.
   *
   * /requester/:requesterPublicId:
   *     requester scope is explicitly selected and therefore remains a
   *     protected domain query.
   */
  @Get('requester/:requesterPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Find journey demands by requester',
    description: 'Returns Journey Demands belonging to a specific requester.',
  })
  @ApiParam({
    name: 'requesterPublicId',
    description: 'Public identifier of the requester.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  public async findByRequester(
    @Param('requesterPublicId') requesterPublicId: string,
    @Query() dto: FindJourneyDemandsByRequesterQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.findJourneyDemandsByRequesterHandler.execute(
      new FindJourneyDemandsByRequesterQuery(
        new RequesterPublicId(requesterPublicId),
        dto.limit,
        dto.offset,
      ),
    );
  }

  // ===========================================================================
  // PUBLIC JOURNEY DEMAND DETAIL
  // ===========================================================================

  /**
   * Public marketplace detail.
   *
   * This endpoint intentionally returns the public application read model.
   * It does not expose the Journey Demand aggregate directly.
   */
  @Get(':journeyDemandPublicId')
  @ApiOperation({
    summary: 'Get public journey demand by public ID',
    description:
      'Returns the publicly discoverable Journey Demand marketplace read model.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async get(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<PublicJourneyDemandResponse | null> {
    return this.getPublicJourneyDemandHandler.execute(
      new GetPublicJourneyDemandQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  // ===========================================================================
  // COMPONENT QUERIES
  // ===========================================================================

  /**
   * Returns the corridor associated with a Journey Demand.
   */
  @Get(':journeyDemandPublicId/corridor')
  @ApiOperation({
    summary: 'Get journey demand corridor',
    description: 'Returns the corridor associated with a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async getCorridor(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandCorridorEntity> {
    return this.getCorridorHandler.execute(
      new GetJourneyDemandCorridorQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  /**
   * Returns the waypoints associated with a Journey Demand.
   */
  @Get(':journeyDemandPublicId/waypoints')
  @ApiOperation({
    summary: 'Get journey demand waypoints',
    description: 'Returns the waypoints associated with a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async getWaypoints(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandWaypointEntity[]> {
    return this.getWaypointsHandler.execute(
      new GetJourneyDemandWaypointsQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  /**
   * Returns the schedule associated with a Journey Demand.
   */
  @Get(':journeyDemandPublicId/schedule')
  @ApiOperation({
    summary: 'Get journey demand schedule',
    description: 'Returns the schedule associated with a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async getSchedule(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandScheduleEntity> {
    return this.getScheduleHandler.execute(
      new GetJourneyDemandScheduleQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  /**
   * Returns capacity requirements for a Journey Demand.
   */
  @Get(':journeyDemandPublicId/capacity')
  @ApiOperation({
    summary: 'Get journey demand capacity',
    description: 'Returns capacity requirements for a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async getCapacity(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandCapacityEntity> {
    return this.getCapacityHandler.execute(
      new GetJourneyDemandCapacityQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  /**
   * Returns pricing information for a Journey Demand.
   */
  @Get(':journeyDemandPublicId/pricing')
  @ApiOperation({
    summary: 'Get journey demand pricing',
    description: 'Returns pricing information for a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async getPricing(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandPricingEntity> {
    return this.getPricingHandler.execute(
      new GetJourneyDemandPricingQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  // ===========================================================================
  // LIFECYCLE COMMANDS
  // ===========================================================================

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:create')
  @ApiOperation({
    summary: 'Create journey demand',
    description: 'Creates a new Journey Demand.',
  })
  public async create(
    @Body() dto: CreateJourneyDemandDto,
  ): Promise<JourneyDemandAggregate> {
    return this.createJourneyDemandHandler.execute(
      new CreateJourneyDemandCommand(
        dto.requesterPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  /**
   * Updates the root Journey Demand.
   */
  @Put(':journeyDemandPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:update')
  @ApiOperation({
    summary: 'Update journey demand',
    description: 'Updates an existing Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async update(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: UpdateJourneyDemandDto,
  ): Promise<void> {
    await this.updateJourneyDemandHandler.execute(
      new UpdateJourneyDemandCommand(
        journeyDemandPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  /**
   * Publishes a Journey Demand for public discovery and matching.
   */
  @Post(':journeyDemandPublicId/publish')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:publish')
  @ApiOperation({
    summary: 'Publish journey demand',
    description:
      'Publishes a Journey Demand for public discovery and matching.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async publish(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: PublishJourneyDemandDto,
  ): Promise<void> {
    await this.publishJourneyDemandHandler.execute(
      new PublishJourneyDemandCommand(
        journeyDemandPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  /**
   * Matches a Journey Demand with a Journey.
   */
  @Post(':journeyDemandPublicId/match')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:match')
  @ApiOperation({
    summary: 'Match journey demand',
    description: 'Matches a Journey Demand with a Journey.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async match(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: MatchJourneyDemandDto,
  ): Promise<void> {
    await this.matchJourneyDemandHandler.execute(
      new MatchJourneyDemandCommand(
        journeyDemandPublicId,
        dto.journeyPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  /**
   * Converts a Journey Demand into the corresponding Journey flow.
   */
  @Post(':journeyDemandPublicId/convert')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:convert')
  @ApiOperation({
    summary: 'Convert journey demand',
    description:
      'Converts a Journey Demand into the corresponding Journey flow.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async convert(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: ConvertJourneyDemandDto,
  ): Promise<void> {
    await this.convertJourneyDemandHandler.execute(
      new ConvertJourneyDemandCommand(
        journeyDemandPublicId,
        dto.journeyPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  /**
   * Marks a Journey Demand as fulfilled.
   */
  @Post(':journeyDemandPublicId/fulfill')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:fulfill')
  @ApiOperation({
    summary: 'Fulfill journey demand',
    description: 'Marks a Journey Demand as fulfilled.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async fulfill(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: FulfillJourneyDemandDto,
  ): Promise<void> {
    await this.fulfillJourneyDemandHandler.execute(
      new FulfillJourneyDemandCommand(
        journeyDemandPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  /**
   * Cancels a Journey Demand.
   */
  @Post(':journeyDemandPublicId/cancel')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:cancel')
  @ApiOperation({
    summary: 'Cancel journey demand',
    description: 'Cancels an existing Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async cancel(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: CancelJourneyDemandDto,
  ): Promise<void> {
    await this.cancelJourneyDemandHandler.execute(
      new CancelJourneyDemandCommand(
        journeyDemandPublicId,
        dto.correlationId,
        dto.causationId,
        dto.reason,
      ),
    );
  }

  /**
   * Expires a Journey Demand.
   */
  @Post(':journeyDemandPublicId/expire')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:expire')
  @ApiOperation({
    summary: 'Expire journey demand',
    description: 'Expires a Journey Demand that is no longer active.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async expire(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: ExpireJourneyDemandDto,
  ): Promise<void> {
    await this.expireJourneyDemandHandler.execute(
      new ExpireJourneyDemandCommand(
        journeyDemandPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // CORRIDOR COMMANDS
  // ===========================================================================

  @Put(':journeyDemandPublicId/corridor')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:corridor:update')
  @ApiOperation({
    summary: 'Update journey demand corridor',
    description: 'Updates the origin and destination corridor.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async updateCorridor(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: UpdateJourneyDemandCorridorDto,
  ): Promise<void> {
    await this.updateCorridorHandler.execute(
      new UpdateJourneyDemandCorridorCommand(
        journeyDemandPublicId,
        dto.origin,
        dto.destination,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // WAYPOINT COMMANDS
  // ===========================================================================

  @Post(':journeyDemandPublicId/waypoints')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:waypoint:add')
  @ApiOperation({
    summary: 'Add journey demand waypoint',
    description: 'Adds a waypoint to a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async addWaypoint(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: AddJourneyDemandWaypointDto,
  ): Promise<void> {
    await this.addWaypointHandler.execute(
      new AddJourneyDemandWaypointCommand(
        journeyDemandPublicId,
        dto.type,
        dto.sequence,
        dto.name,
        dto.latitude,
        dto.longitude,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  @Put(':journeyDemandPublicId/waypoints/:waypointPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:waypoint:update')
  @ApiOperation({
    summary: 'Update journey demand waypoint',
    description: 'Updates an existing Journey Demand waypoint.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  @ApiParam({
    name: 'waypointPublicId',
    description: 'Public identifier of the waypoint.',
  })
  public async updateWaypoint(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Param('waypointPublicId') waypointPublicId: string,
    @Body() dto: UpdateJourneyDemandWaypointDto,
  ): Promise<void> {
    await this.updateWaypointHandler.execute(
      new UpdateJourneyDemandWaypointCommand(
        journeyDemandPublicId,
        waypointPublicId,
        dto.correlationId,
        dto.causationId,
        dto.name,
        dto.latitude,
        dto.longitude,
        dto.sequence,
      ),
    );
  }

  @Delete(':journeyDemandPublicId/waypoints/:waypointPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:waypoint:remove')
  @ApiOperation({
    summary: 'Remove journey demand waypoint',
    description: 'Removes a waypoint from a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  @ApiParam({
    name: 'waypointPublicId',
    description: 'Public identifier of the waypoint.',
  })
  public async removeWaypoint(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Param('waypointPublicId') waypointPublicId: string,
    @Body() dto: RemoveJourneyDemandWaypointDto,
  ): Promise<void> {
    await this.removeWaypointHandler.execute(
      new RemoveJourneyDemandWaypointCommand(
        journeyDemandPublicId,
        waypointPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // SCHEDULE COMMANDS
  // ===========================================================================

  @Put(':journeyDemandPublicId/schedule')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:schedule:update')
  @ApiOperation({
    summary: 'Update journey demand schedule',
    description: 'Updates the requested travel schedule.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async updateSchedule(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: UpdateJourneyDemandScheduleDto,
  ): Promise<void> {
    await this.updateScheduleHandler.execute(
      new UpdateJourneyDemandScheduleCommand(
        journeyDemandPublicId,
        new Date(dto.earliestDeparture),
        new Date(dto.latestDeparture),
        dto.correlationId,
        dto.targetArrival !== undefined
          ? new Date(dto.targetArrival)
          : undefined,
        dto.maximumArrival !== undefined
          ? new Date(dto.maximumArrival)
          : undefined,
        dto.timezone,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // CAPACITY COMMANDS
  // ===========================================================================

  @Put(':journeyDemandPublicId/capacity')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:capacity:update')
  @ApiOperation({
    summary: 'Update journey demand capacity',
    description: 'Updates the number of seats required.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async updateCapacity(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: UpdateJourneyDemandCapacityDto,
  ): Promise<void> {
    await this.updateCapacityHandler.execute(
      new UpdateJourneyDemandCapacityCommand(
        journeyDemandPublicId,
        dto.seatsRequired,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // PRICING COMMANDS
  // ===========================================================================

  @Put(':journeyDemandPublicId/pricing')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:pricing:update')
  @ApiOperation({
    summary: 'Update journey demand pricing',
    description: 'Updates pricing for a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async updatePricing(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: UpdateJourneyDemandPricingDto,
  ): Promise<void> {
    await this.updatePricingHandler.execute(
      new UpdateJourneyDemandPricingCommand(
        journeyDemandPublicId,
        dto.currency,
        dto.maxFare,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // PARTICIPANT COMMANDS
  // ===========================================================================

  @Post(':journeyDemandPublicId/participants')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:participant:add')
  @ApiOperation({
    summary: 'Add journey demand participant',
    description: 'Adds a participant to a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async addParticipant(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: AddJourneyDemandParticipantDto,
  ): Promise<void> {
    await this.addParticipantHandler.execute(
      new AddJourneyDemandParticipantCommand(
        journeyDemandPublicId,
        dto.participantPublicId,
        dto.memberPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  @Put(':journeyDemandPublicId/participants/:participantPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:participant:update')
  @ApiOperation({
    summary: 'Update journey demand participant',
    description: 'Updates participant seat requirements.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  @ApiParam({
    name: 'participantPublicId',
    description: 'Public identifier of the participant.',
  })
  public async updateParticipant(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: UpdateJourneyDemandParticipantDto,
  ): Promise<void> {
    await this.updateParticipantHandler.execute(
      new UpdateJourneyDemandParticipantCommand(
        journeyDemandPublicId,
        participantPublicId,
        dto.seats,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  @Post(':journeyDemandPublicId/participants/:participantPublicId/withdraw')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:participant:withdraw')
  @ApiOperation({
    summary: 'Withdraw journey demand participant',
    description: 'Withdraws a participant from a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  @ApiParam({
    name: 'participantPublicId',
    description: 'Public identifier of the participant.',
  })
  public async withdrawParticipant(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: WithdrawJourneyDemandParticipantDto,
  ): Promise<void> {
    await this.withdrawParticipantHandler.execute(
      new WithdrawJourneyDemandParticipantCommand(
        journeyDemandPublicId,
        participantPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  @Delete(':journeyDemandPublicId/participants/:participantPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:participant:remove')
  @ApiOperation({
    summary: 'Remove journey demand participant',
    description: 'Removes a participant from a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  @ApiParam({
    name: 'participantPublicId',
    description: 'Public identifier of the participant.',
  })
  public async removeParticipant(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
    @Body() dto: RemoveJourneyDemandParticipantDto,
  ): Promise<void> {
    await this.removeParticipantHandler.execute(
      new RemoveJourneyDemandParticipantCommand(
        journeyDemandPublicId,
        participantPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // PROTECTED PARTICIPANT QUERIES
  // ===========================================================================

  @Get(':journeyDemandPublicId/participants')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Get journey demand participants',
    description: 'Returns participants associated with a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async getParticipants(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandParticipantEntity[]> {
    return this.getParticipantsHandler.execute(
      new GetJourneyDemandParticipantsQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  @Get(':journeyDemandPublicId/participants/:participantPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Get journey demand participant',
    description: 'Returns a specific Journey Demand participant.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  @ApiParam({
    name: 'participantPublicId',
    description: 'Public identifier of the participant.',
  })
  public async getParticipant(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Param('participantPublicId') participantPublicId: string,
  ): Promise<JourneyDemandParticipantEntity> {
    return this.getParticipantHandler.execute(
      new GetJourneyDemandParticipantQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
        new JourneyDemandParticipantPublicId(participantPublicId),
      ),
    );
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default JourneyDemandController;
