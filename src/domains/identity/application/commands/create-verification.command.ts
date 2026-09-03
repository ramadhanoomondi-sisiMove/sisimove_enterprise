// -----------------------------------------------------------------------------
// Verification — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// The command represents the intent to create the Verification aggregate for
// an existing Identity.
//
// The command does NOT:
//
// - load the Identity aggregate;
// - create or mutate IdentityEntity;
// - create VerificationEntity directly;
// - construct VerificationRequestEntity;
// - create or submit a VerificationRequest;
// - approve or reject verification;
// - perform verification-provider operations;
// - access asset storage;
// - modify Identity lifecycle state;
// - assign Identity roles;
// - emit VerificationCreatedEvent directly;
// - send notifications;
// - perform external side effects.
//
// The application handler loads/resolves the required application boundary,
// invokes:
//
//     VerificationAggregate.create(...)
//
// and persists the resulting aggregate.
//
// The aggregate is responsible for:
//
// - generating VerificationPublicId;
// - creating VerificationEntity;
// - establishing the initial lifecycle state;
// - establishing the initial verification level;
// - initializing the request collection;
// - enforcing aggregate invariants;
// - recording VerificationCreatedEvent.
//
// -----------------------------------------------------------------------------
//
// Initial state:
//
// status = PENDING
// level  = NONE
// requests = []
//
// No VerificationRequest is created during Verification aggregate creation.
//
// Request creation is a separate application operation:
//
//     VerificationAggregate.createRequest(...)
//
// Request creation represents submission and produces:
//
// - VerificationRequestCreatedEvent
// - VerificationRequestSubmittedEvent
//
// -----------------------------------------------------------------------------
//
// Identity relationship:
//
// Verification belongs to exactly one Identity.
//
// The command therefore carries IdentityPublicId as an opaque cross-aggregate
// public identifier.
//
// The application layer/repository is responsible for enforcing the
// one-to-one Identity → Verification relationship before aggregate creation.
//
// The command does not resolve or mutate the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the complete verification-creation operation;
// - causationId optionally identifies the command/event/operation that caused
//   this creation request.
//
// These values are propagated to the resulting domain event.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `createdAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting creation timestamp.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Verification aggregate.
 *
 * The command carries the domain-ready public identity of the Identity that
 * owns the Verification together with correlation metadata.
 *
 * Required domain inputs:
 *
 * - identityPublicId;
 * - correlationId.
 *
 * Optional inputs:
 *
 * - causationId;
 * - createdAt.
 *
 * The following are intentionally NOT supplied:
 *
 * - VerificationPublicId;
 * - persistence/internal ID;
 * - initial status;
 * - initial verification level;
 * - VerificationRequestEntity[];
 *
 * Those are established by VerificationAggregate.create().
 */
export class CreateVerificationCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity that owns the Verification aggregate.
     *
     * This is an opaque cross-aggregate public identifier and not a
     * persistence/database identifier.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Correlation identifier for the Verification creation operation.
     *
     * This value is propagated to VerificationCreatedEvent.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused this
     * Verification creation request.
     *
     * This value is propagated to the resulting domain event when supplied.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the Verification aggregate is considered
     * created.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly createdAt?: Date,
  ) {}
}
