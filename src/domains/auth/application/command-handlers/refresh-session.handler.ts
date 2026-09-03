// -----------------------------------------------------------------------------
// Session — Refresh Session Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for the complete Session refresh workflow.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Related aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITY
//
// This handler owns the complete application-level refresh workflow.
//
//     Client
//        │
//        │ sessionPublicId + raw refresh token
//        ▼
//     RefreshSessionCommand
//        │
//        ▼
//     RefreshSessionHandler
//        │
//        ├── locate Session
//        │
//        ├── validate Session usability
//        │
//        ├── verify incoming raw refresh token
//        │
//        ├── resolve Authentication through Identity reference
//        │
//        ├── generate replacement raw refresh token
//        │
//        ├── hash replacement refresh token
//        │
//        ├── create SessionRefreshTokenHash
//        │
//        ├── refresh SessionAggregate
//        │
//        ├── sign replacement access token
//        │
//        └── persist Session
//             │
//             ▼
//       RefreshSessionResult
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
//
// The raw refresh token is accepted only as transient application input.
//
// It is used to:
//
// - compare against the persisted Session refresh-token hash;
// - remain transient until returned to the authenticated client.
//
// The raw refresh token MUST NEVER:
//
// - enter SessionEntity;
// - enter SessionAggregate;
// - enter SessionRefreshTokenHash;
// - enter domain events;
// - enter SessionRepository persistence;
// - be logged;
// - be included in exceptions;
// - be included in JWT claims.
//
// Only its cryptographic hash enters the Session aggregate.
//
// -----------------------------------------------------------------------------
//
// ACCESS TOKEN ROTATION
//
// A successful refresh produces BOTH:
//
//     new access token
//     new refresh token
//
// The access token is signed through JwtTokenService:
//
//     JwtTokenService.signAccessToken({
//       identityPublicId,
//       sessionPublicId,
//       authenticationVersion,
//     })
//
// JwtTokenService remains responsible for:
//
// - JWT signing;
// - jti generation;
// - sub construction;
// - sid construction;
// - typ construction;
// - issuer;
// - audience;
// - expiration;
// - algorithm enforcement.
//
// This handler does NOT construct JWT payloads manually.
//
// -----------------------------------------------------------------------------
//
// REFRESH TOKEN ROTATION
//
// Incoming:
//
//     raw refresh token
//             │
//             ▼
//     RefreshTokenHasher.compare()
//             │
//             ▼
//     persisted SessionRefreshTokenHash
//
// Successful verification:
//
//     TokenGenerator.generate()
//             │
//             ▼
//     new raw refresh token
//             │
//             ├──────────────────────► RefreshSessionResult
//             │
//             ▼
//     RefreshTokenHasher.hash()
//             │
//             ▼
//     SessionRefreshTokenHash
//             │
//             ▼
//     SessionAggregate.refresh()
//
// The Session aggregate receives ONLY the replacement hash.
//
// -----------------------------------------------------------------------------
//
// CROSS-AGGREGATE IDENTITY REFERENCE
//
// Session and Authentication intentionally use different value objects for
// the same opaque Identity public reference:
//
//     SessionIdentityPublicId
//             │
//             │ value
//             ▼
//     AuthenticationIdentityPublicId
//
// The application layer performs this explicit translation.
//
// This prevents value objects belonging to different aggregate boundaries
// from being treated as interchangeable types.
//
// Neither repository loads or validates the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// DOMAIN BOUNDARY
//
// SessionAggregate remains responsible for:
//
// - Session refresh eligibility;
// - Session lifecycle invariants;
// - refresh-token hash replacement;
// - Session activity updates;
// - token-family lineage;
// - replacement/revocation invariants;
// - SessionRefreshedEvent construction.
//
// AuthenticationAggregate remains responsible for:
//
// - Authentication lifecycle;
// - authentication state;
// - authentication/password version.
//
// JwtTokenService remains responsible for:
//
// - JWT cryptography;
// - JWT-specific claims;
// - issuer;
// - audience;
// - expiration;
// - algorithm enforcement.
//
// RefreshTokenHasher remains responsible for:
//
// - refresh-token hashing;
// - refresh-token comparison.
//
// TokenGenerator remains responsible for:
//
// - generating cryptographically secure opaque refresh credentials.
//
// -----------------------------------------------------------------------------
//
// THIS HANDLER DOES NOT
//
// - mutate SessionEntity directly;
// - mutate AuthenticationEntity directly;
// - construct SessionAggregate directly;
// - construct AuthenticationAggregate directly;
// - construct domain events;
// - access Prisma;
// - implement Session lifecycle rules;
// - implement token-family policy;
// - implement JWT cryptography;
// - hash passwords;
// - persist raw refresh tokens;
// - expose the persisted refresh-token hash;
// - load or validate Identity;
// - perform authorization.
//
// -----------------------------------------------------------------------------
//
// INFRASTRUCTURE ABSTRACTIONS
//
// The handler depends only on application/domain abstractions:
//
// - SessionRepository;
// - AuthenticationRepository;
// - TokenGenerator;
// - RefreshTokenHasher;
// - JwtTokenService.
//
// Concrete infrastructure implementations are supplied through DI.
//
// -----------------------------------------------------------------------------
//
// AGGREGATE BOUNDARIES
//
// SessionAggregate
// └── SessionEntity
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Only Session is mutated by this handler.
//
// Authentication is read-only during refresh.
//
// Identity remains an independent aggregate and is referenced only by its
// public identifier.
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
// Command
// -----------------------------------------------------------------------------

