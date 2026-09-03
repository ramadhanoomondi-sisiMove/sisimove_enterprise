// -----------------------------------------------------------------------------
// Identity — Change Phone Number Command
// -----------------------------------------------------------------------------
//
// Application command for changing the phone number of an Identity aggregate.
//
// The command represents the intent to replace the current Identity phone
// number with a new phone number.
//
// The command does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - perform phone-number verification;
// - generate or send OTP challenges;
// - authenticate the Identity;
// - create or revoke authentication credentials;
// - create or revoke sessions;
// - send notifications;
// - perform external integration side effects;
// - emit IdentityPhoneNumberChangedEvent directly.
//
// The application handler loads the IdentityAggregate, invokes:
//
//     identityAggregate.changePhoneNumber(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the Identity lifecycle state;
// - validating the phone number through IdentityPhoneNumber;
// - determining whether the value actually changed;
// - determining the phone-number change timestamp;
// - changing the Identity phone number;
// - recording IdentityPhoneNumberChangedEvent.
//
// Phone verification, OTP, authentication, notification, and other downstream
// consequences remain outside this aggregate.
//
// IMPORTANT:
//
// `changedAt` is intentionally not part of this command.
//
// `changedAt` is a domain fact describing when the mutation actually occurred.
// It is therefore determined by IdentityAggregate rather than supplied by the
// caller, DTO, controller, or application handler.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Identity Value Objects
// -----------------------------------------------------------------------------

import type {
  IdentityPhoneNumber,
  IdentityPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for changing an Identity's phone number.
 *
 * The command carries domain-ready value objects rather than raw transport
 * values.
 *
 * DTO-to-domain conversion belongs to the presentation/application boundary.
 *
 * Required domain inputs:
 *
 * - identityPublicId;
 * - phoneNumber;
 * - correlationId.
 *
 * Optional metadata:
 *
 * - causationId.
 *
 * The command intentionally does not contain `changedAt`.
 *
 * `changedAt` is determined by IdentityAggregate when the phone-number
 * mutation occurs.
 *
 * The application layer is responsible for resolving the IdentityAggregate
 * from the Identity repository using `identityPublicId`.
 */
export class ChangeIdentityPhoneNumberCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity aggregate whose phone number is being
     * changed.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * New phone number for the Identity.
     *
     * This is already represented as a domain value object.
     */
    public readonly phoneNumber: IdentityPhoneNumber,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * phone-number change request.
     */
    public readonly causationId?: string,
  ) {}
}

export default ChangeIdentityPhoneNumberCommand;
