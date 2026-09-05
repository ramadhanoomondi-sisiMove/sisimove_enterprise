// -----------------------------------------------------------------------------
// Assets — Archive Command
// -----------------------------------------------------------------------------
//
// Application command for archiving an Asset aggregate.
//
// The command represents the application-level intent:
//
//     Archive Asset
//
// This is an authenticated-owner operation.
//
// The authenticated Identity is supplied by the application boundary and is
// used by the command handler to ensure that the caller is authorized to
// archive the Asset.
//
// The command handler loads the Asset aggregate and delegates the lifecycle
// transition to AssetAggregate.archive().
//
// The Asset aggregate / AssetEntity is responsible for validating whether the
// current lifecycle state permits archiving.
//
// Ownership authorization remains an application concern.
//
// This command does NOT:
//
// - directly modify AssetStatus;
// - directly modify archivedAt;
// - delete physical storage;
// - delete the Asset aggregate;
// - perform Prisma operations;
// - contain authorization/business rules.
//
// -----------------------------------------------------------------------------
//
// Authorization
//
// The authenticated Identity is identified by:
//
//     authenticatedIdentityPublicId
//
// The command handler is responsible for ensuring that the authenticated
// Identity owns the Asset before delegating the lifecycle operation.
//
// The HTTP controller MUST obtain this value from the authenticated JWT
// security context and MUST NOT accept it from the HTTP request body or route.
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
//
// Application flow
//
// HTTP
//   │
//   ▼
// JwtAuthGuard
//   │
//   ▼
// authenticatedIdentityPublicId
//   │
//   ▼
// ArchiveAssetCommand
//   │
//   ▼
// ArchiveAssetHandler
//   │
//   ├── load AssetAggregate
//   │
//   ├── verify ownership
//   │
//   └── aggregate.archive()
//           │
//           ▼
//       repository.save()
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
 * Command for archiving an Asset aggregate owned by the authenticated
 * Identity.
 */
export class ArchiveAssetCommand implements Command {
  public constructor(
    /**
     * Public identifier of the Asset aggregate.
     */
    public readonly publicId: AssetPublicId,

    /**
     * Public identifier of the authenticated Identity performing the operation.
     *
     * This value must originate from the authenticated JWT security context.
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

export default ArchiveAssetCommand;