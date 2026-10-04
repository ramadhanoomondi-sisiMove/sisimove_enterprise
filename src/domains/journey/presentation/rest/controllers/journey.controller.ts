// -----------------------------------------------------------------------------
// sisiMove — Journey HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for the Journey aggregate and its associated Journey
// components.
//
// Permission vocabulary is intentionally aligned with the seeded Journey
// permissions:
//
//   journey:read
//   journey:create
//   journey:update
//   journey:cancel
//   journey:manage
//
// Do NOT introduce component-specific Journey permissions here. Configuration
// mutations are covered by journey:update, while lifecycle management is
// covered by journey:manage.
//
// Asset presentation rule:
// - Journey owns only the Asset public-ID reference.
// - Asset owns the actual Asset resource and delivery URL.
// - The authenticated "my journeys" read model may enrich the vehicle with a
//   reduced public Asset reference for presentation.
// - The Journey domain model is never given an Asset URL.
// -----------------------------------------------------------------------------
//
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

import * as auth from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation — Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Asset — Application Tokens
// -----------------------------------------------------------------------------

import { ASSET_TOKENS } from '../../../../assets/application/asset.tokens';

// -----------------------------------------------------------------------------
// Asset — Application Queries
// -----------------------------------------------------------------------------

import { GetPublicAssetReferenceQuery } from '../../../../assets/application/queries/get-public-asset-reference.query';

// -----------------------------------------------------------------------------
// Asset — Domain Value Objects
// -----------------------------------------------------------------------------

import { AssetPublicId } from '../../../../assets/domain/value-objects';

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
  ExpireJourneyDto,
  PublishJourneyDto,
  StartJourneyDto,
} from '../dto';

// -----------------------------------------------------------------------------
// Journey — Presentation Response Mapper
// -----------------------------------------------------------------------------

import { JourneyResponseMapper } from '../mappers/journey-response.mapper';

// -----------------------------------------------------------------------------
// Journey — Authenticated Response Mapper
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
  JourneyPublicId,
  JourneyStatus,
  JourneyWaypointPublicId,
} from '../../../domain/value-objects';

// =============================================================================
// Local Presentation Contract
// =============================================================================
//
// Do not import Asset application's internal PublicAssetReference type here.
//
// Journey only needs the reduced presentation contract:
//
//     { publicId, url }
//
// Keeping this local prevents the Journey presentation layer from depending
// on the concrete Asset query response type while still consuming the Asset
// domain's public-reference query through its application token.
// =============================================================================

