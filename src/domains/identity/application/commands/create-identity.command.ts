// -----------------------------------------------------------------------------
// Identity — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating an Identity aggregate.
//
// The command represents the application-level intent:
//
//     Create Identity
//
// The command carries domain-ready value objects rather than raw transport
// primitives.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
// The command handler is responsible for invoking IdentityAggregate.create().
//
// Aggregate created:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Initial aggregate state:
//
// - IdentityStatus = PENDING
// - IdentityRoleEntity[] = []
//
// The aggregate itself is responsible for:
//
// - generating IdentityPublicId;
// - creating IdentityEntity;
// - establishing the initial lifecycle state;
// - validating aggregate invariants;
// - recording IdentityCreatedEvent.
//
// This command does NOT:
//
// - create authentication credentials;
// - create a session;
// - create a verification;
// - assign roles;
// - create OTP challenges;
// - send notifications;
// - perform external side effects.
//
// Those concerns belong to their respective application workflows and
// aggregate boundaries.
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
// They are intentionally not part of the Identity domain model and do not
// represent user-facing input.
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
  IdentityEmail,
  IdentityPhoneNumber,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating an Identity aggregate.
 *
 * Required domain inputs:
 *
 * - email;
 * - phoneNumber.
 *
 * Application metadata:
 *
 * - correlationId;
 * - causationId.
 *
 * The following are intentionally NOT supplied:
 *
 * - IdentityPublicId;
 * - persistence/internal ID;
 * - initial status;
 * - roles;
 * - lifecycle timestamps.
 *
 * These are aggregate/domain concerns and are established by
 * IdentityAggregate.create().
 *
 * IdentityType is intentionally not included.
 *
 * Every Identity in the current SisiMove platform represents a user, so an
 * identity classification provides no additional business value.
 */
export class CreateIdentityCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Email address of the Identity.
     *
     * This is already represented by the IdentityEmail value object.
     */
    public readonly email: IdentityEmail,

    /**
     * Phone number of the Identity.
     *
     * This is already represented by the IdentityPhoneNumber value object.
     */
    public readonly phoneNumber: IdentityPhoneNumber,

    /**
     * Correlation identifier for the application operation.
     *
     * This value allows commands and resulting domain events belonging to the
     * same end-to-end operation to be correlated.
     *
     * This is application metadata and is not part of the Identity aggregate's
     * business state.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * command.
     *
     * This value is propagated to resulting domain events when supplied.
     *
     * This is application metadata and is not part of the Identity aggregate's
     * business state.
     */
    public readonly causationId?: string,
  ) {}
}
