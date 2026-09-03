// -----------------------------------------------------------------------------
// Identity — Change Email Command
// -----------------------------------------------------------------------------
//
// Application command for changing the email address of an Identity aggregate.
//
// The command represents the intent to replace the current Identity email
// address with a new email address.
//
// The command does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - perform email verification;
// - create or revoke authentication credentials;
// - create or revoke sessions;
// - send email;
// - perform notification or integration side effects;
// - emit IdentityEmailChangedEvent directly.
//
// The application handler loads the IdentityAggregate, invokes:
//
//     identityAggregate.changeEmail(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the Identity lifecycle state;
// - validating the email through IdentityEmail;
// - determining whether the value actually changed;
// - determining the email-change timestamp;
// - changing the Identity email;
// - recording IdentityEmailChangedEvent.
//
// Email verification, authentication consequences, notifications, and other
// downstream behavior remain outside this aggregate.
//
// IMPORTANT:
//
// `changedAt` is intentionally not part of this command.
//
// `changedAt` is a domain fact describing when the mutation actually occurred.
// It is therefore determined by IdentityAggregate rather than supplied by
// the caller, DTO, controller, or application handler.
//
// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Identity Value Objects
// -----------------------------------------------------------------------------

import type {
  IdentityEmail,
  IdentityPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for changing an Identity's email address.
 *
 * The command carries domain-ready value objects rather than raw transport
 * values.
 *
 * DTO-to-domain conversion belongs to the presentation/application boundary.
 *
 * Required domain inputs:
 *
 * - identityPublicId;
 * - email;
 * - correlationId.
 *
 * Optional metadata:
 *
 * - causationId.
 *
 * The command intentionally does not contain `changedAt`.
 *
 * `changedAt` is determined by IdentityAggregate when the email mutation
 * occurs.
 *
 * The application layer is responsible for resolving the IdentityAggregate
 * from the Identity repository using `identityPublicId`.
 */
export class ChangeIdentityEmailCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity aggregate whose email is being changed.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * New email address for the Identity.
     *
     * This is already represented as a domain value object.
     */
    public readonly email: IdentityEmail,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * email-change request.
     */
    public readonly causationId?: string,
  ) {}
}

export default ChangeIdentityEmailCommand;
