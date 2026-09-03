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

import { ApiTags } from '@nestjs/swagger';

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

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Traveller Profiles')
@Controller('traveller-profiles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // PROFILE QUERIES
  // ===========================================================================

  @Get('public/:publicId')
  @RequirePermissions('traveller-profile:read')
  async getByPublicId(
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

  @Get('member/:memberPublicId')
  @RequirePermissions('traveller-profile:read')
  async getByMemberPublicId(
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

  @Get('handle/:handle')
  @RequirePermissions('traveller-profile:read')
  async getByHandle(
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

  @Get(':travellerProfileId')
  @RequirePermissions('traveller-profile:read')
  async getById(
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

  @Post()
  @RequirePermissions('traveller-profile:create')
  async create(
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

  @Patch(':travellerProfileId/handle')
  @RequirePermissions('traveller-profile:update')
  async changeHandle(
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

  @Patch(':travellerProfileId/bio')
  @RequirePermissions('traveller-profile:update')
  async changeBio(
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

  @Patch(':travellerProfileId/avatar')
  @RequirePermissions('traveller-profile:update')
  async changeAvatar(
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

  @Patch(':travellerProfileId/country')
  @RequirePermissions('traveller-profile:update')
  async changeCountry(
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

  @Patch(':travellerProfileId/status')
  @RequirePermissions('traveller-profile:update')
  async changeStatus(
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

  @Patch(':travellerProfileId/visibility')
  @RequirePermissions('traveller-profile:update')
  async changeVisibility(
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

  @Post(':travellerProfileId/preferences')
  @RequirePermissions('traveller-profile:update')
  async createPreferences(
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

  @Get(':travellerProfileId/preferences')
  @RequirePermissions('traveller-profile:read')
  async getPreferences(
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

  @Patch(':travellerProfileId/preferences')
  @RequirePermissions('traveller-profile:update')
  async changePreferences(
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

  @Delete(':travellerProfileId/preferences')
  @RequirePermissions('traveller-profile:update')
  async removePreferences(
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

  @Post(':travellerProfileId/corridors')
  @RequirePermissions('traveller-profile:update')
  async addCorridor(
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

  @Get(':travellerProfileId/corridors/primary')
  @RequirePermissions('traveller-profile:read')
  async getPrimaryCorridor(
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

  @Get(':travellerProfileId/corridors')
  @RequirePermissions('traveller-profile:read')
  async getCorridors(
    @Param('travellerProfileId') travellerProfileId: string,
  ): Promise<TravellerProfileCorridorResponse[]> {
    const corridors =
      await this.getTravellerProfileCorridorsQueryHandler.execute(
        new GetTravellerProfileCorridorsQuery(travellerProfileId),
      );

    return TravellerProfileResponseMapper.fromCorridors(corridors);
  }

  @Get(':travellerProfileId/corridors/:corridorId')
  @RequirePermissions('traveller-profile:read')
  async getCorridor(
    @Param('corridorId') corridorId: string,
  ): Promise<TravellerProfileCorridorResponse | null> {
    const corridor = await this.getTravellerProfileCorridorQueryHandler.execute(
      new GetTravellerProfileCorridorQuery(corridorId),
    );

    return corridor === null
      ? null
      : TravellerProfileResponseMapper.fromCorridor(corridor);
  }

  @Patch(':travellerProfileId/corridors/:corridorId')
  @RequirePermissions('traveller-profile:update')
  async updateCorridor(
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

  @Delete(':travellerProfileId/corridors/:corridorId')
  @RequirePermissions('traveller-profile:update')
  async removeCorridor(
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

  @Patch(':travellerProfileId/corridors/:corridorId/primary')
  @RequirePermissions('traveller-profile:update')
  async setPrimaryCorridor(
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

  @Delete(':travellerProfileId/corridors/primary')
  @RequirePermissions('traveller-profile:update')
  async clearPrimaryCorridor(
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
