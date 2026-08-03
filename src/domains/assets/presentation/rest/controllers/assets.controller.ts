// src/domains/assets/presentation/rest/controllers/assets.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { CorrelationId } from '../../../../../foundation/logging/correlation-id';

// -----------------------------------------------------------------------------
// Guards & Security
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../identity/presentation/auth';

// -----------------------------------------------------------------------------
// Requests
// -----------------------------------------------------------------------------

import {
  CreateAssetRequest,
  UploadAssetRequest,
  ChangeAssetVisibilityRequest,
} from '../requests';

// -----------------------------------------------------------------------------
// Responses
// -----------------------------------------------------------------------------

import { AssetResponse, AssetDetailResponse } from '../responses';

// -----------------------------------------------------------------------------
// Response Mappers
// -----------------------------------------------------------------------------

import { AssetResponseMapper } from '../mappers';

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

import {
  ArchiveAssetCommand,
  ChangeAssetVisibilityCommand,
  CreateAssetCommand,
  DeleteAssetCommand,
  UploadAssetCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

import {
  AssetExistsByChecksumQuery,
  AssetExistsByObjectKeyQuery,
  AssetExistsByOwnerIdentityIdQuery,
  AssetExistsByPublicIdQuery,
  FindAssetByObjectKeyQuery,
  FindAssetByOwnerIdentityIdQuery,
  FindAssetByPublicIdQuery,
  FindAssetEntitiesByCategoryQuery,
  FindAssetEntitiesByStatusQuery,
  FindAssetEntitiesByTypeQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Command Handlers
// -----------------------------------------------------------------------------

import {
  ArchiveAssetHandler,
  ChangeAssetVisibilityHandler,
  CreateAssetHandler,
  DeleteAssetHandler,
  UploadAssetHandler,
} from '../../../application/handlers';

// -----------------------------------------------------------------------------
// Query Handlers
// -----------------------------------------------------------------------------

import {
  AssetExistsByChecksumHandler,
  AssetExistsByObjectKeyHandler,
  AssetExistsByOwnerIdentityIdHandler,
  AssetExistsByPublicIdHandler,
  FindAssetByObjectKeyHandler,
  FindAssetByOwnerIdentityIdHandler,
  FindAssetByPublicIdHandler,
  FindAssetEntitiesByCategoryHandler,
  FindAssetEntitiesByStatusHandler,
  FindAssetEntitiesByTypeHandler,
} from '../../../application/query-handlers';
import { AssetNotFoundException } from 'src/domains/assets/domain/exceptions';
import {
  AssetStatus,
  AssetType,
  ChecksumAlgorithm,
  JsonValue,
} from 'src/domains/assets/domain/value-objects';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('assets')
export class AssetsController {
  constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    private readonly createAssetHandler: CreateAssetHandler,
    private readonly uploadAssetHandler: UploadAssetHandler,
    private readonly changeAssetVisibilityHandler: ChangeAssetVisibilityHandler,
    private readonly archiveAssetHandler: ArchiveAssetHandler,
    private readonly deleteAssetHandler: DeleteAssetHandler,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    private readonly findAssetByPublicIdHandler: FindAssetByPublicIdHandler,
    private readonly findAssetByObjectKeyHandler: FindAssetByObjectKeyHandler,
    private readonly findAssetByOwnerIdentityIdHandler: FindAssetByOwnerIdentityIdHandler,

    private readonly assetExistsByPublicIdHandler: AssetExistsByPublicIdHandler,
    private readonly assetExistsByObjectKeyHandler: AssetExistsByObjectKeyHandler,
    private readonly assetExistsByOwnerIdentityIdHandler: AssetExistsByOwnerIdentityIdHandler,
    private readonly assetExistsByChecksumHandler: AssetExistsByChecksumHandler,

    private readonly findAssetEntitiesByCategoryHandler: FindAssetEntitiesByCategoryHandler,
    private readonly findAssetEntitiesByStatusHandler: FindAssetEntitiesByStatusHandler,
    private readonly findAssetEntitiesByTypeHandler: FindAssetEntitiesByTypeHandler,

    // -------------------------------------------------------------------------
    // Response Mappers
    // -------------------------------------------------------------------------

    private readonly assetResponseMapper: AssetResponseMapper,
  ) {}
  // ---------------------------------------------------------------------------
  // Asset Queries
  // ---------------------------------------------------------------------------

  @Get(':publicId')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'Get asset by public identifier.',
  })
  @ApiOkResponse({
    type: AssetDetailResponse,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getByPublicId(
    @Param('publicId') publicId: string,
  ): Promise<AssetDetailResponse> {
    const aggregate = await this.findAssetByPublicIdHandler.execute(
      new FindAssetByPublicIdQuery(publicId, CorrelationId.generate()),
    );

    if (!aggregate) {
      throw new AssetNotFoundException(publicId);
    }

    return this.assetResponseMapper.toDetailResponse(aggregate);
  }

  @Get('object-key/:objectKey')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'Get asset by storage object key.',
  })
  @ApiOkResponse({
    type: AssetDetailResponse,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getByObjectKey(
    @Param('objectKey') objectKey: string,
  ): Promise<AssetDetailResponse> {
    const aggregate = await this.findAssetByObjectKeyHandler.execute(
      new FindAssetByObjectKeyQuery(objectKey, CorrelationId.generate()),
    );

    if (!aggregate) {
      throw new AssetNotFoundException(objectKey);
    }

    return this.assetResponseMapper.toDetailResponse(aggregate);
  }

  @Get('owners/:ownerIdentityId')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'List assets owned by an identity.',
  })
  @ApiOkResponse({
    type: AssetResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async getByOwner(
    @Param('ownerIdentityId') ownerIdentityId: string,
  ): Promise<readonly AssetResponse[]> {
    const assets = await this.findAssetByOwnerIdentityIdHandler.execute(
      new FindAssetByOwnerIdentityIdQuery(
        ownerIdentityId,
        CorrelationId.generate(),
      ),
    );

    return assets.map((asset) => this.assetResponseMapper.toResponse(asset));
  }

  @Get('category/:category')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'List assets by category.',
  })
  @ApiOkResponse({
    type: AssetResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async findByCategory(
    @Param('category') category: string,
  ): Promise<readonly AssetResponse[]> {
    const assets = await this.findAssetEntitiesByCategoryHandler.execute(
      new FindAssetEntitiesByCategoryQuery(category, CorrelationId.generate()),
    );

    return assets.map((asset) => this.assetResponseMapper.toResponse(asset));
  }

  @Get('status/:status')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'List assets by status.',
  })
  @ApiOkResponse({
    type: AssetResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async findByStatus(
    @Param('status') status: string,
  ): Promise<readonly AssetResponse[]> {
    const assets = await this.findAssetEntitiesByStatusHandler.execute(
      new FindAssetEntitiesByStatusQuery(
        status as AssetStatus,
        CorrelationId.generate(),
      ),
    );

    return assets.map((asset) => this.assetResponseMapper.toResponse(asset));
  }

  @Get('type/:type')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'List assets by type.',
  })
  @ApiOkResponse({
    type: AssetResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async findByType(
    @Param('type') type: string,
  ): Promise<readonly AssetResponse[]> {
    const assets = await this.findAssetEntitiesByTypeHandler.execute(
      new FindAssetEntitiesByTypeQuery(
        type as AssetType,
        CorrelationId.generate(),
      ),
    );

    return assets.map((asset) => this.assetResponseMapper.toResponse(asset));
  }
  // ---------------------------------------------------------------------------
  // Asset Existence Queries
  // ---------------------------------------------------------------------------

  @Get(':publicId/exists')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'Determine whether an asset exists.',
  })
  @ApiOkResponse({
    schema: {
      type: 'boolean',
    },
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async existsByPublicId(
    @Param('publicId') publicId: string,
  ): Promise<boolean> {
    return this.assetExistsByPublicIdHandler.execute(
      new AssetExistsByPublicIdQuery(publicId, CorrelationId.generate()),
    );
  }

  @Get('object-key/:objectKey/exists')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'Determine whether an asset exists for the specified object key.',
  })
  @ApiOkResponse({
    schema: {
      type: 'boolean',
    },
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async existsByObjectKey(
    @Param('objectKey') objectKey: string,
  ): Promise<boolean> {
    return this.assetExistsByObjectKeyHandler.execute(
      new AssetExistsByObjectKeyQuery(objectKey, CorrelationId.generate()),
    );
  }

  @Get('owners/:ownerIdentityId/exists')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'Determine whether an identity owns any assets.',
  })
  @ApiOkResponse({
    schema: {
      type: 'boolean',
    },
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async ownerHasAssets(
    @Param('ownerIdentityId') ownerIdentityId: string,
  ): Promise<boolean> {
    return this.assetExistsByOwnerIdentityIdHandler.execute(
      new AssetExistsByOwnerIdentityIdQuery(
        ownerIdentityId,
        CorrelationId.generate(),
      ),
    );
  }

  @Get('checksum/:algorithm/:checksum/exists')
  @RequirePermissions('assets.read')
  @ApiOperation({
    summary: 'Determine whether an asset exists with the specified checksum.',
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async existsByChecksum(
    @Param('algorithm') algorithm: string,
    @Param('checksum') checksum: string,
  ): Promise<boolean> {
    return this.assetExistsByChecksumHandler.execute(
      new AssetExistsByChecksumQuery(
        algorithm as ChecksumAlgorithm,
        checksum,
        CorrelationId.generate(),
      ),
    );
  }
  // ---------------------------------------------------------------------------
  // Asset Commands
  // ---------------------------------------------------------------------------

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions('assets.create')
  @ApiOperation({
    summary: 'Create asset.',
  })
  @ApiCreatedResponse({
    description: 'Asset created successfully.',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async create(
    @Body() request: CreateAssetRequest,
  ): Promise<{ publicId: string }> {
    const publicId = await this.createAssetHandler.execute(
      new CreateAssetCommand(
        request.ownerIdentityPublicId,
        request.type,
        request.category,
        request.storageProvider,
        request.bucket,
        request.objectKey,
        request.originalFilename,
        request.storedFilename,
        request.mimeType,
        request.extension,
        BigInt(request.sizeBytes),
        request.checksumAlgorithm,
        request.checksum,
        request.metadata as JsonValue | undefined,
        CorrelationId.generate(),
      ),
    );

    return {
      publicId,
    };
  }

  // ---------------------------------------------------------------------------
  // Upload Asset
  // ---------------------------------------------------------------------------

  @Post(':publicId/upload')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('assets.upload')
  @ApiOperation({
    summary: 'Mark asset as uploaded.',
  })
  @ApiNoContentResponse({
    description: 'Asset uploaded successfully.',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async upload(
    @Param('publicId') publicId: string,
    @Body() request: UploadAssetRequest,
  ): Promise<void> {
    await this.uploadAssetHandler.execute(
      new UploadAssetCommand(
        publicId,
        request.checksumAlgorithm,
        request.checksum,
        request.metadata,
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Change Visibility
  // ---------------------------------------------------------------------------

  @Patch(':publicId/visibility')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('assets.update')
  @ApiOperation({
    summary: 'Change asset visibility.',
  })
  @ApiNoContentResponse({
    description: 'Asset visibility updated.',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async changeVisibility(
    @Param('publicId') publicId: string,
    @Body() request: ChangeAssetVisibilityRequest,
  ): Promise<void> {
    await this.changeAssetVisibilityHandler.execute(
      new ChangeAssetVisibilityCommand(
        publicId,
        request.visibility,
        new Date(),
        CorrelationId.generate(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Archive Asset
  // ---------------------------------------------------------------------------

  @Patch(':publicId/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('assets.archive')
  @ApiOperation({
    summary: 'Archive asset.',
  })
  @ApiNoContentResponse({
    description: 'Asset archived successfully.',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async archive(@Param('publicId') publicId: string): Promise<void> {
    await this.archiveAssetHandler.execute(
      new ArchiveAssetCommand(publicId, new Date(), CorrelationId.generate()),
    );
  }

  // ---------------------------------------------------------------------------
  // Delete Asset
  // ---------------------------------------------------------------------------

  @Delete(':publicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('assets.delete')
  @ApiOperation({
    summary: 'Delete asset.',
  })
  @ApiNoContentResponse({
    description: 'Asset deleted successfully.',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async delete(@Param('publicId') publicId: string): Promise<void> {
    await this.deleteAssetHandler.execute(
      new DeleteAssetCommand(publicId, new Date(), CorrelationId.generate()),
    );
  }
}
