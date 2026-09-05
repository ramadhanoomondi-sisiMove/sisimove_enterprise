// -----------------------------------------------------------------------------
// Assets — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Asset aggregate operations.
//
// Aggregate:
//
// AssetAggregate
// └── AssetEntity
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion from transport primitives to domain value objects;
// - dispatching application commands and queries;
// - mapping application/domain results to transport responses;
// - extracting authenticated Identity context;
// - extracting uploaded file transport data;
// - generating application message correlation identifiers.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - AssetAggregate;
// - AssetEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - repositories.
//
// Physical storage remains behind:
//
// - AssetStoragePort.
//
// -----------------------------------------------------------------------------
//
// AUTHORIZATION MODEL
//
// Asset operations are divided into two security categories:
//
// 1. Authenticated-owner operations
//
//    These operate on behalf of the authenticated Identity and therefore use:
//
//        JwtAuthGuard
//
//    only.
//
//    Examples:
//
//        POST   /assets
//        GET    /assets/owner
//        PATCH  /assets/:assetPublicId/archive
//        DELETE /assets/:assetPublicId
//        PATCH  /assets/:assetPublicId/visibility
//
//    The authenticated Identity is obtained from:
//
//        request.user.identityPublicId
//
//    Owner-scoped operations must never accept the owner's Identity public ID
//    from the caller.
//
//    Ownership authorization is enforced by the application command handler.
//
// 2. Permission-controlled operations
//
//    These expose broader Asset access and therefore use:
//
//        JwtAuthGuard
//        PermissionsGuard
//
//    with an explicit permission.
//
//    Examples:
//
//        GET /assets
//        GET /assets/category
//        GET /assets/status
//        GET /assets/object-key
//        GET /assets/exists
//        GET /assets/:assetPublicId
//
//    These operations are not restricted to the authenticated Identity's own
//    Asset and therefore require explicit application permissions.
//
// -----------------------------------------------------------------------------
//
// OWNER AUTHORIZATION MODEL
//
// For owner-scoped mutations:
//
//     Controller
//         │
//         ├── JwtAuthGuard
//         │
//         ▼
//     request.user.identityPublicId
//         │
//         ▼
//     Application Command
//         │
//         ├── authenticatedIdentityPublicId
//         │
//         ▼
//     Command Handler
//         │
//         ├── load AssetAggregate
//         ├── verify ownership
//         └── delegate domain operation
//
// The controller authenticates the caller.
//
// The command handler verifies that the authenticated Identity owns the Asset.
//
// The AssetAggregate / AssetEntity then enforces the actual domain operation
// and lifecycle rules.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT APPLICATION BOUNDARY
//
// The user-facing Asset operation is:
//
//     Upload a file
//
// The client does NOT perform:
//
//     Create Asset
//
// as a separate public operation.
//
// Therefore:
//
// POST /assets
//      │
//      ├── file
//      ├── type
//      ├── category
//      └── visibility
//      │
//      ▼
// UploadAssetCommand
//      │
//      ▼
// UploadAssetHandler
//      │
//      ├── AssetStoragePort
//      │
//      └── CreateAssetCommand
//              │
//              ▼
//          CreateAssetHandler
//              │
//              ▼
//          AssetAggregate
//
// CreateAssetHandler remains a separate application operation because it owns
// Asset aggregate creation and persistence, but it is delegated to by the
// UploadAssetHandler rather than being exposed as a separate HTTP operation.
//
// -----------------------------------------------------------------------------
//
// PUBLIC HTTP REPRESENTATION
//
// The client provides only:
//
// - physical file;
// - Asset type;
// - Asset category;
// - optional visibility.
//
// The client does NOT provide:
//
// - internal persistence ID;
// - AssetPublicId during creation;
// - owner Identity public ID;
// - storage provider;
// - bucket;
// - object key;
// - lifecycle status;
// - lifecycle timestamps;
// - correlationId;
// - causationId.
//
// These values are generated, derived, or supplied by the application and
// infrastructure layers.
//
// -----------------------------------------------------------------------------
//
// ASSET UPLOAD
//
// HTTP multipart request
//      │
//      ├── file
//      ├── type
//      ├── category
//      └── visibility
//      │
//      ▼
// JwtAuthGuard
//      │
//      ▼
// authenticated Identity
//      │
//      ▼
// UploadAssetCommand
//      │
//      ▼
// UploadAssetHandler
//      │
//      ├── AssetStoragePort.upload()
//      │
//      └── CreateAssetCommand
//              │
//              ▼
//          CreateAssetHandler
//              │
//              ▼
//          AssetAggregate
//              │
//              ▼
//          markUploaded()
//              │
//              ▼
//          repository.save()
//
// The controller does NOT resolve an existing Asset before upload.
//
// The AssetPublicId does not exist before creation.
//
// The UploadAssetHandler owns the orchestration of the complete operation.
//
// -----------------------------------------------------------------------------
//
// STORAGE METADATA
//
// The controller generates only technical metadata required by the
// UploadAssetCommand:
//
// - storageProvider;
// - bucket;
// - objectKey.
//
// AssetPublicId remains owned by AssetAggregate / AssetEntity.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED IDENTITY
//
// JwtAuthGuard populates request.user from the authenticated JWT.
//
// The Identity public ID is obtained from:
//
//     request.user.identityPublicId
//
// The controller does NOT resolve Identity directly.
//
// -----------------------------------------------------------------------------
//
// ASSET LIFECYCLE
//
// UPLOADING
//     │
//     ▼
// UPLOADED
//     │
//     ▼
// READY
//     │
//     ▼
// ARCHIVED
//
// DELETED is terminal.
//
// Lifecycle validation belongs to AssetAggregate / AssetEntity.
//
// -----------------------------------------------------------------------------
//
// APPLICATION MESSAGE METADATA
//
// Direct HTTP commands begin a new application operation.
//
// Therefore:
//
// - correlationId is generated at the HTTP/application boundary;
// - causationId is undefined because there is no preceding application
//   command/event in the HTTP request.
//
// -----------------------------------------------------------------------------
//
// QUERY DTO ALIGNMENT
//
// The following DTOs are query DTOs:
//
// - GetAssetsByCategoryQueryDto;
// - GetAssetsByStatusQueryDto;
// - GetAssetByObjectKeyQueryDto;
// - CheckAssetExistsQueryDto.
//
// GetAssetsByOwnerQueryDto is retained by the presentation layer if required
// by the existing contract, but the authenticated-owner HTTP operation does
// NOT trust an owner Identity public ID supplied by the caller.
//
// The owner is always derived from:
//
//     request.user.identityPublicId
//
// The Asset public identifier for:
//
//     GET /assets/:assetPublicId
//
// is received directly from @Param() because there is no GetAssetQueryDto
// contract.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';

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
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

