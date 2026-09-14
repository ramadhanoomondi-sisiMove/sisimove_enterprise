// -----------------------------------------------------------------------------
// sisiMove — Assets
// HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Asset aggregate operations.
//
// Aggregate:
//
// AssetAggregate
// └── AssetEntity
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This controller is responsible only for HTTP transport concerns:
//
// - HTTP route definitions;
// - DTO binding;
// - request validation that is specific to HTTP transport;
// - conversion from transport primitives to domain value objects;
// - extraction of authenticated Identity context;
// - extraction of uploaded file data;
// - creation of application-operation metadata;
// - dispatching application commands and queries;
// - mapping application/domain results to HTTP responses.
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
// Public Asset delivery remains behind:
//
// - GetPublicAssetReferenceQueryHandler;
// - GetPublicAssetContentHandler;
// - AssetDeliveryPort;
// - AssetStoragePort.
//
// -----------------------------------------------------------------------------
//
// SECURITY MODEL
// -----------------------------------------------------------------------------
//
// Asset HTTP operations fall into three categories:
//
// 1. AUTHENTICATED-OWNER OPERATIONS
//
//    These operate on behalf of the currently authenticated Identity.
//
//    They use:
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
//    The owner Identity is ALWAYS obtained from:
//
//        request.user.identityPublicId
//
//    The caller must never provide an arbitrary owner Identity public ID.
//
//    Ownership authorization is enforced by the application handler.
//
//
// 2. PERMISSION-CONTROLLED OPERATIONS
//
//    These expose broader Asset access.
//
//    They use:
//
//        JwtAuthGuard
//        PermissionsGuard
//
//    together with an explicit permission.
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
//    These endpoints are NOT anonymous public Asset endpoints.
//
//
// 3. ANONYMOUS PUBLIC ASSET DELIVERY
//
//    These endpoints expose only information that the Asset application layer
//    has determined is safe for anonymous public consumption.
//
//    Public delivery is deliberately divided into two capabilities:
//
//        GET /assets/public/:assetPublicId/reference
//
//            resolves a public Asset reference.
//
//        GET /assets/public/:assetPublicId
//
//            streams the physical Asset content.
//
//    Neither endpoint requires authentication.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET REFERENCE
// -----------------------------------------------------------------------------
//
// The public Asset reference endpoint returns the deliberately reduced
// consumer-facing representation:
//
//     {
//       publicId,
//       url,
//     }
//
// The controller does not construct the URL.
//
// URL resolution belongs to:
//
//     GetPublicAssetReferenceQueryHandler
//             │
//             └── AssetDeliveryPort
//
// This allows delivery implementations such as:
//
//     LocalAssetDeliveryService
//     BunnyAssetDeliveryService
//
// to determine how the Asset is consumed without exposing their infrastructure
// details through the HTTP controller.
//
// The public reference does NOT expose:
//
// - internal persistence IDs;
// - owner Identity IDs;
// - storage provider;
// - bucket;
// - object key;
// - lifecycle internals;
// - storage implementation metadata.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET CONTENT
// -----------------------------------------------------------------------------
//
// GET /assets/public/:assetPublicId
//
// This endpoint streams the physical content of an Asset that is explicitly:
//
//     - PUBLIC;
//     - usable / READY.
//
// The application handler is responsible for:
//
// - resolving the Asset;
// - verifying public visibility;
// - verifying usability;
// - loading the physical object.
//
// The controller is responsible only for translating the resulting content
// into an HTTP StreamableFile response.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// `/assets/:assetPublicId` is an authenticated Asset-management endpoint.
//
// It must NOT be used by the anonymous public marketplace merely because an
// Asset has:
//
//     visibility = PUBLIC
//
// Public marketplace consumers should receive a deliberately reduced
// PublicAsset representation through the appropriate public read boundary.
//
// For example:
//
//     PublicAsset
//     ├── publicId
//     ├── url
//     └── alt
//
// The public read boundary is responsible for resolving the safe renderable
// representation.
//
// The public Asset URL may ultimately resolve to:
//
//     GET /assets/public/:assetPublicId
//
// while the public reference query may expose that URL through:
//
//     GET /assets/public/:assetPublicId/reference
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET REFERENCE FLOW
// -----------------------------------------------------------------------------
//
//     Browser / Public Read Boundary
//        │
//        │ GET /assets/public/:assetPublicId/reference
//        ▼
//     AssetsController
//        │
//        │ GetPublicAssetReferenceQuery
//        ▼
//     GetPublicAssetReferenceQueryHandler
//        │
//        ├── AssetRepository
//        │      │
//        │      └── AssetAggregate
//        │
//        ├── verify usable
//        ├── verify public
//        │
//        └── AssetDeliveryPort
//               │
//               └── consumer-facing URL
//        │
//        ▼
//     AssetsController
//        │
//        └── { publicId, url }
//        │
//        ▼
//     Public Marketplace
//
// The controller does not construct the URL and does not access storage.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET CONTENT FLOW
// -----------------------------------------------------------------------------
//
//     Browser
//        │
//        │ GET /assets/public/:assetPublicId
//        ▼
//     AssetsController
//        │
//        │ GetPublicAssetContentQuery
//        ▼
//     GetPublicAssetContentHandler
//        │
//        ├── AssetRepository
//        │      │
//        │      └── AssetAggregate
//        │
//        ├── verify PUBLIC
//        │
//        ├── verify READY / usable
//        │
//        └── AssetStoragePort
//               │
//               └── AssetStorageObjectContent
//                       │
//                       └── Readable
//        │
//        ▼
//     AssetsController
//        │
//        ├── Content-Type
//        ├── Content-Length
//        ├── Content-Disposition
//        └── StreamableFile
//        │
//        ▼
//     Browser
//
// The controller never accesses the repository or physical storage directly
// for public delivery.
//
// -----------------------------------------------------------------------------
//
// OWNER AUTHORIZATION MODEL
//
//     HTTP request
//          │
//          ▼
//     JwtAuthGuard
//          │
//          ▼
//     request.user.identityPublicId
//          │
//          ▼
//     Application Command
//          │
//          ▼
//     Command Handler
//          │
//          ├── load AssetAggregate
//          ├── verify ownership
//          └── execute domain operation
//          │
//          ▼
//     AssetAggregate
//
// The controller authenticates the caller.
//
// The application handler authorizes ownership.
//
// The domain enforces Asset lifecycle and business invariants.
//
// -----------------------------------------------------------------------------
//
// UPLOAD APPLICATION BOUNDARY
//
// The user-facing operation is:
//
//     Upload a file
//
// It is NOT:
//
//     Create Asset
//
// Therefore:
//
//     POST /assets
//          │
//          ├── physical file
//          ├── type
//          ├── category
//          └── visibility
//          │
//          ▼
//     UploadAssetCommand
//          │
//          ▼
//     UploadAssetHandler
//          │
//          ├── AssetStoragePort
//          │
//          └── CreateAssetCommand
//                  │
//                  ▼
//             CreateAssetHandler
//                  │
//                  ▼
//             AssetAggregate
//
// CreateAsset remains a separate application operation because it owns Asset
// aggregate creation, but it is orchestrated by UploadAssetHandler rather than
// exposed as a separate HTTP operation.
//
// -----------------------------------------------------------------------------
//
// CLIENT INPUT
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
// Those values are generated, derived, or supplied by application and
// infrastructure layers.
//
// -----------------------------------------------------------------------------
//
// STORAGE METADATA
//
// The controller generates the unique object key because the current
// UploadAssetCommand contract requires one.
//
// However, the controller does NOT decide storage behavior.
//
// Provider and bucket values are configuration/infrastructure concerns exposed
// to the application boundary through the current command contract.
//
// The controller therefore performs only the final transport-to-value-object
// conversion required by UploadAssetCommand.
//
// -----------------------------------------------------------------------------
//
// APPLICATION MESSAGE METADATA
//
// A direct HTTP request starts a new application operation.
//
// Therefore:
//
// - correlationId is generated at the HTTP boundary;
// - causationId is undefined because the request is not caused by a preceding
//   application command/event.
//
// -----------------------------------------------------------------------------
//
// ASSET LIFECYCLE
//
//     UPLOADING
//         │
//         ▼
//     UPLOADED
//         │
//         ▼
//        READY
//         │
//         ▼
//      ARCHIVED
//
// DELETED is terminal.
//
// Lifecycle rules remain inside the Asset domain.
//
// -----------------------------------------------------------------------------
//
// QUERY DTO ALIGNMENT
//
// Query DTOs remain responsible for HTTP query parameters:
//
// - CheckAssetExistsQueryDto;
// - GetAssetByObjectKeyQueryDto;
// - GetAssetsByCategoryQueryDto;
// - GetAssetsByOwnerQueryDto;
// - GetAssetsByStatusQueryDto.
//
// The owner operation does not trust an owner ID supplied by the caller.
//
// GET /assets/owner always derives ownership from:
//
//     request.user.identityPublicId
//
// GET /assets/:assetPublicId receives the public identifier directly through
// @Param() because there is no dedicated GetAssetQueryDto.
//
// GET /assets/public/:assetPublicId/reference receives only the stable Asset
// public identifier. The caller cannot supply storage metadata.
//
// GET /assets/public/:assetPublicId also receives only the stable Asset public
// identifier.
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
  StreamableFile,
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
  GetPublicAssetContentQuery,
  GetPublicAssetReferenceQuery,
} from '../../../application/queries';

