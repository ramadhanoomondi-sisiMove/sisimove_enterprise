// -----------------------------------------------------------------------------
// Verification Request — Submit Handler
// -----------------------------------------------------------------------------
//
// Application orchestrator for the user-facing verification evidence
// submission operation.
//
// User-facing operation:
//
//     Submit Verification Request
//
// The caller supplies:
//
//     - verification request type;
//     - physical evidence.
//
// The authenticated Identity is supplied by the security/application boundary.
//
// The caller does NOT supply:
//
//     - identityPublicId;
//     - verificationPublicId;
//     - assetPublicId;
//     - verificationRequestPublicId.
//
// The application creates and connects the required resources:
//
//     1. Upload Asset
//     2. Create Verification when required
//     3. Create Verification Request
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
// SubmitVerificationRequestCommand
//             │
//             ▼
//     UploadAssetHandler
//             │
//             ├── AssetStoragePort
//             │
//             └── CreateAssetHandler
//                     │
//                     ▼
//               AssetAggregate
//                     │
//                     ▼
//                AssetPublicId
//                     │
//                     ▼
//        VerificationRepository
//             │
//             ├── existing Verification
//             │
//             └── missing Verification
//                    │
//                    ▼
//        CreateVerificationHandler
//                    │
//                    ▼
//          VerificationAggregate
//                    │
//                    ▼
// CreateVerificationRequestHandler
//                    │
//                    ▼
//       VerificationRequest PENDING
//                    │
//                    ▼
//        VerificationRepository
//                    │
//                    ▼
//          Completed Verification
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - validate the application command;
// - resolve Asset metadata from the verification request type;
// - generate the Asset object key;
// - resolve the configured Asset storage provider;
// - construct Asset value objects;
// - initiate Asset upload through UploadAssetHandler;
// - obtain the resulting Asset public identity;
// - resolve the Identity's Verification aggregate;
// - create Verification when it does not exist;
// - create the VerificationRequest through
//   CreateVerificationRequestHandler;
// - reload the completed Verification aggregate;
// - return the completed Verification aggregate and Asset public identity.
//
// -----------------------------------------------------------------------------
//
// This handler is an ORCHESTRATOR.
//
// It does NOT:
//
// - construct VerificationAggregate;
// - construct VerificationRequestEntity;
// - construct AssetEntity;
// - access Prisma directly;
// - access AssetStoragePort directly;
// - access physical storage directly;
// - access storage SDKs;
// - mutate VerificationEntity directly;
// - mutate Identity;
// - approve Verification;
// - reject Verification;
// - reopen Verification;
// - expire Verification;
// - revoke Verification;
// - approve VerificationRequest;
// - reject VerificationRequest;
// - cancel VerificationRequest;
// - emit domain events directly;
// - generate VerificationPublicId;
// - generate VerificationRequestPublicId;
// - generate AssetPublicId;
// - generate internal persistence identifiers.
//
// Specialized application handlers remain responsible for their own
// operations.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
//     Identity Domain
//          │
//          │ Asset public identity only
//          ▼
//     Assets Domain
//
// The internal Asset persistence identifier never crosses the bounded-context
// boundary.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// VerificationRequest does not own the physical uploaded file.
//
// The Asset belongs to the Assets bounded context.
//
// VerificationRequest stores only the opaque Asset public identity required
// to identify the submitted evidence.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Node.js
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Assets — Application Tokens
// -----------------------------------------------------------------------------

import { ASSET_TOKENS } from '../../../assets/application/asset.tokens';

// -----------------------------------------------------------------------------
// Assets — Commands
// -----------------------------------------------------------------------------

import { UploadAssetCommand } from '../../../assets/application/commands/upload-asset.command';

// -----------------------------------------------------------------------------
// Assets — Application Handler
// -----------------------------------------------------------------------------

import type { UploadAssetHandler } from '../../../assets/application/command-handlers/upload-asset.handler';

// -----------------------------------------------------------------------------
// Assets — Value Objects
// -----------------------------------------------------------------------------

import {
  AssetBucket,
  AssetCategory,
  AssetMimeType,
  AssetObjectKey,
  AssetOriginalFilename,
  AssetSizeBytes,
  AssetStorageProvider,
  AssetType,
  AssetVisibility,
} from '../../../assets/domain/value-objects';

// -----------------------------------------------------------------------------
// Identity — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Identity — Commands
// -----------------------------------------------------------------------------

import { CreateVerificationCommand } from '../commands/create-verification.command';

