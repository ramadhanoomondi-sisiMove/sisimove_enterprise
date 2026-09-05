// -----------------------------------------------------------------------------
// Assets — Upload Asset Request DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for the user-facing:
//
//     Upload Asset
//
// The client does not create an Asset record separately and does not need to
// know about Asset aggregate identifiers.
//
// The upload workflow is:
//
//     HTTP multipart/form-data
//              │
//              ▼
//     UploadAssetRequestDto
//              │
//              ▼
//     UploadAssetCommand
//              │
//              ├── physical content
//              ├── derived file metadata
//              └── application/internal metadata
//              │
//              ▼
//     UploadAssetHandler
//              │
//              ├── AssetStoragePort
//              │
//              └── CreateAssetHandler
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// The client supplies:
//
//     physical file
//
// The application derives from the actual uploaded file:
//
//     mimeType
//     sizeBytes
//     originalFilename
//
// The application/internal boundary supplies:
//
//     ownerIdentityPublicId
//     type
//     category
//     visibility
//     storageProvider
//     bucket
//     objectKey
//     correlationId
//     causationId
//
// None of those internal/technical values are exposed through this DTO.
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - AssetPublicId;
// - ownerIdentityPublicId;
// - storageProvider;
// - bucket;
// - objectKey;
// - mimeType;
// - sizeBytes;
// - correlationId;
// - causationId;
// - AssetStatus;
// - uploadedAt;
// - archivedAt;
// - deletedAt;
// - createdAt;
// - updatedAt.
//
// -----------------------------------------------------------------------------
//
// Asset metadata:
//
// The actual uploaded file is authoritative for physical file metadata.
//
// Therefore:
//
//     mimeType
//     sizeBytes
//     originalFilename
//
// are derived by the HTTP/application boundary from the uploaded file.
//
// The client cannot override these values through this DTO.
//
// Asset type/category/visibility are application/domain inputs and are supplied
// by the corresponding upload endpoint/application workflow rather than being
// treated as physical file metadata.
//
// -----------------------------------------------------------------------------
//
// Storage boundary:
//
// The DTO has no knowledge of:
//
// - Local filesystem;
// - Bunny Storage;
// - AWS S3;
// - Google Cloud Storage;
// - Azure Blob Storage;
// - Cloudinary;
// - storage buckets;
// - storage object keys.
//
// Those concerns remain behind AssetStoragePort.
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// Swagger documents the endpoint as accepting:
//
//     multipart/form-data
//
// with a single binary:
//
//     file
//
// The actual multipart file remains a transport concern and is converted by
// the controller into the storage-neutral Readable stream required by
// UploadAssetCommand.
//
// -----------------------------------------------------------------------------
//
// Domain:
//
// AssetAggregate / AssetEntity own:
//
// - Asset identity;
// - lifecycle state;
// - lifecycle transitions;
// - domain invariants;
// - domain events.
//
// Application:
//
// UploadAssetCommand / UploadAssetHandler own:
//
// - upload orchestration;
// - delegation to physical storage;
// - delegation to Asset creation.
//
// Infrastructure:
//
// AssetStoragePort implementation performs the physical storage operation.
//
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// =============================================================================
// DTO
// =============================================================================

/**
 * Public HTTP request DTO for the user-facing Upload Asset operation.
 *
 * The physical file is represented by the HTTP multipart upload.
 *
 * The controller is responsible for converting the transport-level uploaded
 * file into the storage-neutral content stream and deriving its physical
 * metadata.
 */
export class UploadAssetRequestDto {
  // ===========================================================================
  // Physical File
  // ===========================================================================

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Physical Asset file to upload.',
  })
  file!: unknown;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default UploadAssetRequestDto;
