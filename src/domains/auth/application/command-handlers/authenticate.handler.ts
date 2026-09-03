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
// record  record
// failure success
//     │     │
//     └──┬──┘
//        ▼
// persist Authentication
//        │
//        ▼
// AuthenticationAttemptResult
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITY
//
// This handler answers one application-level question:
//
//     "Are these credentials valid for an Identity that is permitted to
//      authenticate?"
//
// It owns the application orchestration required to answer that question.
//
// Domain state transitions remain inside AuthenticationAggregate.
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
// This is important because AuthenticateLoginHandler must never interpret a
// failed credential attempt as successful authentication and continue with:
//
//     Device → Session → Tokens
//
// -----------------------------------------------------------------------------
//
// SECURITY / ACCOUNT ENUMERATION
//
// The following conditions intentionally produce the same generic result:
//
// - unknown email;
// - unknown phone number;
// - missing Authentication;
// - authentication not currently permitted;
// - invalid password.
//
// The authentication endpoint therefore does not reveal whether a supplied
// identifier corresponds to an existing account.
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
// - perform authorization;
// - perform unrelated external side effects.
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
// The handler depends only on:
//
//     SECURITY_PASSWORD_HASHER
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
// It first determines whether the identifier is a valid email or phone number,
// then delegates to the corresponding repository method.
//
// Repository failures are NOT swallowed while attempting identifier
// classification.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION POLICY
//
// AuthenticationAggregate owns authentication lifecycle policy.
//
// This handler does NOT implement:
//
// - failure thresholds;
// - lock thresholds;
// - lock duration;
// - authentication state transitions.
//
// It delegates state transitions to AuthenticationAggregate.
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
// Unexpected infrastructure/domain failures are exceptions and are allowed to
// propagate.
//
// This distinction is important:
//
//     expected authentication failure
//             ↓
//     AuthenticationFailureResult
//
//     unexpected system failure
//             ↓
//     exception
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
// Authentication — Command
// -----------------------------------------------------------------------------

import type { AuthenticateCommand } from '../commands/authenticate.command';

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
// Identity is a separate bounded context.
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
 *    domain state transition
 *             ↓
 *   AuthenticationRepository.save()
 *             ↓
 * AuthenticationAttemptResult
 *
 * Domain behavior remains inside AuthenticationAggregate.
 *
 * Cross-aggregate coordination occurs only at the application boundary.
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

    @Inject(SECURITY_PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes credential authentication.
   *
   * Expected authentication failures return a discriminated failure result.
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
    //
    // The command carries the transport-level login identifier.
    //
    // Email and phone value objects remain responsible for their own domain
    // validation.
    //
    // -------------------------------------------------------------------------

    const identifier = command.emailOrPhoneNumber.trim();

    if (identifier.length === 0) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 3. Resolve Identity
    // -------------------------------------------------------------------------
    //
    // IdentityRepository intentionally exposes separate methods:
    //
    //     findByEmail()
    //     findByPhoneNumber()
    //
    // resolveIdentity() determines the identifier type and delegates to the
    // appropriate repository method.
    //
    // -------------------------------------------------------------------------

    const identity = await this.resolveIdentity(identifier);

    if (identity === null) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 4. Resolve Authentication
    // -------------------------------------------------------------------------
    //
    // Identity and Authentication remain separate aggregates.
    //
    // Authentication is located using Identity's opaque public identifier.
    //
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
    // AuthenticationAggregate owns the lifecycle predicate determining whether
    // authentication is currently permitted.
    //
    // A prohibited Authentication is intentionally represented using the same
    // generic result as invalid credentials.
    //
    // This prevents account-state enumeration through the login endpoint.
    //
    // -------------------------------------------------------------------------

    if (!authentication.canAuthenticate()) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 6. Obtain stored password hash
    // -------------------------------------------------------------------------
    //
    // The stored password credential belongs to Authentication.
    //
    // The plaintext password remains transient command input.
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
    // Password comparison is delegated entirely to the shared PasswordHasher.
    //
    // No password hashing algorithm is implemented here.
    //
    // -------------------------------------------------------------------------

    const credentialsValid = await this.passwordHasher.compare(
      command.password,
      passwordHash.value,
    );

    // =========================================================================
    // 8A. Authentication failure
    // =========================================================================
    //
    // Record the failed authentication through the aggregate.
    //
    // AuthenticationEntity is never mutated directly.
    //
    // =========================================================================

    if (!credentialsValid) {
      // -----------------------------------------------------------------------
      // Establish one timestamp for this authentication attempt.
      // -----------------------------------------------------------------------

      const failedAt = AuthenticationLastFailedAt.create(new Date());

      // -----------------------------------------------------------------------
      // Calculate the next failure count.
      //
      // AuthenticationAggregate remains responsible for applying its domain
      // transition and enforcing any applicable lifecycle policy.
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
      // IMPORTANT:
      //
      // Never return the AuthenticationAggregate on credential failure.
      //
      // The higher-level login workflow must terminate here.
      // -----------------------------------------------------------------------

      return this.invalidCredentials();
    }

    // =========================================================================
    // 8B. Authentication success
    // =========================================================================
    //
    // Credentials have been successfully verified.
    //
    // Record successful authentication through the aggregate.
    //
    // =========================================================================

    const authenticatedAt = AuthenticationLastAuthenticatedAt.create(
      new Date(),
    );

    authentication.recordSuccessfulAuthentication(
      authenticatedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 9. Persist successful Authentication
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(authentication);

    // -------------------------------------------------------------------------
    // 10. Return explicit authentication success
    // -------------------------------------------------------------------------
    //
    // The success discriminator allows AuthenticateLoginHandler to safely
    // continue into Device, Session, and token creation.
    //
    // -------------------------------------------------------------------------

    return {
      success: true,
      authentication,
    };
  }

  // ===========================================================================
  // Invalid Credentials
  // ===========================================================================

  /**
   * Creates the generic invalid-credentials result.
   *
   * This method intentionally contains no identity-specific information.
   *
   * It is used for:
   *
   * - unknown email;
   * - unknown phone number;
   * - missing Authentication;
   * - authentication not permitted;
   * - invalid password.
   *
   * This prevents account enumeration through the authentication endpoint.
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
   * Important:
   *
   * Value-object construction errors are used only to determine the identifier
   * type.
   *
   * Repository errors are NOT caught here.
   *
   * This prevents infrastructure failures such as database connectivity
   * errors from being incorrectly interpreted as "not an email" and then
   * silently retried as a phone lookup.
   */
  private async resolveIdentity(
    identifier: string,
  ): Promise<Awaited<ReturnType<IdentityRepository['findByEmail']>>> {
    // -------------------------------------------------------------------------
    // 1. Attempt to construct an email value object.
    // -------------------------------------------------------------------------

    let email: IdentityEmail | null = null;

    try {
      email = IdentityEmail.create(identifier);
    } catch {
      // -----------------------------------------------------------------------
      // The identifier is not a valid email.
      //
      // Continue with phone-number classification.
      // -----------------------------------------------------------------------
    }

    // -------------------------------------------------------------------------
    // 2. Email lookup
    // -------------------------------------------------------------------------

    if (email !== null) {
      return this.identityRepository.findByEmail(email);
    }

    // -------------------------------------------------------------------------
    // 3. Attempt to construct a phone-number value object.
    // -------------------------------------------------------------------------

    let phoneNumber: IdentityPhoneNumber;

    try {
      phoneNumber = IdentityPhoneNumber.create(identifier);
    } catch {
      // -----------------------------------------------------------------------
      // The identifier is neither a valid email nor a valid phone number.
      // -----------------------------------------------------------------------

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