import { CreateVerificationRequestCommand } from '../commands/create-verification-request.command';

import { SubmitVerificationRequestCommand } from '../commands/submit-verification-request.command';

// -----------------------------------------------------------------------------
// Identity — Application Handlers
// -----------------------------------------------------------------------------

import type { CreateVerificationHandler } from './create-verification.handler';

import type { CreateVerificationRequestHandler } from './create-verification-request.handler';

// -----------------------------------------------------------------------------
// Verification — Aggregate
// -----------------------------------------------------------------------------

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

// -----------------------------------------------------------------------------
// Verification — Repository
// -----------------------------------------------------------------------------

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

// -----------------------------------------------------------------------------
// Verification — Exceptions
// -----------------------------------------------------------------------------

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

// -----------------------------------------------------------------------------
// Verification — Value Objects
// -----------------------------------------------------------------------------

import {
  VerificationRequestAssetPublicId,
  VerificationRequestType,
} from '../../domain/value-objects';

// =============================================================================
// Result
// =============================================================================

/**
 * Result of submitting verification evidence.
 *
 * The Verification aggregate is returned after the VerificationRequest has
 * been persisted.
 *
 * The Asset public identity is returned separately because the Asset belongs
 * to the Assets bounded context.
 */
export interface SubmitVerificationRequestResult {
  readonly verification: VerificationAggregate;
  readonly assetPublicId: string;
}

// =============================================================================
// Handler
// =============================================================================

/**
 * Orchestrates the user-facing verification request submission workflow.
 *
 * User intent:
 *
 *     "Submit my verification evidence."
 *
 * The authenticated identity determines which Verification aggregate owns
 * the request.
 *
 * The caller does not need to create an Asset, create a Verification, or
 * create a VerificationRequest independently.
 */