// -----------------------------------------------------------------------------
// HTTP
// -----------------------------------------------------------------------------

import type { Request } from 'express';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

import type { AuthenticatedIdentity } from '../../../../../foundation/security/auth/authenticated-identity.interface';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { ASSET_TOKENS } from '../../../application/asset.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  ArchiveAssetCommand,
  ChangeAssetVisibilityCommand,
  DeleteAssetCommand,
  UploadAssetCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  CheckAssetExistsQuery,
  GetAssetByObjectKeyQuery,
  GetAssetQuery,
  GetAssetsByCategoryQuery,
  GetAssetsByOwnerQuery,
  GetAssetsByStatusQuery,
  GetAssetsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { AssetAggregate } from '../../../domain/aggregates/asset.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  AssetBucket,
  AssetCategory,
  AssetIdentityPublicId,
  AssetMimeType,
  AssetObjectKey,
  AssetOriginalFilename,
  AssetPublicId,
  AssetSizeBytes,
  AssetStatus,
  AssetStorageProvider,
  AssetType,
  AssetVisibility,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  ChangeAssetVisibilityRequestDto,
  CreateAssetRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import {
  CheckAssetExistsQueryDto,
  GetAssetByObjectKeyQueryDto,
  GetAssetsByCategoryQueryDto,
  GetAssetsByOwnerQueryDto,
  GetAssetsByStatusQueryDto,
} from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response
// -----------------------------------------------------------------------------

import { AssetResponseMapper } from '../mappers/asset.response.mapper';

import type { AssetResponse } from '../mappers/asset.response.mapper';

// =============================================================================
// Authenticated Request
// =============================================================================

