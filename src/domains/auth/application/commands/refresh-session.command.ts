// -----------------------------------------------------------------------------
// Session — Refresh Command
// -----------------------------------------------------------------------------
//
// Application command for refreshing an existing Session.
//
// The command represents the application-level intent:
//
//     Refresh Session
//
// The RefreshSessionHandler owns the complete application workflow:
//
//     Client
//        │
//        │ raw refresh token
//        ▼
//     RefreshSessionCommand
//        │
//        ▼
//     RefreshSessionHandler
//        │
//        ├── locate Session
//        │
//        ├── compare raw token against persisted hash
//        │
//        ├── generate replacement refresh token
//        │
//        ├── hash replacement refresh token
//        │
//        ├── create SessionRefreshTokenHash
//        │
//        ├── SessionAggregate.refresh()
//        │
//        ├── persist Session
//        │
//        └── return replacement credentials
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
//
// This command contains the raw refresh token as transient application input.
//
// IMPORTANT:
//
// The raw refresh token MUST NEVER be passed into:
//
// - SessionEntity;
// - SessionAggregate;
// - Session domain events;
// - SessionRepository;
// - persistence models;
// - SessionRefreshTokenHash.
//
// The RefreshSessionHandler consumes the raw token only for verification.
//
// After successful verification, the handler generates a replacement raw
// refresh token, hashes it, and passes ONLY the resulting
// SessionRefreshTokenHash into SessionAggregate.refresh().
//
// -----------------------------------------------------------------------------
//
// TOKEN ROTATION
//
// The refresh workflow is:
//
//     existing Session
//          │
//          ├── persisted refreshTokenHash
//          │
//          ▼
//     compare(
//       command.refreshToken,
//       session.refreshTokenHash.value,
//     )
//          │
//       ┌──┴──┐
//       │     │
//     false  true
//       │     │
//       ▼     ▼
//     reject  generate new raw token
//                 │
//                 ├──────────────────────► client response
//                 │
//                 ▼
//             hash(new token)
//                 │
//                 ▼
//          SessionRefreshTokenHash
//                 │
//                 ▼
//          SessionAggregate.refresh()
//                 │
//                 ▼
//             persist Session
//
// -----------------------------------------------------------------------------
//
// COMMAND RESPONSIBILITIES
//
// The command carries only transient application input:
//
// - sessionPublicId;
// - raw refreshToken;
// - lastActivityAt;
// - correlationId;
// - causationId.
//
// The command does NOT:
//
// - verify refresh tokens;
// - hash refresh tokens;
// - generate refresh tokens;
// - construct SessionEntity;
// - construct SessionAggregate;
// - mutate Session state;
// - access Prisma;
// - sign JWTs;
// - perform authorization;
// - send notifications.
//
// Those operations belong to the RefreshSessionHandler or its injected
// application/security abstractions.
//
// -----------------------------------------------------------------------------
//
// HANDLER RESPONSIBILITIES
//
// RefreshSessionHandler is responsible for:
//
// - validating command structure;
// - locating the Session aggregate;
// - comparing the incoming raw refresh token against the persisted hash;
// - rejecting an invalid refresh credential;
// - generating a replacement refresh token;
// - hashing the replacement refresh token;
// - creating SessionRefreshTokenHash from the replacement hash;
// - invoking SessionAggregate.refresh();
// - persisting the changed Session aggregate;
// - issuing the access token when required by the application's token service;
// - returning the replacement raw refresh token to the caller.
//
// -----------------------------------------------------------------------------
//
// DOMAIN RESPONSIBILITIES
//
// SessionAggregate / SessionEntity remain responsible for:
//
// - Session lifecycle validation;
// - refresh eligibility;
// - refresh-token hash replacement;
// - Session activity updates;
// - token-family lineage;
// - replacement/revocation invariants;
// - Session domain-event construction.
//
// The domain does NOT know:
//
// - the raw refresh token;
// - the hashing algorithm;
// - TokenGenerator;
// - JWT;
// - HTTP;
// - Prisma.
//
// -----------------------------------------------------------------------------
//
// RAW REFRESH TOKEN
//
// `refreshToken` is transient application input.
//
// It MUST:
//
// - never be logged;
// - never be persisted;
// - never be included in domain events;
// - never be included in SessionEntity;
// - never be converted directly into SessionRefreshTokenHash;
// - never be returned after it has been replaced unless it is the newly
//   generated replacement token.
//
// The handler must compare the supplied raw token against the existing
// persisted hash before performing token rotation.
//
// -----------------------------------------------------------------------------
//
// REFRESH TOKEN HASH
//
// `SessionRefreshTokenHash` is created ONLY from the hash of the newly
// generated refresh token:
//
//     SessionRefreshTokenHash.create(
//       refreshTokenHasher.hash(newRefreshToken),
//     )
//
// It must never be created from `command.refreshToken`.
//
// -----------------------------------------------------------------------------
//
// AGGREGATE BOUNDARY
//
// Session
// └── SessionEntity
//
// The handler coordinates infrastructure/security services around the
// aggregate but does not bypass the aggregate boundary.
//
// -----------------------------------------------------------------------------
//
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  SessionPublicId,
  SessionLastActivityAt,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Represents the application intent to refresh an existing Session.
 *
 * The command carries the incoming raw refresh token as transient application
 * input because RefreshSessionHandler owns the complete refresh workflow.
 *
 * IMPORTANT:
 *
 * The raw refresh token MUST NOT enter the Session aggregate.
 *
 * RefreshSessionHandler uses this value only to compare it against the
 * Session's persisted SessionRefreshTokenHash.
 */
export class RefreshSessionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identifier of the Session being refreshed.
     */
    public readonly sessionPublicId: SessionPublicId,

    /**
     * Incoming raw refresh token supplied by the client.
     *
     * This is transient application input.
     *
     * It MUST NOT:
     *
     * - be persisted;
     * - enter SessionEntity;
     * - enter SessionAggregate;
     * - enter Session domain events;
     * - enter SessionRefreshTokenHash;
     * - be logged.
     *
     * RefreshSessionHandler uses it only for credential comparison.
     */
    public readonly refreshToken: string,

    /**
     * Timestamp representing the latest authenticated Session activity.
     *
     * SessionAggregate remains responsible for validating this timestamp
     * against its lifecycle invariants.
     */
    public readonly lastActivityAt: SessionLastActivityAt,

    /**
     * Correlation identifier for this Session-refresh operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or workflow that caused this
     * refresh operation.
     */
    public readonly causationId?: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RefreshSessionCommand;