import type { RefreshSessionCommand } from '../commands/refresh-session.command';

// -----------------------------------------------------------------------------
// Domain — Repositories
// -----------------------------------------------------------------------------

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

import type { SessionRepository } from '../../domain/repositories/session.repository';

// -----------------------------------------------------------------------------
// Domain — Exception
// -----------------------------------------------------------------------------

import { SessionException } from '../../domain/exceptions/session.exception';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import { AuthenticationIdentityPublicId } from '../../domain/value-objects/authentication-identity-public-id.vo';

import { SessionRefreshTokenHash } from '../../domain/value-objects/session-refresh-token-hash.vo';

// =============================================================================
// Result
// =============================================================================

/**
 * Successful Session refresh result.
 *
 * Both newly issued credentials are returned only as transient application
 * output.
 *
 * The persisted refresh-token hash is intentionally never returned.
 */
export interface RefreshSessionResult {
  /**
   * Indicates that the refresh operation succeeded.
   */
  readonly success: true;

  /**
   * Public identifier of the refreshed Session.
   */
  readonly sessionPublicId: string;

  /**
   * Public identifier of the authenticated Identity.
   */
  readonly identityPublicId: string;

  /**
   * Newly issued short-lived JWT access token.
   */
  readonly accessToken: string;

  /**
   * Newly issued opaque refresh token.
   *
   * This plaintext credential exists only as transient application output.
   */
  readonly refreshToken: string;
}

// =============================================================================
// Handler
// =============================================================================

/**
 * Refreshes an existing Session and rotates its refresh credential.
 *
 * The handler owns the complete application workflow:
 *
 * 1. validate the command;
 * 2. locate the Session aggregate;
 * 3. validate Session usability;
 * 4. compare the supplied raw refresh token with the persisted hash;
 * 5. resolve Authentication through the opaque Identity reference;
 * 6. generate a replacement refresh token;
 * 7. hash the replacement refresh token;
 * 8. wrap the hash in SessionRefreshTokenHash;
 * 9. refresh the Session aggregate;
 * 10. issue a replacement access token;
 * 11. persist the refreshed Session;
 * 12. return both newly issued credentials.
 *
 * The handler never places the raw refresh token inside the domain.
 */