import type { PublicAssetReference } from '../../../application/queries/get-public-asset-reference.query';

// -----------------------------------------------------------------------------
// Application — Ports
// -----------------------------------------------------------------------------

import type { AssetStorageObjectContent } from '../../../application/ports/asset-storage.port';

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
 * Request shape after JwtAuthGuard has authenticated the caller.
 *
 * The authentication layer owns the creation of this identity context.
 *
 * The Asset controller merely consumes it.
 */
interface AuthenticatedRequest extends Request {
  user: AuthenticatedIdentity;
}

// =============================================================================
// Uploaded File Transport
// =============================================================================

/**
 * Minimal file representation required by the Asset application boundary.
 *
 * The controller deliberately does not pass the complete Multer/Express file
 * object into the application layer.
 *
 * Only information required by UploadAssetCommand is extracted.
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
    // Commands
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
    // Queries
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

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_REFERENCE)
    private readonly getPublicAssetReferenceHandler: QueryHandler<
      GetPublicAssetReferenceQuery,
      PublicAssetReference
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_CONTENT)
    private readonly getPublicAssetContentHandler: QueryHandler<
      GetPublicAssetContentQuery,
      AssetStorageObjectContent
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // GET /assets
  // ---------------------------------------------------------------------------
  //
  // Permission-controlled Asset administration/read operation.
  //
  // This is NOT a public marketplace endpoint.
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List assets',
    description:
      'Returns Asset aggregates available to the authenticated caller with the required permission.',
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
  // GET /assets/owner
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
  // GET /assets/category
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
  // GET /assets/status
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
  // GET /assets/object-key
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
  // GET /assets/exists
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
  // GET /assets/public/:assetPublicId/reference
  // ---------------------------------------------------------------------------
  //
  // Anonymous public Asset-reference resolution.
  //
  // This endpoint does NOT return AssetResponse.
  //
  // It returns the deliberately reduced public Asset reference:
  //
  //     {
  //       publicId,
  //       url,
  //     }
  //
  // The application handler is responsible for:
  //
  // - resolving the Asset;
  // - verifying that the Asset is usable;
  // - verifying that the Asset is public;
  // - resolving the consumer-facing delivery URL.
  //
  // The controller does not:
  //
  // - query the repository;
  // - inspect Asset visibility;
  // - inspect Asset lifecycle;
  // - construct a delivery URL;
  // - access physical storage;
  // - accept storage metadata from the caller.
  //
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Get a public asset reference',
    description:
      'Returns the public identity and consumer-facing delivery URL of a publicly visible and usable Asset.',
  })
  @Get('public/:assetPublicId/reference')
  public async getPublicReference(
    @Param('assetPublicId') assetPublicId: string,
  ): Promise<PublicAssetReference> {
    const publicId = new AssetPublicId(assetPublicId);

    const query = new GetPublicAssetReferenceQuery(publicId);

    return this.getPublicAssetReferenceHandler.execute(query);
  }

  // ---------------------------------------------------------------------------
  // GET /assets/public/:assetPublicId
  // ---------------------------------------------------------------------------
  //
  // Anonymous public Asset-content delivery.
  //
  // IMPORTANT:
  //
  // This endpoint does NOT return AssetResponse.
  //
  // It returns only the physical content of an Asset that the application
  // layer has determined is both:
  //
  //     PUBLIC
  //     READY / usable
  //
  // There is deliberately NO JwtAuthGuard here.
  //
  // The stable AssetPublicId is sufficient to address the public Asset.
  //
  // The controller does not:
  //
  // - query the repository;
  // - inspect Asset visibility;
  // - inspect Asset lifecycle;
  // - access storage directly;
  // - construct a storage path;
  // - accept bucket/objectKey from the caller.
  //
  // All of those concerns belong behind the application boundary.
  //
  // StreamableFile keeps the HTTP transport concern here while allowing the
  // application handler to return a normal Node Readable stream.
  // ---------------------------------------------------------------------------

  @ApiOperation({
    summary: 'Deliver a public asset',
    description:
      'Streams the content of a publicly visible and usable Asset by public ID.',
  })
  @Get('public/:assetPublicId')
  public async getPublicContent(
    @Param('assetPublicId') assetPublicId: string,
  ): Promise<StreamableFile> {
    const publicId = new AssetPublicId(assetPublicId);

    const query = new GetPublicAssetContentQuery(publicId);

    const content = await this.getPublicAssetContentHandler.execute(query);

    return new StreamableFile(content.content, {
      type: content.mimeType.value,
      length: content.sizeBytes.value,
      disposition: 'inline',
    });
  }

  // ---------------------------------------------------------------------------
  // GET /assets/:assetPublicId
  // ---------------------------------------------------------------------------
  //
  // IMPORTANT:
  //
  // This is an authenticated Asset-management endpoint.
  //
  // It is NOT the public Asset read boundary.
  //
  // The complete AssetResponse may contain storage metadata and therefore must
  // not be exposed anonymously merely because an Asset has PUBLIC visibility.
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get an asset',
    description:
      'Returns an Asset aggregate by public ID for an authenticated caller with the required permission.',
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
  // Upload
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // POST /assets
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Upload an asset',
    description:
      'Uploads a physical file for the authenticated Identity and creates the Asset aggregate.',
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
    // HTTP file validation
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
    // Authenticated owner
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
    // Storage configuration
    // -------------------------------------------------------------------------

    const storageProvider = this.createStorageProvider();

    const bucket = this.createStorageBucket();

    // -------------------------------------------------------------------------
    // Object key
    // -------------------------------------------------------------------------

    const objectKey = this.createObjectKey();

    // -------------------------------------------------------------------------
    // HTTP Buffer -> application Readable
    // -------------------------------------------------------------------------

    const content = this.createReadableContent(file);

    // -------------------------------------------------------------------------
    // Application operation metadata
    // -------------------------------------------------------------------------

    const correlationId = randomUUID();

    // -------------------------------------------------------------------------
    // Upload command
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
  // Lifecycle
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // PATCH /assets/:assetPublicId/archive
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
  // DELETE /assets/:assetPublicId
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
  // PATCH /assets/:assetPublicId/visibility
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
        return AssetStorageProvider.create('BUNNY');

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
