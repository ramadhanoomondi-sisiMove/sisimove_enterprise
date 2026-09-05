// -----------------------------------------------------------------------------
// Verification Request — Submit Command
// -----------------------------------------------------------------------------
//
// Application command representing the user-facing intent to submit
// verification evidence.
//
// This command is an orchestration command.
//
// It does NOT directly:
// - construct VerificationAggregate;
// - construct VerificationRequestEntity;
// - construct AssetEntity;
// - access storage;
// - persist Prisma models;
// - mutate Identity;
// - emit domain events directly.
//
// The application handler is responsible for orchestrating:
//
//     Upload Asset
//          ↓
//     Create Asset
//          ↓
//     Create Verification when required
//          ↓
//     Create Verification Request
//
// The specialized application commands remain responsible for their own
// operations:
//
//     UploadAssetCommand
//     CreateVerificationCommand
//     CreateVerificationRequestCommand
//
// -----------------------------------------------------------------------------
//
// User-facing intent
// -----------------------------------------------------------------------------
//
// The caller is saying:
//
//     "Submit this piece of verification evidence."
//
// The caller does not need to:
// - create an Asset first;
// - know the storage provider;
// - know the storage bucket;
// - generate the asset object key;
// - create a Verification aggregate first;
// - obtain an Asset public ID first;
// - manually chain the lower-level application commands.
//
// The orchestration handler performs those operations.
//
// -----------------------------------------------------------------------------
//
// Verification Request Flow
// -----------------------------------------------------------------------------
//
//     SubmitVerificationRequestCommand
//                  │
//                  ▼
//          UploadAssetCommand
//                  │
//                  ▼
//          UploadAssetHandler
//                  │
//                  └── CreateAssetHandler
//                          │
//                          ▼
//                    AssetPublicId
//                          │
//                          ▼
//              CreateVerificationCommand
//                          │
//                          ▼
//              CreateVerificationHandler
//                          │
//                          ▼
//          CreateVerificationRequestCommand
//                          │
//                          ▼
//       CreateVerificationRequestHandler
//
// -----------------------------------------------------------------------------
//
// Asset
// -----------------------------------------------------------------------------
//
// The uploaded evidence becomes an Asset.
//
// The command carries the physical content only because the user-facing
// application operation is responsible for initiating the upload.
//
// The Verification domain never receives the physical file content.
//
// After upload/create, only the Asset public identifier crosses into the
// Verification application operation.
//
// -----------------------------------------------------------------------------
//
// Asset Mapping
// -----------------------------------------------------------------------------
//
// VerificationRequestType is mapped to the appropriate Asset metadata by
// the orchestration/application boundary.
//
// Expected mapping:
//
//     PROFILE_PHOTO
//         → AssetType.IMAGE
//         → AssetCategory.PROFILE_PHOTO
//
//     GOVERNMENT_ID
//         → AssetType.IMAGE / DOCUMENT
//         → AssetCategory.GOVERNMENT_ID
//
//     DRIVER_LICENSE
//         → AssetType.IMAGE / DOCUMENT
//         → AssetCategory.DRIVER_LICENSE
//
// The Verification domain does not perform this transport/storage concern.
//
// -----------------------------------------------------------------------------
//
// Identity
// -----------------------------------------------------------------------------
//
// identityPublicId identifies the authenticated Identity.
//
// It is supplied by the authenticated application context.
//
// It is not a database identifier.
//
// It is used to:
//
// - identify the owner of the uploaded Asset;
// - resolve the Identity's Verification aggregate;
// - create the VerificationRequest within that aggregate.
//
// -----------------------------------------------------------------------------
//
// Correlation / Causation
// -----------------------------------------------------------------------------
//
// correlationId identifies the complete submission operation.
//
// The same correlation identifier is propagated to the specialized commands.
//
// causationId optionally identifies the operation that caused this submission.
//
// Specialized handlers remain responsible for propagating these values into
// their respective domain/application event mechanisms.
//
// -----------------------------------------------------------------------------
//
// Timestamp
// -----------------------------------------------------------------------------
//
// submittedAt is optional.
//
// When omitted, the downstream aggregate/application boundary determines the
// effective current timestamp.
//
// -----------------------------------------------------------------------------
//
// Foundation
// -----------------------------------------------------------------------------

import type { Readable } from 'node:stream';

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  IdentityPublicId,
  VerificationRequestType,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * User-facing application command for submitting verification evidence.
 *
 * This command represents the complete verification-request submission intent.
 *
 * The handler orchestrates Asset upload/creation and Verification
 * request creation without moving storage concerns into the Verification
 * domain.
 */
export class SubmitVerificationRequestCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the authenticated Identity submitting the verification
     * evidence.
     *
     * This identifier is also used as the owner identity for the created Asset.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Type of verification evidence being submitted.
     *
     * Examples:
     *
     * - PROFILE_PHOTO;
     * - GOVERNMENT_ID;
     * - DRIVER_LICENSE.
     */
    public readonly type: VerificationRequestType,

    /**
     * Physical content of the verification evidence.
     *
     * The content is consumed only by the application/storage boundary.
     *
     * It must never enter the Verification domain entity or aggregate.
     */
    public readonly content: Readable,

    /**
     * MIME type of the uploaded evidence.
     *
     * This is used when creating the Asset.
     */
    public readonly mimeType: string,

    /**
     * Size of the uploaded evidence in bytes.
     *
     * This is used when creating the Asset.
     */
    public readonly sizeBytes: number,

    /**
     * Original filename supplied by the upload transport.
     *
     * This value is application/storage metadata and is not part of the
     * VerificationRequest domain identity.
     */
    public readonly originalFilename: string | undefined,

    /**
     * Correlation identifier for the complete verification submission
     * operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused this
     * submission.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the verification request is considered
     * submitted.
     */
    public readonly submittedAt?: Date,
  ) {}
}
