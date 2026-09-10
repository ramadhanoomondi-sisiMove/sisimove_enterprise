// src/domains/journey-demand/presentation/rest/controllers/journey-demand.controller.ts

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

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

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
  GetJourneyDemandsQuery,
  GetMyJourneyDemandsQuery,
} from '../../../application/queries';

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
  GetJourneyDemandsQueryDto,
  GetMyJourneyDemandsQueryDto,
} from '../dto/queries';

// =============================================================================
// Journey Demand HTTP Controller
// =============================================================================
//
// HTTP transport boundary for the Journey Demand bounded context.
//
// The controller intentionally separates:
//
// 1. PUBLIC DISCOVERY
// 2. AUTHENTICATED QUERIES
// 3. STATE-CHANGING COMMANDS
//
// Public discovery is important to the SisiMove landing experience. A visitor
// can discover published/open journey demands without authentication.
//
// Authenticated operations remain protected by:
//
//   JwtAuthGuard
//        ↓
//   PermissionsGuard
//        ↓
//   Required journey-demand permission
//        ↓
//   Application Command / Query Handler
//
// The controller contains no business rules.
//
// Responsibilities are limited to:
//
// - HTTP transport;
// - DTO binding;
// - path/query parameter binding;
// - primitive → domain value-object conversion;
// - command/query construction;
// - dispatching application handlers;
// - declaring authorization requirements.
//
// Domain behavior remains inside the Journey Demand domain and application
// layers.
//
// -----------------------------------------------------------------------------
// ROUTE ORDERING
// -----------------------------------------------------------------------------
//
// Static collection routes MUST appear before the dynamic:
//
//   :journeyDemandPublicId
//
// route.
//
// Therefore:
//
//   GET /journey-demands/mine
//   GET /journey-demands/matchable
//
// are declared before:
//
//   GET /journey-demands/:journeyDemandPublicId
//
// Otherwise the dynamic route can consume "mine" or "matchable" as if they
// were Journey Demand public IDs.
//
// The same principle is applied consistently throughout this controller.
//
// =============================================================================

@ApiTags('Journey Demands')
@Controller('journey-demands')
export class JourneyDemandController {
  constructor(
    // ========================================================================
    // Lifecycle Command Handlers
    // ========================================================================

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

    // ========================================================================
    // Corridor Command Handlers
    // ========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_CORRIDOR)
    private readonly updateCorridorHandler: CommandHandler<
      UpdateJourneyDemandCorridorCommand,
      void
    >,

    // ========================================================================
    // Waypoint Command Handlers
    // ========================================================================

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

    // ========================================================================
    // Schedule Command Handlers
    // ========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_SCHEDULE)
    private readonly updateScheduleHandler: CommandHandler<
      UpdateJourneyDemandScheduleCommand,
      void
    >,

    // ========================================================================
    // Capacity Command Handlers
    // ========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_CAPACITY)
    private readonly updateCapacityHandler: CommandHandler<
      UpdateJourneyDemandCapacityCommand,
      void
    >,

    // ========================================================================
    // Pricing Command Handlers
    // ========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.COMMAND_HANDLERS.UPDATE_PRICING)
    private readonly updatePricingHandler: CommandHandler<
      UpdateJourneyDemandPricingCommand,
      void
    >,

    // ========================================================================
    // Participant Command Handlers
    // ========================================================================

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

    // ========================================================================
    // Journey Demand Query Handlers
    // ========================================================================

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID)
    private readonly getJourneyDemandByPublicIdHandler: QueryHandler<
      GetJourneyDemandByPublicIdQuery,
      JourneyDemandAggregate
    >,

    @Inject(JOURNEY_DEMAND_TOKENS.QUERY_HANDLERS.GET_ALL)
    private readonly getJourneyDemandsHandler: QueryHandler<
      GetJourneyDemandsQuery,
      JourneyDemandEntity[]
    >,

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

    // ========================================================================
    // Component Query Handlers
    // ========================================================================

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
  // PUBLIC DISCOVERY QUERIES
  // ===========================================================================
  //
  // These endpoints require no authentication.
  //
  // They form the public Journey Demand discovery surface used by:
  //
  // - the SisiMove landing page;
  // - public Journey Demand discovery;
  // - public Journey Demand search;
  // - Journey Demand detail pages.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get All Journey Demands
  // ---------------------------------------------------------------------------