interface JourneyVehicleAssetReference {
  readonly publicId: string;
  readonly url: string;
}

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
    // Journey Asset Queries
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

    // =========================================================================
    // Asset Domain — Public Asset Reference Query
    // =========================================================================

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_REFERENCE)
    private readonly getPublicAssetReferenceHandler: QueryHandler<
      GetPublicAssetReferenceQuery,
      JourneyVehicleAssetReference
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
  @ApiQuery({
    name: 'minPrice',
    type: Number,
    required: false,
    description:
      'Optional minimum Journey price per seat in KES. Journeys below this price are excluded.',
    example: 500,
  })
  @ApiQuery({
    name: 'maxPrice',
    type: Number,
    required: false,
    description:
      'Optional maximum Journey price per seat in KES. Journeys above this price are excluded.',
    example: 1500,
  })
  @Get('public')
  public async getPublicJourneys(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('date') date?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<readonly PublicJourneyResponse[]> {
    const parsedMinPrice = this.parseOptionalPriceFilter(minPrice, 'minPrice');

    const parsedMaxPrice = this.parseOptionalPriceFilter(maxPrice, 'maxPrice');

    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      throw new BadRequestException(
        'minPrice cannot be greater than maxPrice.',
      );
    }

    return this.getPublicJourneysQueryHandler.execute(
      new GetPublicJourneysQuery(
        undefined,
        from,
        to,
        date,
        parsedMinPrice,
        parsedMaxPrice,
      ),
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
  ): Promise<readonly ReturnType<typeof JourneyResponseMapper.fromEntity>[]> {
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

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get my journeys',
    description:
      'Returns journeys belonging to the currently authenticated journey provider, including a consumer-facing vehicle Asset reference when available.',
  })
  @Get('me')
  @UseGuards(auth.JwtAuthGuard)
  public async getMyJourneys(
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
  ): Promise<readonly MyJourneyResponse[]> {
    const journeys = await this.getJourneysByProviderQueryHandler.execute(
      new GetJourneysByProviderQuery(identity.identityPublicId),
    );

    return Promise.all(
      journeys.map(async (journey) => {
        const assetPublicId = journey.vehicle?.assetPublicId;

        if (assetPublicId === undefined || assetPublicId === null) {
          return MyJourneyMapper.fromAggregate(journey);
        }

        const vehicleAsset = await this.resolveVehicleAssetReference(
          assetPublicId.value,
        );

        return MyJourneyMapper.fromAggregate(journey, vehicleAsset);
      }),
    );
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
  // CREATE / LIFECYCLE
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Journey
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create journey',
    description:
      'Creates a new journey for the currently authenticated journey provider.',
  })
  @Post()
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:create')
  public async create(
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
  ): Promise<{ publicId: string }> {
    const journey = await this.createJourneyHandler.execute(
      new CreateJourneyCommand(identity.identityPublicId, randomUUID()),
    );

    return {
      publicId: journey.journey.publicId.value,
    };
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
  @auth.RequirePermissions('journey:manage')
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
  @auth.RequirePermissions('journey:manage')
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
  @auth.RequirePermissions('journey:manage')
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
  @auth.RequirePermissions('journey:manage')
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
  // Get Public Journey Corridor
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Attach / Configure Corridor
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Configure journey corridor',
    description: 'Creates and attaches a corridor configuration to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/corridor')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
  public async attachCorridor(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachCorridorDto,
  ): Promise<void> {
    await this.attachCorridorHandler.execute(
      new AttachJourneyCorridorCommand(
        new JourneyPublicId(journeyPublicId),
        dto.originName,
        dto.originLatitude,
        dto.originLongitude,
        dto.destinationName,
        dto.destinationLatitude,
        dto.destinationLongitude,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Corridor
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey corridor',
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
  @auth.RequirePermissions('journey:update')
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
  // Get Public Journey Waypoints
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Get Public Journey Waypoint
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Add Journey Waypoint
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Add journey waypoint',
    description:
      'Creates a waypoint from the supplied configuration and adds it to the journey corridor.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/waypoints')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
  public async addWaypoint(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AddWaypointDto,
  ): Promise<void> {
    await this.addWaypointHandler.execute(
      new AddJourneyWaypointCommand(
        journeyPublicId,
        dto.type,
        dto.sequence,
        dto.name,
        dto.latitude,
        dto.longitude,
        dto.pickupAllowed,
        dto.dropoffAllowed,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Journey Waypoint
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
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
  // Get Public Journey Schedule
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Attach / Configure Schedule
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Configure journey schedule',
    description: 'Creates and attaches a schedule configuration to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/schedule')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
  public async attachSchedule(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachScheduleDto,
  ): Promise<void> {
    await this.attachScheduleHandler.execute(
      new AttachJourneyScheduleCommand(
        new JourneyPublicId(journeyPublicId),
        new Date(dto.departureAt),
        dto.arrivalAt !== undefined ? new Date(dto.arrivalAt) : undefined,
        dto.timezone,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Journey Schedule
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
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
  // Get Public Journey Vehicle
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Attach / Configure Vehicle
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Configure journey vehicle',
    description: 'Creates and attaches a vehicle configuration to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/vehicle')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
  public async attachVehicle(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachVehicleDto,
  ): Promise<void> {
    await this.attachVehicleHandler.execute(
      new AttachJourneyVehicleCommand(
        new JourneyPublicId(journeyPublicId),
        dto.make,
        dto.model,
        dto.year,
        dto.color,
        dto.registration,
        dto.assetPublicId,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Journey Vehicle
  // ---------------------------------------------------------------------------

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
  @auth.RequirePermissions('journey:update')
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
  // Get Public Journey Capacity
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Attach / Configure Capacity
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Configure journey capacity',
    description:
      'Creates and attaches capacity information to a journey. A newly configured journey starts with zero booked seats.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/capacity')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
  public async attachCapacity(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachCapacityDto,
  ): Promise<void> {
    await this.attachCapacityHandler.execute(
      new AttachJourneyCapacityCommand(
        new JourneyPublicId(journeyPublicId),
        dto.totalSeats,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Journey Capacity
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
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
  // Get Public Journey Pricing
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Attach / Configure Pricing
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Configure journey pricing',
    description: 'Creates and attaches pricing information to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/pricing')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
  public async attachPricing(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachPricingDto,
  ): Promise<void> {
    await this.attachPricingHandler.execute(
      new AttachPricingCommand(
        new JourneyPublicId(journeyPublicId),
        dto.amount,
        dto.currency,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Journey Pricing
  // ---------------------------------------------------------------------------

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
  @auth.RequirePermissions('journey:update')
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
  // Get Public Journey Preferences
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Attach / Configure Preferences
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Configure journey preferences',
    description:
      'Creates and attaches travel preference configuration to a journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/preferences')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
  public async attachPreferences(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachPreferencesDto,
  ): Promise<void> {
    await this.attachPreferencesHandler.execute(
      new AttachPreferencesCommand(
        new JourneyPublicId(journeyPublicId),
        dto.smoking,
        dto.pets,
        dto.luggage,
        dto.conversation,
        dto.music,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Journey Preferences
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
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
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
  // Get Public Journey Assets
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Get Public Journey Asset
  // ---------------------------------------------------------------------------

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
    description: 'Public ID of the referenced Asset.',
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
  // Attach / Configure Journey Asset
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Attach journey asset',
    description:
      'Creates a Journey-owned asset attachment referencing an existing Asset-domain resource.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Post(':journeyPublicId/assets')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
  public async attachAsset(
    @Param('journeyPublicId') journeyPublicId: string,
    @Body() dto: AttachAssetDto,
  ): Promise<void> {
    await this.attachAssetHandler.execute(
      new AttachJourneyAssetCommand(
        new JourneyPublicId(journeyPublicId),
        new JourneyAssetPublicIdReference(dto.assetPublicId),
        dto.type,
        dto.sortOrder,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Journey Asset
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove journey asset',
    description: 'Removes an asset attachment from a journey.',
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
    description: 'Public ID of the referenced Asset.',
  })
  @Delete(':journeyPublicId/assets/:assetPublicId')
  @UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
  @auth.RequirePermissions('journey:update')
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
  // Resolve Vehicle Asset Reference
  // ---------------------------------------------------------------------------
  //
  // The Journey aggregate contains only the Asset public ID.
  //
  // The Asset domain determines whether the Asset is publicly usable and
  // resolves its consumer-facing URL.
  //
  // A failure here must not make the authenticated Journey collection
  // disappear. The Journey still has a valid opaque Asset reference, but the
  // presentation projection cannot render an image until the Asset becomes
  // publicly usable.
  //
  // ---------------------------------------------------------------------------

  private async resolveVehicleAssetReference(
    assetPublicId: string,
  ): Promise<JourneyVehicleAssetReference | null> {
    try {
      return await this.getPublicAssetReferenceHandler.execute(
        new GetPublicAssetReferenceQuery(new AssetPublicId(assetPublicId)),
      );
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Parse Optional Price Filter
  // ---------------------------------------------------------------------------
  //
  // HTTP query parameters arrive as strings.
  //
  // The application query receives numbers because price filtering is a
  // numeric concern owned by the Journey query layer.
  //
  // Empty values are treated as absent.
  //
  // Invalid numeric values are rejected at the HTTP boundary rather than
  // silently becoming NaN or being passed deeper into the application layer.
  //
  // ---------------------------------------------------------------------------

  private parseOptionalPriceFilter(
    value: string | undefined,
    parameterName: string,
  ): number | undefined {
    const normalized = value?.trim();

    if (!normalized) {
      return undefined;
    }

    const parsed = Number(normalized);

    if (!Number.isFinite(parsed)) {
      throw new BadRequestException(`${parameterName} must be a valid number.`);
    }

    if (parsed < 0) {
      throw new BadRequestException(`${parameterName} cannot be negative.`);
    }

    return parsed;
  }

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
