// src/domains/social/presentation/rest/controllers/traveller-profile.controller.ts

import { randomUUID } from 'crypto';

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Application Commands
// -----------------------------------------------------------------------------

import {
  CreateTravellerProfileCommand,
  ChangeTravellerProfileHandleCommand,
  ChangeTravellerProfileBioCommand,
  ChangeTravellerProfileAvatarCommand,
  ChangeTravellerProfileCountryCommand,
  ChangeTravellerProfileStatusCommand,
  ChangeTravellerProfileVisibilityCommand,
  CreateTravellerProfilePreferencesCommand,
  ChangeTravellerProfilePreferencesCommand,
  RemoveTravellerProfilePreferencesCommand,
  AddTravellerProfileCorridorCommand,
  UpdateTravellerProfileCorridorCommand,
  RemoveTravellerProfileCorridorCommand,
  SetTravellerProfilePrimaryCorridorCommand,
  ClearTravellerProfilePrimaryCorridorCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application Queries
// -----------------------------------------------------------------------------

import {
  GetTravellerProfileQuery,
  GetTravellerProfileByPublicIdQuery,
  GetTravellerProfileByMemberPublicIdQuery,
  GetTravellerProfileByHandleQuery,
  GetTravellerProfilePreferencesQuery,
  GetTravellerProfileCorridorQuery,
  GetTravellerProfileCorridorsQuery,
  GetTravellerProfilePrimaryCorridorQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TravellerProfileAggregate } from '../../../domain/aggregates/traveller-profile.aggregate';
import type { TravellerProfilePreferencesEntity } from '../../../domain/entities/traveller-profile-preferences.entity';
import type { TravellerProfileCorridorEntity } from '../../../domain/entities/traveller-profile-corridor.entity';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { TRAVELLER_PROFILE_TOKENS } from '../../../application/traveller-profile.tokens';

// -----------------------------------------------------------------------------
// Presentation DTOs
// -----------------------------------------------------------------------------

import {
  CreateTravellerProfileDto,
  ChangeTravellerProfileHandleDto,
  ChangeTravellerProfileBioDto,
  ChangeTravellerProfileAvatarDto,
  ChangeTravellerProfileCountryDto,
  ChangeTravellerProfileStatusDto,
  ChangeTravellerProfileVisibilityDto,
  CreateTravellerProfilePreferencesDto,
  ChangeTravellerProfilePreferencesDto,
  AddTravellerProfileCorridorDto,
  UpdateTravellerProfileCorridorDto,
} from '../dto';

// -----------------------------------------------------------------------------
// Presentation Responses
// -----------------------------------------------------------------------------

import {
  TravellerProfileResponseMapper,
  type TravellerProfileResponse,
  type TravellerProfilePreferencesResponse,
  type TravellerProfileCorridorResponse,
} from '../mappers';

// =============================================================================
// Traveller Profile HTTP Controller
// =============================================================================
//
// This controller exposes two categories of Traveller Profile operations:
//
// 1. PUBLIC PROFILE DISCOVERY
//
//    These endpoints support the public SisiMove experience, including:
//
//    - landing-page traveller discovery;
//    - public traveller profiles;
//    - profile lookup by handle;
//    - profile lookup by public identity;
//    - public route/corridor presentation.
//
//    These endpoints do NOT require authentication.
//
// 2. AUTHENTICATED PROFILE MANAGEMENT
//
//    These endpoints modify Traveller Profile state or expose private/profile-
//    management information. They require:
//
//        Access Token
//             ↓
//        JwtAuthGuard
//             ↓
//        PermissionsGuard
//             ↓
//        Required traveller-profile permission
//             ↓
//        Application Command / Query Handler
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding;
// - command/query construction;
// - dispatching application handlers;
// - mapping application/domain results to HTTP responses;
// - declaring authorization requirements.
//
// The controller contains no business rules.
//
// Domain behavior remains in:
//
// - TravellerProfileAggregate;
// - TravellerProfilePreferencesEntity;
// - TravellerProfileCorridorEntity;
// - application command/query handlers.
//
// =============================================================================

@ApiTags('Traveller Profiles')
@Controller('traveller-profiles')
export class TravellerProfileController {
  constructor(
    // ========================================================================
    // Commands
    // ========================================================================

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createTravellerProfileHandler: CommandHandler<
      CreateTravellerProfileCommand,
      TravellerProfileAggregate
    >,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_HANDLE)
    private readonly changeTravellerProfileHandleHandler: CommandHandler<ChangeTravellerProfileHandleCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_BIO)
    private readonly changeTravellerProfileBioHandler: CommandHandler<ChangeTravellerProfileBioCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_AVATAR)
    private readonly changeTravellerProfileAvatarHandler: CommandHandler<ChangeTravellerProfileAvatarCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_COUNTRY)
    private readonly changeTravellerProfileCountryHandler: CommandHandler<ChangeTravellerProfileCountryCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_STATUS)
    private readonly changeTravellerProfileStatusHandler: CommandHandler<ChangeTravellerProfileStatusCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_VISIBILITY)
    private readonly changeTravellerProfileVisibilityHandler: CommandHandler<ChangeTravellerProfileVisibilityCommand>,

    // ========================================================================
    // Preferences Commands
    // ========================================================================

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE_PREFERENCES)
    private readonly createTravellerProfilePreferencesHandler: CommandHandler<CreateTravellerProfilePreferencesCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CHANGE_PREFERENCES)
    private readonly changeTravellerProfilePreferencesHandler: CommandHandler<ChangeTravellerProfilePreferencesCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_PREFERENCES)
    private readonly removeTravellerProfilePreferencesHandler: CommandHandler<RemoveTravellerProfilePreferencesCommand>,

    // ========================================================================
    // Corridor Commands
    // ========================================================================

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.ADD_CORRIDOR)
    private readonly addTravellerProfileCorridorHandler: CommandHandler<AddTravellerProfileCorridorCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.UPDATE_CORRIDOR)
    private readonly updateTravellerProfileCorridorHandler: CommandHandler<UpdateTravellerProfileCorridorCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.REMOVE_CORRIDOR)
    private readonly removeTravellerProfileCorridorHandler: CommandHandler<RemoveTravellerProfileCorridorCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.SET_PRIMARY_CORRIDOR)
    private readonly setTravellerProfilePrimaryCorridorHandler: CommandHandler<SetTravellerProfilePrimaryCorridorCommand>,

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CLEAR_PRIMARY_CORRIDOR)
    private readonly clearTravellerProfilePrimaryCorridorHandler: CommandHandler<ClearTravellerProfilePrimaryCorridorCommand>,

    // ========================================================================
    // Queries
    // ========================================================================

    @Inject(TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET)
    private readonly getTravellerProfileQueryHandler: QueryHandler<
      GetTravellerProfileQuery,
      TravellerProfileAggregate | null
    >,

    @Inject(TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID)
    private readonly getTravellerProfileByPublicIdQueryHandler: QueryHandler<
      GetTravellerProfileByPublicIdQuery,
      TravellerProfileAggregate | null
    >,

    @Inject(TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_MEMBER_PUBLIC_ID)
    private readonly getTravellerProfileByMemberPublicIdQueryHandler: QueryHandler<
      GetTravellerProfileByMemberPublicIdQuery,
      TravellerProfileAggregate | null
    >,

    @Inject(TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_BY_HANDLE)
    private readonly getTravellerProfileByHandleQueryHandler: QueryHandler<
      GetTravellerProfileByHandleQuery,
      TravellerProfileAggregate | null
    >,

    // ========================================================================
    // Preferences Queries
    // ========================================================================

    @Inject(TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PREFERENCES)
    private readonly getTravellerProfilePreferencesQueryHandler: QueryHandler<
      GetTravellerProfilePreferencesQuery,
      TravellerProfilePreferencesEntity | null
    >,

    // ========================================================================
    // Corridor Queries
    // ========================================================================

    @Inject(TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_CORRIDOR)
    private readonly getTravellerProfileCorridorQueryHandler: QueryHandler<
      GetTravellerProfileCorridorQuery,
      TravellerProfileCorridorEntity | null
    >,

    @Inject(TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_CORRIDORS)
    private readonly getTravellerProfileCorridorsQueryHandler: QueryHandler<
      GetTravellerProfileCorridorsQuery,
      TravellerProfileCorridorEntity[]
    >,

    @Inject(TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PRIMARY_CORRIDOR)
    private readonly getTravellerProfilePrimaryCorridorQueryHandler: QueryHandler<
      GetTravellerProfilePrimaryCorridorQuery,
      TravellerProfileCorridorEntity | null
    >,
  ) {}

  // ===========================================================================
  // PUBLIC PROFILE DISCOVERY
  // ===========================================================================
  //
  // These endpoints intentionally do not use JwtAuthGuard.
  //
  // They support the public SisiMove experience:
  //
  // - landing-page traveller discovery;
  // - public traveller profile pages;
  // - profile lookup by public ID;
  // - profile lookup by handle;
  // - profile lookup by member public ID.
  //
  // The response mapper is responsible for exposing the public representation
  // rather than the internal aggregate structure.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Traveller Profile By Public ID
  // ---------------------------------------------------------------------------

  @Get('public/:publicId')
  public async getByPublicId(
    @Param('publicId') publicId: string,
  ): Promise<TravellerProfileResponse | null> {
    const aggregate =
      await this.getTravellerProfileByPublicIdQueryHandler.execute(
        new GetTravellerProfileByPublicIdQuery(publicId),
      );

    return aggregate === null
      ? null
      : TravellerProfileResponseMapper.fromAggregate(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Traveller Profile By Member Public ID
  // ---------------------------------------------------------------------------

  @Get('member/:memberPublicId')
  public async getByMemberPublicId(
    @Param('memberPublicId') memberPublicId: string,
  ): Promise<TravellerProfileResponse | null> {
    const aggregate =
      await this.getTravellerProfileByMemberPublicIdQueryHandler.execute(
        new GetTravellerProfileByMemberPublicIdQuery(memberPublicId),
      );

    return aggregate === null
      ? null
      : TravellerProfileResponseMapper.fromAggregate(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Traveller Profile By Handle
  // ---------------------------------------------------------------------------

  @Get('handle/:handle')
  public async getByHandle(
    @Param('handle') handle: string,
  ): Promise<TravellerProfileResponse | null> {
    const aggregate =
      await this.getTravellerProfileByHandleQueryHandler.execute(
        new GetTravellerProfileByHandleQuery(handle),
      );

    return aggregate === null
      ? null
      : TravellerProfileResponseMapper.fromAggregate(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Traveller Profile
  // ---------------------------------------------------------------------------
  //
  // Public because a Traveller Profile is part of the public SisiMove
  // traveller-discovery experience.
  //
  // Keep this route after the explicit public/member/handle routes so those
  // routes remain unambiguous.
  //
  // ---------------------------------------------------------------------------

  @Get(':travellerProfileId')
  public async getById(
    @Param('travellerProfileId') travellerProfileId: string,
  ): Promise<TravellerProfileResponse | null> {
    const aggregate = await this.getTravellerProfileQueryHandler.execute(
      new GetTravellerProfileQuery(travellerProfileId),
    );

    return aggregate === null
      ? null
      : TravellerProfileResponseMapper.fromAggregate(aggregate);
  }

  // ===========================================================================
  // PROFILE COMMANDS
  // ===========================================================================
  //
  // All profile mutations require authentication and authorization.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Traveller Profile
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:create')
  public async create(
    @Body() dto: CreateTravellerProfileDto,
  ): Promise<TravellerProfileResponse> {
    const correlationId = randomUUID();

    const command = new CreateTravellerProfileCommand(
      dto.memberPublicId,
      dto.handle,
      dto.bio ?? null,
      dto.avatarAssetPublicId ?? null,
      dto.countryCode ?? 'KE',
      undefined,
      undefined,
      correlationId,
    );

    const aggregate = await this.createTravellerProfileHandler.execute(command);

    return TravellerProfileResponseMapper.fromAggregate(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Change Handle
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/handle')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async changeHandle(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: ChangeTravellerProfileHandleDto,
  ): Promise<void> {
    await this.changeTravellerProfileHandleHandler.execute(
      new ChangeTravellerProfileHandleCommand(
        travellerProfileId,
        dto.handle,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Change Bio
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/bio')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async changeBio(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: ChangeTravellerProfileBioDto,
  ): Promise<void> {
    await this.changeTravellerProfileBioHandler.execute(
      new ChangeTravellerProfileBioCommand(
        travellerProfileId,
        dto.bio ?? null,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Change Avatar
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/avatar')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async changeAvatar(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: ChangeTravellerProfileAvatarDto,
  ): Promise<void> {
    await this.changeTravellerProfileAvatarHandler.execute(
      new ChangeTravellerProfileAvatarCommand(
        travellerProfileId,
        dto.avatarAssetPublicId ?? null,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Change Country
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/country')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async changeCountry(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: ChangeTravellerProfileCountryDto,
  ): Promise<void> {
    await this.changeTravellerProfileCountryHandler.execute(
      new ChangeTravellerProfileCountryCommand(
        travellerProfileId,
        dto.countryCode,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Change Status
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/status')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async changeStatus(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: ChangeTravellerProfileStatusDto,
  ): Promise<void> {
    await this.changeTravellerProfileStatusHandler.execute(
      new ChangeTravellerProfileStatusCommand(
        travellerProfileId,
        dto.status,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Change Visibility
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/visibility')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async changeVisibility(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: ChangeTravellerProfileVisibilityDto,
  ): Promise<void> {
    await this.changeTravellerProfileVisibilityHandler.execute(
      new ChangeTravellerProfileVisibilityCommand(
        travellerProfileId,
        dto.visibility,
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // PREFERENCES
  // ===========================================================================
  //
  // Preferences are intentionally protected.
  //
  // They control profile presentation and traveller interaction behavior and
  // should not become part of the anonymous public profile surface.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Preferences
  // ---------------------------------------------------------------------------

  @Post(':travellerProfileId/preferences')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async createPreferences(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: CreateTravellerProfilePreferencesDto,
  ): Promise<void> {
    await this.createTravellerProfilePreferencesHandler.execute(
      new CreateTravellerProfilePreferencesCommand(
        travellerProfileId,
        dto.showJourneyHistory ?? true,
        dto.showJourneyStatistics ?? true,
        dto.allowJourneyInvites ?? true,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Preferences
  // ---------------------------------------------------------------------------

  @Get(':travellerProfileId/preferences')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:read')
  public async getPreferences(
    @Param('travellerProfileId') travellerProfileId: string,
  ): Promise<TravellerProfilePreferencesResponse | null> {
    const preferences =
      await this.getTravellerProfilePreferencesQueryHandler.execute(
        new GetTravellerProfilePreferencesQuery(travellerProfileId),
      );

    return preferences === null
      ? null
      : TravellerProfileResponseMapper.fromPreferences(preferences);
  }

  // ---------------------------------------------------------------------------
  // Change Preferences
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/preferences')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async changePreferences(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: ChangeTravellerProfilePreferencesDto,
  ): Promise<void> {
    await this.changeTravellerProfilePreferencesHandler.execute(
      new ChangeTravellerProfilePreferencesCommand(
        travellerProfileId,
        dto.showJourneyHistory,
        dto.showJourneyStatistics,
        dto.allowJourneyInvites,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Preferences
  // ---------------------------------------------------------------------------

  @Delete(':travellerProfileId/preferences')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async removePreferences(
    @Param('travellerProfileId') travellerProfileId: string,
  ): Promise<void> {
    await this.removeTravellerProfilePreferencesHandler.execute(
      new RemoveTravellerProfilePreferencesCommand(
        travellerProfileId,
        randomUUID(),
      ),
    );
  }

  // ===========================================================================
  // CORRIDORS
  // ===========================================================================
  //
  // Traveller corridors are part of the public traveller-discovery experience.
  //
  // SisiMove can use the primary corridor and corridor information to show
  // where a traveller commonly travels without requiring the visitor to log
  // in first.
  //
  // Corridor mutations remain protected.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Add Corridor
  // ---------------------------------------------------------------------------

  @Post(':travellerProfileId/corridors')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async addCorridor(
    @Param('travellerProfileId') travellerProfileId: string,
    @Body() dto: AddTravellerProfileCorridorDto,
  ): Promise<void> {
    await this.addTravellerProfileCorridorHandler.execute(
      new AddTravellerProfileCorridorCommand(
        travellerProfileId,
        dto.originName,
        dto.destinationName,
        dto.originLatitude,
        dto.originLongitude,
        dto.destinationLatitude,
        dto.destinationLongitude,
        dto.corridorKey ?? null,
        dto.isPrimary ?? false,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Primary Corridor
  // ---------------------------------------------------------------------------
  //
  // Public discovery endpoint.
  //
  // ---------------------------------------------------------------------------

  @Get(':travellerProfileId/corridors/primary')
  public async getPrimaryCorridor(
    @Param('travellerProfileId') travellerProfileId: string,
  ): Promise<TravellerProfileCorridorResponse | null> {
    const corridor =
      await this.getTravellerProfilePrimaryCorridorQueryHandler.execute(
        new GetTravellerProfilePrimaryCorridorQuery(travellerProfileId),
      );

    return corridor === null
      ? null
      : TravellerProfileResponseMapper.fromCorridor(corridor);
  }

  // ---------------------------------------------------------------------------
  // Get Corridors
  // ---------------------------------------------------------------------------
  //
  // Public discovery endpoint.
  //
  // ---------------------------------------------------------------------------

  @Get(':travellerProfileId/corridors')
  public async getCorridors(
    @Param('travellerProfileId') travellerProfileId: string,
  ): Promise<TravellerProfileCorridorResponse[]> {
    const corridors =
      await this.getTravellerProfileCorridorsQueryHandler.execute(
        new GetTravellerProfileCorridorsQuery(travellerProfileId),
      );

    return TravellerProfileResponseMapper.fromCorridors(corridors);
  }

  // ---------------------------------------------------------------------------
  // Get Corridor
  // ---------------------------------------------------------------------------

  @Get(':travellerProfileId/corridors/:corridorId')
  public async getCorridor(
    @Param('corridorId') corridorId: string,
  ): Promise<TravellerProfileCorridorResponse | null> {
    const corridor = await this.getTravellerProfileCorridorQueryHandler.execute(
      new GetTravellerProfileCorridorQuery(corridorId),
    );

    return corridor === null
      ? null
      : TravellerProfileResponseMapper.fromCorridor(corridor);
  }

  // ---------------------------------------------------------------------------
  // Update Corridor
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/corridors/:corridorId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async updateCorridor(
    @Param('travellerProfileId') travellerProfileId: string,
    @Param('corridorId') corridorId: string,
    @Body() dto: UpdateTravellerProfileCorridorDto,
  ): Promise<void> {
    await this.updateTravellerProfileCorridorHandler.execute(
      new UpdateTravellerProfileCorridorCommand(
        travellerProfileId,
        corridorId,
        dto.originName,
        dto.destinationName,
        dto.originLatitude,
        dto.originLongitude,
        dto.destinationLatitude,
        dto.destinationLongitude,
        dto.corridorKey ?? null,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Remove Corridor
  // ---------------------------------------------------------------------------

  @Delete(':travellerProfileId/corridors/:corridorId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async removeCorridor(
    @Param('travellerProfileId') travellerProfileId: string,
    @Param('corridorId') corridorId: string,
  ): Promise<void> {
    await this.removeTravellerProfileCorridorHandler.execute(
      new RemoveTravellerProfileCorridorCommand(
        travellerProfileId,
        corridorId,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Set Primary Corridor
  // ---------------------------------------------------------------------------

  @Patch(':travellerProfileId/corridors/:corridorId/primary')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async setPrimaryCorridor(
    @Param('travellerProfileId') travellerProfileId: string,
    @Param('corridorId') corridorId: string,
  ): Promise<void> {
    await this.setTravellerProfilePrimaryCorridorHandler.execute(
      new SetTravellerProfilePrimaryCorridorCommand(
        travellerProfileId,
        corridorId,
        randomUUID(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Clear Primary Corridor
  // ---------------------------------------------------------------------------

  @Delete(':travellerProfileId/corridors/primary')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('traveller-profile:update')
  public async clearPrimaryCorridor(
    @Param('travellerProfileId') travellerProfileId: string,
  ): Promise<void> {
    await this.clearTravellerProfilePrimaryCorridorHandler.execute(
      new ClearTravellerProfilePrimaryCorridorCommand(
        travellerProfileId,
        randomUUID(),
      ),
    );
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default TravellerProfileController;
