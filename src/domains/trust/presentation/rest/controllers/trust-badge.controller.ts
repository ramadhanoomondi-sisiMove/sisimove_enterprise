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
  ApiBearerAuth,
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
} from '../../../../../foundation/security/auth';

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

// =============================================================================
// Trust Badge HTTP Controller
// =============================================================================
//
// This controller exposes two categories of Trust Badge endpoints:
//
// 1. PUBLIC DISCOVERY
//
//    These endpoints support:
//
//    - public Trust Profiles;
//    - public traveller reputation surfaces;
//    - landing-page presentation;
//    - displaying available Trust Badge definitions;
//    - resolving badge information without authentication.
//
//    Public queries:
//      GET /trust-badges/active
//      GET /trust-badges/name/:name
//      GET /trust-badges/type/:type
//      GET /trust-badges/asset/:assetPublicId
//      GET /trust-badges/:trustBadgeId
//
// 2. ADMINISTRATIVE MANAGEMENT
//
//    These endpoints mutate the Trust Badge catalogue and therefore require
//    authentication plus the appropriate Trust Badge permission.
//
//    Protected commands:
//      POST  /trust-badges
//      PATCH /trust-badges/:trustBadgeId
//      PATCH /trust-badges/:trustBadgeId/type
//      PATCH /trust-badges/:trustBadgeId/name
//      PATCH /trust-badges/:trustBadgeId/description
//      PATCH /trust-badges/:trustBadgeId/asset
//      POST  /trust-badges/:trustBadgeId/activate
//      POST  /trust-badges/:trustBadgeId/deactivate
//
// Security model for protected operations:
//
//   Access Token
//        ↓
//   JwtAuthGuard
//        ↓
//   PermissionsGuard
//        ↓
//   Required trust-badge permission
//        ↓
//   Application Command Handler
//        ↓
//   TrustBadgeAggregate
//
// Public query model:
//
//   HTTP Request
//        ↓
//   Application Query Handler
//        ↓
//   TrustBadgeAggregate
//        ↓
//   TrustBadgeResponseMapper
//        ↓
//   Public HTTP Response
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding;
// - command/query construction;
// - dispatching application handlers;
// - mapping domain/application results to HTTP responses;
// - declaring authorization requirements for protected operations.
//
// The controller contains no business rules.
//
// Domain behavior remains in:
//
// - TrustBadgeAggregate;
// - Trust Badge entities/value objects;
// - application command handlers;
// - application query handlers.
//
// =============================================================================

@ApiTags('Trust Badges')
@Controller('trust-badges')
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
  // PUBLIC QUERIES
  // ===========================================================================
  //
  // These endpoints intentionally do NOT use:
  //
  //   @ApiBearerAuth()
  //   @UseGuards(JwtAuthGuard, PermissionsGuard)
  //   @RequirePermissions(...)
  //
  // Trust Badge definitions are public catalogue/discovery information.
  // Public Trust Profiles and landing-page surfaces may need to resolve
  // badge definitions without requiring an authenticated session.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Active Trust Badges
  // ---------------------------------------------------------------------------

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all active trust badges.',
    description:
      'Returns all active Trust Badge definitions available for public discovery.',
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

  // ---------------------------------------------------------------------------
  // Get Trust Badge By Name
  // ---------------------------------------------------------------------------

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a trust badge by name.',
    description:
      'Returns a Trust Badge definition matching the supplied public name.',
  })
  @ApiOkResponse({
    description: 'Trust badge retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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

  // ---------------------------------------------------------------------------
  // Get Trust Badge By Type
  // ---------------------------------------------------------------------------

  @Get('type/:type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a trust badge by type.',
    description:
      'Returns a Trust Badge definition matching the supplied Trust Badge type.',
  })
  @ApiOkResponse({
    description: 'Trust badge retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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

  // ---------------------------------------------------------------------------
  // Get Trust Badges By Asset
  // ---------------------------------------------------------------------------

  @Get('asset/:assetPublicId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get trust badges using an asset.',
    description:
      'Returns Trust Badge definitions associated with the specified public asset.',
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

  // ---------------------------------------------------------------------------
  // Get Trust Badge
  // ---------------------------------------------------------------------------

  @Get(':trustBadgeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a trust badge.',
    description:
      'Returns a public Trust Badge definition by its public identifier.',
  })
  @ApiOkResponse({
    description: 'Trust badge retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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
  // PROTECTED COMMANDS
  // ===========================================================================
  //
  // Every mutation explicitly declares its authentication and authorization
  // requirements at method level.
  //
  // This is intentional because the controller contains public GET endpoints.
  // Class-level authentication would incorrectly protect those public routes.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Trust Badge
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a trust badge.',
    description:
      'Creates a new Trust Badge definition. Requires Trust Badge creation permission.',
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

  // ---------------------------------------------------------------------------
  // Update Trust Badge
  // ---------------------------------------------------------------------------

  @Patch(':trustBadgeId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a trust badge.',
    description: 'Updates the definition of an existing Trust Badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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

  // ---------------------------------------------------------------------------
  // Change Trust Badge Type
  // ---------------------------------------------------------------------------

  @Patch(':trustBadgeId/type')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change a trust badge type.',
    description: 'Changes the classification type of an existing Trust Badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge type changed successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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

  // ---------------------------------------------------------------------------
  // Change Trust Badge Name
  // ---------------------------------------------------------------------------

  @Patch(':trustBadgeId/name')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change a trust badge name.',
    description: 'Changes the display name of an existing Trust Badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge name changed successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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

  // ---------------------------------------------------------------------------
  // Change Trust Badge Description
  // ---------------------------------------------------------------------------

  @Patch(':trustBadgeId/description')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change a trust badge description.',
    description: 'Changes the description of an existing Trust Badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge description changed successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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

  // ---------------------------------------------------------------------------
  // Set Trust Badge Asset
  // ---------------------------------------------------------------------------

  @Patch(':trustBadgeId/asset')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set a trust badge asset.',
    description: 'Associates a public asset with an existing Trust Badge.',
  })
  @ApiOkResponse({
    description: 'Trust badge asset set successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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

  // ---------------------------------------------------------------------------
  // Activate Trust Badge
  // ---------------------------------------------------------------------------

  @Post(':trustBadgeId/activate')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate a trust badge.',
    description:
      'Activates an existing Trust Badge so it can be used by the platform.',
  })
  @ApiOkResponse({
    description: 'Trust badge activated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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

  // ---------------------------------------------------------------------------
  // Deactivate Trust Badge
  // ---------------------------------------------------------------------------

  @Post(':trustBadgeId/deactivate')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('trust-badge:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate a trust badge.',
    description:
      'Deactivates an existing Trust Badge so it is no longer available for active use.',
  })
  @ApiOkResponse({
    description: 'Trust badge deactivated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Trust badge was not found.',
  })
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
