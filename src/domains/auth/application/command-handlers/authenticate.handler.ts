// -----------------------------------------------------------------------------
// Authentication — Authenticate Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for credential authentication.
//
// Authentication is initiated using:
//
//     emailOrPhoneNumber + password
//
// The client does NOT provide:
//
// - authenticationPublicId;
// - identityPublicId;
// - correlationId;
// - causationId.
//
// Correlation and causation identifiers are application/infrastructure context
// and are expected to be established before this command reaches the handler.
//
// The application workflow resolves:
//
//     emailOrPhoneNumber
//             │
//        ┌────┴────┐
//        │         │
//      email     phone
//        │         │
//        ▼         ▼
//   IdentityRepository
//        │
//        ▼
//      Identity
//        │
//        │ identityPublicId
//        ▼
//   AuthenticationRepository
//        │
//        ▼
//   AuthenticationAggregate
//        │
//        ▼
//   PasswordHasher.compare()
//        │
//     ┌──┴──┐
//     │     │
//  failure success
//     │     │
//     ▼     ▼
// record   inspect
// failure  lifecycle
//             │
//             ▼
//        PENDING?
//             │
//             ▼
// ActivateAuthenticationCommand
//             │
//             ▼
// ActivateAuthenticationHandler
//             │
//             ▼
// AuthenticationAggregate.activate()
//             │
//             │ PENDING → ACTIVE
//             ▼
// record successful authentication
//             │
//             ▼
// persist Authentication
//             │
//             ▼
// AuthenticationAttemptResult
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION LIFECYCLE
//
// Authentication is a separate bounded context from Identity.
//
// Identity lifecycle:
//
//     PENDING → ACTIVE
//
// Authentication lifecycle:
//
//     PENDING → ACTIVE
//             │
//             ├──→ LOCKED
//             │
//             └──→ DISABLED
//
// Authentication does NOT inherit Identity lifecycle state.
//
// A PENDING Authentication may therefore exist while its Identity is ACTIVE.
//
// PENDING has special significance during the first successful credential
// authentication:
//
//     PENDING
//        │
//        │ valid established password
//        ▼
//     ACTIVE
//
// The transition is delegated to ActivateAuthenticationHandler.
//
// -----------------------------------------------------------------------------
//
// ACTIVATION RULE
//
// A PENDING Authentication is NOT activated merely because:
//
// - an identifier was supplied;
// - an Identity was found;
// - an Authentication aggregate was found;
// - a login request was received.
//
// Activation occurs only after:
//
//     PasswordHasher.compare()
//             │
//             ▼
//        credentialsValid
//             │
//             ▼
//            true
//
// Therefore:
//
//     identifier
//          ≠
//     authentication
//          ≠
//     activation
//
// Valid password possession is required before activation.
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITY
//
// This handler answers one application-level question:
//
//     "Are these credentials valid for an Identity whose Authentication
//      account is eligible for credential authentication?"
//
// It owns application orchestration.
//
// Domain state transitions remain inside AuthenticationAggregate.
//
// Authentication activation is delegated to ActivateAuthenticationHandler.
//
// -----------------------------------------------------------------------------
//
// RESULT SEMANTICS
//
// Success:
//
//     {
//       success: true,
//       authentication: AuthenticationAggregate,
//     }
//
// Failure:
//
//     {
//       success: false,
//       reason: 'INVALID_CREDENTIALS',
//     }
//
// A failed authentication attempt NEVER returns an AuthenticationAggregate.
//
// This prevents AuthenticateLoginHandler from continuing into:
//
//     Device → Session → Tokens
//
// after failed credential verification.
//
// -----------------------------------------------------------------------------
//
// SECURITY / ACCOUNT ENUMERATION
//
// The following expected conditions intentionally produce the same generic
// result:
//
// - unknown email;
// - unknown phone number;
// - missing Authentication;
// - Authentication not permitted;
// - invalid password.
//
// The endpoint therefore does not reveal whether a supplied identifier
// corresponds to an existing account.
//
// -----------------------------------------------------------------------------
//
// AGGREGATE BOUNDARIES
//
// Identity
// └── IdentityEntity
//
// Authentication
// └── AuthenticationEntity
//
// Device
// └── DeviceEntity
//
// Session
// └── SessionEntity
//
// Recovery
// └── RecoveryEntity
//
// OtpChallenge
// └── OtpChallengeEntity
//
// Identity and Authentication remain separate aggregate boundaries.
//
// This handler coordinates between Identity and Authentication without merging
// their aggregate responsibilities.
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
//
// This handler:
//
// - resolves Identity from email or phone;
// - constructs IdentityEmail / IdentityPhoneNumber value objects;
// - resolves Authentication from Identity public ID;
// - verifies Authentication eligibility;
// - delegates password comparison to PasswordHasher;
// - activates PENDING Authentication after successful credential verification;
// - records authentication failure through AuthenticationAggregate;
// - records successful authentication through AuthenticationAggregate;
// - persists AuthenticationAggregate;
// - returns an explicit authentication success/failure result.
//
// -----------------------------------------------------------------------------
//
// THIS HANDLER DOES NOT
//
// - hash passwords;
// - implement password comparison;
// - access Prisma;
// - modify AuthenticationEntity directly;
// - construct domain events directly;
// - mutate Identity;
// - create Devices;
// - create Sessions;
// - generate access tokens;
// - generate refresh tokens;
// - hash refresh tokens;
// - revoke Sessions;
// - send notifications;
// - perform authorization.
//
// -----------------------------------------------------------------------------
//
// PASSWORD SECURITY
//
// PasswordHasher is the shared security abstraction.
//
// Password provisioning:
//
//     PasswordHasher.hash()
//
// Authentication:
//
//     PasswordHasher.compare()
//
// The concrete hashing implementation belongs to infrastructure.
//
// -----------------------------------------------------------------------------
//
// PLAINTEXT PASSWORD
//
// The plaintext password is transient command input.
//
// It MUST NOT:
//
// - be logged;
// - be persisted;
// - be included in domain events;
// - be included in exceptions;
// - be stored on AuthenticationEntity.
//
// It is passed only to PasswordHasher.compare().
//
// -----------------------------------------------------------------------------
//
// IDENTITY LOOKUP
//
// IdentityRepository intentionally exposes separate contact lookups:
//
//     findByEmail(IdentityEmail)
//     findByPhoneNumber(IdentityPhoneNumber)
//
// This handler does not introduce a combined repository method.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION POLICY
//
// AuthenticationAggregate owns authentication state policy.
//
// This handler does NOT implement:
//
// - failure thresholds;
// - lock thresholds;
// - lock duration;
// - Authentication state mutation.
//
// It delegates:
//
// - activation to ActivateAuthenticationHandler;
// - successful-authentication state mutation to AuthenticationAggregate;
// - failed-authentication state mutation to AuthenticationAggregate.
//
// -----------------------------------------------------------------------------
//
// PENDING AUTHENTICATION
//
// PENDING is treated as a bootstrap authentication state.
//
// Therefore:
//
//     PENDING  → password verification permitted
//     ACTIVE   → password verification permitted
//     LOCKED   → rejected
//     DISABLED → rejected
//
// The distinction is important.
//
// `canAuthenticate()` may intentionally represent the normal ACTIVE-state
// authentication policy. Consequently, it MUST NOT be used to reject PENDING
// before password verification in this workflow.
//
// -----------------------------------------------------------------------------
//
// SESSION CREATION
//
// Session is a separate aggregate.
//
// This handler does NOT create Sessions.
//
// Successful credential authentication is only one stage of the complete login
// workflow.
//
// Session creation, Device handling, and token issuance belong to the higher-
// level AuthenticateLoginHandler.
//
// -----------------------------------------------------------------------------
//
// FAILURE SEMANTICS
//
// Credential failures are normal authentication outcomes and therefore return
// AuthenticationFailureResult.
//
// Unexpected application, domain, repository, or infrastructure failures
// propagate as exceptions.
//
// -----------------------------------------------------------------------------
//
// PERSISTENCE NOTE
//
// For an already ACTIVE Authentication:
//
//     authenticate
//          ↓
//     record success
//          ↓
//     save
//
// For a PENDING Authentication:
//
//     authenticate
//          ↓
//     ActivateAuthenticationHandler
//          ↓
//     save ACTIVE
//          ↓
//     record success
//          ↓
//     save successful-authentication state
//
// The two saves are intentionally visible at the current application-handler
// boundary.
//
// This handler does NOT claim that activation and successful-authentication
// recording are one database transaction unless the repository/application
// infrastructure explicitly provides such transactional behavior.
//
// A Unit of Work / transaction boundary can be introduced later if atomic
// first-login activation is required.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type { PasswordHasher } from '../../../../foundation/security/password-hasher.interface';

