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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
// Tokens
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

import type { JourneyDemandEntity } from '../../../domain/entities/journey-demand.entity';
import type { JourneyDemandCorridorEntity } from '../../../domain/entities/journey-demand-corridor.entity';
import type { JourneyDemandWaypointEntity } from '../../../domain/entities/journey-demand-waypoint.entity';
import type { JourneyDemandScheduleEntity } from '../../../domain/entities/journey-demand-schedule.entity';
import type { JourneyDemandCapacityEntity } from '../../../domain/entities/journey-demand-capacity.entity';
import type { JourneyDemandPricingEntity } from '../../../domain/entities/journey-demand-pricing.entity';
import type { JourneyDemandParticipantEntity } from '../../../domain/entities/journey-demand-participant.entity';

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
// DTOs
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
// Journey Demand — Administrative HTTP Controller
// =============================================================================
//
// This controller is NOT a public/self-service Journey Demand API.
//
// It exposes Journey Demand management capabilities to authenticated
// administrators and authorized operators.
//
// Security model:
//
//   Access Token
//        ↓
//   JwtAuthGuard
//        ↓
//   PermissionsGuard
//        ↓
//   Required journey-demand permission
//        ↓
//   Application Command / Query Handler
//        ↓
//   JourneyDemandAggregate
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding;
// - query parameter and path parameter binding;
// - command/query construction;
// - dispatching application handlers;
// - mapping application/domain results to HTTP responses;
// - declaring authorization requirements.
//
// The controller contains no business rules.
//
// Domain behavior remains in:
//
// - JourneyDemandAggregate;
// - JourneyDemandEntity;
// - JourneyDemandCorridorEntity;
// - JourneyDemandWaypointEntity;
// - JourneyDemandScheduleEntity;
// - JourneyDemandCapacityEntity;
// - JourneyDemandPricingEntity;
// - JourneyDemandParticipantEntity.
//
// Authorization is enforced through the authentication and permission
// infrastructure.
//
// =============================================================================

@ApiTags('Journey Demands')
@ApiBearerAuth('access-token')
@Controller('journey-demands')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // QUERY ENDPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get All Journey Demands
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('journey-demand:read')
  public async getAll(
    @Query() dto: GetJourneyDemandsQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.getJourneyDemandsHandler.execute(
      new GetJourneyDemandsQuery(dto.limit, dto.offset),
    );
  }

  // ---------------------------------------------------------------------------
  // Get My Journey Demands
  // ---------------------------------------------------------------------------

  @Get('mine')
  @RequirePermissions('journey-demand:read')
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
  // Find Open Journey Demands
  // ---------------------------------------------------------------------------

  @Get('open')
  @RequirePermissions('journey-demand:read')
  public async findOpen(
    @Query() dto: FindOpenJourneyDemandsQueryDto,
  ): Promise<JourneyDemandEntity[]> {
    return this.findOpenJourneyDemandsHandler.execute(
      new FindOpenJourneyDemandsQuery(dto.limit, dto.offset),
    );
  }

  // ---------------------------------------------------------------------------
  // Find Matchable Journey Demands
  // ---------------------------------------------------------------------------

  @Get('matchable')
  @RequirePermissions('journey-demand:read')
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
  @RequirePermissions('journey-demand:read')
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

  // ---------------------------------------------------------------------------
  // Find By Corridor
  // ---------------------------------------------------------------------------

  @Get('corridor/:corridorId')
  @RequirePermissions('journey-demand:read')
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
  @RequirePermissions('journey-demand:read')
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

  // ---------------------------------------------------------------------------
  // Get Journey Demand By Public ID
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId')
  @RequirePermissions('journey-demand:read')
  public async get(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandAggregate> {
    return this.getJourneyDemandByPublicIdHandler.execute(
      new GetJourneyDemandByPublicIdQuery(
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
  @RequirePermissions('journey-demand:create')
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
  @RequirePermissions('journey-demand:update')
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
  @RequirePermissions('journey-demand:publish')
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
  @RequirePermissions('journey-demand:match')
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
  @RequirePermissions('journey-demand:convert')
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
  @RequirePermissions('journey-demand:fulfill')
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
  @RequirePermissions('journey-demand:cancel')
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
  @RequirePermissions('journey-demand:expire')
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
  // CORRIDOR
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Update Corridor
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/corridor')
  @RequirePermissions('journey-demand:corridor:update')
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
  // WAYPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Add Waypoint
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/waypoints')
  @RequirePermissions('journey-demand:waypoint:add')
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
  @RequirePermissions('journey-demand:waypoint:update')
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
  @RequirePermissions('journey-demand:waypoint:remove')
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
  // SCHEDULE
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Update Schedule
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/schedule')
  @RequirePermissions('journey-demand:schedule:update')
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
  // CAPACITY
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Update Capacity
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/capacity')
  @RequirePermissions('journey-demand:capacity:update')
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
  // PRICING
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Update Pricing
  // ---------------------------------------------------------------------------

  @Put(':journeyDemandPublicId/pricing')
  @RequirePermissions('journey-demand:pricing:update')
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
  // PARTICIPANTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Add Participant
  // ---------------------------------------------------------------------------

  @Post(':journeyDemandPublicId/participants')
  @RequirePermissions('journey-demand:participant:add')
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
  @RequirePermissions('journey-demand:participant:update')
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
  @RequirePermissions('journey-demand:participant:withdraw')
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
  @RequirePermissions('journey-demand:participant:remove')
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
  // COMPONENT QUERIES
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Corridor
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/corridor')
  @RequirePermissions('journey-demand:read')
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
  @RequirePermissions('journey-demand:read')
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
  @RequirePermissions('journey-demand:read')
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
  @RequirePermissions('journey-demand:read')
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
  @RequirePermissions('journey-demand:read')
  public async getPricing(
    @Param('journeyDemandPublicId') journeyDemandPublicId: string,
  ): Promise<JourneyDemandPricingEntity> {
    return this.getPricingHandler.execute(
      new GetJourneyDemandPricingQuery(
        new JourneyDemandPublicId(journeyDemandPublicId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Participants
  // ---------------------------------------------------------------------------

  @Get(':journeyDemandPublicId/participants')
  @RequirePermissions('journey-demand:read')
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
  @RequirePermissions('journey-demand:read')
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
