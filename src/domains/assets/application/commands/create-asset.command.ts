// -----------------------------------------------------------------------------
// Assets — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating an Asset aggregate.
//
// The command represents the application-level intent:
//
//     Create Asset
//
// The command carries domain-ready value objects rather than raw transport
// primitives.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The command handler is responsible for invoking:
//
//     AssetAggregate.create()
//
// Aggregate created:
//
// AssetAggregate
// └── AssetEntity
//
// Initial aggregate state:
//
// - AssetStatus = UPLOADING
//
// The aggregate itself is responsible for:
//
// - generating AssetPublicId;
// - creating AssetEntity;
// - establishing the initial lifecycle state;
// - validating aggregate invariants;
// - recording AssetCreatedEvent.
//
// This command does NOT:
//
// - upload physical file content;
// - interact with storage providers;
// - create storage objects;
// - mark the Asset as uploaded;
// - mark the Asset as ready;
// - archive the Asset;
// - delete the Asset;
// - change Asset visibility after creation.
//
// Physical storage belongs to AssetStoragePort.
//
// Asset lifecycle belongs to AssetAggregate / AssetEntity.
//
// -----------------------------------------------------------------------------
//
// Correlation / Causation
//
// - correlationId identifies the end-to-end application operation;
// - causationId optionally identifies the command or domain event that caused
//   this command.
//
// These values are application-level metadata.
//
// They are intentionally not part of the Asset domain model.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  AssetIdentityPublicId,
  AssetType,
  AssetCategory,
  AssetVisibility,
  AssetStorageProvider,
  AssetBucket,
  AssetObjectKey,
  AssetOriginalFilename,
  AssetMimeType,
  AssetSizeBytes,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating an Asset aggregate.
 *
 * The command carries all domain information required to establish the Asset
 * metadata before physical content is uploaded.
 *
 * The following are intentionally NOT supplied:
 *
 * - AssetPublicId;
 * - persistence/internal ID;
 * - initial status;
 * - uploadedAt;
 * - archivedAt;
 * - deletedAt;
 * - createdAt;
 * - updatedAt.
 *
 * These are aggregate/domain concerns.
 */
export class CreateAssetCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Identity that owns the Asset.
     *
     * The reference is represented by AssetIdentityPublicId rather than an
     * Identity aggregate or IdentityEntity.
     */
    public readonly ownerIdentityPublicId: AssetIdentityPublicId | undefined,

    /**
     * Asset type.
     */
    public readonly type: AssetType,

    /**
     * Asset category.
     */
    public readonly category: AssetCategory,

    /**
     * Asset visibility.
     */
    public readonly visibility: AssetVisibility,

    /**
     * Storage provider where the physical Asset will be stored.
     */
    public readonly storageProvider: AssetStorageProvider,

    /**
     * Storage bucket or container.
     */
    public readonly bucket: AssetBucket,

    /**
     * Storage object key.
     */
    public readonly objectKey: AssetObjectKey,

    /**
     * Original client-provided filename, when available.
     */
    public readonly originalFilename: AssetOriginalFilename | undefined,

    /**
     * MIME type of the Asset.
     */
    public readonly mimeType: AssetMimeType,

    /**
     * Expected physical Asset size.
     */
    public readonly sizeBytes: AssetSizeBytes,

    /**
     * Correlation identifier for the application operation.
     *
     * This allows the command and resulting domain events to be correlated
     * across the end-to-end application workflow.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
