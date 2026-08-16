// src/domains/journey/presentation/http/journey.controller.ts

// -----------------------------------------------------------------------------
// Node
// -----------------------------------------------------------------------------

import { randomUUID } from 'crypto';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Authentication / Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../identity/presentation/auth';

// -----------------------------------------------------------------------------
// Foundation Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Journey Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../../application/journey.tokens';

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

import {
  AddJourneyWaypointCommand,
  AttachJourneyAssetCommand,
  AttachJourneyCapacityCommand,
  AttachJourneyCorridorCommand,
  AttachJourneyScheduleCommand,
  AttachJourneyVehicleCommand,
  AttachPreferencesCommand,
  AttachPricingCommand,
  CancelJourneyCommand,
  CompleteJourneyCommand,
  CreateJourneyCommand,
  ExpireJourneyCommand,
  PublishJourneyCommand,
  RemoveJourneyAssetCommand,
  RemoveJourneyCapacityCommand,
  RemoveJourneyCorridorCommand,
  RemoveJourneyScheduleCommand,
  RemoveJourneyVehicleCommand,
  RemoveJourneyWaypointCommand,
  RemovePreferencesCommand,
  RemovePricingCommand,
  StartJourneyCommand,
} from '../../../application/commands/journey';

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

import {
  GetJourneyAssetByReferenceQuery,
  GetJourneyAssetsQuery,
  GetJourneyCapacityQuery,
  GetJourneyCorridorQuery,
  GetJourneyPreferencesQuery,
  GetJourneyPricingQuery,
  GetJourneyQuery,
  GetJourneyScheduleQuery,
  GetJourneyVehicleQuery,
  GetJourneyWaypointQuery,
  GetJourneyWaypointsQuery,
  GetJourneysByProviderAndStatusQuery,
  GetJourneysByProviderQuery,
  GetJourneysByStatusQuery,
} from '../../../application/queries/journey';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyAssetEntity } from '../../../domain/entities/journey-asset.entity';
import type { JourneyCapacityEntity } from '../../../domain/entities/journey-capacity.entity';
import type { JourneyCorridorEntity } from '../../../domain/entities/journey-corridor.entity';
import type { JourneyPreferencesEntity } from '../../../domain/entities/journey-preferences.entity';
import type { JourneyPricingEntity } from '../../../domain/entities/journey-pricing.entity';
import type { JourneyScheduleEntity } from '../../../domain/entities/journey-schedule.entity';
import type { JourneyVehicleEntity } from '../../../domain/entities/journey-vehicle.entity';
import type { JourneyWaypointEntity } from '../../../domain/entities/journey-waypoint.entity';

// -----------------------------------------------------------------------------
// DTOs
// -----------------------------------------------------------------------------

