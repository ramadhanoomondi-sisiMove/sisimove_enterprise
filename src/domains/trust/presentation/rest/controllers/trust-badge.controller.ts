// src/domains/trust/presentation/rest/controllers/trust-badge.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { CorrelationId } from '../../../../../foundation/logging/correlation-id';
import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';
import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../identity/presentation/auth';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { TRUST_BADGE_TOKENS } from '../../../application/trust-badge.tokens';

// -----------------------------------------------------------------------------
// Application Commands
// -----------------------------------------------------------------------------

import {
  ActivateTrustBadgeCommand,
  ChangeTrustBadgeDescriptionCommand,
  ChangeTrustBadgeNameCommand,
  ChangeTrustBadgeTypeCommand,
  CreateTrustBadgeCommand,
  DeactivateTrustBadgeCommand,
  SetTrustBadgeAssetCommand,
  UpdateTrustBadgeCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application Queries
// -----------------------------------------------------------------------------

import {
  GetActiveTrustBadgesQuery,
  GetTrustBadgeByNameQuery,
  GetTrustBadgeByTypeQuery,
  GetTrustBadgesByAssetQuery,
  GetTrustBadgeQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { TrustBadgeAggregate } from '../../../domain/aggregates/trust-badge.aggregate';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { TrustBadgeType } from '../../../domain/value-objects/trust-badge-type.vo';

// -----------------------------------------------------------------------------
// Presentation DTOs
// -----------------------------------------------------------------------------

import {
  ChangeTrustBadgeDescriptionDto,
  ChangeTrustBadgeNameDto,
  ChangeTrustBadgeTypeDto,
  CreateTrustBadgeDto,
  SetTrustBadgeAssetDto,
  UpdateTrustBadgeDto,
} from '../dto';

// -----------------------------------------------------------------------------
// Presentation Responses
// -----------------------------------------------------------------------------

import {
  TrustBadgeResponseMapper,
  type TrustBadgeResponse,
} from '../mappers/trust-badge-response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Trust Badges')
@Controller('trust-badges')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TrustBadgeController {
  constructor(
    // ========================================================================
    // Commands
    // ========================================================================

    @Inject(TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createTrustBadgeHandler: CommandHandler<
      CreateTrustBadgeCommand,
      TrustBadgeAggregate
    >,

    @Inject(TRUST_BADGE_TOKENS.COMMAND_HANDLERS.UPDATE)
    private readonly updateTrustBadgeHandler: CommandHandler<UpdateTrustBadgeCommand>,

    @Inject(TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_TYPE)
    private readonly changeTrustBadgeTypeHandler: CommandHandler<ChangeTrustBadgeTypeCommand>,

    @Inject(TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_NAME)
    private readonly changeTrustBadgeNameHandler: CommandHandler<ChangeTrustBadgeNameCommand>,

    @Inject(TRUST_BADGE_TOKENS.COMMAND_HANDLERS.CHANGE_DESCRIPTION)
    private readonly changeTrustBadgeDescriptionHandler: CommandHandler<ChangeTrustBadgeDescriptionCommand>,

    @Inject(TRUST_BADGE_TOKENS.COMMAND_HANDLERS.SET_ASSET)
    private readonly setTrustBadgeAssetHandler: CommandHandler<SetTrustBadgeAssetCommand>,

    @Inject(TRUST_BADGE_TOKENS.COMMAND_HANDLERS.ACTIVATE)
    private readonly activateTrustBadgeHandler: CommandHandler<ActivateTrustBadgeCommand>,

    @Inject(TRUST_BADGE_TOKENS.COMMAND_HANDLERS.DEACTIVATE)
    private readonly deactivateTrustBadgeHandler: CommandHandler<DeactivateTrustBadgeCommand>,

    // ========================================================================
    // Queries
    // ========================================================================

    @Inject(TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET)
    private readonly getTrustBadgeHandler: QueryHandler<
      GetTrustBadgeQuery,
      TrustBadgeAggregate | null
    >,

    @Inject(TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_ACTIVE)
    private readonly getActiveTrustBadgesHandler: QueryHandler<
      GetActiveTrustBadgesQuery,
      readonly TrustBadgeAggregate[]
    >,

    @Inject(TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_NAME)
    private readonly getTrustBadgeByNameHandler: QueryHandler<
      GetTrustBadgeByNameQuery,
      TrustBadgeAggregate | null
    >,

    @Inject(TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_TYPE)
    private readonly getTrustBadgeByTypeHandler: QueryHandler<
      GetTrustBadgeByTypeQuery,
      TrustBadgeAggregate | null
    >,

    @Inject(TRUST_BADGE_TOKENS.QUERY_HANDLERS.GET_BY_ASSET)
    private readonly getTrustBadgesByAssetHandler: QueryHandler<
      GetTrustBadgesByAssetQuery,
      readonly TrustBadgeAggregate[]
    >,
  ) {}

  // ===========================================================================
  // QUERIES
  // ===========================================================================

  @Get('active')
  @RequirePermissions('trust-badge:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all active trust badges.',
  })
  @ApiOkResponse({
    description: 'Active trust badges retrieved successfully.',
  })
  async getActive(): Promise<TrustBadgeResponse[]> {
    const aggregates = await this.getActiveTrustBadgesHandler.execute(
      new GetActiveTrustBadgesQuery(),
    );

    return TrustBadgeResponseMapper.fromAggregates([...aggregates]);
  }

  @Get('name/:name')
  @RequirePermissions('trust-badge:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a trust badge by name.',
  })
  @ApiOkResponse({
    description: 'Trust badge retrieved successfully.',
  })
  @ApiNotFoundResponse()
  async getByName(
    @Param('name') name: string,
  ): Promise<TrustBadgeResponse | null> {
    const aggregate = await this.getTrustBadgeByNameHandler.execute(
      new GetTrustBadgeByNameQuery(name),
    );

    return aggregate === null
      ? null
      : TrustBadgeResponseMapper.fromAggregate(aggregate);
  }

  @Get('type/:type')
  @RequirePermissions('trust-badge:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a trust badge by type.',
  })
  @ApiOkResponse({
    description: 'Trust badge retrieved successfully.',
  })
  @ApiNotFoundResponse()
  async getByType(
    @Param('type') type: TrustBadgeType,
  ): Promise<TrustBadgeResponse | null> {
    const aggregate = await this.getTrustBadgeByTypeHandler.execute(
      new GetTrustBadgeByTypeQuery(type),
    );

    return aggregate === null
      ? null
      : TrustBadgeResponseMapper.fromAggregate(aggregate);
  }

  @Get('asset/:assetPublicId')
  @RequirePermissions('trust-badge:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get trust badges using an asset.',
  })
  @ApiOkResponse({
    description: 'Trust badges retrieved successfully.',
  })
  async getByAsset(
    @Param('assetPublicId') assetPublicId: string,
  ): Promise<TrustBadgeResponse[]> {
    const aggregates = await this.getTrustBadgesByAssetHandler.execute(
      new GetTrustBadgesByAssetQuery(assetPublicId),
    );

    return TrustBadgeResponseMapper.fromAggregates([...aggregates]);
  }

  @Get(':trustBadgeId')
  @RequirePermissions('trust-badge:read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a trust badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge retrieved successfully.',
  })
  @ApiNotFoundResponse()
  async getById(
    @Param('trustBadgeId') trustBadgeId: string,
  ): Promise<TrustBadgeResponse | null> {
    const aggregate = await this.getTrustBadgeHandler.execute(
      new GetTrustBadgeQuery(trustBadgeId),
    );

    return aggregate === null
      ? null
      : TrustBadgeResponseMapper.fromAggregate(aggregate);
  }

  // ===========================================================================
  // COMMANDS
  // ===========================================================================

  @Post()
  @RequirePermissions('trust-badge:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a trust badge.',
  })
  @ApiCreatedResponse({
    description: 'Trust badge created successfully.',
  })
  async create(@Body() dto: CreateTrustBadgeDto): Promise<TrustBadgeResponse> {
    const aggregate = await this.createTrustBadgeHandler.execute(
      new CreateTrustBadgeCommand(
        dto.type,
        dto.name,
        dto.description,
        dto.assetPublicId,
        CorrelationId.generate(),
      ),
    );

    return TrustBadgeResponseMapper.fromAggregate(aggregate);
  }

  @Patch(':trustBadgeId')
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a trust badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge updated successfully.',
  })
  @ApiNotFoundResponse()
  async update(
    @Param('trustBadgeId') trustBadgeId: string,
    @Body() dto: UpdateTrustBadgeDto,
  ): Promise<{ message: string }> {
    await this.updateTrustBadgeHandler.execute(
      new UpdateTrustBadgeCommand(
        trustBadgeId,
        dto.type,
        dto.name,
        dto.description,
        dto.assetPublicId,
        CorrelationId.generate(),
      ),
    );

    return {
      message: 'Trust badge updated successfully.',
    };
  }

  @Patch(':trustBadgeId/type')
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change a trust badge type.',
  })
  @ApiOkResponse({
    description: 'Trust badge type changed successfully.',
  })
  @ApiNotFoundResponse()
  async changeType(
    @Param('trustBadgeId') trustBadgeId: string,
    @Body() dto: ChangeTrustBadgeTypeDto,
  ): Promise<{ message: string }> {
    await this.changeTrustBadgeTypeHandler.execute(
      new ChangeTrustBadgeTypeCommand(
        trustBadgeId,
        dto.type,
        CorrelationId.generate(),
      ),
    );

    return {
      message: 'Trust badge type changed successfully.',
    };
  }

  @Patch(':trustBadgeId/name')
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change a trust badge name.',
  })
  @ApiOkResponse({
    description: 'Trust badge name changed successfully.',
  })
  @ApiNotFoundResponse()
  async changeName(
    @Param('trustBadgeId') trustBadgeId: string,
    @Body() dto: ChangeTrustBadgeNameDto,
  ): Promise<{ message: string }> {
    await this.changeTrustBadgeNameHandler.execute(
      new ChangeTrustBadgeNameCommand(
        trustBadgeId,
        dto.name,
        CorrelationId.generate(),
      ),
    );

    return {
      message: 'Trust badge name changed successfully.',
    };
  }

  @Patch(':trustBadgeId/description')
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change a trust badge description.',
  })
  @ApiOkResponse({
    description: 'Trust badge description changed successfully.',
  })
  @ApiNotFoundResponse()
  async changeDescription(
    @Param('trustBadgeId') trustBadgeId: string,
    @Body() dto: ChangeTrustBadgeDescriptionDto,
  ): Promise<{ message: string }> {
    await this.changeTrustBadgeDescriptionHandler.execute(
      new ChangeTrustBadgeDescriptionCommand(
        trustBadgeId,
        dto.description,
        CorrelationId.generate(),
      ),
    );

    return {
      message: 'Trust badge description changed successfully.',
    };
  }

  @Patch(':trustBadgeId/asset')
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set a trust badge asset.',
  })
  @ApiOkResponse({
    description: 'Trust badge asset set successfully.',
  })
  @ApiNotFoundResponse()
  async setAsset(
    @Param('trustBadgeId') trustBadgeId: string,
    @Body() dto: SetTrustBadgeAssetDto,
  ): Promise<{ message: string }> {
    await this.setTrustBadgeAssetHandler.execute(
      new SetTrustBadgeAssetCommand(
        trustBadgeId,
        dto.assetPublicId,
        CorrelationId.generate(),
      ),
    );

    return {
      message: 'Trust badge asset set successfully.',
    };
  }

  @Post(':trustBadgeId/activate')
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate a trust badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge activated successfully.',
  })
  @ApiNotFoundResponse()
  async activate(
    @Param('trustBadgeId') trustBadgeId: string,
  ): Promise<{ message: string }> {
    await this.activateTrustBadgeHandler.execute(
      new ActivateTrustBadgeCommand(trustBadgeId, CorrelationId.generate()),
    );

    return {
      message: 'Trust badge activated successfully.',
    };
  }

  @Post(':trustBadgeId/deactivate')
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate a trust badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge deactivated successfully.',
  })
  @ApiNotFoundResponse()
  async deactivate(
    @Param('trustBadgeId') trustBadgeId: string,
  ): Promise<{ message: string }> {
    await this.deactivateTrustBadgeHandler.execute(
      new DeactivateTrustBadgeCommand(trustBadgeId, CorrelationId.generate()),
    );

    return {
      message: 'Trust badge deactivated successfully.',
    };
  }
}
