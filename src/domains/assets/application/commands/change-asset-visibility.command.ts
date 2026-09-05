// -----------------------------------------------------------------------------
// Assets — Change Visibility Command
// -----------------------------------------------------------------------------
//
// Application command for changing the visibility of an Asset.
//
// The command represents the application-level intent:
//
//     Change Asset Visibility
//
// The command handler loads the Asset aggregate, verifies that the
// authenticated Identity owns the Asset, and delegates the state change to
// AssetAggregate / AssetEntity.
//
// The Asset entity remains responsible for enforcing lifecycle mutability
// rules.
//
// This command does NOT:
//
// - directly modify AssetVisibility;
// - directly modify persistence records;
// - modify physical storage;
// - generate URLs;
// - perform authorization checks itself;
// - validate Identity domain state.
//
// The authenticated Identity is supplied by the application boundary so the
// handler can verify Asset ownership before delegating to the domain.
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
  AssetVisibility,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for changing Asset visibility.
 */
export class ChangeAssetVisibilityCommand implements Command {
  public constructor(
    /**
     * Public identifier of the Asset aggregate.
     */
    public readonly publicId: AssetPublicId,

    /**
     * Public identifier of the authenticated Identity requesting the change.
     *
     * This value originates from the authenticated request context.
     */
    public readonly authenticatedIdentityPublicId: AssetIdentityPublicId,

    /**
     * New Asset visibility.
     */
    public readonly visibility: AssetVisibility,

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

export default ChangeAssetVisibilityCommand;