  @Get()
  @ApiOperation({
    summary: 'Get journey demands',
    description:
      'Returns publicly discoverable journey demands with pagination.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of journey demands to return.',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of journey demands to skip.',
  })
  public async getAll(
    @Query() dto: GetJourneyDemandsQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.getJourneyDemandsHandler.execute(
      new GetJourneyDemandsQuery(dto.limit, dto.offset),
    );
  }

  // ---------------------------------------------------------------------------
  // Find Open Journey Demands
  // ---------------------------------------------------------------------------

  @Get('open')
  @ApiOperation({
    summary: 'Find open journey demands',
    description:
      'Returns publicly discoverable journey demands that are currently open.',
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

  // ---------------------------------------------------------------------------
  // Find By Corridor
  // ---------------------------------------------------------------------------

  @Get('corridor/:corridorId')
  @ApiOperation({
    summary: 'Find journey demands by corridor',
    description:
      'Returns publicly discoverable journey demands associated with a corridor.',
  })
  @ApiParam({
    name: 'corridorId',
    description: 'Journey Demand corridor identifier.',
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

  // ---------------------------------------------------------------------------
  // Find By Schedule
  // ---------------------------------------------------------------------------

  @Get('schedule/:scheduleId')
  @ApiOperation({
    summary: 'Find journey demands by schedule',
    description:
      'Returns publicly discoverable journey demands matching a schedule.',
  })
  @ApiParam({
    name: 'scheduleId',
    description: 'Journey Demand schedule identifier.',
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

  // ===========================================================================
  // AUTHENTICATED COLLECTION QUERIES
  // ===========================================================================
  //
  // These routes are deliberately declared BEFORE:
  //
  //   GET /:journeyDemandPublicId
  //
  // so that "mine" and "matchable" are not interpreted as public IDs.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get My Journey Demands
  // ---------------------------------------------------------------------------

  @Get('mine')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Get my journey demands',
    description:
      'Returns journey demands belonging to the specified requester.',
  })
  public async getMine(
    @Query() dto: GetMyJourneyDemandsQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.getMyJourneyDemandsHandler.execute(
      new GetMyJourneyDemandsQuery(
        new RequesterPublicId(dto.requesterPublicId),
        dto.limit,
        dto.offset,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Find Matchable Journey Demands
  // ---------------------------------------------------------------------------

  @Get('matchable')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Find matchable journey demands',
    description:
      'Returns journey demands available for authorized matching operations.',
  })
  public async findMatchable(
    @Query() dto: FindMatchableJourneyDemandsQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.findMatchableJourneyDemandsHandler.execute(
      new FindMatchableJourneyDemandsQuery(dto.limit, dto.offset),
    );
  }

  // ---------------------------------------------------------------------------
  // Find By Requester
  // ---------------------------------------------------------------------------

  @Get('requester/:requesterPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Find journey demands by requester',
    description: 'Returns journey demands belonging to a specific requester.',
  })
  @ApiParam({
    name: 'requesterPublicId',
    description: 'Public identifier of the requester.',
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
  //
  // This dynamic route intentionally appears after all single-segment static
  // collection routes.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Journey Demand By Public ID
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId')
  @ApiOperation({
    summary: 'Get journey demand by public ID',
    description:
      'Returns a publicly discoverable journey demand by its public identifier.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
  })
  public async get(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandAggregate> {
    return this.getJourneyDemandByPublicIdHandler.execute(
      new GetJourneyDemandByPublicIdQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Corridor
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/corridor')
  @ApiOperation({
    summary: 'Get journey demand corridor',
    description: 'Returns the corridor associated with a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Get Waypoints
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/waypoints')
  @ApiOperation({
    summary: 'Get journey demand waypoints',
    description:
      'Returns the public waypoints associated with a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Get Schedule
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/schedule')
  @ApiOperation({
    summary: 'Get journey demand schedule',
    description: 'Returns the schedule associated with a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Get Capacity
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/capacity')
  @ApiOperation({
    summary: 'Get journey demand capacity',
    description: 'Returns capacity requirements for a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Get Pricing
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/pricing')
  @ApiOperation({
    summary: 'Get journey demand pricing',
    description: 'Returns pricing information for a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:create')
  @ApiOperation({
    summary: 'Create journey demand',
    description: 'Creates a new journey demand.',
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

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:update')
  @ApiOperation({
    summary: 'Update journey demand',
    description: 'Updates an existing journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Publish
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/publish')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:publish')
  @ApiOperation({
    summary: 'Publish journey demand',
    description: 'Publishes a journey demand for discovery and matching.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Match
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/match')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:match')
  @ApiOperation({
    summary: 'Match journey demand',
    description: 'Matches a journey demand with a journey.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Convert
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/convert')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:convert')
  @ApiOperation({
    summary: 'Convert journey demand',
    description:
      'Converts a journey demand into the corresponding journey flow.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Fulfill
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/fulfill')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:fulfill')
  @ApiOperation({
    summary: 'Fulfill journey demand',
    description: 'Marks a journey demand as fulfilled.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/cancel')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:cancel')
  @ApiOperation({
    summary: 'Cancel journey demand',
    description: 'Cancels an existing journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Expire
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/expire')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:expire')
  @ApiOperation({
    summary: 'Expire journey demand',
    description: 'Expires a journey demand that is no longer active.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Update Corridor
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/corridor')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:corridor:update')
  @ApiOperation({
    summary: 'Update journey demand corridor',
    description: 'Updates the origin and destination corridor.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Add Waypoint
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/waypoints')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:waypoint:add')
  @ApiOperation({
    summary: 'Add journey demand waypoint',
    description: 'Adds a waypoint to a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Update Waypoint
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/waypoints/:waypointPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:waypoint:update')
  @ApiOperation({
    summary: 'Update journey demand waypoint',
    description: 'Updates an existing journey demand waypoint.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Remove Waypoint
  // ---------------------------------------------------------------------------

  @Delete(':journeyDemandPublicId/waypoints/:waypointPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:waypoint:remove')
  @ApiOperation({
    summary: 'Remove journey demand waypoint',
    description: 'Removes a waypoint from a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Update Schedule
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/schedule')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:schedule:update')
  @ApiOperation({
    summary: 'Update journey demand schedule',
    description: 'Updates the requested travel schedule.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Update Capacity
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/capacity')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:capacity:update')
  @ApiOperation({
    summary: 'Update journey demand capacity',
    description: 'Updates the number of seats required.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Update Pricing
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/pricing')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:pricing:update')
  @ApiOperation({
    summary: 'Update journey demand pricing',
    description: 'Updates the maximum fare for a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Add Participant
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/participants')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:participant:add')
  @ApiOperation({
    summary: 'Add journey demand participant',
    description: 'Adds a participant to a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Update Participant
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/participants/:participantPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:participant:update')
  @ApiOperation({
    summary: 'Update journey demand participant',
    description: 'Updates participant seat requirements.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Withdraw Participant
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/participants/:participantPublicId/withdraw')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:participant:withdraw')
  @ApiOperation({
    summary: 'Withdraw journey demand participant',
    description: 'Withdraws a participant from a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Remove Participant
  // ---------------------------------------------------------------------------

  @Delete(':journeyDemandPublicId/participants/:participantPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:participant:remove')
  @ApiOperation({
    summary: 'Remove journey demand participant',
    description: 'Removes a participant from a journey demand.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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
  // PRIVATE PARTICIPANT QUERIES
  // ===========================================================================
  //
  // Participant information is operational/member-specific information and is
  // therefore protected even though the parent Journey Demand itself is
  // publicly discoverable.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Participants
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/participants')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Get journey demand participants',
    description:
      'Returns participants associated with a journey demand. This is a protected operation.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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

  // ---------------------------------------------------------------------------
  // Get Participant
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/participants/:participantPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey-demand:read')
  @ApiOperation({
    summary: 'Get journey demand participant',
    description:
      'Returns a specific journey demand participant. This is a protected operation.',
  })
  @ApiParam({
    name: 'journeyDemandPublicId',
    description: 'Public identifier of the journey demand.',
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
