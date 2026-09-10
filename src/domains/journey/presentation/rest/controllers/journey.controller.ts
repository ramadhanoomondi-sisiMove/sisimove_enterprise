// -----------------------------------------------------------------------------
// Journey — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Journey aggregate and its associated journey components.
//
// Aggregate boundaries:
//
// JourneyAggregate
// ├── Journey
// ├── JourneyCorridor
// ├── JourneyWaypoint[]
// ├── JourneySchedule
// ├── JourneyVehicle
// ├── JourneyCapacity
// ├── JourneyPricing
// ├── JourneyPreferences
// └── JourneyAsset[]
//
// -----------------------------------------------------------------------------
//
// Public landing-page operations:
//
// 1. GET    /journeys/search?from=&to=&date=
//    Public search for published journeys by route and departure date.
//
// 2. GET    /journeys/status/:status
//    Public journey discovery by status.
//
// 3. GET    /journeys/:journeyPublicId
//    Public journey detail.
//
// 4. GET    /journeys/:journeyPublicId/corridor
//    Public corridor information.
//
// 5. GET    /journeys/:journeyPublicId/waypoints
//    Public journey route waypoints.
//
// 6. GET    /journeys/:journeyPublicId/waypoints/:waypointPublicId
//    Public individual waypoint.
//
// 7. GET    /journeys/:journeyPublicId/schedule
//    Public journey schedule.
//
// 8. GET    /journeys/:journeyPublicId/vehicle
//    Public journey vehicle information.
//
// 9. GET    /journeys/:journeyPublicId/capacity
//    Public journey capacity.
//
// 10. GET   /journeys/:journeyPublicId/pricing
//     Public journey pricing.
//
// 11. GET   /journeys/:journeyPublicId/preferences
//     Public journey preferences.
//
// 12. GET   /journeys/:journeyPublicId/assets
//     Public journey assets.
//
// 13. GET   /journeys/:journeyPublicId/assets/:assetPublicId
//     Public individual journey asset.
//
// Public operations intentionally do NOT require:
//
//     JwtAuthGuard
//     PermissionsGuard
//     @RequirePermissions(...)
//
// -----------------------------------------------------------------------------
//
// Authenticated journey operations:
//
// Journey creation, lifecycle transitions, component mutation, and provider
// queries remain protected.
//
// Provider/account operations require:
//
//     JwtAuthGuard
//     PermissionsGuard
//     @RequirePermissions(...)
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion of transport primitives to domain value objects;
// - generation of application correlation metadata;
// - dispatching application commands and queries.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - JourneyAggregate;
// - Journey entities;
// - Journey value objects.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - JourneyRepository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

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

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation — Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Journey — Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../../application/journey.tokens';

// -----------------------------------------------------------------------------
// Journey — Commands
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
// Journey — Queries
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
  SearchPublishedJourneysQuery,
} from '../../../application/queries/journey';

// -----------------------------------------------------------------------------
// Journey — Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';

// -----------------------------------------------------------------------------
// Journey — Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyAssetEntity } from '../../../domain/entities/journey-asset.entity';

import type { JourneyCapacityEntity } from '../../../domain/entities/journey-capacity.entity';

import type { JourneyCorridorEntity } from '../../../domain/entities/journey-corridor.entity';

import type { JourneyEntity } from '../../../domain/entities/journey.entity';

import type { JourneyPreferencesEntity } from '../../../domain/entities/journey-preferences.entity';

import type { JourneyPricingEntity } from '../../../domain/entities/journey-pricing.entity';

import type { JourneyScheduleEntity } from '../../../domain/entities/journey-schedule.entity';

import type { JourneyVehicleEntity } from '../../../domain/entities/journey-vehicle.entity';

import type { JourneyWaypointEntity } from '../../../domain/entities/journey-waypoint.entity';

