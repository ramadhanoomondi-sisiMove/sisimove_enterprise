// -----------------------------------------------------------------------------
// Authentication — Authenticate Login Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for the complete user login workflow.
//
// Security invariant:
//
// An Identity must be ACTIVE before the application creates a Device,
// creates a Session, or issues access/refresh tokens.
//
// Lifecycle enforcement:
//
// - ACTIVE: continue login.
// - PENDING: reject login.
// - SUSPENDED: reject login.
// - CLOSED: reject login.
// - Missing Identity: reject login.
//
// Identity lifecycle remains owned by IdentityAggregate.
// This handler consumes the current lifecycle status from
// AuthorizationSnapshotService.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { JwtTokenService } from '../../../../foundation/security/jwt-token-service.interface';

import type { RefreshTokenHasher } from '../../../../foundation/security/refresh-token-hasher.interface';

import type { TokenGenerator } from '../../../../foundation/security/token-generator.interface';

import { IDENTITY_TOKENS } from '../../../identity/application/identity.tokens';

import type { AuthorizationSnapshotService } from '../../../identity/application/services/authorization-snapshot.service';

import { AUTH_TOKENS } from '../auth.tokens';

import { AuthenticateCommand } from '../commands/authenticate.command';

import type { AuthenticateLoginCommand } from '../commands/authenticate-login.command';

import { AuthenticateHandler } from './authenticate.handler';

import { AuthenticationException } from '../../domain/exceptions/authentication.exception';

import type { DeviceRepository } from '../../domain/repositories/device.repository';

import type { SessionRepository } from '../../domain/repositories/session.repository';

import { DeviceAggregate } from '../../domain/aggregates/device.aggregate';

import { DeviceEntity } from '../../domain/entities/device.entity';

import { SessionAggregate } from '../../domain/aggregates/session.aggregate';

import { SessionEntity } from '../../domain/entities/session.entity';

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

const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

// =============================================================================
// Result Types
// =============================================================================

export type AuthenticateLoginFailureReasonCode = 'INVALID_CREDENTIALS';

