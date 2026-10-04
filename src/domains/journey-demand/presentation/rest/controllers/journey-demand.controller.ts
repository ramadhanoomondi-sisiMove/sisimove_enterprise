// -----------------------------------------------------------------------------
// sisiMove — Journey Demand HTTP Controller
// -----------------------------------------------------------------------------
//
// Transport boundary for the Journey Demand bounded context.
//
// Architectural responsibility:
//
// HTTP Request
//     ↓
// Controller
//     ↓
// DTO → Application Command / Query
//     ↓
// Command / Query Handler
//     ↓
// JourneyDemandAggregate
//     ↓
// Repository
//
// The controller intentionally contains no domain logic.
//
// It is responsible for:
//
// - HTTP routing
// - authentication / authorization guards
// - DTO → application command/query translation
// - primitive → domain value-object conversion where required by queries
// - returning application/query results
//
// It does NOT:
//
// - mutate domain entities directly
// - construct domain aggregates
// - enforce aggregate invariants
// - increment aggregate versions
// - create domain events
// - persist entities directly
//
// Authorization permissions intentionally match the seeded Journey Demand
// permission vocabulary:
//
//   demand:read
//   demand:create
//   demand:update
//   demand:cancel
//
// No additional Journey Demand permissions are assumed here.
//
// -----------------------------------------------------------------------------
// PUBLIC MARKETPLACE
// -----------------------------------------------------------------------------
//
// Public Journey Demand discovery supports:
//
//   minPrice?
//   maxPrice?
//
// These filters apply to the requester's maximum acceptable per-seat price:
//
//   maximumPricePerSeat
//
// Inclusive range:
//
//   minPrice <= maximumPricePerSeat <= maxPrice
//
// Either boundary may be supplied independently.
//
// Public lifecycle visibility is controlled by the public query handlers.
// The controller does not perform status filtering.
//
// The public marketplace must not expose:
//
//   CANCELLED
//   EXPIRED
//
// The public query/projection layer is responsible for enforcing that rule.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
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

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

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
  GetJourneyDemandCapacityQuery,
  GetJourneyDemandCorridorQuery,
  GetJourneyDemandParticipantQuery,
  GetJourneyDemandParticipantsQuery,
  GetJourneyDemandPricingQuery,
  GetJourneyDemandScheduleQuery,
  GetJourneyDemandWaypointsQuery,
  GetMyJourneyDemandQuery,
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
// Journey Demand Response
// -----------------------------------------------------------------------------

