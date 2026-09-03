// -----------------------------------------------------------------------------
// Authentication — Create Command
// -----------------------------------------------------------------------------
//
// Application command expressing the intent to create a password-backed
// Authentication for an existing Identity.
//
// Authentication is an independent aggregate representing the authentication
// state and credential lifecycle associated with exactly one Identity.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Password handling:
//
// - plaintext passwords must NEVER enter this command;
// - plaintext password hashing occurs before this command is created;
// - only AuthenticationPasswordHash may be supplied;
// - password verification belongs to PasswordHasher infrastructure;
// - this command contains only the resulting opaque password hash.
//
// The command represents:
//
//     existing Identity
//          │
//          │ identityPublicId
//          ▼
//     new Authentication
//          │
//          │ passwordHash
//          ▼
//     password credential established
//
// Initial domain state is established by the Authentication aggregate/entity:
//
// - AuthenticationStatus = PENDING;
// - passwordVersion = 1;
// - passwordChangedAt = set when the password credential is established;
// - passwordMustChange = false;
// - failedAuthenticationCount = 0;
// - lastFailedAuthenticationAt = undefined;
// - lockedAt = undefined;
// - lockedUntil = undefined;
// - lockReason = undefined;
// - lastAuthenticatedAt = undefined.
//
// The command handler is responsible for:
//
// - enforcing Authentication uniqueness for the Identity;
// - creating the Authentication aggregate;
// - recording AuthenticationCreatedEvent;
// - persisting the aggregate;
// - returning the created aggregate to the application caller.
//
// The domain is responsible for:
//
// - generating AuthenticationPublicId;
// - creating AuthenticationEntity;
// - establishing initial domain state;
// - enforcing Authentication invariants.
//
// This command does NOT:
//
// - accept plaintext passwords;
// - hash passwords;
// - compare passwords;
// - validate Identity domain state;
// - activate Authentication;
// - lock or unlock Authentication;
// - create Session;
// - create Device;
// - create Recovery;
// - create OtpChallenge;
// - send notifications;
// - perform external side effects.
//
// Those responsibilities belong to their respective application workflows,
// aggregate boundaries, domain policies, and infrastructure services.
//
// -----------------------------------------------------------------------------
//
// Cross-domain reference:
//
// identityPublicId is the public reference of an Identity owned by the
// Identity domain.
//
// Authentication does not own or persist the Identity aggregate and therefore
// does not accept an internal Identity persistence ID.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the complete business operation;
// - causationId optionally identifies the command or event that caused this
//   command.
//
// These values are application-level metadata and are propagated to the
// resulting AuthenticationCreatedEvent.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  AuthenticationIdentityPublicId,
  AuthenticationPasswordHash,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a password-backed Authentication aggregate.
 *
 * Required inputs:
 *
 * - identityPublicId;
 * - correlationId;
 * - passwordHash.
 *
 * Optional input:
 *
 * - causationId.
 *
 * The command intentionally contains the cryptographic password hash rather
 * than the plaintext password.
 *
 * The hash must already have been produced by the application's PasswordHasher
 * abstraction before this command is constructed.
 */
export class CreateAuthenticationCommand extends Command {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    /**
     * Public reference to the Identity associated with this Authentication.
     *
     * This is an opaque cross-domain public identifier.
     *
     * Authentication does not resolve or mutate the Identity aggregate inside
     * the domain model.
     */
    public readonly identityPublicId: AuthenticationIdentityPublicId,

    /**
     * Correlation identifier for the complete Authentication creation
     * operation.
     *
     * This metadata is propagated to AuthenticationCreatedEvent.
     */
    public readonly correlationId: string,

    /**
     * Cryptographic password hash used to establish the Authentication
     * credential.
     *
     * This value MUST already have been produced by PasswordHasher
     * infrastructure.
     *
     * Plaintext passwords must never enter the command.
     */
    public readonly passwordHash: AuthenticationPasswordHash,

    /**
     * Optional identifier of the command or event that caused this command.
     *
     * This metadata is propagated to AuthenticationCreatedEvent when present.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
