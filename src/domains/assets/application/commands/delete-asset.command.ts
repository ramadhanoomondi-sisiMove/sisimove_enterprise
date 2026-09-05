// -----------------------------------------------------------------------------
// Assets — Delete Command
// -----------------------------------------------------------------------------
//
// Application command for deleting an Asset aggregate.
//
// The command represents the application-level intent:
//
//     Delete Asset
//
// The command handler is responsible for coordinating:
//
// - authenticated-owner verification;
// - Asset aggregate lifecycle transition;
// - Asset aggregate persistence;
// - physical storage cleanup where required by the application workflow.
//
// The Asset aggregate / AssetEntity owns the domain transition to DELETED.
//
// AssetStoragePort owns physical object deletion.
//
// These are separate responsibilities.
//
// This command does NOT:
//
// - directly modify AssetStatus;
// - directly modify deletedAt;
// - directly manipulate Prisma;
// - directly use a storage-provider SDK;
// - contain authorization rules;
// - validate Identity domain state.
//
// The authenticated identity is supplied by the application boundary so the
// handler can verify that the requested Asset belongs to the authenticated
// identity before performing the deletion.
//
// -----------------------------------------------------------------------------
//
// Correlation / Causation
//
// - correlationId identifies the end-to-end application operation;
// - causationId optionally identifies the command or domain event that caused
//   this command.
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
  AssetPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for deleting an Asset aggregate.
 */
export class DeleteAssetCommand implements Command {
  public constructor(
    /**
     * Public identifier of the Asset aggregate.
     */
    public readonly publicId: AssetPublicId,

    /**
     * Public identifier of the authenticated Identity requesting the deletion.
     *
     * This value originates from the authenticated request context.
     */
    public readonly authenticatedIdentityPublicId: AssetIdentityPublicId,

    /**
     * Correlation identifier for the application operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}

export default DeleteAssetCommand;
