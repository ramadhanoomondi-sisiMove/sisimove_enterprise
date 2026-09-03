// -----------------------------------------------------------------------------
// Session — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Session aggregate.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// The command represents the application-level intent:
//
//     Create Session
//
// A Session is an independent aggregate representing one authenticated
// application session associated with an Identity and, optionally, a Device.
//
// The command contains only domain-ready values required to establish the
// initial Session state.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary
// -----------------------------------------------------------------------------
//
// This command belongs to the application layer.
//
// It:
//
// - carries application intent;
// - carries domain value objects;
// - carries operation metadata;
// - contains no transport DTOs;
// - contains no persistence models;
// - contains no security-service dependencies;
// - contains no raw credential material.
//
// The command does NOT create the aggregate itself.
//
// The CreateSessionHandler is responsible for translating this command into:
//
//     SessionEntity
//          ↓
//     SessionAggregate
//          ↓
//     SessionCreatedEvent
//          ↓
//     SessionRepository
//
// -----------------------------------------------------------------------------
//
// Security boundary
// -----------------------------------------------------------------------------
//
// Raw refresh-token material MUST remain outside the Session domain.
//
// The expected authentication workflow is:
//
//     TokenService
//          │
//          │ generateRefreshToken()
//          ▼
//     rawRefreshToken
//          │
//          │ hash
//          ▼
//     SessionRefreshTokenHash
//          │
//          ▼
//     CreateSessionCommand
//          │
//          ▼
//     CreateSessionHandler
//          │
//          ▼
//     SessionAggregate
//
// The raw refresh token MUST NOT enter:
//
// - this command;
// - SessionEntity;
// - SessionAggregate;
// - Session domain events;
// - SessionRepository;
// - persistence.
//
// The persisted value is:
//
//     SessionRefreshTokenHash
//
// not:
//
//     rawRefreshToken
//
// The outer authentication workflow may retain the raw refresh token
// transiently when it must ultimately return it to the authenticated client.
//
// -----------------------------------------------------------------------------
//
// Token-family boundary
// -----------------------------------------------------------------------------
//
// `tokenFamilyPublicId` identifies the refresh-token family to which this
// Session belongs.
//
// The command does not:
//
// - generate token families;
// - generate token-family secrets;
// - rotate refresh tokens;
// - detect token reuse;
// - revoke token families.
//
// Those concerns belong to the appropriate application/security workflow.
//
// For initial authentication, the application workflow normally establishes a
// new token-family public identifier before dispatching this command.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references
// -----------------------------------------------------------------------------
//
// Identity and Device remain separate aggregate boundaries.
//
// The command therefore carries opaque public references:
//
//     SessionIdentityPublicId
//     SessionDevicePublicId
//
// The CreateSessionHandler does NOT load or validate the referenced aggregates.
//
// Identity and Device validation, where required, belongs to the surrounding
// application workflow.
//
// -----------------------------------------------------------------------------
//
// Timestamps
// -----------------------------------------------------------------------------
//
// The authentication/application workflow establishes:
//
//     authenticatedAt
//     lastActivityAt
//     expiresAt
//
// These timestamps are domain-ready value objects by the time they enter this
// command.
//
// The command does not:
//
// - call Date.now();
// - calculate session duration;
// - determine expiration policy;
// - modify timestamps.
//
// SessionEntity is responsible for validating their chronological
// relationships.
//
// -----------------------------------------------------------------------------
//
// Initial Session state
// -----------------------------------------------------------------------------
//
// SessionEntity.create() establishes:
//
//     status = ACTIVE
//
// and:
//
//     replacedBySessionPublicId = undefined
//     revokedAt                 = undefined
//     revokedReason             = undefined
//
// Therefore this command does not carry an initial status.
//
// Status is a domain decision owned by SessionEntity.create().
//
// -----------------------------------------------------------------------------
//
// Application responsibilities
// -----------------------------------------------------------------------------
//
// The surrounding authentication/application workflow is responsible for:
//
// - authenticating the Identity;
// - obtaining the Identity public reference;
// - obtaining an optional Device public reference;
// - generating the raw refresh token;
// - hashing the refresh token;
// - creating SessionRefreshTokenHash;
// - establishing the token-family public identifier;
// - establishing authentication/activity timestamps;
// - establishing Session expiry;
// - collecting optional Session context;
// - generating operation correlation metadata;
// - dispatching CreateSessionCommand.
//
// -----------------------------------------------------------------------------
//
// CreateSessionHandler responsibilities
// -----------------------------------------------------------------------------
//
// CreateSessionHandler is responsible for:
//
// - validating the command structurally;
// - creating SessionEntity;
// - creating SessionAggregate;
// - recording SessionCreatedEvent;
// - persisting the aggregate;
// - returning the created SessionAggregate.
//
// -----------------------------------------------------------------------------
//
// This command does NOT
// -----------------------------------------------------------------------------
//
// This command does NOT:
//
// - generate raw refresh tokens;
// - hash refresh tokens;
// - compare refresh tokens;
// - sign JWTs;
// - verify JWTs;
// - generate access tokens;
// - validate passwords;
// - validate Identity state;
// - validate Device state;
// - create Devices;
// - activate Devices;
// - revoke Sessions;
// - rotate Sessions;
// - detect refresh-token reuse;
// - revoke token families;
// - perform authorization;
// - access Prisma;
// - access repositories directly;
// - publish domain events;
// - send notifications;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Command flow
// -----------------------------------------------------------------------------
//
//     AuthenticateHandler
//            │
//            ├── authenticate Identity
//            │
//            ├── verify password
//            │
//            ├── record successful Authentication
//            │
//            ├── generate refresh token
//            │
//            ├── hash refresh token
//            │
//            ├── establish token family
//            │
//            └── establish Session timestamps/context
//                       │
//                       ▼
//              CreateSessionCommand
//                       │
//                       ▼
//              CreateSessionHandler
//                       │
//                       ▼
//              SessionEntity.create()
//                       │
//                       ▼
//              SessionAggregate.create()
//                       │
//                       ▼
//              aggregate.recordCreated()
//                       │
//                       ▼
//              SessionRepository.save()
//                       │
//                       ▼
//                 ACTIVE Session
//
// The raw refresh token remains outside the Session aggregate and can be
// returned by the outer authentication workflow when required.
//
// -----------------------------------------------------------------------------
//
// exactOptionalPropertyTypes
// -----------------------------------------------------------------------------
//
// Optional references intentionally use:
//
//     SessionDevicePublicId | undefined
//
// rather than making the command property itself optional.
//
// This makes the command shape explicit and predictable:
//
//     devicePublicId === undefined
//
// means no Device is associated with the Session.
//
// -----------------------------------------------------------------------------
//
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  SessionAuthenticatedAt,
  SessionCity,
  SessionCountryCode,
  SessionDevicePublicId,
  SessionExpiresAt,
  SessionIdentityPublicId,
  SessionIpAddress,
  SessionLastActivityAt,
  SessionRefreshTokenHash,
  SessionTokenFamilyPublicId,
  SessionUserAgent,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// =============================================================================