export interface AuthenticateLoginSuccessResult {
  readonly success: true;
  readonly identityPublicId: string;
  readonly authenticationPublicId: string;
  readonly devicePublicId: string;
  readonly sessionPublicId: string;
  readonly roleCodes: readonly string[];
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AuthenticateLoginFailureResult {
  readonly success: false;
  readonly reason: AuthenticateLoginFailureReasonCode;
}

export type AuthenticateLoginResult =
  AuthenticateLoginSuccessResult | AuthenticateLoginFailureResult;

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class AuthenticateLoginHandler implements CommandHandler<
  AuthenticateLoginCommand,
  AuthenticateLoginResult
> {
  public constructor(
    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.AUTHENTICATE)
    private readonly authenticateHandler: AuthenticateHandler,

    @Inject(AUTH_TOKENS.REPOSITORIES.DEVICE)
    private readonly deviceRepository: DeviceRepository,

    @Inject(AUTH_TOKENS.REPOSITORIES.SESSION)
    private readonly sessionRepository: SessionRepository,

    @Inject(IDENTITY_TOKENS.APPLICATION_SERVICES.AUTHORIZATION_SNAPSHOT)
    private readonly authorizationSnapshotService: AuthorizationSnapshotService,

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGenerator,

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.REFRESH_TOKEN_HASHER)
    private readonly refreshTokenHasher: RefreshTokenHasher,

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.JWT_TOKEN_SERVICE)
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: AuthenticateLoginCommand,
  ): Promise<AuthenticateLoginResult> {
    if (command === undefined || command === null) {
      throw new AuthenticationException(
        'Authenticate login command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 1. Authenticate credentials
    // -------------------------------------------------------------------------

    const authenticationResult = await this.authenticateHandler.execute(
      new AuthenticateCommand(
        command.emailOrPhoneNumber,
        command.password,
        command.correlationId,
        command.causationId,
      ),
    );

    if (!authenticationResult.success) {
      return this.invalidCredentials();
    }

    const authentication = authenticationResult.authentication;
    const identityPublicId = authentication.identityPublicId;

    // -------------------------------------------------------------------------
    // 2. Enforce current Identity lifecycle BEFORE creating Device or Session
    // -------------------------------------------------------------------------
    //
    // The snapshot service loads the current Identity state from persistence.
    // Only ACTIVE identities may proceed.
    //
    // Do not rely on roles or permissions being empty: lifecycle status is an
    // explicit, separate authentication requirement.
    //
    // -------------------------------------------------------------------------

    const authorization =
      await this.authorizationSnapshotService.resolve(identityPublicId);

    if (authorization.identityStatus !== 'ACTIVE') {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 3. Adapt Identity reference for Device and Session
    // -------------------------------------------------------------------------

    const deviceIdentityPublicId = new DeviceIdentityPublicId(
      identityPublicId.value,
    );

    const sessionIdentityPublicId = new SessionIdentityPublicId(
      identityPublicId.value,
    );

    // -------------------------------------------------------------------------
    // 4. Establish login timestamps and Session expiration
    // -------------------------------------------------------------------------

    const loginAt = new Date();

    const authenticatedAt = SessionAuthenticatedAt.create(loginAt);

    const lastActivityAt = SessionLastActivityAt.create(loginAt);

    const lastSeenAt = DeviceLastSeenAt.create(loginAt);

    const expiresAt = SessionExpiresAt.create(
      new Date(loginAt.getTime() + SESSION_LIFETIME_MS),
    );

    // -------------------------------------------------------------------------
    // 5. Resolve or create Device
    // -------------------------------------------------------------------------

    const device = await this.resolveDevice(
      command,
      deviceIdentityPublicId,
      loginAt,
      lastSeenAt,
    );

    if (device === undefined) {
      return this.invalidCredentials();
    }

    // -------------------------------------------------------------------------
    // 6. Generate and hash refresh token
    // -------------------------------------------------------------------------

    const refreshToken = this.tokenGenerator.generate();

    const refreshTokenHash = SessionRefreshTokenHash.create(
      this.refreshTokenHasher.hash(refreshToken),
    );

    const tokenFamilyPublicId = new SessionTokenFamilyPublicId();

    const sessionDevicePublicId = new SessionDevicePublicId(
      device.publicId.value,
    );

    // -------------------------------------------------------------------------
    // 7. Create Session entity
    // -------------------------------------------------------------------------

    const sessionEntity = SessionEntity.create(
      sessionIdentityPublicId,
      refreshTokenHash,
      tokenFamilyPublicId,
      authenticatedAt,
      lastActivityAt,
      expiresAt,
      {
        devicePublicId: sessionDevicePublicId,

        ...(command.ipAddress !== undefined
          ? { ipAddress: command.ipAddress }
          : {}),

        ...(command.userAgent !== undefined
          ? { userAgent: command.userAgent }
          : {}),

        ...(command.countryCode !== undefined
          ? { countryCode: command.countryCode }
          : {}),

        ...(command.city !== undefined ? { city: command.city } : {}),

        createdAt: loginAt,
      },
    );

    const session = SessionAggregate.create(sessionEntity);

    session.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 8. Generate access token using the resolved authorization snapshot
    // -------------------------------------------------------------------------

    const accessToken = this.jwtTokenService.signAccessToken({
      identityPublicId: identityPublicId.value,
      sessionPublicId: session.publicId.value,
      authenticationVersion: authentication.passwordVersion.value,
      roles: authorization.roles,
      permissions: authorization.permissions,
    });

    // -------------------------------------------------------------------------
    // 9. Persist Session only after lifecycle validation
    // -------------------------------------------------------------------------

    await this.sessionRepository.save(session);

    // -------------------------------------------------------------------------
    // 10. Return successful login result
    // -------------------------------------------------------------------------

    return {
      success: true,
      identityPublicId: identityPublicId.value,
      authenticationPublicId: authentication.publicId.value,
      devicePublicId: device.publicId.value,
      sessionPublicId: session.publicId.value,
      roleCodes: authorization.roleCodes,
      accessToken,
      refreshToken,
    };
  }

  // ===========================================================================
  // Device Resolution
  // ===========================================================================

  private async resolveDevice(
    command: AuthenticateLoginCommand,
    identityPublicId: DeviceIdentityPublicId,
    loginAt: Date,
    lastSeenAt: DeviceLastSeenAt,
  ): Promise<DeviceAggregate | undefined> {
    const existingDevice =
      await this.deviceRepository.findByIdentityPublicIdAndFingerprint(
        identityPublicId,
        command.fingerprint,
      );

    if (existingDevice === undefined) {
      const deviceEntity = DeviceEntity.create(
        identityPublicId,
        command.fingerprint,
        command.deviceType,
        {
          ...(command.deviceName !== undefined
            ? { name: command.deviceName }
            : {}),

          ...(command.platform !== undefined
            ? { platform: command.platform }
            : {}),

          ...(command.operatingSystem !== undefined
            ? { operatingSystem: command.operatingSystem }
            : {}),

          ...(command.operatingSystemVersion !== undefined
            ? { operatingSystemVersion: command.operatingSystemVersion }
            : {}),

          ...(command.browser !== undefined
            ? { browser: command.browser }
            : {}),

          ...(command.browserVersion !== undefined
            ? { browserVersion: command.browserVersion }
            : {}),

          lastSeenAt,
          createdAt: loginAt,
        },
      );

      const device = DeviceAggregate.create(deviceEntity);

      device.recordCreated(command.correlationId, command.causationId);

      await this.deviceRepository.save(device);

      return device;
    }

    if (!existingDevice.canAuthenticate()) {
      return undefined;
    }

    existingDevice.recordSeen(
      lastSeenAt,
      command.correlationId,
      command.causationId,
    );

    await this.deviceRepository.save(existingDevice);

    return existingDevice;
  }

  // ===========================================================================
  // Generic Login Failure
  // ===========================================================================

  private invalidCredentials(): AuthenticateLoginFailureResult {
    return {
      success: false,
      reason: 'INVALID_CREDENTIALS',
    };
  }
}

export default AuthenticateLoginHandler;