@Injectable()
export class RefreshSessionHandler implements CommandHandler<
  RefreshSessionCommand,
  RefreshSessionResult
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Session Repository
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.REPOSITORIES.SESSION)
    private readonly sessionRepository: SessionRepository,

    // -------------------------------------------------------------------------
    // Authentication Repository
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.REPOSITORIES.AUTHENTICATION)
    private readonly authenticationRepository: AuthenticationRepository,

    // -------------------------------------------------------------------------
    // Token Generator
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGenerator,

    // -------------------------------------------------------------------------
    // Refresh Token Hasher
    // -------------------------------------------------------------------------

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
   * Executes the complete Session refresh workflow.
   *
   * The supplied raw refresh token remains transient throughout the
   * application workflow.
   */
  public async execute(
    command: RefreshSessionCommand,
  ): Promise<RefreshSessionResult> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 2. Retrieve Session aggregate
    // -------------------------------------------------------------------------

    const session = await this.sessionRepository.findByPublicId(
      command.sessionPublicId,
    );

    if (session === null) {
      throw new SessionException('Session could not be found.');
    }

    // -------------------------------------------------------------------------
    // 3. Validate Session usability
    // -------------------------------------------------------------------------

    if (!session.isUsable()) {
      throw new SessionException('Session is not available for refresh.');
    }

    // -------------------------------------------------------------------------
    // 4. Verify incoming raw refresh token
    // -------------------------------------------------------------------------
    //
    // The persisted value is the opaque SessionRefreshTokenHash.
    //
    // The raw credential is compared against that hash.
    //
    // The raw token never becomes a domain value object.
    //

    const persistedRefreshTokenHash: string = session.refreshTokenHash.value;

    const refreshTokenValid: boolean = this.refreshTokenHasher.compare(
      command.refreshToken,
      persistedRefreshTokenHash,
    );

    if (!refreshTokenValid) {
      throw new SessionException('Invalid refresh token.');
    }

    // -------------------------------------------------------------------------
    // 5. Resolve Authentication
    // -------------------------------------------------------------------------
    //
    // SessionIdentityPublicId and AuthenticationIdentityPublicId are separate
    // value-object types even though they represent the same external
    // Identity reference.
    //
    // AuthenticationIdentityPublicId does NOT expose a static create()
    // factory. Its public constructor is therefore used for the explicit
    // application-layer translation.
    //

    const authenticationIdentityPublicId = new AuthenticationIdentityPublicId(
      session.identityPublicId.value,
    );

    const authentication =
      await this.authenticationRepository.findByIdentityPublicId(
        authenticationIdentityPublicId,
      );

    if (authentication === null) {
      throw new SessionException(
        'Authentication could not be found for the Session Identity.',
      );
    }

    // -------------------------------------------------------------------------
    // 6. Generate replacement refresh token
    // -------------------------------------------------------------------------
    //
    // This is the new plaintext bearer credential.
    //
    // It remains transient and is never supplied to the Session aggregate.
    //

    const newRefreshToken: string = this.tokenGenerator.generate();

    this.ensureGeneratedRefreshToken(newRefreshToken);

    // -------------------------------------------------------------------------
    // 7. Hash replacement refresh token
    // -------------------------------------------------------------------------
    //
    // Only the hash crosses the Session domain boundary.
    //

    const newRefreshTokenHashValue: string =
      this.refreshTokenHasher.hash(newRefreshToken);

    const newRefreshTokenHash: SessionRefreshTokenHash =
      SessionRefreshTokenHash.create(newRefreshTokenHashValue);

    // -------------------------------------------------------------------------
    // 8. Refresh Session aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate receives:
    //
    // - replacement refresh-token hash;
    // - latest activity timestamp;
    // - correlation metadata.
    //
    // The raw refresh token never enters the domain.
    //

    session.refresh(
      newRefreshTokenHash,
      command.lastActivityAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 9. Issue replacement access token
    // -------------------------------------------------------------------------
    //
    // JwtTokenService owns JWT-specific concerns.
    //
    // The application supplies only application-level claims.
    //

    const accessToken: string = this.jwtTokenService.signAccessToken({
      identityPublicId: session.identityPublicId.value,
      sessionPublicId: session.publicId.value,
      authenticationVersion: authentication.passwordVersion.value,
    });

    // -------------------------------------------------------------------------
    // 10. Persist refreshed Session
    // -------------------------------------------------------------------------

    await this.sessionRepository.save(session);

    // -------------------------------------------------------------------------
    // 11. Return refreshed credentials
    // -------------------------------------------------------------------------

    return {
      success: true,
      sessionPublicId: session.publicId.value,
      identityPublicId: session.identityPublicId.value,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Performs structural command validation.
   *
   * Domain lifecycle validation remains inside SessionAggregate.
   */
  private ensureRequiredCommandFields(command: RefreshSessionCommand): void {
    // -------------------------------------------------------------------------
    // Command
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new SessionException('Refresh Session command is required.');
    }

    // -------------------------------------------------------------------------
    // Session public ID
    // -------------------------------------------------------------------------

    if (command.sessionPublicId === undefined) {
      throw new SessionException('Session public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Raw refresh token
    // -------------------------------------------------------------------------
    //
    // Refresh tokens are opaque credentials.
    //
    // Do NOT trim, normalize, lowercase, decode, or otherwise transform them.
    //

    if (
      typeof command.refreshToken !== 'string' ||
      command.refreshToken.length === 0
    ) {
      throw new SessionException('Refresh token is required.');
    }

    // -------------------------------------------------------------------------
    // Last activity timestamp
    // -------------------------------------------------------------------------

    if (command.lastActivityAt === undefined) {
      throw new SessionException(
        'Session last-activity timestamp is required.',
      );
    }

    const lastActivityAt: Date = command.lastActivityAt.value;

    if (
      !(lastActivityAt instanceof Date) ||
      !Number.isFinite(lastActivityAt.getTime())
    ) {
      throw new SessionException(
        'Session last-activity timestamp must be a valid date.',
      );
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new SessionException('Session correlation ID is required.');
    }

    // -------------------------------------------------------------------------
    // Causation ID
    // -------------------------------------------------------------------------

    if (
      command.causationId !== undefined &&
      (typeof command.causationId !== 'string' ||
        command.causationId.trim().length === 0)
    ) {
      throw new SessionException(
        'Session causation ID must be a non-empty string when provided.',
      );
    }
  }

  // ===========================================================================
  // Generated Token Validation
  // ===========================================================================

  /**
   * Ensures that the token generator returned a usable opaque credential.
   *
   * The generated token is never normalized or trimmed.
   */
  private ensureGeneratedRefreshToken(token: string): void {
    if (typeof token !== 'string' || token.length === 0) {
      throw new SessionException(
        'Refresh token generator returned an invalid token.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RefreshSessionHandler;