// -----------------------------------------------------------------------------
// Journey — Presentation DTOs
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
// Journey — Domain Value Objects
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

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Journeys')
@Controller('journeys')
export class JourneyController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // =========================================================================
    // Journey Lifecycle Commands
    // =========================================================================

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

    // =========================================================================
    // Corridor Commands
    // =========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_CORRIDOR)
    private readonly attachCorridorHandler: CommandHandler<AttachJourneyCorridorCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_CORRIDOR)
    private readonly removeCorridorHandler: CommandHandler<RemoveJourneyCorridorCommand>,

    // =========================================================================
    // Waypoint Commands
    // =========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ADD_WAYPOINT)
    private readonly addWaypointHandler: CommandHandler<AddJourneyWaypointCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_WAYPOINT)
    private readonly removeWaypointHandler: CommandHandler<RemoveJourneyWaypointCommand>,

    // =========================================================================
    // Schedule Commands
    // =========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_SCHEDULE)
    private readonly attachScheduleHandler: CommandHandler<AttachJourneyScheduleCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_SCHEDULE)
    private readonly removeScheduleHandler: CommandHandler<RemoveJourneyScheduleCommand>,

    // =========================================================================
    // Vehicle Commands
    // =========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_VEHICLE)
    private readonly attachVehicleHandler: CommandHandler<AttachJourneyVehicleCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_VEHICLE)
    private readonly removeVehicleHandler: CommandHandler<RemoveJourneyVehicleCommand>,

    // =========================================================================
    // Capacity Commands
    // =========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_CAPACITY)
    private readonly attachCapacityHandler: CommandHandler<AttachJourneyCapacityCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_CAPACITY)
    private readonly removeCapacityHandler: CommandHandler<RemoveJourneyCapacityCommand>,

    // =========================================================================
    // Pricing Commands
    // =========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_PRICING)
    private readonly attachPricingHandler: CommandHandler<AttachPricingCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_PRICING)
    private readonly removePricingHandler: CommandHandler<RemovePricingCommand>,

    // =========================================================================
    // Preferences Commands
    // =========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_PREFERENCES)
    private readonly attachPreferencesHandler: CommandHandler<AttachPreferencesCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_PREFERENCES)
    private readonly removePreferencesHandler: CommandHandler<RemovePreferencesCommand>,

    // =========================================================================
    // Asset Commands
    // =========================================================================

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.ATTACH_ASSET)
    private readonly attachAssetHandler: CommandHandler<AttachJourneyAssetCommand>,

    @Inject(JOURNEY_TOKENS.COMMAND_HANDLERS.REMOVE_ASSET)
    private readonly removeAssetHandler: CommandHandler<RemoveJourneyAssetCommand>,

    // =========================================================================
    // Journey Queries
    // =========================================================================

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

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.SEARCH_PUBLISHED)
    private readonly searchPublishedJourneysQueryHandler: QueryHandler<
      SearchPublishedJourneysQuery,
      readonly JourneyEntity[]
    >,

    // =========================================================================
    // Corridor Queries
    // =========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_CORRIDOR)
    private readonly getJourneyCorridorQueryHandler: QueryHandler<
      GetJourneyCorridorQuery,
      JourneyCorridorEntity | null
    >,

    // =========================================================================
    // Waypoint Queries
    // =========================================================================

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

    // =========================================================================
    // Schedule Queries
    // =========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_SCHEDULE)
    private readonly getJourneyScheduleQueryHandler: QueryHandler<
      GetJourneyScheduleQuery,
      JourneyScheduleEntity | null
    >,

    // =========================================================================
    // Vehicle Queries
    // =========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_VEHICLE)
    private readonly getJourneyVehicleQueryHandler: QueryHandler<
      GetJourneyVehicleQuery,
      JourneyVehicleEntity | null
    >,

    // =========================================================================
    // Capacity Queries
    // =========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_CAPACITY)
    private readonly getJourneyCapacityQueryHandler: QueryHandler<
      GetJourneyCapacityQuery,
      JourneyCapacityEntity | null
    >,

    // =========================================================================
    // Pricing Queries
    // =========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_PRICING)
    private readonly getJourneyPricingQueryHandler: QueryHandler<
      GetJourneyPricingQuery,
      JourneyPricingEntity | null
    >,

    // =========================================================================
    // Preferences Queries
    // =========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_PREFERENCES)
    private readonly getJourneyPreferencesQueryHandler: QueryHandler<
      GetJourneyPreferencesQuery,
      JourneyPreferencesEntity | null
    >,

    // =========================================================================
    // Asset Queries
    // =========================================================================

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
  // PUBLIC JOURNEY DISCOVERY
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Search Published Journeys
  // ---------------------------------------------------------------------------
  //
  // Public landing-page operation.
  //
  // Journey is the primary discovery object.
  //
  // The search is deliberately delegated to the Journey application query
  // handler. The controller does not search, filter, or inspect Journey data.
  //
  // Example:
  //
  //     GET /journeys/search?from=Nairobi&to=Kisumu&date=2026-09-15
  //
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Search published journeys',
    description:
      'Returns published journeys matching the requested origin, destination, and departure date.',
  })
  @ApiQuery({
    name: 'from',
    type: String,
    required: true,
    description: 'Journey origin.',
    example: 'Nairobi',
  })
  @ApiQuery({
    name: 'to',
    type: String,
    required: true,
    description: 'Journey destination.',
    example: 'Kisumu',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    required: true,
    description: 'Departure date in YYYY-MM-DD format.',
    example: '2026-09-15',
  })
  @Get('search')
  public async searchPublishedJourneys(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date: string,
  ): Promise<readonly JourneyEntity[]> {
    return this.searchPublishedJourneysQueryHandler.execute(
      new SearchPublishedJourneysQuery(from, to, date),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journeys By Status
  // ---------------------------------------------------------------------------
  //
  // Public landing-page operation.
  //
  // No authentication is required.
  //
  // Example:
  //
  //     GET /journeys/status/PUBLISHED
  //
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journeys by status',
    description:
      'Returns journeys matching the specified status for public journey discovery.',
  })
  @ApiParam({
    name: 'status',
    type: String,
    required: true,
    description: 'Journey status.',
    example: 'PUBLISHED',
  })
  @Get('status/:status')
  public async getByStatus(
    @Param('status') status: string,
  ): Promise<readonly JourneyAggregate[]> {
    return this.getJourneysByStatusQueryHandler.execute(
      new GetJourneysByStatusQuery(this.parseJourneyStatus(status)),
    );
  }

  // ===========================================================================
  // AUTHENTICATED JOURNEY QUERIES
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Journeys By Provider And Status
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get journeys by provider and status',
    description:
      'Returns journeys belonging to a provider filtered by journey status.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the journey provider.',
  })
  @ApiParam({
    name: 'status',
    type: String,
    required: true,
    description: 'Journey status.',
    example: 'PUBLISHED',
  })
  @Get('provider/:providerPublicId/status/:status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:read')
  public async getByProviderAndStatus(
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

  // ---------------------------------------------------------------------------
  // Get Journeys By Provider
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get journeys by provider',
    description:
      'Returns journeys belonging to the specified journey provider.',
  })
  @ApiParam({
    name: 'providerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the journey provider.',
  })
  @Get('provider/:providerPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:read')
  public async getByProvider(
    @Param('providerPublicId') providerPublicId: string,
  ): Promise<readonly JourneyAggregate[]> {
    return this.getJourneysByProviderQueryHandler.execute(
      new GetJourneysByProviderQuery(providerPublicId),
    );
  }

  // ===========================================================================
  // PUBLIC JOURNEY
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Journey
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey',
    description:
      'Returns a journey by its public ID for public journey discovery and display.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
    example: 'JRN-8VBLAO',
  })
  @Get(':journeyPublicId')
  public async get(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyAggregate | null> {
    return this.getJourneyQueryHandler.execute(
      new GetJourneyQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ===========================================================================
  // JOURNEY LIFECYCLE
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Journey
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create journey',
    description: 'Creates a new journey for an authenticated provider.',
  })
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:create')
  public async create(
    @Body() dto: CreateJourneyDto,
  ): Promise<JourneyAggregate> {
    return this.createJourneyHandler.execute(
      new CreateJourneyCommand(dto.providerPublicId, randomUUID()),
    );
  }

  // ---------------------------------------------------------------------------
  // Publish Journey
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Publish journey',
    description: 'Publishes a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/publish')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:publish')
  public async publish(
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

  // ---------------------------------------------------------------------------
  // Start Journey
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Start journey',
    description: 'Starts a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/start')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:start')
  public async start(
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

  // ---------------------------------------------------------------------------
  // Complete Journey
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Complete journey',
    description: 'Completes a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/complete')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:complete')
  public async complete(
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

  // ---------------------------------------------------------------------------
  // Cancel Journey
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancel journey',
    description: 'Cancels a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/cancel')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:cancel')
  public async cancel(
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

  // ---------------------------------------------------------------------------
  // Expire Journey
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Expire journey',
    description: 'Expires a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/expire')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:expire')
  public async expire(
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

  // ---------------------------------------------------------------------------
  // Get Corridor
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey corridor',
    description: 'Returns the corridor associated with a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get(':journeyPublicId/corridor')
  public async getCorridor(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyCorridorEntity | null> {
    return this.getJourneyCorridorQueryHandler.execute(
      new GetJourneyCorridorQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ---------------------------------------------------------------------------
  // Attach Corridor
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Attach corridor',
    description: 'Attaches a corridor to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/corridor')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:corridor:attach')
  public async attachCorridor(
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

  // ---------------------------------------------------------------------------
  // Remove Corridor
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove corridor',
    description: 'Removes the corridor from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Delete(':journeyPublicId/corridor')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:corridor:remove')
  public async removeCorridor(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removeCorridorHandler.execute(
      new RemoveJourneyCorridorCommand(journeyPublicId, randomUUID()),
    );
  }

  // ===========================================================================
  // WAYPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Waypoints
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey waypoints',
    description: 'Returns all waypoints belonging to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get(':journeyPublicId/waypoints')
  public async getWaypoints(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<readonly JourneyWaypointEntity[]> {
    return this.getJourneyWaypointsQueryHandler.execute(
      new GetJourneyWaypointsQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Waypoint
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey waypoint',
    description: 'Returns a single waypoint belonging to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @ApiParam({
    name: 'waypointPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Waypoint.',
  })
  @Get(':journeyPublicId/waypoints/:waypointPublicId')
  public async getWaypoint(
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

  // ---------------------------------------------------------------------------
  // Add Waypoint
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Add journey waypoint',
    description: 'Adds a waypoint to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/waypoints')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:waypoint:add')
  public async addWaypoint(
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

  // ---------------------------------------------------------------------------
  // Remove Waypoint
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey waypoint',
    description: 'Removes a waypoint from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @ApiParam({
    name: 'waypointPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Waypoint.',
  })
  @Delete(':journeyPublicId/waypoints/:waypointPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:waypoint:remove')
  public async removeWaypoint(
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

  // ---------------------------------------------------------------------------
  // Get Schedule
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey schedule',
    description: 'Returns the schedule associated with a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get(':journeyPublicId/schedule')
  public async getSchedule(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyScheduleEntity | null> {
    return this.getJourneyScheduleQueryHandler.execute(
      new GetJourneyScheduleQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ---------------------------------------------------------------------------
  // Attach Schedule
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Attach journey schedule',
    description: 'Attaches a schedule to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/schedule')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:schedule:attach')
  public async attachSchedule(
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

  // ---------------------------------------------------------------------------
  // Remove Schedule
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey schedule',
    description: 'Removes the schedule from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Delete(':journeyPublicId/schedule')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:schedule:remove')
  public async removeSchedule(
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

  // ---------------------------------------------------------------------------
  // Get Vehicle
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey vehicle',
    description: 'Returns the vehicle associated with a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get(':journeyPublicId/vehicle')
  public async getVehicle(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyVehicleEntity | null> {
    return this.getJourneyVehicleQueryHandler.execute(
      new GetJourneyVehicleQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ---------------------------------------------------------------------------
  // Attach Vehicle
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Attach journey vehicle',
    description: 'Attaches a vehicle to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/vehicle')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:vehicle:attach')
  public async attachVehicle(
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

  // ---------------------------------------------------------------------------
  // Remove Vehicle
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey vehicle',
    description: 'Removes the vehicle from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Delete(':journeyPublicId/vehicle')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:vehicle:remove')
  public async removeVehicle(
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

  // ---------------------------------------------------------------------------
  // Get Capacity
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey capacity',
    description: 'Returns the capacity information associated with a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get(':journeyPublicId/capacity')
  public async getCapacity(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyCapacityEntity | null> {
    return this.getJourneyCapacityQueryHandler.execute(
      new GetJourneyCapacityQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ---------------------------------------------------------------------------
  // Attach Capacity
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Attach journey capacity',
    description: 'Attaches capacity information to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/capacity')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:capacity:attach')
  public async attachCapacity(
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

  // ---------------------------------------------------------------------------
  // Remove Capacity
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey capacity',
    description: 'Removes capacity information from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Delete(':journeyPublicId/capacity')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:capacity:remove')
  public async removeCapacity(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removeCapacityHandler.execute(
      new RemoveJourneyCapacityCommand(journeyPublicId, randomUUID()),
    );
  }

  // ===========================================================================
  // PRICING
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Pricing
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey pricing',
    description: 'Returns pricing information associated with a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get(':journeyPublicId/pricing')
  public async getPricing(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyPricingEntity | null> {
    return this.getJourneyPricingQueryHandler.execute(
      new GetJourneyPricingQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ---------------------------------------------------------------------------
  // Attach Pricing
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Attach journey pricing',
    description: 'Attaches pricing information to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/pricing')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:pricing:attach')
  public async attachPricing(
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

  // ---------------------------------------------------------------------------
  // Remove Pricing
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey pricing',
    description: 'Removes pricing information from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Delete(':journeyPublicId/pricing')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:pricing:remove')
  public async removePricing(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<void> {
    await this.removePricingHandler.execute(
      new RemovePricingCommand(journeyPublicId, randomUUID()),
    );
  }

  // ===========================================================================
  // PREFERENCES
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Preferences
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey preferences',
    description: 'Returns preferences associated with a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get(':journeyPublicId/preferences')
  public async getPreferences(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyPreferencesEntity | null> {
    return this.getJourneyPreferencesQueryHandler.execute(
      new GetJourneyPreferencesQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ---------------------------------------------------------------------------
  // Attach Preferences
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Attach journey preferences',
    description: 'Attaches preferences to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/preferences')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:preferences:attach')
  public async attachPreferences(
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

  // ---------------------------------------------------------------------------
  // Remove Preferences
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey preferences',
    description: 'Removes preferences from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Delete(':journeyPublicId/preferences')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:preferences:remove')
  public async removePreferences(
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

  // ---------------------------------------------------------------------------
  // Get Assets
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey assets',
    description: 'Returns assets associated with a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get(':journeyPublicId/assets')
  public async getAssets(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<readonly JourneyAssetEntity[]> {
    return this.getJourneyAssetsQueryHandler.execute(
      new GetJourneyAssetsQuery(new JourneyPublicId(journeyPublicId)),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Asset
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey asset',
    description: 'Returns a single asset associated with a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @ApiParam({
    name: 'assetPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Asset.',
  })
  @Get(':journeyPublicId/assets/:assetPublicId')
  public async getAsset(
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

  // ---------------------------------------------------------------------------
  // Attach Asset
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Attach journey asset',
    description: 'Attaches an asset to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/assets')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:asset:attach')
  public async attachAsset(
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

  // ---------------------------------------------------------------------------
  // Remove Asset
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey asset',
    description: 'Removes an asset from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @ApiParam({
    name: 'assetPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Asset.',
  })
  @Delete(':journeyPublicId/assets/:assetPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('journey:asset:remove')
  public async removeAsset(
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

  // ---------------------------------------------------------------------------
  // Parse Journey Status
  // ---------------------------------------------------------------------------

  private parseJourneyStatus(status: string): JourneyStatus {
    const normalizedStatus = status.trim().toUpperCase();

    if (!this.isJourneyStatus(normalizedStatus)) {
      throw new BadRequestException(`Invalid journey status "${status}".`);
    }

    return normalizedStatus;
  }

  // ---------------------------------------------------------------------------
  // Check Journey Status
  // ---------------------------------------------------------------------------

  private isJourneyStatus(value: string): value is JourneyStatus {
    return Object.values(JourneyStatus).includes(value as JourneyStatus);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyController;