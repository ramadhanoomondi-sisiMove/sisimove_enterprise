// -----------------------------------------------------------------------------
// Authentication — Authenticate Login Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for the complete user login workflow.
//
// Login is initiated using:
//
//     emailOrPhoneNumber
//     password
//     device information
//     session request context
//
// The client does NOT provide:
//
// - identityPublicId;
// - authenticationPublicId;
// - devicePublicId;
// - sessionPublicId;
// - refreshToken;
// - refreshTokenHash;
// - tokenFamilyPublicId.
//
// -----------------------------------------------------------------------------
//
// WORKFLOW
//
//     AuthenticateLoginCommand
//              │
//              ▼
//     AuthenticateHandler
//              │
//         ┌────┴────┐
//         │         │
//      failure    success
//         │         │
//         ▼         ▼
//       return   Authentication
//                    │
//                    ▼
//                 Device
//                    │
//                    ▼
//                 Session
//                    │
//             ┌──────┴──────┐
//             │             │
//             ▼             ▼
//        access token   refresh token
//             │             │
//             └──────┬──────┘
//                    ▼
//        AuthenticateLoginResult
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
//
// This handler:
//
// - delegates credential authentication;
// - terminates immediately when credentials fail;
// - obtains the authenticated Identity reference from Authentication;
// - resolves or creates the Device;
// - validates existing Device lifecycle state;
// - records Device activity;
// - generates a raw refresh token;
// - hashes the refresh token;
// - creates a new refresh-token family;
// - creates the Session;
// - generates the access JWT;
// - persists the Session;
// - returns the complete authenticated login result.
//
// -----------------------------------------------------------------------------
//
// THIS HANDLER DOES NOT
//
// - resolve Identity directly;
// - compare passwords;
// - hash passwords;
// - access Prisma;
// - mutate AuthenticationEntity directly;
// - mutate Identity;
// - call CreateDeviceHandler;
// - call CreateSessionHandler;
// - implement JWT generation;
// - implement refresh-token hashing;
// - persist raw refresh tokens;
// - revoke other Sessions;
// - send notifications;
// - perform authorization.
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
// Identity, Authentication, Device, and Session remain separate aggregates.
//
// This handler coordinates those aggregates at the application boundary.
//
// -----------------------------------------------------------------------------
//
// SECURITY
//
// The raw refresh token exists only inside this application workflow.
//
// It MUST NOT:
//
// - enter SessionEntity;
// - enter SessionAggregate;
// - be persisted;
// - be included in domain events;
// - be logged.
//
// Only SessionRefreshTokenHash crosses into the Session aggregate.
//
// -----------------------------------------------------------------------------
//
// TOKEN FAMILY
//
// Every fresh login creates a new refresh-token family.
//
// Refresh-token rotation performed later operates within the established
// Session/token-family lifecycle.
//
// -----------------------------------------------------------------------------
//
// CORRELATION / CAUSATION
//
// correlationId identifies the complete login operation.
//
// causationId optionally identifies the command/event that caused the login.
//
// Both values are propagated into Device and Session aggregate operations.
//
// -----------------------------------------------------------------------------
//
// FAILURE SEMANTICS
//
// Credential failure and unusable Device state intentionally produce the same
// public result:
//
//     {
//       success: false,
//       reason: 'INVALID_CREDENTIALS',
//     }
//
// This prevents the login boundary from revealing:
//
// - whether an Identity exists;
// - whether Authentication exists;
// - whether credentials were incorrect;
// - whether Authentication is disabled;
// - whether a Device exists;
// - whether a Device is revoked or otherwise unusable.
//
// Unexpected repository, domain, application, or infrastructure failures are
// not converted into this generic result. They propagate normally.
//
// -----------------------------------------------------------------------------
//
// RESULT SEMANTICS
//
// Success:
//
//     {
//       success: true,
//       identityPublicId,
//       authenticationPublicId,
//       devicePublicId,
//       sessionPublicId,
//       accessToken,
//       refreshToken,
//     }
//
// Failure:
//
//     {
//       success: false,
//       reason: 'INVALID_CREDENTIALS',
//     }
//
// The intermediate Authentication result is intentionally not exposed as the
// final login result.
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

import type { JwtTokenService } from '../../../../foundation/security/jwt-token-service.interface';

import type { RefreshTokenHasher } from '../../../../foundation/security/refresh-token-hasher.interface';

import type { TokenGenerator } from '../../../../foundation/security/token-generator.interface';

// -----------------------------------------------------------------------------
// Authentication — Application Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Authentication — Commands
// -----------------------------------------------------------------------------

import { AuthenticateCommand } from '../commands/authenticate.command';

import type { AuthenticateLoginCommand } from '../commands/authenticate-login.command';

// -----------------------------------------------------------------------------
// Authentication — Credential Authentication Handler
// -----------------------------------------------------------------------------

import { AuthenticateHandler } from './authenticate.handler';

// -----------------------------------------------------------------------------
// Authentication — Exceptions
// -----------------------------------------------------------------------------

import { AuthenticationException } from '../../domain/exceptions/authentication.exception';

// -----------------------------------------------------------------------------
// Authentication — Repositories
// -----------------------------------------------------------------------------

import type { DeviceRepository } from '../../domain/repositories/device.repository';

import type { SessionRepository } from '../../domain/repositories/session.repository';

// -----------------------------------------------------------------------------
// Authentication — Device
// -----------------------------------------------------------------------------

import { DeviceAggregate } from '../../domain/aggregates/device.aggregate';

import { DeviceEntity } from '../../domain/entities/device.entity';

// -----------------------------------------------------------------------------
// Authentication — Session
// -----------------------------------------------------------------------------

import { SessionAggregate } from '../../domain/aggregates/session.aggregate';

import { SessionEntity } from '../../domain/entities/session.entity';

// -----------------------------------------------------------------------------
// Authentication — Value Objects
// -----------------------------------------------------------------------------

import {
  DeviceIdentityPublicId,
  DeviceLastSeenAt,
  SessionAuthenticatedAt,
  SessionDevicePublicId,
  SessionExpiresAt,
  SessionIdentityPublicId,
  SessionLastActivityAt,
  SessionRefreshTokenHash,
  SessionTokenFamilyPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Application Policy
// =============================================================================

/**
 * Default lifetime of a newly-created authenticated Session.
 *
 * This is application policy.
 *
 * SessionEntity remains responsible for validating the resulting expiration
 * timestamp.
 */
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

// =============================================================================
// Result Types
// =============================================================================

/**
 * Generic reason returned when the login operation cannot establish an
 * authenticated Session.
 *
 * The value intentionally does not reveal the specific reason for failure.
 */
export type AuthenticateLoginFailureReasonCode = 'INVALID_CREDENTIALS';

/**
 * Successful complete-login result.
 *
 * The `success: true` discriminator guarantees that the complete login
 * workflow successfully produced:
 *
 * - authenticated Identity context;
 * - usable Device;
 * - Session;
 * - access token;
 * - refresh token.
 */
export interface AuthenticateLoginSuccessResult {
  readonly success: true;

  readonly identityPublicId: string;

  readonly authenticationPublicId: string;

  readonly devicePublicId: string;

  readonly sessionPublicId: string;

  readonly accessToken: string;

  readonly refreshToken: string;
}

/**
 * Failed complete-login result.
 *
 * No authentication artifacts are returned.
 */
export interface AuthenticateLoginFailureResult {
  readonly success: false;

  readonly reason: AuthenticateLoginFailureReasonCode;
}

/**
 * Result of the complete login workflow.
 */
export type AuthenticateLoginResult =
  AuthenticateLoginSuccessResult | AuthenticateLoginFailureResult;

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles the complete authenticated login workflow.
 *
 * Application orchestration:
 *
 *     AuthenticateLoginCommand
 *              │
 *              ▼
 *     AuthenticateHandler
 *              │
 *        ┌─────┴─────┐
 *        │           │
 *     failure      success
 *        │           │
 *        ▼           ▼
 *      return    Authentication
 *                    │
 *                    ▼
 *                  Device
 *                    │
 *                    ▼
 *                  Session
 *                    │
 *              ┌─────┴─────┐
 *              │           │
 *              ▼           ▼
 *         access token refresh token
 *              │           │
 *              └─────┬─────┘
 *                    ▼
 *       AuthenticateLoginResult
 *
 * Domain behavior remains inside the appropriate aggregates.
 *
 * Cross-aggregate orchestration remains in this application handler.
 */
@Injectable()
export class AuthenticateLoginHandler implements CommandHandler<
  AuthenticateLoginCommand,
  AuthenticateLoginResult
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Credential Authentication
    // -------------------------------------------------------------------------
    //
    // AuthenticateHandler owns:
    //
    // - Identity resolution;
    // - Authentication resolution;
    // - password comparison;
    // - Authentication state transitions.
    //

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.AUTHENTICATE)
    private readonly authenticateHandler: AuthenticateHandler,

    // -------------------------------------------------------------------------
    // Device Repository
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.REPOSITORIES.DEVICE)
    private readonly deviceRepository: DeviceRepository,

    // -------------------------------------------------------------------------
    // Session Repository
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.REPOSITORIES.SESSION)
    private readonly sessionRepository: SessionRepository,

    // -------------------------------------------------------------------------
    // Token Generator
    // -------------------------------------------------------------------------
    //
    // Generates the raw refresh token.
    //
    // The raw value remains transient.
    //

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGenerator,

    // -------------------------------------------------------------------------
    // Refresh Token Hasher
    // -------------------------------------------------------------------------
    //
    // Only the resulting hash enters Session.
    //

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.REFRESH_TOKEN_HASHER)
    private readonly refreshTokenHasher: RefreshTokenHasher,

    // -------------------------------------------------------------------------
    // JWT Token Service
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the complete login workflow.
   *
   * Credential authentication is delegated to AuthenticateHandler.
   *
   * Device and Session processing occur only after successful credential
   * authentication.
   *
   * Expected authentication failures return a generic failure result.
   *
   * Unexpected application, domain, repository, or infrastructure failures
   * propagate as exceptions.
   */
  public async execute(
    command: AuthenticateLoginCommand,
  ): Promise<AuthenticateLoginResult> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new AuthenticationException(
        'Authenticate login command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Authenticate credentials
    // -------------------------------------------------------------------------
    //
    // AuthenticateHandler owns:
    //
    // - Identity resolution;
    // - Authentication resolution;
    // - password comparison;
    // - authentication failure recording;
    // - authentication success recording.
    //
    // -------------------------------------------------------------------------

    const authenticationResult = await this.authenticateHandler.execute(
      new AuthenticateCommand(
        command.emailOrPhoneNumber,
        command.password,
        command.correlationId,
        command.causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // 3. Terminate immediately when credentials fail
    // -------------------------------------------------------------------------
    //
    // No Device.
    // No Session.
    // No refresh token.
    // No access token.
    //
    // -------------------------------------------------------------------------

    if (!authenticationResult.success) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 4. Obtain authenticated Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // TypeScript narrows authenticationResult through the discriminated
    // `success` property.
    //
    // -------------------------------------------------------------------------

    const authentication = authenticationResult.authentication;

    // -------------------------------------------------------------------------
    // 5. Obtain Identity public identifier
    // -------------------------------------------------------------------------
    //
    // Authentication already owns the opaque Identity reference.
    //
    // No additional Identity lookup is required.
    //
    // -------------------------------------------------------------------------

    const identityPublicId = authentication.identityPublicId;

    // -------------------------------------------------------------------------
    // 6. Adapt Identity reference for Device
    // -------------------------------------------------------------------------

    const deviceIdentityPublicId = new DeviceIdentityPublicId(
      identityPublicId.value,
    );

    // -------------------------------------------------------------------------
    // 7. Adapt Identity reference for Session
    // -------------------------------------------------------------------------

    const sessionIdentityPublicId = new SessionIdentityPublicId(
      identityPublicId.value,
    );

    // -------------------------------------------------------------------------
    // 8. Establish one coherent login timestamp
    // -------------------------------------------------------------------------
    //
    // A single timestamp represents the login operation.
    //
    // It is used for:
    //
    // - Device creation;
    // - Device activity;
    // - Session authentication;
    // - Session activity;
    // - Session creation.
    //
    // -------------------------------------------------------------------------

    const loginAt = new Date();

    const authenticatedAt = SessionAuthenticatedAt.create(loginAt);

    const lastActivityAt = SessionLastActivityAt.create(loginAt);

    const lastSeenAt = DeviceLastSeenAt.create(loginAt);

    // -------------------------------------------------------------------------
    // 9. Establish Session expiration
    // -------------------------------------------------------------------------

    const expiresAt = SessionExpiresAt.create(
      new Date(loginAt.getTime() + SESSION_LIFETIME_MS),
    );

    // -------------------------------------------------------------------------
    // 10. Resolve or create Device
    // -------------------------------------------------------------------------
    //
    // `undefined` has one application-level meaning here:
    //
    //     matching Device exists but cannot currently authenticate.
    //
    // A missing Device is created by resolveDevice().
    //
    // Repository/infrastructure failures are NOT converted into undefined.
    // They propagate as exceptions.
    //
    // -------------------------------------------------------------------------

    const device = await this.resolveDevice(
      command,
      deviceIdentityPublicId,
      loginAt,
      lastSeenAt,
    );

    // -------------------------------------------------------------------------
    // 11. Terminate when Device cannot be used
    // -------------------------------------------------------------------------
    //
    // The login boundary deliberately conceals Device lifecycle state.
    //
    // No Session or token is created.
    //
    // -------------------------------------------------------------------------

    if (device === undefined) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 12. Generate raw refresh token
    // -------------------------------------------------------------------------
    //
    // The raw token exists only inside this application workflow.
    //
    // It MUST NOT enter:
    //
    // - SessionEntity;
    // - SessionAggregate;
    // - persistence;
    // - domain events;
    // - logs.
    //
    // -------------------------------------------------------------------------

    const refreshToken = this.tokenGenerator.generate();

    // -------------------------------------------------------------------------
    // 13. Hash refresh token
    // -------------------------------------------------------------------------
    //
    // Only the resulting hash crosses into the Session aggregate.
    //
    // -------------------------------------------------------------------------

    const refreshTokenHash = SessionRefreshTokenHash.create(
      this.refreshTokenHasher.hash(refreshToken),
    );

    // -------------------------------------------------------------------------
    // 14. Create refresh-token family
    // -------------------------------------------------------------------------
    //
    // Every fresh login establishes a new token family.
    //
    // Subsequent refresh-token rotation remains within this family.
    //
    // -------------------------------------------------------------------------

    const tokenFamilyPublicId = new SessionTokenFamilyPublicId();

    // -------------------------------------------------------------------------
    // 15. Adapt Device public identifier for Session
    // -------------------------------------------------------------------------
    //
    // DevicePublicId and SessionDevicePublicId are intentionally distinct
    // value-object types.
    //
    // The conversion is explicit at the application boundary.
    //
    // -------------------------------------------------------------------------

    const sessionDevicePublicId = new SessionDevicePublicId(
      device.publicId.value,
    );

    // -------------------------------------------------------------------------
    // 16. Create Session entity
    // -------------------------------------------------------------------------
    //
    // Session receives only the hashed refresh token.
    //
    // The raw refresh token is deliberately absent.
    //
    // -------------------------------------------------------------------------

    const sessionEntity = SessionEntity.create(
      sessionIdentityPublicId,
      refreshTokenHash,
      tokenFamilyPublicId,
      authenticatedAt,
      lastActivityAt,
      expiresAt,
      {
        // ---------------------------------------------------------------------
        // Device reference
        // ---------------------------------------------------------------------

        devicePublicId: sessionDevicePublicId,

        // ---------------------------------------------------------------------
        // Optional request context
        // ---------------------------------------------------------------------

        ...(command.ipAddress !== undefined
          ? {
              ipAddress: command.ipAddress,
            }
          : {}),

        ...(command.userAgent !== undefined
          ? {
              userAgent: command.userAgent,
            }
          : {}),

        ...(command.countryCode !== undefined
          ? {
              countryCode: command.countryCode,
            }
          : {}),

        ...(command.city !== undefined
          ? {
              city: command.city,
            }
          : {}),

        // ---------------------------------------------------------------------
        // Session creation timestamp
        // ---------------------------------------------------------------------

        createdAt: loginAt,
      },
    );

    // -------------------------------------------------------------------------
    // 17. Create Session aggregate
    // -------------------------------------------------------------------------

    const session = SessionAggregate.create(sessionEntity);

    // -------------------------------------------------------------------------
    // 18. Record Session creation
    // -------------------------------------------------------------------------
    //
    // This records the domain event in the aggregate.
    //
    // The repository remains responsible only for persistence.
    //
    // -------------------------------------------------------------------------

    session.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 19. Generate access token
    // -------------------------------------------------------------------------
    //
    // Generate the access token before persisting the Session.
    //
    // If JWT signing fails, the Session has not yet been persisted.
    //
    // The Authentication password version is included so downstream
    // authentication infrastructure can determine the credential version
    // under which the access token was issued.
    //
    // -------------------------------------------------------------------------

    const accessToken = this.jwtTokenService.signAccessToken({
      identityPublicId: identityPublicId.value,
      sessionPublicId: session.publicId.value,
      authenticationVersion: authentication.passwordVersion.value,
    });

    // -------------------------------------------------------------------------
    // 20. Persist Session
    // -------------------------------------------------------------------------
    //
    // Only the Session aggregate is persisted.
    //
    // The raw refresh token never reaches the repository.
    //
    // -------------------------------------------------------------------------

    await this.sessionRepository.save(session);

    // -------------------------------------------------------------------------
    // 21. Return complete successful login result
    // -------------------------------------------------------------------------
    //
    // The raw refresh token is returned only to the client.
    //
    // It has never:
    //
    // - been persisted;
    // - entered SessionEntity;
    // - entered SessionAggregate;
    // - entered a domain event.
    //
    // -------------------------------------------------------------------------

    return {
      success: true,
      identityPublicId: identityPublicId.value,
      authenticationPublicId: authentication.publicId.value,
      devicePublicId: device.publicId.value,
      sessionPublicId: session.publicId.value,
      accessToken,
      refreshToken,
    };
  }

  // ===========================================================================
  // Device Resolution
  // ===========================================================================

  /**
   * Resolves an existing Device or creates a new Device for the authenticated
   * Identity.
   *
   * Return semantics:
   *
   *     DeviceAggregate
   *         = usable existing Device or newly-created Device
   *
   *     undefined
   *         = matching Device exists but is not currently usable
   *
   * This distinction allows the public login boundary to return the generic
   * INVALID_CREDENTIALS result without exposing Device lifecycle information.
   *
   * Unexpected repository or domain failures are allowed to propagate.
   */
  private async resolveDevice(
    command: AuthenticateLoginCommand,
    identityPublicId: DeviceIdentityPublicId,
    loginAt: Date,
    lastSeenAt: DeviceLastSeenAt,
  ): Promise<DeviceAggregate | undefined> {
    // -------------------------------------------------------------------------
    // 1. Find Device by Identity + fingerprint
    // -------------------------------------------------------------------------
    //
    // Device uniqueness is scoped to:
    //
    //     Identity + DeviceFingerprint
    //
    // Fingerprint is therefore not globally unique.
    //
    // The DeviceRepository contract returns undefined when no Device exists.
    //
    // -------------------------------------------------------------------------

    const existingDevice =
      await this.deviceRepository.findByIdentityPublicIdAndFingerprint(
        identityPublicId,
        command.fingerprint,
      );

    // -------------------------------------------------------------------------
    // 2. Create new Device when none exists
    // -------------------------------------------------------------------------

    if (existingDevice === undefined) {
      const deviceEntity = DeviceEntity.create(
        identityPublicId,
        command.fingerprint,
        command.deviceType,
        {
          ...(command.deviceName !== undefined
            ? {
                name: command.deviceName,
              }
            : {}),

          ...(command.platform !== undefined
            ? {
                platform: command.platform,
              }
            : {}),

          ...(command.operatingSystem !== undefined
            ? {
                operatingSystem: command.operatingSystem,
              }
            : {}),

          ...(command.operatingSystemVersion !== undefined
            ? {
                operatingSystemVersion: command.operatingSystemVersion,
              }
            : {}),

          ...(command.browser !== undefined
            ? {
                browser: command.browser,
              }
            : {}),

          ...(command.browserVersion !== undefined
            ? {
                browserVersion: command.browserVersion,
              }
            : {}),

          lastSeenAt,
          createdAt: loginAt,
        },
      );

      // -----------------------------------------------------------------------
      // Create Device aggregate
      // -----------------------------------------------------------------------

      const device = DeviceAggregate.create(deviceEntity);

      // -----------------------------------------------------------------------
      // Record Device creation
      // -----------------------------------------------------------------------

      device.recordCreated(command.correlationId, command.causationId);

      // -----------------------------------------------------------------------
      // Persist Device
      // -----------------------------------------------------------------------

      await this.deviceRepository.save(device);

      // -----------------------------------------------------------------------
      // Return newly-created Device
      // -----------------------------------------------------------------------

      return device;
    }

    // -------------------------------------------------------------------------
    // 3. Validate existing Device lifecycle state
    // -------------------------------------------------------------------------
    //
    // A matching fingerprint does not authorize a Device.
    //
    // The Device aggregate remains authoritative over whether the Device can
    // participate in authentication.
    //
    // An unusable Device is represented as undefined so the login boundary can
    // return the same generic failure used for invalid credentials.
    //
    // -------------------------------------------------------------------------

    if (!existingDevice.canAuthenticate()) {
      return undefined;
    }

    // -------------------------------------------------------------------------
    // 4. Record Device activity
    // -------------------------------------------------------------------------
    //
    // DeviceAggregate owns the activity transition and event recording.
    //
    // The application handler only orchestrates the operation.
    //
    // -------------------------------------------------------------------------

    existingDevice.recordSeen(
      lastSeenAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist updated Device
    // -------------------------------------------------------------------------

    await this.deviceRepository.save(existingDevice);

    // -------------------------------------------------------------------------
    // 6. Return existing Device
    // -------------------------------------------------------------------------

    return existingDevice;
  }

  // ===========================================================================
  // Invalid Credentials
  // ===========================================================================

  /**
   * Creates the generic login failure result.
   *
   * This helper deliberately contains no Identity-, Authentication-, or
   * Device-specific information.
   */
  private invalidCredentials(): AuthenticateLoginFailureResult {
    return {
      success: false,
      reason: 'INVALID_CREDENTIALS',
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthenticateLoginHandler;