/**
 * JwtAuthGuard populates request.user from the authenticated JWT.
 *
 * The JWT subject is mapped by JwtStrategy to:
 *
 *     request.user.identityPublicId
 *
 * Asset ownership therefore comes exclusively from the authenticated security
 * context and is never accepted from the caller.
 */
interface AuthenticatedRequest extends Request {
  user: AuthenticatedIdentity;
}

// =============================================================================
// Transport Types
// =============================================================================

/**
 * Minimal HTTP representation required from the multipart file interceptor.
 *
 * This deliberately avoids depending on the global Express.Multer namespace.
 *
 * The controller only needs:
 *
 * - original filename;
 * - MIME type;
 * - byte size;
 * - uploaded Buffer.
 */
interface UploadedAssetFile {
  readonly originalname?: string;
  readonly mimetype: string;
  readonly size: number;
  readonly buffer: Buffer;
}

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Asset Command Handlers
    // -------------------------------------------------------------------------

    @Inject(ASSET_TOKENS.COMMAND_HANDLERS.UPLOAD_ASSET)
    private readonly uploadAssetHandler: CommandHandler<
      UploadAssetCommand,
      AssetAggregate
    >,

    @Inject(ASSET_TOKENS.COMMAND_HANDLERS.ARCHIVE_ASSET)
    private readonly archiveAssetHandler: CommandHandler<
      ArchiveAssetCommand,
      AssetAggregate
    >,

    @Inject(ASSET_TOKENS.COMMAND_HANDLERS.DELETE_ASSET)
    private readonly deleteAssetHandler: CommandHandler<
      DeleteAssetCommand,
      AssetAggregate
    >,

    @Inject(ASSET_TOKENS.COMMAND_HANDLERS.CHANGE_ASSET_VISIBILITY)
    private readonly changeAssetVisibilityHandler: CommandHandler<
      ChangeAssetVisibilityCommand,
      AssetAggregate
    >,

    // -------------------------------------------------------------------------
    // Asset Query Handlers
    // -------------------------------------------------------------------------

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_ASSET)
    private readonly getAssetHandler: QueryHandler<
      GetAssetQuery,
      AssetAggregate | null
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS)
    private readonly getAssetsHandler: QueryHandler<
      GetAssetsQuery,
      AssetAggregate[]
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_ASSET_BY_OBJECT_KEY)
    private readonly getAssetByObjectKeyHandler: QueryHandler<
      GetAssetByObjectKeyQuery,
      AssetAggregate | null
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_OWNER)
    private readonly getAssetsByOwnerHandler: QueryHandler<
      GetAssetsByOwnerQuery,
      AssetAggregate[]
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_CATEGORY)
    private readonly getAssetsByCategoryHandler: QueryHandler<
      GetAssetsByCategoryQuery,
      AssetAggregate[]
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_ASSETS_BY_STATUS)
    private readonly getAssetsByStatusHandler: QueryHandler<
      GetAssetsByStatusQuery,
      AssetAggregate[]
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.CHECK_ASSET_EXISTS)
    private readonly checkAssetExistsHandler: QueryHandler<
      CheckAssetExistsQuery,
      boolean
    >,
  ) {}

  // ===========================================================================
  // Asset Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Assets
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List assets',
    description: 'Returns all Asset aggregates available to the caller.',
  })
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('asset:read')
  public async getAll(): Promise<AssetResponse[]> {
    const query = new GetAssetsQuery();

    const aggregates = await this.getAssetsHandler.execute(query);

    return aggregates.map((aggregate) =>
      AssetResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Assets By Owner
  // ---------------------------------------------------------------------------
  //
  // Authenticated-owner operation.
  //
  // The owner is ALWAYS the authenticated Identity.
  //
  // The caller cannot select another Identity by supplying an arbitrary
  // identityPublicId through the HTTP request.
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List my assets',
    description: 'Returns assets belonging to the authenticated Identity.',
  })
  @Get('owner')
  @UseGuards(JwtAuthGuard)
  public async getByOwner(
    @Query() _dto: GetAssetsByOwnerQueryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<AssetResponse[]> {
    const identityPublicId = new AssetIdentityPublicId(
      req.user.identityPublicId,
    );

    const query = new GetAssetsByOwnerQuery(identityPublicId);

    const aggregates = await this.getAssetsByOwnerHandler.execute(query);

    return aggregates.map((aggregate) =>
      AssetResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Assets By Category
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List assets by category',
    description: 'Returns assets matching the specified category.',
  })
  @Get('category')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('asset:read')
  public async getByCategory(
    @Query() dto: GetAssetsByCategoryQueryDto,
  ): Promise<AssetResponse[]> {
    const category = AssetCategory.create(
      dto.category as Parameters<typeof AssetCategory.create>[0],
    );

    const query = new GetAssetsByCategoryQuery(category);

    const aggregates = await this.getAssetsByCategoryHandler.execute(query);

    return aggregates.map((aggregate) =>
      AssetResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Assets By Status
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List assets by status',
    description: 'Returns assets matching the specified lifecycle status.',
  })
  @Get('status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('asset:read')
  public async getByStatus(
    @Query() dto: GetAssetsByStatusQueryDto,
  ): Promise<AssetResponse[]> {
    const status = AssetStatus.create(
      dto.status as Parameters<typeof AssetStatus.create>[0],
    );

    const query = new GetAssetsByStatusQuery(status);

    const aggregates = await this.getAssetsByStatusHandler.execute(query);

    return aggregates.map((aggregate) =>
      AssetResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Asset By Object Key
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get asset by object key',
    description: 'Returns an Asset by its storage object key.',
  })
  @Get('object-key')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('asset:read')
  public async getByObjectKey(
    @Query() dto: GetAssetByObjectKeyQueryDto,
  ): Promise<AssetResponse | null> {
    const objectKey = AssetObjectKey.create(dto.objectKey);

    const query = new GetAssetByObjectKeyQuery(objectKey);

    const aggregate = await this.getAssetByObjectKeyHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return AssetResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Check Asset Exists
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Check whether an asset exists',
    description:
      'Checks Asset existence using exactly one of publicId or objectKey.',
  })
  @Get('exists')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('asset:read')
  public async exists(
    @Query() dto: CheckAssetExistsQueryDto,
  ): Promise<boolean> {
    const criteria: {
      publicId?: AssetPublicId;
      objectKey?: AssetObjectKey;
    } = {};

    if (dto.publicId !== undefined) {
      criteria.publicId = new AssetPublicId(dto.publicId);
    }

    if (dto.objectKey !== undefined) {
      criteria.objectKey = AssetObjectKey.create(dto.objectKey);
    }

    if (criteria.publicId === undefined && criteria.objectKey === undefined) {
      throw new BadRequestException(
        'Either publicId or objectKey is required.',
      );
    }

    if (criteria.publicId !== undefined && criteria.objectKey !== undefined) {
      throw new BadRequestException(
        'Provide either publicId or objectKey, not both.',
      );
    }

    const query = new CheckAssetExistsQuery(criteria);

    return this.checkAssetExistsHandler.execute(query);
  }

  // ---------------------------------------------------------------------------
  // Get Asset
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get an asset',
    description: 'Returns an Asset aggregate by its public ID.',
  })
  @Get(':assetPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('asset:read')
  public async get(
    @Param('assetPublicId') assetPublicId: string,
  ): Promise<AssetResponse | null> {
    const publicId = new AssetPublicId(assetPublicId);

    const query = new GetAssetQuery(publicId);

    const aggregate = await this.getAssetHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return AssetResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Asset Upload
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Upload Asset
  // ---------------------------------------------------------------------------
  //
  // POST /assets
  //
  // Authenticated-owner operation.
  //
  // The authenticated Identity becomes the owner of the newly uploaded Asset.
  //
  // IMPORTANT:
  //
  // This endpoint intentionally uses JwtAuthGuard only.
  //
  // It does NOT require:
  //
  //     PermissionsGuard
  //     @RequirePermissions('asset:upload')
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Upload an asset',
    description:
      'Uploads a physical asset for the authenticated Identity and creates the Asset aggregate.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'type', 'category'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Physical Asset file to upload.',
        },
        type: {
          type: 'string',
          enum: ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER'],
          example: 'IMAGE',
          description: 'Type of Asset being uploaded.',
        },
        category: {
          type: 'string',
          enum: [
            'PROFILE_PHOTO',
            'COVER_PHOTO',
            'AVATAR',
            'GOVERNMENT_ID',
            'DRIVER_LICENSE',
            'PASSPORT',
            'SELFIE',
            'VEHICLE_PHOTO',
            'CHAT_ATTACHMENT',
            'OTHER',
          ],
          example: 'PROFILE_PHOTO',
          description: 'Business category of the Asset.',
        },
        visibility: {
          type: 'string',
          enum: ['PUBLIC', 'PRIVATE'],
          example: 'PRIVATE',
          default: 'PRIVATE',
          description: 'Visibility of the Asset.',
        },
      },
    },
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @Body() dto: CreateAssetRequestDto,
    @UploadedFile() file: UploadedAssetFile | undefined,
    @Req() req: AuthenticatedRequest,
  ): Promise<AssetResponse> {
    // -------------------------------------------------------------------------
    // Validate uploaded HTTP file
    // -------------------------------------------------------------------------

    if (file === undefined) {
      throw new BadRequestException('Asset file is required.');
    }

    if (!Number.isSafeInteger(file.size) || file.size <= 0) {
      throw new BadRequestException('Asset file size is invalid.');
    }

    if (!Buffer.isBuffer(file.buffer)) {
      throw new BadRequestException('Uploaded file content is unavailable.');
    }

    if (
      typeof file.mimetype !== 'string' ||
      file.mimetype.trim().length === 0
    ) {
      throw new BadRequestException('Asset MIME type is invalid.');
    }

    // -------------------------------------------------------------------------
    // Authenticated Identity
    // -------------------------------------------------------------------------

    const ownerIdentityPublicId = new AssetIdentityPublicId(
      req.user.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // Domain value objects
    // -------------------------------------------------------------------------

    const type = AssetType.create(
      dto.type as Parameters<typeof AssetType.create>[0],
    );

    const category = AssetCategory.create(
      dto.category as Parameters<typeof AssetCategory.create>[0],
    );

    const visibility = AssetVisibility.create(
      (dto.visibility ?? 'PRIVATE') as Parameters<
        typeof AssetVisibility.create
      >[0],
    );

    // -------------------------------------------------------------------------
    // Uploaded file metadata
    // -------------------------------------------------------------------------

    const mimeType = AssetMimeType.create(file.mimetype.trim());

    const sizeBytes = AssetSizeBytes.create(file.size);

    const originalFilename =
      typeof file.originalname === 'string' &&
      file.originalname.trim().length > 0
        ? AssetOriginalFilename.create(file.originalname.trim())
        : undefined;

    // -------------------------------------------------------------------------
    // Technical storage metadata
    // -------------------------------------------------------------------------

    const storageProvider = this.createStorageProvider();

    const bucket = this.createStorageBucket();

    const objectKey = this.createObjectKey();

    // -------------------------------------------------------------------------
    // HTTP Buffer -> Readable
    // -------------------------------------------------------------------------

    const content = this.createReadableContent(file);

    // -------------------------------------------------------------------------
    // Application operation metadata
    // -------------------------------------------------------------------------

    const correlationId = randomUUID();

    // -------------------------------------------------------------------------
    // Application command
    // -------------------------------------------------------------------------

    const command = new UploadAssetCommand(
      ownerIdentityPublicId,
      type,
      category,
      visibility,
      storageProvider,
      bucket,
      objectKey,
      originalFilename,
      mimeType,
      sizeBytes,
      content,
      correlationId,
      undefined,
    );

    // -------------------------------------------------------------------------
    // Application execution
    // -------------------------------------------------------------------------

    const aggregate = await this.uploadAssetHandler.execute(command);

    return AssetResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Asset Lifecycle
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Archive Asset
  // ---------------------------------------------------------------------------
  //
  // Authenticated-owner operation.
  //
  // The authenticated Identity is passed into the command.
  //
  // ArchiveAssetHandler verifies that the authenticated Identity owns the Asset.
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Archive an asset',
    description:
      'Archives an Asset belonging to the authenticated Identity according to domain rules.',
  })
  @Patch(':assetPublicId/archive')
  @UseGuards(JwtAuthGuard)
  public async archive(
    @Param('assetPublicId') assetPublicId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<AssetResponse> {
    const authenticatedIdentityPublicId = new AssetIdentityPublicId(
      req.user.identityPublicId,
    );

    const command = new ArchiveAssetCommand(
      new AssetPublicId(assetPublicId),
      authenticatedIdentityPublicId,
      randomUUID(),
      undefined,
    );

    const aggregate = await this.archiveAssetHandler.execute(command);

    return AssetResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Delete Asset
  // ---------------------------------------------------------------------------
  //
  // Authenticated-owner operation.
  //
  // The authenticated Identity is passed into the command.
  //
  // DeleteAssetHandler verifies that the authenticated Identity owns the Asset
  // before coordinating physical storage deletion and the domain lifecycle
  // transition.
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete an asset',
    description:
      'Deletes an Asset belonging to the authenticated Identity and coordinates physical storage deletion.',
  })
  @Delete(':assetPublicId')
  @UseGuards(JwtAuthGuard)
  public async delete(
    @Param('assetPublicId') assetPublicId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<AssetResponse> {
    const authenticatedIdentityPublicId = new AssetIdentityPublicId(
      req.user.identityPublicId,
    );

    const command = new DeleteAssetCommand(
      new AssetPublicId(assetPublicId),
      authenticatedIdentityPublicId,
      randomUUID(),
      undefined,
    );

    const aggregate = await this.deleteAssetHandler.execute(command);

    return AssetResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Change Asset Visibility
  // ---------------------------------------------------------------------------
  //
  // Authenticated-owner operation.
  //
  // The authenticated Identity is passed into the command.
  //
  // ChangeAssetVisibilityHandler verifies that the authenticated Identity owns
  // the Asset before delegating the visibility operation to the aggregate.
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Change asset visibility',
    description:
      'Changes the visibility of an Asset belonging to the authenticated Identity.',
  })
  @Patch(':assetPublicId/visibility')
  @UseGuards(JwtAuthGuard)
  public async changeVisibility(
    @Param('assetPublicId') assetPublicId: string,
    @Body() dto: ChangeAssetVisibilityRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<AssetResponse> {
    const authenticatedIdentityPublicId = new AssetIdentityPublicId(
      req.user.identityPublicId,
    );

    const visibility = AssetVisibility.create(
      dto.visibility as Parameters<typeof AssetVisibility.create>[0],
    );

    const command = new ChangeAssetVisibilityCommand(
      new AssetPublicId(assetPublicId),
      authenticatedIdentityPublicId,
      visibility,
      randomUUID(),
      undefined,
    );

    const aggregate = await this.changeAssetVisibilityHandler.execute(command);

    return AssetResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // HTTP Helpers
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Storage Provider
  // ---------------------------------------------------------------------------

  private createStorageProvider(): AssetStorageProvider {
    const provider = (process.env.ASSET_STORAGE_PROVIDER ?? 'LOCAL')
      .trim()
      .toUpperCase();

    switch (provider) {
      case 'LOCAL':
        return AssetStorageProvider.create('LOCAL');

      case 'BUNNY':
        return AssetStorageProvider.create('OTHER');

      case 'AWS_S3':
        return AssetStorageProvider.create('AWS_S3');

      case 'GOOGLE_CLOUD_STORAGE':
        return AssetStorageProvider.create('GOOGLE_CLOUD_STORAGE');

      case 'AZURE_BLOB':
        return AssetStorageProvider.create('AZURE_BLOB');

      case 'CLOUDINARY':
        return AssetStorageProvider.create('CLOUDINARY');

      case 'OTHER':
        return AssetStorageProvider.create('OTHER');

      default:
        throw new BadRequestException(
          `Unsupported asset storage provider "${provider}".`,
        );
    }
  }

  // ---------------------------------------------------------------------------
  // Storage Bucket
  // ---------------------------------------------------------------------------

  private createStorageBucket(): AssetBucket {
    const bucket = (
      process.env.ASSET_STORAGE_BUCKET ??
      process.env.BUNNY_STORAGE_BUCKET ??
      'assets'
    ).trim();

    if (bucket.length === 0) {
      throw new BadRequestException('Asset storage bucket is not configured.');
    }

    return AssetBucket.create(bucket);
  }

  // ---------------------------------------------------------------------------
  // Object Key
  // ---------------------------------------------------------------------------

  private createObjectKey(): AssetObjectKey {
    return AssetObjectKey.create(randomUUID());
  }

  // ---------------------------------------------------------------------------
  // Uploaded File -> Readable
  // ---------------------------------------------------------------------------

  private createReadableContent(file: UploadedAssetFile): Readable {
    return Readable.from(file.buffer);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AssetsController;