// Command Properties
// =============================================================================

/**
 * Domain-ready properties required to create a Session.
 *
 * This type exists to keep the command constructor explicit without creating
 * a long positional parameter list.
 */
export interface CreateSessionCommandProps {
  /**
   * Opaque public reference to the Identity associated with the Session.
   */
  readonly identityPublicId: SessionIdentityPublicId;

  /**
   * Optional opaque public reference to the Device associated with the Session.
   */
  readonly devicePublicId: SessionDevicePublicId | undefined;

  /**
   * Persisted hash of the refresh token.
   *
   * Raw refresh-token material must never be supplied here.
   */
  readonly refreshTokenHash: SessionRefreshTokenHash;

  /**
   * Public identifier of the refresh-token family.
   */
  readonly tokenFamilyPublicId: SessionTokenFamilyPublicId;

  /**
   * Optional client IP address observed during authentication.
   */
  readonly ipAddress: SessionIpAddress | undefined;

  /**
   * Optional client user-agent observed during authentication.
   */
  readonly userAgent: SessionUserAgent | undefined;

  /**
   * Optional ISO 3166-1 alpha-2 country code associated with the Session.
   */
  readonly countryCode: SessionCountryCode | undefined;

  /**
   * Optional client city associated with the Session.
   */
  readonly city: SessionCity | undefined;

