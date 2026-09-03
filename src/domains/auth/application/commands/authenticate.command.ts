// -----------------------------------------------------------------------------
// Authentication — Authenticate Command
// -----------------------------------------------------------------------------
//
// Application command for authenticating a user.
//
// The command represents the application-level intent:
//
//     Authenticate
//
// Authentication is a credential-based security workflow in which a user
// supplies an email address or phone number together with a password.
//
// The supplied email/phone number is used by the application layer to resolve
// the user's Identity and, from that Identity, locate the associated
// Authentication aggregate.
//
// The command handler is responsible for:
//
// - resolving the Identity from the supplied email/phone number;
// - locating the Authentication aggregate associated with that Identity;
// - checking whether authentication is currently permitted;
// - delegating password verification to authentication infrastructure;
// - recording authentication success or failure on the Authentication
//   aggregate;
// - persisting the resulting Authentication aggregate state;
// - dispatching resulting domain events;
// - coordinating Session creation when authentication succeeds.
//
// Aggregate affected:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Identity is used as the credential lookup boundary:
//
// Identity
//     │
//     └── email / phone number
//             │
//             ▼
//       Authentication
//
// AuthenticationAggregate is responsible for:
//
// - exposing whether authentication is currently permitted;
// - recording authentication failures;
// - recording successful authentication;
// - maintaining failure counters;
// - maintaining authentication timestamps;
// - enforcing authentication state invariants;
// - recording AuthenticationFailedEvent;
// - recording AuthenticationAuthenticatedEvent.
//
// Identity is responsible for:
//
// - owning the authoritative email address;
// - owning the authoritative phone number;
// - providing the identity public identifier used to locate related
//   Authentication state.
//
// Security infrastructure is responsible for:
//
// - hashing passwords;
// - comparing the supplied password against the stored password hash;
// - protecting password credentials;
// - implementing the concrete password-hashing algorithm.
//
// Application policy is responsible for:
//
// - deciding the authentication failure threshold;
// - deciding whether a failure should result in locking;
// - deciding lock duration;
// - coordinating subsequent authentication workflows.
//
// This command does NOT:
//
// - hash passwords;
// - compare passwords;
// - access Prisma directly;
// - generate access tokens;
// - generate refresh tokens;
// - create a Session directly;
// - create a Device directly;
// - revoke Sessions;
// - mutate Identity state;
// - persist itself;
// - send notifications.
//
// Those concerns belong to infrastructure services, application handlers,
// policies, and their respective aggregate boundaries.
//
// -----------------------------------------------------------------------------
//
// Credential input:
//
// The command accepts:
//
// - emailOrPhoneNumber;
// - password.
//
// `emailOrPhoneNumber` is a login identifier supplied by the user. It may be
// either the authoritative email address or authoritative phone number of the
// Identity.
//
// `password` is a transient credential.
//
// Raw credentials are application input and MUST NOT be persisted or included
// in domain events.
//
// The command handler must ensure that raw credentials remain within the
// authentication workflow and are never logged, persisted, or published.
//
// -----------------------------------------------------------------------------
//
// Authentication lookup:
//
// The client does NOT provide:
//
// - authenticationPublicId;
// - identityPublicId.
//
// These are internal identifiers and are resolved by the application workflow.
//
// The expected workflow is:
//
//     emailOrPhoneNumber
//             │
//             ▼
//         Identity
//             │
//             │ identityPublicId
//             ▼
//       Authentication
//             │
//             ▼
//       Password verification
//             │
//             ▼
//       Authentication result
//
// This keeps the public login contract focused on user credentials rather
// than internal aggregate identifiers.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the end-to-end authentication operation;
// - causationId optionally identifies the command or domain event that caused
//   this command.
//
// These values are application metadata and are not supplied as credential
// input by the login client.
//
// Direct HTTP authentication requests should generate correlationId at the
// presentation boundary and normally omit causationId.
//
// These values are propagated to resulting domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for authenticating a user using an email address or phone number.
 *
 * Required application inputs:
 *
 * - emailOrPhoneNumber;
 * - password;
 * - correlationId.
 *
 * Optional:
 *
 * - causationId.
 *
 * The command intentionally does NOT accept an AuthenticationPublicId.
 *
 * AuthenticationPublicId is an internal identifier and should not be required
 * from the person logging in. The application workflow resolves the Identity
 * from the supplied email/phone number and then resolves the corresponding
 * Authentication aggregate.
 *
 * The password is intentionally represented as a string because it is a
 * transient credential supplied by the authentication request.
 *
 * It must never be:
 *
 * - persisted;
 * - logged;
 * - published in a domain event;
 * - stored on the Authentication entity.
 */
export class AuthenticateCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Email address or phone number supplied as the login identifier.
     *
     * The application handler uses this value to resolve the authoritative
     * Identity before locating the associated Authentication aggregate.
     *
     * This is intentionally a primitive string at the command boundary.
     *
     * The handler/application layer is responsible for interpreting the value
     * and resolving the appropriate Identity value object.
     */
    public readonly emailOrPhoneNumber: string,

    /**
     * Transient plaintext password supplied by the authentication request.
     *
     * This value must:
     *
     * - never be persisted;
     * - never be logged;
     * - never be included in a domain event;
     * - never be stored on the Authentication entity.
     *
     * Password verification is delegated to authentication infrastructure.
     */
    public readonly password: string,

    /**
     * Correlation identifier for the authentication operation.
     *
     * This value identifies the complete authentication workflow and is
     * propagated to resulting authentication domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * authentication command.
     *
     * This value is propagated to resulting domain events when supplied.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