// -----------------------------------------------------------------------------
// Infrastructure — Security
// -----------------------------------------------------------------------------

import { SECURITY_PASSWORD_HASHER } from '../../../../infrastructure/security';

// -----------------------------------------------------------------------------
// Authentication — Application Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Authentication — Commands
// -----------------------------------------------------------------------------

import type { AuthenticateCommand } from '../commands/authenticate.command';
import { ActivateAuthenticationCommand } from '../commands/activate-authentication.command';

// -----------------------------------------------------------------------------
// Authentication — Application Handlers
// -----------------------------------------------------------------------------

import { ActivateAuthenticationHandler } from './activate-authentication.handler';

// -----------------------------------------------------------------------------
// Authentication — Aggregate
// -----------------------------------------------------------------------------

import { AuthenticationAggregate } from '../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Authentication — Repository
// -----------------------------------------------------------------------------

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

// -----------------------------------------------------------------------------
// Authentication — Exception
// -----------------------------------------------------------------------------

import { AuthenticationException } from '../../domain/exceptions/authentication.exception';

// -----------------------------------------------------------------------------
// Authentication — Value Objects
// -----------------------------------------------------------------------------

import {
  AuthenticationFailureCount,
  AuthenticationFailureReason,
  AuthenticationLastAuthenticatedAt,
  AuthenticationLastFailedAt,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Identity — Application Tokens
// -----------------------------------------------------------------------------
//
// Identity remains a separate bounded context.
//
// Authentication consumes Identity through Identity's existing application
// repository token.
//
// AUTH_TOKENS remains scoped to Authentication dependencies.
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../../../identity/application/identity.tokens';

// -----------------------------------------------------------------------------
// Identity — Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../../identity/domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Identity — Value Objects
// -----------------------------------------------------------------------------

import {
  IdentityEmail,
  IdentityPhoneNumber,
} from '../../../identity/domain/value-objects';

// =============================================================================
// Result Types
// =============================================================================

/**
 * Generic reason returned for every expected credential-authentication failure.
 *
 * The value intentionally does not reveal whether:
 *
 * - the Identity exists;
 * - the supplied identifier is registered;
 * - Authentication exists;
 * - Authentication is currently permitted;
 * - the password is incorrect.
 */
export type AuthenticationFailureReasonCode = 'INVALID_CREDENTIALS';

/**
 * Successful credential-authentication result.
 *
 * The `success: true` discriminator guarantees that the caller has received
 * an authenticated AuthenticationAggregate.
 */
export interface AuthenticationSuccessResult {
  readonly success: true;
  readonly authentication: AuthenticationAggregate;
}

/**
 * Failed credential-authentication result.
 *
 * The AuthenticationAggregate is intentionally absent.
 *
 * This prevents higher-level login orchestration from accidentally continuing
 * into Device, Session, and token creation after failed authentication.
 */
export interface AuthenticationFailureResult {
  readonly success: false;
  readonly reason: AuthenticationFailureReasonCode;
}

/**
 * Result of a credential-authentication attempt.
 *
 * Consumers MUST branch on `success`.
 */
export type AuthenticationAttemptResult =
  AuthenticationSuccessResult | AuthenticationFailureResult;

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles credential authentication.
 *
 * Application workflow:
 *
 *     emailOrPhoneNumber
 *             ↓
 *      Identity identifier
 *             ↓
 *       IdentityRepository
 *             ↓
 *          Identity
 *             ↓
 *       identityPublicId
 *             ↓
 *   AuthenticationRepository
 *             ↓
 *    AuthenticationAggregate
 *             ↓
 *       PasswordHasher
 *             ↓
 *      password valid?
 *        ┌────┴────┐
 *        │         │
 *       no        yes
 *        │         │
 *        ▼         ▼
 *     failure   PENDING?
 *                   │
 *             ┌─────┴─────┐
 *             │           │
 *            yes          no
 *             │           │
 *             ▼           │
 *    ActivateAuthentication│
 *             │           │
 *             ▼           │
 *           ACTIVE ◄───────┘
 *             │
 *             ▼
 *    record successful authentication
 *             │
 *             ▼
 *       persist aggregate
 *             │
 *             ▼
 *   AuthenticationAttemptResult
 *
 * Domain behavior remains inside AuthenticationAggregate.
 *
 * Cross-aggregate coordination and Authentication activation orchestration
 * occur at the application boundary.
 */
@Injectable()
export class AuthenticateHandler implements CommandHandler<
  AuthenticateCommand,
  AuthenticationAttemptResult
> {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Identity Repository
    // -------------------------------------------------------------------------
    //
    // Identity is the authoritative source for email and phone identity
    // attributes.
    //
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly identityRepository: IdentityRepository,

    // -------------------------------------------------------------------------
    // Authentication Repository
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.REPOSITORIES.AUTHENTICATION)
    private readonly authenticationRepository: AuthenticationRepository,

    // -------------------------------------------------------------------------
    // Password Hasher
    // -------------------------------------------------------------------------
    //
    // Shared security abstraction.
    //
    // The concrete implementation is infrastructure-owned.
    //
    // -------------------------------------------------------------------------

    @Inject(SECURITY_PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    // -------------------------------------------------------------------------
    // Activate Authentication Handler
    // -------------------------------------------------------------------------
    //
    // PENDING Authentication activation is delegated to the dedicated
    // application handler.
    //
    // Direct handler orchestration is intentional:
    //
    //     AuthenticateHandler
    //             │
    //             ▼
    //     ActivateAuthenticationHandler
    //             │
    //             ▼
    //     AuthenticationAggregate.activate()
    //
    // No CommandBus is required.
    //
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.ACTIVATE_AUTHENTICATION)
    private readonly activateAuthenticationHandler: ActivateAuthenticationHandler,
  ) {}

  // ===========================================================================

  // Execute

  // ===========================================================================

  /**
   * Executes credential authentication.
   *
   * Expected credential failures return a discriminated failure result.
   *
   * A PENDING Authentication is activated only after successful password
   * verification.
   *
   * Unexpected application, domain, repository, or infrastructure failures
   * propagate as exceptions.
   */
  public async execute(
    command: AuthenticateCommand,
  ): Promise<AuthenticationAttemptResult> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new AuthenticationException('Authenticate command is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Normalize login identifier
    // -------------------------------------------------------------------------

    const identifier = command.emailOrPhoneNumber.trim();

    if (identifier.length === 0) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 3. Resolve Identity
    // -------------------------------------------------------------------------

    const identity = await this.resolveIdentity(identifier);

    if (identity === null) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 4. Resolve Authentication
    // -------------------------------------------------------------------------

    const authentication =
      await this.authenticationRepository.findByIdentityPublicId(
        identity.publicId,
      );

    if (authentication === null) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 5. Verify Authentication eligibility
    // -------------------------------------------------------------------------
    //
    // PENDING is intentionally excluded from the normal canAuthenticate()
    // rejection path.
    //
    // PENDING must reach password verification because successful possession
    // of the established password is what permits activation.
    //
    // Normal authentication eligibility therefore becomes:
    //
    //     PENDING  → verify credentials
    //     ACTIVE   → verify credentials
    //     LOCKED   → reject
    //     DISABLED → reject
    //
    // AuthenticationAggregate remains responsible for the actual lifecycle
    // predicates.
    //
    // -------------------------------------------------------------------------

    if (!authentication.isPending() && !authentication.canAuthenticate()) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 6. Obtain stored password hash
    // -------------------------------------------------------------------------
    //
    // A password hash is required for credential authentication.
    //
    // The plaintext password never enters the aggregate.
    //
    // -------------------------------------------------------------------------

    const passwordHash = authentication.passwordHash;

    if (passwordHash === undefined) {
      throw new AuthenticationException(
        'Authentication does not have an established password.',
      );
    }

    // -------------------------------------------------------------------------
    // 7. Compare password
    // -------------------------------------------------------------------------
    //
    // Password comparison is delegated entirely to PasswordHasher.
    //
    // The plaintext password is never:
    //
    // - persisted;
    // - logged;
    // - published;
    // - stored on the aggregate.
    //
    // -------------------------------------------------------------------------

    const credentialsValid = await this.passwordHasher.compare(
      command.password,
      passwordHash.value,
    );

    // =========================================================================
    // 8A. Authentication failure
    // =========================================================================

    if (!credentialsValid) {
      // -----------------------------------------------------------------------
      // Establish one timestamp for this authentication attempt.
      // -----------------------------------------------------------------------

      const failedAt = AuthenticationLastFailedAt.create(new Date());

      // -----------------------------------------------------------------------
      // Calculate the next failure count.
      // -----------------------------------------------------------------------

      const failureCount = AuthenticationFailureCount.create(
        authentication.failedAuthenticationCount.value + 1,
      );

      // -----------------------------------------------------------------------
      // Generic failure reason.
      // -----------------------------------------------------------------------

      const reason = AuthenticationFailureReason.create('INVALID_CREDENTIALS');

      // -----------------------------------------------------------------------
      // Record domain transition.
      // -----------------------------------------------------------------------
      //
      // AuthenticationAggregate owns the failure-state policy.
      //
      // This handler does not decide:
      //
      // - whether the account becomes LOCKED;
      // - how many failures are allowed;
      // - how long a lock lasts.
      //
      // -----------------------------------------------------------------------

      authentication.recordAuthenticationFailure(
        failureCount,
        failedAt,
        reason,
        command.correlationId,
        command.causationId,
      );

      // -----------------------------------------------------------------------
      // Persist Authentication aggregate.
      // -----------------------------------------------------------------------

      await this.authenticationRepository.save(authentication);

      // -----------------------------------------------------------------------
      // Failed authentication never continues into activation, Device,
      // Session, or token creation.
      // -----------------------------------------------------------------------

      return this.invalidCredentials();
    }

    // =========================================================================
    // 8B. Successful password verification
    // =========================================================================
    //
    // At this point:
    //
    //     credentialsValid === true
    //
    // This is the first point at which a PENDING Authentication is permitted
    // to enter the activation workflow.
    //
    // =========================================================================

    let authenticatedAuthentication = authentication;

    // -------------------------------------------------------------------------
    // 9. Activate PENDING Authentication
    // -------------------------------------------------------------------------
    //
    // PENDING → ACTIVE
    //
    // AuthenticateHandler does NOT call:
    //
    //     authentication.activate()
    //
    // directly.
    //
    // Instead it creates the application command and delegates the lifecycle
    // transition to ActivateAuthenticationHandler.
    //
    // This preserves the same orchestration pattern used by Identity:
    //
    //     AuthenticateHandler
    //             │
    //             ▼
    //     ActivateAuthenticationCommand
    //             │
    //             ▼
    //     ActivateAuthenticationHandler
    //             │
    //             ▼
    //     AuthenticationAggregate.activate()
    //
    // -------------------------------------------------------------------------

    if (authentication.isPending()) {
      const activateCommand = new ActivateAuthenticationCommand(
        authentication.publicId,
        command.correlationId,
        command.causationId,
      );

      authenticatedAuthentication =
        await this.activateAuthenticationHandler.execute(activateCommand);
    }

    // -------------------------------------------------------------------------
    // 10. Record successful authentication
    // -------------------------------------------------------------------------
    //
    // For a PENDING Authentication, use the aggregate returned by the
    // activation handler.
    //
    // That aggregate represents the state after:
    //
    //     PENDING → ACTIVE
    //
    // For an already ACTIVE Authentication, the original aggregate is used.
    //
    // -------------------------------------------------------------------------

    const authenticatedAt = AuthenticationLastAuthenticatedAt.create(
      new Date(),
    );

    authenticatedAuthentication.recordSuccessfulAuthentication(
      authenticatedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 11. Persist successful Authentication
    // -------------------------------------------------------------------------
    //
    // Already ACTIVE:
    //
    //     record success → save
    //
    // PENDING:
    //
    //     activation handler → save ACTIVE
    //                    ↓
    //             record success
    //                    ↓
    //                  save
    //
    // The second save persists the successful-authentication state.
    //
    // Atomicity across these operations is NOT assumed here.
    //
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(authenticatedAuthentication);

    // -------------------------------------------------------------------------
    // 12. Return explicit authentication success
    // -------------------------------------------------------------------------
    //
    // AuthenticateLoginHandler may now safely continue into:
    //
    //     Device → Session → Tokens
    //
    // because this result can only be successful after password verification.
    //
    // -------------------------------------------------------------------------

    return {
      success: true,
      authentication: authenticatedAuthentication,
    };
  }

  // ===========================================================================

  // Invalid Credentials

  // ===========================================================================

  /**
   * Creates the generic invalid-credentials result.
   *
   * This method intentionally contains no identity-specific information.
   */
  private invalidCredentials(): AuthenticationFailureResult {
    return {
      success: false,
      reason: 'INVALID_CREDENTIALS',
    };
  }

  // ===========================================================================

  // Identity Resolution

  // ===========================================================================

  /**
   * Resolves an Identity from an email or phone login identifier.
   *
   * The method intentionally keeps email and phone repository operations
   * separate because IdentityRepository owns separate lookup contracts.
   *
   * Only value-object classification failures are caught.
   *
   * Repository failures are NOT caught and therefore propagate normally.
   */
  private async resolveIdentity(
    identifier: string,
  ): Promise<Awaited<ReturnType<IdentityRepository['findByEmail']>>> {
    // -------------------------------------------------------------------------
    // 1. Attempt email classification
    // -------------------------------------------------------------------------

    let email: IdentityEmail | null = null;

    try {
      email = IdentityEmail.create(identifier);
    } catch {
      // Not an email. Continue with phone-number classification.
    }

    // -------------------------------------------------------------------------
    // 2. Email lookup
    // -------------------------------------------------------------------------

    if (email !== null) {
      return this.identityRepository.findByEmail(email);
    }

    // -------------------------------------------------------------------------
    // 3. Attempt phone-number classification
    // -------------------------------------------------------------------------

    let phoneNumber: IdentityPhoneNumber;

    try {
      phoneNumber = IdentityPhoneNumber.create(identifier);
    } catch {
      return null;
    }

    // -------------------------------------------------------------------------
    // 4. Phone lookup
    // -------------------------------------------------------------------------

    return this.identityRepository.findByPhoneNumber(phoneNumber);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthenticateHandler;