  /**
   * Timestamp at which authentication succeeded.
   */
  readonly authenticatedAt: SessionAuthenticatedAt;

  /**
   * Timestamp of the initial Session activity.
   */
  readonly lastActivityAt: SessionLastActivityAt;

  /**
   * Timestamp at which the Session expires.
   */
  readonly expiresAt: SessionExpiresAt;

  /**
   * Correlation identifier for the Session-creation operation.
   */
  readonly correlationId: string;

  /**
   * Optional identifier of the command, event, or operation that caused the
   * Session-creation operation.
   */
  readonly causationId?: string;
}

// =============================================================================
// Command
// =============================================================================

/**
 * Application command for creating a Session aggregate.
 *
 * All values supplied to the command are already expressed using the
 * appropriate domain value objects.
 *
 * Raw refresh-token material is intentionally excluded.
 */
export class CreateSessionCommand implements Command {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  public constructor(props: CreateSessionCommandProps) {
    this.identityPublicId = props.identityPublicId;
    this.devicePublicId = props.devicePublicId;

    this.refreshTokenHash = props.refreshTokenHash;
    this.tokenFamilyPublicId = props.tokenFamilyPublicId;

    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.countryCode = props.countryCode;
    this.city = props.city;

    this.authenticatedAt = props.authenticatedAt;
    this.lastActivityAt = props.lastActivityAt;
    this.expiresAt = props.expiresAt;

    this.correlationId = props.correlationId;
    this.causationId = props.causationId;
  }

  // ===========================================================================

  // Identity

  // ===========================================================================

  /**
   * Opaque public reference to the Identity associated with this Session.
   */
  public readonly identityPublicId: SessionIdentityPublicId;

  /**
   * Optional opaque public reference to the Device associated with this
   * Session.
   */
  public readonly devicePublicId: SessionDevicePublicId | undefined;

  // ===========================================================================

  // Refresh Token Security

  // ===========================================================================

  /**
   * Persisted hash of the refresh token.
   *
   * The raw refresh token must never enter the Session application or domain
   * boundary.
   */
  public readonly refreshTokenHash: SessionRefreshTokenHash;

  /**
   * Public identifier of the refresh-token family.
   */
  public readonly tokenFamilyPublicId: SessionTokenFamilyPublicId;

  // ===========================================================================

  // Session Context

  // ===========================================================================

  /**
   * Optional client IP address observed during authentication.
   */
  public readonly ipAddress: SessionIpAddress | undefined;

  /**
   * Optional client user-agent observed during authentication.
   */
  public readonly userAgent: SessionUserAgent | undefined;

  /**
   * Optional ISO 3166-1 alpha-2 country code associated with the Session.
   */
  public readonly countryCode: SessionCountryCode | undefined;

  /**
   * Optional client city associated with the Session.
   */
  public readonly city: SessionCity | undefined;

  // ===========================================================================

  // Session Lifecycle Timestamps

  // ===========================================================================

  /**
   * Timestamp at which authentication succeeded.
   */
  public readonly authenticatedAt: SessionAuthenticatedAt;

  /**
   * Timestamp of the initial Session activity.
   */
  public readonly lastActivityAt: SessionLastActivityAt;

  /**
   * Timestamp at which the Session expires.
   */
  public readonly expiresAt: SessionExpiresAt;

  // ===========================================================================

  // Operation Metadata

  // ===========================================================================

  /**
   * Correlation identifier for this application operation.
   */
  public readonly correlationId: string;

  /**
   * Optional causation identifier describing the command, event, or operation
   * that caused this Session creation.
   */
  public readonly causationId: string | undefined;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateSessionCommand;