import {
  AddWaypointDto,
  AttachAssetDto,
  AttachCapacityDto,
  AttachCorridorDto,
  AttachPreferencesDto,
  AttachPricingDto,
  AttachScheduleDto,
  AttachVehicleDto,
  CancelJourneyDto,
  CompleteJourneyDto,
  CreateJourneyDto,
  ExpireJourneyDto,
  PublishJourneyDto,
  StartJourneyDto,
} from '../dto';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyAssetPublicIdReference } from '../../../domain/value-objects/journey-asset-public-id-reference.vo';
import { JourneyCapacityPublicId } from '../../../domain/value-objects/journey-capacity-public-id.vo';
import { JourneyCorridorPublicId } from '../../../domain/value-objects/journey-corridor-public-id.vo';
import { JourneyPreferencesPublicId } from '../../../domain/value-objects/journey-preferences-public-id.vo';
import { JourneyPricingPublicId } from '../../../domain/value-objects/journey-pricing-public-id.vo';
import { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import { JourneySchedulePublicId } from '../../../domain/value-objects/journey-schedule-public-id.vo';
import { JourneyStatus } from '../../../domain/value-objects/journey-status.vo';
import { JourneyVehiclePublicId } from '../../../domain/value-objects/journey-vehicle-public-id.vo';
import { JourneyWaypointPublicId } from '../../../domain/value-objects/journey-waypoint-public-id.vo';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Journeys')
@Controller('journeys')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JourneyController {
  constructor(
    // ========================================================================
    // Journey Lifecycle Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createJourneyHandler: CommandHandler<
      CreateJourneyCommand,
      JourneyAggregate
    >,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.PUBLISH)
    private readonly publishJourneyHandler: CommandHandler<PublishJourneyCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.START)
    private readonly startJourneyHandler: CommandHandler<StartJourneyCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeJourneyHandler: CommandHandler<CompleteJourneyCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelJourneyHandler: CommandHandler<CancelJourneyCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.EXPIRE)
    private readonly expireJourneyHandler: CommandHandler<ExpireJourneyCommand>,

    // ========================================================================
    // Corridor Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_CORRIDOR)
    private readonly attachCorridorHandler: CommandHandler<AttachJourneyCorridorCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_CORRIDOR)
    private readonly removeCorridorHandler: CommandHandler<RemoveJourneyCorridorCommand>,

    // ========================================================================
    // Waypoint Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ADD_WAYPOINT)
    private readonly addWaypointHandler: CommandHandler<AddJourneyWaypointCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_WAYPOINT)
    private readonly removeWaypointHandler: CommandHandler<RemoveJourneyWaypointCommand>,

    // ========================================================================
    // Schedule Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_SCHEDULE)
    private readonly attachScheduleHandler: CommandHandler<AttachJourneyScheduleCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_SCHEDULE)
    private readonly removeScheduleHandler: CommandHandler<RemoveJourneyScheduleCommand>,

    // ========================================================================
    // Vehicle Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_VEHICLE)
    private readonly attachVehicleHandler: CommandHandler<AttachJourneyVehicleCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_VEHICLE)
    private readonly removeVehicleHandler: CommandHandler<RemoveJourneyVehicleCommand>,

    // ========================================================================
    // Capacity Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_CAPACITY)
    private readonly attachCapacityHandler: CommandHandler<AttachJourneyCapacityCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_CAPACITY)
    private readonly removeCapacityHandler: CommandHandler<RemoveJourneyCapacityCommand>,

    // ========================================================================
    // Pricing Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_PRICING)
    private readonly attachPricingHandler: CommandHandler<AttachPricingCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_PRICING)
    private readonly removePricingHandler: CommandHandler<RemovePricingCommand>,

    // ========================================================================
    // Preferences Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_PREFERENCES)
    private readonly attachPreferencesHandler: CommandHandler<AttachPreferencesCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_PREFERENCES)
    private readonly removePreferencesHandler: CommandHandler<RemovePreferencesCommand>,

    // ========================================================================
    // Asset Commands
    // ========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_ASSET)
    private readonly attachAssetHandler: CommandHandler<AttachJourneyAssetCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_ASSET)
    private readonly removeAssetHandler: CommandHandler<RemoveJourneyAssetCommand>,

    // ========================================================================
    // Journey Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET)
    private readonly getJourneyQueryHandler: QueryHandler<
      GetJourneyQuery,
      JourneyAggregate | null
    >,

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER)
    private readonly getJourneysByProviderQueryHandler: QueryHandler<
      GetJourneysByProviderQuery,
      readonly JourneyAggregate[]
    >,

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_STATUS)
    private readonly getJourneysByStatusQueryHandler: QueryHandler<
      GetJourneysByStatusQuery,
      readonly JourneyAggregate[]
    >,

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER_AND_STATUS)
    private readonly getJourneysByProviderAndStatusQueryHandler: QueryHandler<
      GetJourneysByProviderAndStatusQuery,
      readonly JourneyAggregate[]
    >,

    // ========================================================================
    // Corridor Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_CORRIDOR)
    private readonly getJourneyCorridorQueryHandler: QueryHandler<
      GetJourneyCorridorQuery,
      JourneyCorridorEntity | null
    >,

    // ========================================================================
    // Waypoint Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_WAYPOINT)
    private readonly getJourneyWaypointQueryHandler: QueryHandler<
      GetJourneyWaypointQuery,
      JourneyWaypointEntity | null
    >,

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_WAYPOINTS)
    private readonly getJourneyWaypointsQueryHandler: QueryHandler<
      GetJourneyWaypointsQuery,
      readonly JourneyWaypointEntity[]
    >,

    // ========================================================================
    // Schedule Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_SCHEDULE)
    private readonly getJourneyScheduleQueryHandler: QueryHandler<
      GetJourneyScheduleQuery,
      JourneyScheduleEntity | null
    >,

    // ========================================================================
    // Vehicle Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_VEHICLE)
    private readonly getJourneyVehicleQueryHandler: QueryHandler<
      GetJourneyVehicleQuery,
      JourneyVehicleEntity | null
    >,

    // ========================================================================
    // Capacity Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_CAPACITY)
    private readonly getJourneyCapacityQueryHandler: QueryHandler<
      GetJourneyCapacityQuery,
      JourneyCapacityEntity | null
    >,

    // ========================================================================
    // Pricing Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_PRICING)
    private readonly getJourneyPricingQueryHandler: QueryHandler<
      GetJourneyPricingQuery,
      JourneyPricingEntity | null
    >,

    // ========================================================================
    // Preferences Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_PREFERENCES)
    private readonly getJourneyPreferencesQueryHandler: QueryHandler<
      GetJourneyPreferencesQuery,
      JourneyPreferencesEntity | null
    >,

    // ========================================================================
    // Asset Queries
    // ========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_ASSETS)
    private readonly getJourneyAssetsQueryHandler: QueryHandler<
      GetJourneyAssetsQuery,
      readonly JourneyAssetEntity[]
    >,

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_ASSET_BY_REFERENCE)
    private readonly getJourneyAssetByReferenceQueryHandler: QueryHandler<
      GetJourneyAssetByReferenceQuery,
      JourneyAssetEntity | null
    >,
  ) {}

  // ===========================================================================
  // JOURNEY QUERIES
  // ===========================================================================

  @Get('provider/:providerPublicId/status/:status')
  @RequirePermissions('journey:read')
  async getByProviderAndStatus(
    @Param('providerPublicId') providerPublicId: string,
    @Param('status') status: string,
  ): Promise<readonly JourneyAggregate[]> {
    return this.getJourneysByProviderAndStatusQueryHandler.execute(
      new GetJourneysByProviderAndStatusQuery(
        providerPublicId,
        this.parseJourneyStatus(status),
      ),
    );
  }

  @Get('provider/:providerPublicId')
  @RequirePermissions('journey:read')
  async getByProvider(
    @Param('providerPublicId') providerPublicId: string,
  ): Promise<readonly JourneyAggregate[]> {
    return this.getJourneysByProviderQueryHandler.execute(
      new GetJourneysByProviderQuery(providerPublicId),
    );
  }

  @Get('status/:status')
  @RequirePermissions('journey:read')
  async getByStatus(
    @Param('status') status: string,
  ): Promise<readonly JourneyAggregate[]> {
    return this.getJourneysByStatusQueryHandler.execute(
      new GetJourneysByStatusQuery(this.parseJourneyStatus(status)),
    );
  }

  @Get(':journeyPublicId')
  @RequirePermissions('journey:read')
  async get(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyAggregate | null> {
    return this.getJourneyQueryHandler.execute(
      new GetJourneyQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ===========================================================================
  // JOURNEY LIFECYCLE
  // ===========================================================================

  @Post()
  @RequirePermissions('journey:create')
  async create(@Body() dto: CreateJourneyDto): Promise<JourneyAggregate> {
    return this.createJourneyHandler.execute(
      new CreateJourneyCommand(dto.providerPublicId, randomUUID()),
    );
  }

  @Post(':journeyPublicId/publish')
  @RequirePermissions('journey:publish')
  async publish(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: PublishJourneyDto,
  ): Promise<void> {
    await this.publishJourneyHandler.execute(
      new PublishJourneyCommand(
        journeyPublicId,
        randomUUID(),
        undefined,
        dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      ),
    );
  }

  @Post(':journeyPublicId/start')
  @RequirePermissions('journey:start')
  async start(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: StartJourneyDto,
  ): Promise<void> {
    await this.startJourneyHandler.execute(
      new StartJourneyCommand(
        journeyPublicId,
        randomUUID(),
        undefined,
        dto.startedAt ? new Date(dto.startedAt) : undefined,
      ),
    );
  }

  @Post(':journeyPublicId/complete')
  @RequirePermissions('journey:complete')
  async complete(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: CompleteJourneyDto,
  ): Promise<void> {
    await this.completeJourneyHandler.execute(
      new CompleteJourneyCommand(
        journeyPublicId,
        randomUUID(),
        undefined,
        dto.completedAt ? new Date(dto.completedAt) : undefined,
      ),
    );
  }

  @Post(':journeyPublicId/cancel')
  @RequirePermissions('journey:cancel')
  async cancel(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: CancelJourneyDto,
  ): Promise<void> {
    await this.cancelJourneyHandler.execute(
      new CancelJourneyCommand(
        journeyPublicId,
        dto.reason,
        randomUUID(),
        undefined,
        dto.cancelledAt ? new Date(dto.cancelledAt) : undefined,
      ),
    );
  }

  @Post(':journeyPublicId/expire')
  @RequirePermissions('journey:expire')
  async expire(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: ExpireJourneyDto,
  ): Promise<void> {
    await this.expireJourneyHandler.execute(
      new ExpireJourneyCommand(
        journeyPublicId,
        randomUUID(),
        undefined,
        dto.expiredAt ? new Date(dto.expiredAt) : undefined,
      ),
    );
  }

  // ===========================================================================
  // CORRIDOR
  // ===========================================================================

  @Get(':journeyPublicId/corridor')
  @RequirePermissions('journey:read')
  async getCorridor(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyCorridorEntity | null> {
    return this.getJourneyCorridorQueryHandler.execute(
      new GetJourneyCorridorQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  @Post(':journeyPublicId/corridor')
  @RequirePermissions('journey:corridor:attach')
  async attachCorridor(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachCorridorDto,
  ): Promise<void> {
    await this.attachCorridorHandler.execute(
      new AttachJourneyCorridorCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneyCorridorPublicId(dto.corridorPublicId),
        randomUUID(),
      ),
    );
  }

  @Delete(':journeyPublicId/corridor')
  @RequirePermissions('journey:corridor:remove')
  async removeCorridor(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removeCorridorHandler.execute(
      new RemoveJourneyCorridorCommand(journeyPublicId, randomUUID()),
    );
  }

  // ===========================================================================
  // WAYPOINTS
  // ===========================================================================

  @Get(':journeyPublicId/waypoints')
  @RequirePermissions('journey:read')
  async getWaypoints(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<readonly JourneyWaypointEntity[]> {
    return this.getJourneyWaypointsQueryHandler.execute(
      new GetJourneyWaypointsQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // -----------------------------------------------------------------------------
  // Waypoint
  // -----------------------------------------------------------------------------

  @Get(':journeyPublicId/waypoints/:waypointPublicId')
  @RequirePermissions('journey:read')
  async getWaypoint(
    @Param('journeyPublicId') journeyPublicId: string,
    @Param('waypointPublicId') waypointPublicId: string,
  ): Promise<JourneyWaypointEntity | null> {
    return this.getJourneyWaypointQueryHandler.execute(
      new GetJourneyWaypointQuery(
        new JourneyPublicId(journeyPublicId),
        new JourneyWaypointPublicId(waypointPublicId),
      ),
    );
  }

  @Post(':journeyPublicId/waypoints')
  @RequirePermissions('journey:waypoint:add')
  async addWaypoint(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AddWaypointDto,
  ): Promise<void> {
    await this.addWaypointHandler.execute(
      new AddJourneyWaypointCommand(
        journeyPublicId,
        dto.waypointPublicId,
        randomUUID(),
      ),
    );
  }

  @Delete(':journeyPublicId/waypoints/:waypointPublicId')
  @RequirePermissions('journey:waypoint:remove')
  async removeWaypoint(
    @Param('journeyPublicId') journeyPublicId: string,
    @Param('waypointPublicId') waypointPublicId: string,
  ): Promise<void> {
    await this.removeWaypointHandler.execute(
      new RemoveJourneyWaypointCommand(
        journeyPublicId,
        waypointPublicId,
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // SCHEDULE
  // ===========================================================================

  @Get(':journeyPublicId/schedule')
  @RequirePermissions('journey:read')
  async getSchedule(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyScheduleEntity | null> {
    return this.getJourneyScheduleQueryHandler.execute(
      new GetJourneyScheduleQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  @Post(':journeyPublicId/schedule')
  @RequirePermissions('journey:schedule:attach')
  async attachSchedule(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachScheduleDto,
  ): Promise<void> {
    await this.attachScheduleHandler.execute(
      new AttachJourneyScheduleCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneySchedulePublicId(dto.schedulePublicId),
        randomUUID(),
      ),
    );
  }

  @Delete(':journeyPublicId/schedule')
  @RequirePermissions('journey:schedule:remove')
  async removeSchedule(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removeScheduleHandler.execute(
      new RemoveJourneyScheduleCommand(
        new JourneyPublicId(journeyPublicId),
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // VEHICLE
  // ===========================================================================

  @Get(':journeyPublicId/vehicle')
  @RequirePermissions('journey:read')
  async getVehicle(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyVehicleEntity | null> {
    return this.getJourneyVehicleQueryHandler.execute(
      new GetJourneyVehicleQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  @Post(':journeyPublicId/vehicle')
  @RequirePermissions('journey:vehicle:attach')
  async attachVehicle(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachVehicleDto,
  ): Promise<void> {
    await this.attachVehicleHandler.execute(
      new AttachJourneyVehicleCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneyVehiclePublicId(dto.vehiclePublicId),
        randomUUID(),
      ),
    );
  }

  @Delete(':journeyPublicId/vehicle')
  @RequirePermissions('journey:vehicle:remove')
  async removeVehicle(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removeVehicleHandler.execute(
      new RemoveJourneyVehicleCommand(
        new JourneyPublicId(journeyPublicId),
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // CAPACITY
  // ===========================================================================

  @Get(':journeyPublicId/capacity')
  @RequirePermissions('journey:read')
  async getCapacity(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyCapacityEntity | null> {
    return this.getJourneyCapacityQueryHandler.execute(
      new GetJourneyCapacityQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  @Post(':journeyPublicId/capacity')
  @RequirePermissions('journey:capacity:attach')
  async attachCapacity(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachCapacityDto,
  ): Promise<void> {
    await this.attachCapacityHandler.execute(
      new AttachJourneyCapacityCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneyCapacityPublicId(dto.capacityPublicId),
        randomUUID(),
      ),
    );
  }

  @Delete(':journeyPublicId/capacity')
  @RequirePermissions('journey:capacity:remove')
  async removeCapacity(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removeCapacityHandler.execute(
      new RemoveJourneyCapacityCommand(journeyPublicId, randomUUID()),
    );
  }

  // ===========================================================================
  // PRICING
  // ===========================================================================

  @Get(':journeyPublicId/pricing')
  @RequirePermissions('journey:read')
  async getPricing(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyPricingEntity | null> {
    return this.getJourneyPricingQueryHandler.execute(
      new GetJourneyPricingQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  @Post(':journeyPublicId/pricing')
  @RequirePermissions('journey:pricing:attach')
  async attachPricing(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachPricingDto,
  ): Promise<void> {
    await this.attachPricingHandler.execute(
      new AttachPricingCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneyPricingPublicId(dto.pricingPublicId),
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // PRICING
  // ===========================================================================

  @Delete(':journeyPublicId/pricing')
  @RequirePermissions('journey:pricing:remove')
  async removePricing(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removePricingHandler.execute(
      new RemovePricingCommand(journeyPublicId, randomUUID()),
    );
  }

  // ===========================================================================
  // PREFERENCES
  // ===========================================================================

  @Get(':journeyPublicId/preferences')
  @RequirePermissions('journey:read')
  async getPreferences(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyPreferencesEntity | null> {
    return this.getJourneyPreferencesQueryHandler.execute(
      new GetJourneyPreferencesQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  @Post(':journeyPublicId/preferences')
  @RequirePermissions('journey:preferences:attach')
  async attachPreferences(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachPreferencesDto,
  ): Promise<void> {
    await this.attachPreferencesHandler.execute(
      new AttachPreferencesCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneyPreferencesPublicId(dto.preferencesPublicId),
        randomUUID(),
      ),
    );
  }

  @Delete(':journeyPublicId/preferences')
  @RequirePermissions('journey:preferences:remove')
  async removePreferences(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removePreferencesHandler.execute(
      new RemovePreferencesCommand(
        new JourneyPublicId(journeyPublicId),
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // ASSETS
  // ===========================================================================

  @Get(':journeyPublicId/assets')
  @RequirePermissions('journey:read')
  async getAssets(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<readonly JourneyAssetEntity[]> {
    return this.getJourneyAssetsQueryHandler.execute(
      new GetJourneyAssetsQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  @Get(':journeyPublicId/assets/:assetPublicId')
  @RequirePermissions('journey:read')
  async getAsset(
    @Param('journeyPublicId') journeyPublicId: string,
    @Param('assetPublicId') assetPublicId: string,
  ): Promise<JourneyAssetEntity | null> {
    return this.getJourneyAssetByReferenceQueryHandler.execute(
      new GetJourneyAssetByReferenceQuery(
        new JourneyPublicId(journeyPublicId),
        new JourneyAssetPublicIdReference(assetPublicId),
      ),
    );
  }

  @Post(':journeyPublicId/assets')
  @RequirePermissions('journey:asset:attach')
  async attachAsset(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachAssetDto,
  ): Promise<void> {
    await this.attachAssetHandler.execute(
      new AttachJourneyAssetCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneyAssetPublicIdReference(dto.assetPublicId),
        randomUUID(),
      ),
    );
  }

  @Delete(':journeyPublicId/assets/:assetPublicId')
  @RequirePermissions('journey:asset:remove')
  async removeAsset(
    @Param('journeyPublicId') journeyPublicId: string,
    @Param('assetPublicId') assetPublicId: string,
  ): Promise<void> {
    await this.removeAssetHandler.execute(
      new RemoveJourneyAssetCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneyAssetPublicIdReference(assetPublicId),
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // PRIVATE HELPERS
  // ===========================================================================

  private parseJourneyStatus(status: string): JourneyStatus {
    const normalizedStatus = status.trim().toUpperCase();

    if (!this.isJourneyStatus(normalizedStatus)) {
      throw new BadRequestException(`Invalid journey status "${status}".`);
    }

    return normalizedStatus;
  }

  private isJourneyStatus(value: string): value is JourneyStatus {
    return Object.values(JourneyStatus).includes(value as JourneyStatus);
  }
}