@Injectable()
export class SubmitVerificationRequestHandler implements CommandHandler<
  SubmitVerificationRequestCommand,
  SubmitVerificationRequestResult
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Assets
    // -------------------------------------------------------------------------

    @Inject(ASSET_TOKENS.COMMAND_HANDLERS.UPLOAD_ASSET)
    private readonly uploadAssetHandler: UploadAssetHandler,

    // -------------------------------------------------------------------------
    // Verification
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_VERIFICATION)
    private readonly createVerificationHandler: CreateVerificationHandler,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_VERIFICATION_REQUEST)
    private readonly createVerificationRequestHandler: CreateVerificationRequestHandler,

    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the complete verification request submission workflow.
   *
   * The operation is intentionally identity-driven.
   *
   * The Verification aggregate is resolved from the authenticated identity
   * rather than from a client-supplied Verification public ID.
   */
  public async execute(
    command: SubmitVerificationRequestCommand,
  ): Promise<SubmitVerificationRequestResult> {
    // =========================================================================
    // 1. Validate command
    // =========================================================================

    this.validateCommand(command);

    // =========================================================================
    // 2. Resolve Asset metadata
    // =========================================================================

    const assetMetadata = this.resolveAssetMetadata(
      command.type,
      command.mimeType,
    );

    // =========================================================================
    // 3. Create Asset value objects
    // =========================================================================

    const objectKey = AssetObjectKey.create(randomUUID());

    const mimeType = AssetMimeType.create(command.mimeType);

    const sizeBytes = AssetSizeBytes.create(command.sizeBytes);

    const originalFilename = this.createOriginalFilename(
      command.originalFilename,
    );

    const storageProvider = this.resolveStorageProvider();

    // =========================================================================
    // 4. Upload Asset
    // =========================================================================
    //
    // UploadAssetHandler owns the complete Asset upload operation:
    //
    //     physical content
    //           ↓
    //     AssetStoragePort
    //           ↓
    //     CreateAssetHandler
    //           ↓
    //     AssetAggregate
    //
    // This orchestrator does not access physical storage directly.
    // =========================================================================

    const uploadedAsset = await this.uploadAssetHandler.execute(
      new UploadAssetCommand(
        command.identityPublicId,
        assetMetadata.type,
        assetMetadata.category,
        AssetVisibility.private(),
        storageProvider,
        assetMetadata.bucket,
        objectKey,
        originalFilename,
        mimeType,
        sizeBytes,
        command.content,
        command.correlationId,
        command.causationId,
      ),
    );

    // =========================================================================
    // 5. Obtain Asset public identity
    // =========================================================================
    //
    // Only the Asset public identity crosses into the Verification context.
    //
    // No internal Asset persistence identifier crosses the boundary.
    // =========================================================================

    if (
      uploadedAsset.publicId === undefined ||
      uploadedAsset.publicId === null
    ) {
      throw new VerificationInvariantException(
        'UploadAssetHandler completed without returning an Asset public ID.',
      );
    }

    const assetPublicId = new VerificationRequestAssetPublicId(
      uploadedAsset.publicId.value,
    );

    // =========================================================================
    // 6. Resolve Verification
    // =========================================================================
    //
    // Verification is one-to-one with Identity.
    //
    // The applicant does not have to create the Verification separately.
    // =========================================================================

    let verification = await this.verificationRepository.findByIdentityPublicId(
      command.identityPublicId,
    );

    // =========================================================================
    // 7. Create Verification when required
    // =========================================================================
    //
    // Creation remains delegated to CreateVerificationHandler.
    //
    // This orchestrator only decides whether creation is required.
    // =========================================================================

    if (verification === null) {
      verification = await this.createVerification(command);
    }

    // =========================================================================
    // 8. Verify aggregate identity
    // =========================================================================

    this.assertIdentityConsistency(
      verification,
      command.identityPublicId.value,
    );

    // =========================================================================
    // 9. Create Verification Request
    // =========================================================================
    //
    // The Asset already exists.
    //
    // The VerificationRequest receives only its public identity.
    //
    // Physical file content never enters the Verification domain.
    // =========================================================================

    await this.createVerificationRequestHandler.execute(
      new CreateVerificationRequestCommand(
        command.identityPublicId,
        command.type,
        assetPublicId,
        command.correlationId,
        command.causationId,
        command.submittedAt,
      ),
    );

    // =========================================================================
    // 10. Reload completed Verification aggregate
    // =========================================================================
    //
    // CreateVerificationRequestHandler intentionally returns void.
    //
    // Reloading therefore obtains the persisted aggregate including the
    // newly-created VerificationRequest.
    // =========================================================================

    const completedVerification =
      await this.verificationRepository.findByIdentityPublicId(
        command.identityPublicId,
      );

    if (completedVerification === null) {
      throw new VerificationInvariantException(
        `Verification was not found after verification request submission for identity ${command.identityPublicId.value}.`,
      );
    }

    // =========================================================================
    // 11. Final identity consistency check
    // =========================================================================

    this.assertIdentityConsistency(
      completedVerification,
      command.identityPublicId.value,
    );

    // =========================================================================
    // 12. Return result
    // =========================================================================

    return {
      verification: completedVerification,
      assetPublicId: assetPublicId.value,
    };
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Validates application-level command requirements.
   *
   * Transport validation remains in the HTTP layer.
   *
   * Domain validation remains in the domain model.
   */
  private validateCommand(command: SubmitVerificationRequestCommand): void {
    if (command === undefined || command === null) {
      throw new VerificationInvariantException(
        'Submit verification request command is required.',
      );
    }

    if (command.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Submit verification request identity public ID is required.',
      );
    }

    if (command.type === undefined) {
      throw new VerificationInvariantException(
        'Submit verification request type is required.',
      );
    }

    if (command.content === undefined || command.content === null) {
      throw new VerificationInvariantException(
        'Submit verification request asset content is required.',
      );
    }

    if (!command.mimeType?.trim()) {
      throw new VerificationInvariantException(
        'Submit verification request MIME type is required.',
      );
    }

    if (!Number.isSafeInteger(command.sizeBytes) || command.sizeBytes < 0) {
      throw new VerificationInvariantException(
        'Submit verification request sizeBytes must be a non-negative safe integer.',
      );
    }

    if (!command.correlationId?.trim()) {
      throw new VerificationInvariantException(
        'Submit verification request correlationId is required.',
      );
    }
  }

  // ===========================================================================
  // Create Verification
  // ===========================================================================

  /**
   * Delegates Verification creation to the dedicated application handler.
   */
  private async createVerification(
    command: SubmitVerificationRequestCommand,
  ): Promise<VerificationAggregate> {
    return this.createVerificationHandler.execute(
      new CreateVerificationCommand(
        command.identityPublicId,
        command.correlationId,
        command.causationId,
        command.submittedAt,
      ),
    );
  }

  // ===========================================================================
  // Identity Consistency
  // ===========================================================================

  /**
   * Ensures that the resolved Verification belongs to the authenticated
   * identity that initiated the operation.
   */
  private assertIdentityConsistency(
    verification: VerificationAggregate,
    expectedIdentityPublicId: string,
  ): void {
    if (verification.identityPublicId.value !== expectedIdentityPublicId) {
      throw new VerificationInvariantException(
        `Verification aggregate identity mismatch: expected "${expectedIdentityPublicId}" but received "${verification.identityPublicId.value}".`,
      );
    }
  }

  // ===========================================================================
  // Original Filename
  // ===========================================================================

  /**
   * Converts an optional transport filename into the Asset domain value
   * object.
   */
  private createOriginalFilename(
    originalFilename: string | undefined,
  ): AssetOriginalFilename | undefined {
    const normalizedFilename = originalFilename?.trim();

    if (!normalizedFilename) {
      return undefined;
    }

    return AssetOriginalFilename.create(normalizedFilename);
  }

  // ===========================================================================
  // Asset Metadata
  // ===========================================================================

  /**
   * Resolves Asset metadata from the verification request semantics.
   *
   * Request type determines the semantic category.
   *
   * MIME type determines the physical AssetType.
   */
  private resolveAssetMetadata(
    requestType: VerificationRequestType,
    mimeType: string,
  ): {
    readonly type: AssetType;
    readonly category: AssetCategory;
    readonly bucket: AssetBucket;
  } {
    return {
      type: this.resolveAssetType(mimeType),
      category: this.resolveAssetCategory(requestType),
      bucket: AssetBucket.create(
        process.env.ASSET_STORAGE_BUCKET?.trim() || 'assets',
      ),
    };
  }

  // ===========================================================================
  // Asset Category
  // ===========================================================================

  /**
   * Maps VerificationRequestType to AssetCategory.
   *
   * VerificationRequestType is a ValueObject, therefore its predicates are
   * used instead of comparing the ValueObject instance with primitive strings.
   */
  private resolveAssetCategory(
    requestType: VerificationRequestType,
  ): AssetCategory {
    if (requestType.isProfilePhoto()) {
      return AssetCategory.profilePhoto();
    }

    if (requestType.isGovernmentId()) {
      return AssetCategory.governmentId();
    }

    if (requestType.isDriverLicense()) {
      return AssetCategory.driverLicense();
    }

    throw new VerificationInvariantException(
      `Unsupported verification request type "${requestType.value}".`,
    );
  }

  // ===========================================================================
  // Asset Type
  // ===========================================================================

  /**
   * Resolves the physical AssetType from the MIME type.
   *
   * Request type answers:
   *
   *     "Why is this evidence being submitted?"
   *
   * MIME type answers:
   *
   *     "What kind of physical asset was uploaded?"
   */
  private resolveAssetType(mimeType: string): AssetType {
    const normalizedMimeType = mimeType.trim().toLowerCase();

    if (normalizedMimeType.startsWith('image/')) {
      return AssetType.image();
    }

    if (normalizedMimeType.startsWith('video/')) {
      return AssetType.video();
    }

    if (normalizedMimeType.startsWith('audio/')) {
      return AssetType.audio();
    }

    if (
      normalizedMimeType === 'application/pdf' ||
      normalizedMimeType.startsWith('text/') ||
      normalizedMimeType.startsWith('application/msword') ||
      normalizedMimeType.startsWith(
        'application/vnd.openxmlformats-officedocument.',
      )
    ) {
      return AssetType.document();
    }

    return AssetType.other();
  }

  // ===========================================================================
  // Storage Provider
  // ===========================================================================

  /**
   * Resolves the configured Asset storage provider.
   *
   * Only providers represented by the frozen AssetStorageProvider value object
   * are accepted.
   *
   * BUNNY is intentionally not referenced here because it is not part of the
   * frozen AssetStorageProvider domain contract.
   */
  private resolveStorageProvider(): AssetStorageProvider {
    const configuredProvider = (process.env.ASSET_STORAGE_PROVIDER ?? 'LOCAL')
      .trim()
      .toUpperCase();

    switch (configuredProvider) {
      case 'LOCAL':
        return AssetStorageProvider.local();

      case 'AWS_S3':
        return AssetStorageProvider.awsS3();

      case 'GOOGLE_CLOUD_STORAGE':
        return AssetStorageProvider.googleCloudStorage();

      case 'AZURE_BLOB':
        return AssetStorageProvider.azureBlob();

      case 'CLOUDINARY':
        return AssetStorageProvider.cloudinary();

      case 'OTHER':
        return AssetStorageProvider.other();

      default:
        throw new VerificationInvariantException(
          `Unsupported ASSET_STORAGE_PROVIDER "${configuredProvider}".`,
        );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SubmitVerificationRequestHandler;
