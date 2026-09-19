// -----------------------------------------------------------------------------
// sisiMove — Journey HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for the Journey aggregate and its associated Journey
// components.
//
// Aggregate boundary:
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
// IMPORTANT PUBLIC READ ARCHITECTURE
// ---------------------------------
//
// Journey remains the owner of Journey creation and Journey state.
//
// Journey.providerPublicId is an opaque public reference to the member who
// provides the Journey.
//
// Traveller Profile and Trust Profile do NOT own the Journey.
//
// Public marketplace composition:
//
// Journey
//   └── providerPublicId
//          ├── Traveller Profile public read model
//          └── Trust Profile public read model
//
// GetPublicJourneysQueryHandler owns this public-read composition.
//
// The controller MUST NOT:
//
// - unwrap a domain JourneyEntity from the public response;
// - convert the public projection back through JourneyResponseMapper;
// - load Traveller Profile or Trust Profile;
// - join persistence models;
// - fabricate provider data;
// - expose providerPublicId;
// - expose internal Journey lifecycle fields.
//
// The public application query is therefore the single source of truth for
// the public marketplace Journey representation.
//
//
// AUTHENTICATED "MY JOURNEYS" READ
// --------------------------------
//
// The authenticated My Journeys boundary is:
//
//     GET /journeys/me
//
// The provider identity is derived from the authenticated JWT through
// CurrentIdentity. The client MUST NOT supply providerPublicId for this
// endpoint.
//
// Flow:
//
//     JWT
//       │
//       ▼
//     AuthenticatedIdentity.identityPublicId
//       │
//       ▼
//     GetJourneysByProviderQuery
//       │
//       ▼
//     JourneyAggregate[]
//       │
//       ▼
//     MyJourneyMapper
//       │
//       ▼
//     MyJourneyResponse[]
//
// The existing GetJourneysByProviderQueryHandler is reused.
//
// No new repository method is introduced.
//
// The controller is responsible only for HTTP transport and application
// response mapping. Domain aggregates are not exposed directly through the
// authenticated HTTP contract.
//
// Route ordering is intentional:
//
//     GET /journeys/me
//
// appears before:
//
//     GET /journeys/:journeyPublicId
//
// so "me" cannot be interpreted as a Journey public ID.
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
//
// CurrentIdentity exposes the already-authenticated identity established by
// JwtAuthGuard.
//
// AuthenticatedIdentity is the application-facing authenticated identity
// contract.
//
// -----------------------------------------------------------------------------

import * as auth from '../../../../../foundation/security/auth';

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
  GetJourneyScheduleQuery,
  GetJourneyVehicleQuery,
  GetJourneyWaypointQuery,
  GetJourneyWaypointsQuery,
  GetJourneysByProviderAndStatusQuery,
  GetJourneysByProviderQuery,
  GetPublicJourneysQuery,
  SearchPublishedJourneysQuery,
} from '../../../application/queries/journey';

// -----------------------------------------------------------------------------
// Journey — Public Query Response
// -----------------------------------------------------------------------------
//
// GetPublicJourneysQueryHandler returns the complete public marketplace
// projection.
//
// PublicJourneyResponse is NOT a wrapper around JourneyEntity.
//
// It is the application read model consumed by the public marketplace.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyResponse } from '../../../application/query-handlers/journey/get-public-journeys.query-handler';

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
// Journey — Presentation Response Mapper
// -----------------------------------------------------------------------------
//
// JourneyResponseMapper remains the mapper for the existing internal Journey
// HTTP representation.
//
// It is intentionally NOT used by:
//
//     GET /journeys/public
//
// or:
//
//     GET /journeys/:journeyPublicId
//
// Those endpoints consume the application public-read projection directly.
//
// -----------------------------------------------------------------------------

import { JourneyResponseMapper } from '../mappers/journey-response.mapper';

// -----------------------------------------------------------------------------
// Journey — Authenticated Response Mapper
// -----------------------------------------------------------------------------
//
// MyJourneyMapper converts an owned JourneyAggregate into the stable
// authenticated HTTP representation.
//
// The domain aggregate therefore never crosses the HTTP boundary.
//
// -----------------------------------------------------------------------------