import {
  JourneyDemandResponse,
  JourneyDemandResponseMapper,
} from '../../mappers';

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
  public constructor(
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
    // Authenticated Owner Query Handlers
    // =========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_MY)
    private readonly getMyJourneyDemandsHandler: QueryHandler<
      GetMyJourneyDemandsQuery,
      JourneyDemandAggregate[]
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_MY_ONE)
    private readonly getMyJourneyDemandHandler: QueryHandler<
      GetMyJourneyDemandQuery,
      JourneyDemandEntity | null
    >,

    // =========================================================================
    // Protected Collection Query Handlers
    // =========================================================================

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

  @Get()
  @ApiOperation({
    summary: 'Get public journey demands',
    description:
      'Returns publicly discoverable Journey Demands for marketplace browsing and optional filtering. Public results exclude cancelled and expired Journey Demands. Price filtering applies inclusively to the requester maximum acceptable per-seat price.',
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
    name: 'minPrice',
    required: false,
    type: Number,
    description:
      'Minimum acceptable per-seat price in KES. Inclusive. Filters against maximumPricePerSeat.',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description:
      'Maximum acceptable per-seat price in KES. Inclusive. Filters against maximumPricePerSeat.',
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
        dto.minPrice,
        dto.maxPrice,
        dto.limit,
        dto.offset,
      ),
    );
  }

  // ===========================================================================
  // AUTHENTICATED OWNER COLLECTION
  // ===========================================================================

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard)
  @ApiOperation({
    summary: 'Get my journey demands',
    description:
      'Returns Journey Demands belonging to the currently authenticated requester.',
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
  public async getMyJourneyDemands(
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
    @Query() dto: GetMyJourneyDemandsQueryDto,
  ): Promise<readonly MyJourneyDemandResponse[]> {
    const aggregates = await this.getMyJourneyDemandsHandler.execute(
      new GetMyJourneyDemandsQuery(
        new RequesterPublicId(identity.identityPublicId),
        dto.limit,
        dto.offset,
      ),
    );

    return aggregates.map((aggregate) =>
      MyJourneyDemandMapper.fromAggregate(aggregate),
    );
  }

  // ===========================================================================
  // AUTHENTICATED OWNER DETAIL
  // ===========================================================================

  @Get('me/:journeyDemandPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard)
  @ApiOperation({
    summary: 'Get my journey demand',
    description:
      'Returns one Journey Demand belonging to the currently authenticated requester.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async getMyJourneyDemand(
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<MyJourneyDemandResponse | null> {
    const entity = await this.getMyJourneyDemandHandler.execute(
      new GetMyJourneyDemandQuery(
        new RequesterPublicId(identity.identityPublicId),
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );

    if (entity === null) {
      return null;
    }

    return MyJourneyDemandMapper.fromEntity(entity);
  }

  // ===========================================================================
  // PROTECTED COLLECTION QUERIES
  // ===========================================================================

  @Get('open')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:read')
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

  @Get('matchable')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:read')
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

  @Get('corridor/:corridorId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:read')
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

  @Get('schedule/:scheduleId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:read')
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

  @Get('requester/:requesterPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:read')
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

  @Get(':journeyDemandPublicId')
  @ApiOperation({
    summary: 'Get public journey demand by public ID',
    description:
      'Returns the publicly discoverable Journey Demand marketplace read model. Cancelled and expired Journey Demands are not publicly discoverable.',
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
  @auth.RequirePermissions('demand:create')
  @ApiOperation({
    summary: 'Create journey demand',
    description:
      'Creates a new Journey Demand in DRAFT state. Component configuration and publication are performed through the subsequent Journey Demand commands.',
  })
  public async create(
    @Body() dto: CreateJourneyDemandDto,
  ): Promise<JourneyDemandResponse> {
    // -------------------------------------------------------------------------
    // Creation is intentionally performed exactly once.
    //
    // The application workflow subsequently updates the aggregate through
    // corridor, schedule, capacity, and pricing commands.
    // -------------------------------------------------------------------------

    const aggregate = await this.createJourneyDemandHandler.execute(
      new CreateJourneyDemandCommand(
        dto.requesterPublicId,
        dto.correlationId,
        dto.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // The HTTP contract returns the mapped aggregate response.
    //
    // The controller does not expose the aggregate itself.
    // -------------------------------------------------------------------------

    return JourneyDemandResponseMapper.toResponse(aggregate);
  }

  @Put(':journeyDemandPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Update journey demand',
    description:
      'Records a root-level Journey Demand update. Aggregate versioning, audit timestamp, and the JourneyDemandUpdatedEvent are handled by the aggregate.',
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

  @Post(':journeyDemandPublicId/publish')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Publish journey demand',
    description:
      'Publishes a complete Journey Demand for public discovery and matching.',
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

  @Post(':journeyDemandPublicId/match')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Match journey demand',
    description: 'Matches a Journey Demand with an existing Journey.',
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

  @Post(':journeyDemandPublicId/convert')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Convert journey demand',
    description:
      'Converts a matched Journey Demand into the corresponding Journey flow.',
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

  @Post(':journeyDemandPublicId/fulfill')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Fulfill journey demand',
    description: 'Marks a converted Journey Demand as fulfilled.',
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

  @Post(':journeyDemandPublicId/cancel')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:cancel')
  @ApiOperation({
    summary: 'Cancel journey demand',
    description: 'Cancels an active Journey Demand.',
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

  @Post(':journeyDemandPublicId/expire')
  @ApiBearerAuth('access-token')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('demand:update')
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
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Update journey demand corridor',
    description:
      'Creates the Journey Demand corridor when it does not yet exist, or updates the existing corridor origin and destination when it does.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  public async updateCorridor(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
    @Body() dto: UpdateJourneyDemandCorridorDto,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // Important:
    //
    // The first corridor update may create the corridor child entity.
    //
    // JourneyDemandCorridorEntity requires complete geographic coordinates
    // during creation:
    //
    //   originCoordinates
    //   destinationCoordinates
    //
    // Existing corridor updates continue to modify only the origin/destination
    // names through JourneyDemandAggregate.updateCorridor().
    //
    // Therefore the transport DTO supplies the coordinates required by the
    // first-time creation path.
    // -------------------------------------------------------------------------

    await this.updateCorridorHandler.execute(
      new UpdateJourneyDemandCorridorCommand(
        journeyDemandPublicId,
        dto.origin,
        dto.originLatitude,
        dto.originLongitude,
        dto.destination,
        dto.destinationLatitude,
        dto.destinationLongitude,
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
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Add journey demand waypoint',
    description: 'Adds a new waypoint to the Journey Demand corridor.',
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
  @auth.RequirePermissions('demand:update')
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
    description: 'Public identifier of the Journey Demand waypoint.',
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
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Remove journey demand waypoint',
    description: 'Removes an existing waypoint from a Journey Demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the Journey Demand.',
  })
  @ApiParam({
    name: 'waypointPublicId',
    description: 'Public identifier of the Journey Demand waypoint.',
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
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Update journey demand schedule',
    description:
      'Creates or updates the requested travel schedule for a Journey Demand.',
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
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Update journey demand capacity',
    description:
      'Creates or updates the number of seats required by the Journey Demand.',
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
  @auth.RequirePermissions('demand:update')
  @ApiOperation({
    summary: 'Update journey demand pricing',
    description: 'Creates or updates pricing for a Journey Demand.',
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
  @auth.RequirePermissions('demand:update')
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
  @auth.RequirePermissions('demand:update')
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
    description: 'Public identifier of the Journey Demand participant.',
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
  @auth.RequirePermissions('demand:update')
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
    description: 'Public identifier of the Journey Demand participant.',
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
  @auth.RequirePermissions('demand:update')
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
    description: 'Public identifier of the Journey Demand participant.',
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
  @auth.RequirePermissions('demand:read')
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
  @auth.RequirePermissions('demand:read')
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
    description: 'Public identifier of the Journey Demand participant.',
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