import { MyJourneyMapper } from '../../../application/mappers/my-journey.mapper';

// -----------------------------------------------------------------------------
// Journey — Authenticated Response
// -----------------------------------------------------------------------------

import type { MyJourneyResponse } from '../../../application/responses/my-journey.response';

// -----------------------------------------------------------------------------
// Journey — Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyAssetPublicIdReference,
  JourneyCapacityPublicId,
  JourneyCorridorPublicId,
  JourneyPreferencesPublicId,
  JourneyPricingPublicId,
  JourneyPublicId,
  JourneySchedulePublicId,
  JourneyStatus,
  JourneyVehiclePublicId,
  JourneyWaypointPublicId,
} from 'src/domains/journey/domain/value-objects';

// -----------------------------------------------------------------------------
// Journey — Internal HTTP Response Type
// -----------------------------------------------------------------------------
//
// This response type belongs only to endpoints that intentionally expose the
// existing internal Journey REST representation.
//
// The public marketplace and authenticated "my journeys" boundaries use their
// own explicit application-facing contracts.
//
// -----------------------------------------------------------------------------

type JourneyEntityResponse = ReturnType<
  typeof JourneyResponseMapper.fromEntity
>;

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
    // Authenticated Journey Queries
    // =========================================================================
    //
    // GET /journeys/me uses the current authenticated identity as the provider
    // reference.
    //
    // No providerPublicId is accepted from the client.
    //
    // The repository/query boundary remains unchanged.
    //
    // =========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER)
    private readonly getJourneysByProviderQueryHandler: QueryHandler<
      GetJourneysByProviderQuery,
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
    // Public Journey Collection / Detail Query
    // =========================================================================
    //
    // GetPublicJourneysQuery is intentionally the ONLY public Journey
    // collection/detail query.
    //
    // Collection:
    //
    //     new GetPublicJourneysQuery(
    //       undefined,
    //       from,
    //       to,
    //       date,
    //     )
    //
    // Detail:
    //
    //     new GetPublicJourneysQuery(publicId)
    //
    // =========================================================================

    @Inject(JOURNEY_TOKENS.QUERY_HANDLERS.GET_PUBLIC_MANY)
    private readonly getPublicJourneysQueryHandler: QueryHandler<
      GetPublicJourneysQuery,
      readonly PublicJourneyResponse[]
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
  // Get Public Journeys
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journeys',
    description:
      'Returns publicly discoverable journeys for marketplace discovery. With no filters, all currently discoverable journeys are returned.',
  })
  @ApiQuery({
    name: 'from',
    type: String,
    required: false,
    description: 'Optional journey origin filter.',
    example: 'Nairobi',
  })
  @ApiQuery({
    name: 'to',
    type: String,
    required: false,
    description: 'Optional journey destination filter.',
    example: 'Kisumu',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    required: false,
    description: 'Optional departure date filter in YYYY-MM-DD format.',
    example: '2026-09-18',
  })
  @Get('public')
  public async getPublicJourneys(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('date') date?: string,
  ): Promise<readonly PublicJourneyResponse[]> {
    return this.getPublicJourneysQueryHandler.execute(
      new GetPublicJourneysQuery(undefined, from, to, date),
    );
  }

  // ---------------------------------------------------------------------------
  // Search Published Journeys
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
  ): Promise<readonly JourneyEntityResponse[]> {
    const journeys = await this.searchPublishedJourneysQueryHandler.execute(
      new SearchPublishedJourneysQuery(from, to, date),
    );

    return journeys.map((journey) => JourneyResponseMapper.fromEntity(journey));
  }

  // ===========================================================================
  // AUTHENTICATED JOURNEY QUERIES
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get My Journeys
  // ---------------------------------------------------------------------------
  //
  // Authenticated Journey-management boundary.
  //
  //     GET /journeys/me
  //
  // Ownership:
  //
  //     JWT
  //       ↓
  //     AuthenticatedIdentity.identityPublicId
  //       ↓
  //     GetJourneysByProviderQuery
  //
  // The client cannot choose providerPublicId.
  //
  // The query handler still returns JourneyAggregate[] because that is the
  // existing application query contract.
  //
  // The controller then converts those aggregates into MyJourneyResponse
  // objects before crossing the HTTP boundary.
  //
  // This prevents the domain aggregate from becoming an accidental REST
  // contract.
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get my journeys',
    description:
      'Returns journeys belonging to the currently authenticated journey provider.',
  })
  @Get('me')
  @UseGuards(auth.JwtAuthGuard)
  public async getMyJourneys(
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
  ): Promise<readonly MyJourneyResponse[]> {
    const journeys = await this.getJourneysByProviderQueryHandler.execute(
      new GetJourneysByProviderQuery(identity.identityPublicId),
    );

    return journeys.map((journey) => MyJourneyMapper.fromAggregate(journey));
  }

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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:read')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:read')
  public async getByProvider(
    @Param('providerPublicId') providerPublicId: string,
  ): Promise<readonly JourneyAggregate[]> {
    return this.getJourneysByProviderQueryHandler.execute(
      new GetJourneysByProviderQuery(providerPublicId),
    );
  }

  // ===========================================================================
  // PUBLIC JOURNEY DETAIL
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Public Journey
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get public journey',
    description:
      'Returns a currently publicly discoverable journey by its public ID.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
    example: 'JRN-8VBLAO',
  })
  @Get(':journeyPublicId')
  public async getPublicJourney(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<PublicJourneyResponse | null> {
    const journeys = await this.getPublicJourneysQueryHandler.execute(
      new GetPublicJourneysQuery(journeyPublicId),
    );

    return journeys[0] ?? null;
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:create')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:publish')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:start')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:complete')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:cancel')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:expire')
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

  @ApiOperation({
    summary: 'Get public journey corridor',
    description: 'Returns the corridor of a publicly discoverable journey.',
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:corridor:attach')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:corridor:remove')
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

  @ApiOperation({
    summary: 'Get public journey waypoints',
    description:
      'Returns waypoints belonging to a publicly discoverable journey.',
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

  @ApiOperation({
    summary: 'Get public journey waypoint',
    description:
      'Returns a waypoint belonging to a publicly discoverable journey.',
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:waypoint:add')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:waypoint:remove')
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

  @ApiOperation({
    summary: 'Get public journey schedule',
    description: 'Returns the schedule of a publicly discoverable journey.',
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:schedule:attach')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:schedule:remove')
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

  @ApiOperation({
    summary: 'Get public journey vehicle',
    description: 'Returns the vehicle of a publicly discoverable journey.',
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:vehicle:attach')
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove vehicle',
    description: 'Removes the vehicle from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Delete(':journeyPublicId/vehicle')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:vehicle:remove')
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

  @ApiOperation({
    summary: 'Get public journey capacity',
    description: 'Returns the capacity of a publicly discoverable journey.',
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:capacity:attach')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:capacity:remove')
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

  @ApiOperation({
    summary: 'Get public journey pricing',
    description: 'Returns pricing of a publicly discoverable journey.',
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:pricing:attach')
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey pricing',
    description: 'Removes pricing from a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Delete(':journeyPublicId/pricing')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:pricing:remove')
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

  @ApiOperation({
    summary: 'Get public journey preferences',
    description: 'Returns preferences of a publicly discoverable journey.',
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:preferences:attach')
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:preferences:remove')
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

  @ApiOperation({
    summary: 'Get public journey assets',
    description: 'Returns assets belonging to a publicly discoverable journey.',
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

  @ApiOperation({
    summary: 'Get public journey asset',
    description:
      'Returns an asset belonging to a publicly discoverable journey.',
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
    description: 'Public ID of the Journey asset.',
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:asset:attach')
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
    description: 'Public ID of the Journey asset.',
  })
  @Delete(':journeyPublicId/assets/:assetPublicId')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:asset:remove')
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

  private parseJourneyStatus(value: string): JourneyStatus {
    const normalized = value.trim().toUpperCase();

    const status = Object.values(JourneyStatus).find(
      (candidate) => String(candidate) === normalized,
    );

    if (status === undefined) {
      throw new BadRequestException(`Invalid journey status "${value}".`);
    }

    return status;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyController;
