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
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
//
// The raw refresh token MUST be handled entirely by the surrounding
// authentication/security workflow.
//
// Expected flow:
//
//     Client
//        │
//        │ raw refresh token
//        ▼
//     Authentication Workflow
//        │
//        ├── locate Session
//        │
//        ├── HashingService.verify(
//        │      rawRefreshToken,
//        │      persistedSession.refreshTokenHash,
//        │   )
//        │
//        ├── TokenService.generateRefreshToken()
//        │
//        ├── HashingService.hash(newRawRefreshToken)
//        │
//        ▼
//     RefreshSessionCommand
//        │
//        ├── sessionPublicId
//        ├── refreshTokenHash
//        ├── lastActivityAt
//        ├── correlationId
//        └── causationId
//        │
//        ▼
//     RefreshSessionHandler
//        │
//        ▼
//     SessionAggregate.refresh()
//        │
//        ▼
//     SessionRepository.save()
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// `refreshTokenHash` is the hash of the NEW refresh token.
//
// It is NOT the hash used to verify the incoming refresh token.
//
// Incoming-token verification must occur before this command is dispatched:
//
//     HashingService.verify(
//       rawRefreshToken,
//       persistedSession.refreshTokenHash,
//     )
//
// Only after successful verification should the authentication workflow:
//
// 1. generate a new raw refresh token;
// 2. hash the new raw refresh token;
// 3. create this command;
// 4. dispatch the command.
//
// -----------------------------------------------------------------------------
//
// APPLICATION RESPONSIBILITIES
//
// The surrounding authentication workflow is responsible for:
//
// - receiving the raw refresh token;
// - locating the Session;
// - verifying the incoming refresh token;
// - generating the replacement refresh token;
// - hashing the replacement refresh token;
// - creating this command;
// - retaining the raw replacement token when it must be returned to the client.
//
// The command handler is responsible for:
//
// - validating command structure;
// - locating the Session aggregate;
// - passing the new refresh-token hash to the aggregate;
// - passing the latest activity timestamp to the aggregate;
// - invoking SessionAggregate.refresh();
// - persisting the changed aggregate.
//
// -----------------------------------------------------------------------------
//
// DOMAIN RESPONSIBILITIES
//
// SessionAggregate / SessionEntity own:
//
// - Session lifecycle validation;
// - refresh eligibility;
// - refresh-token rotation;
// - replacement of the persisted refresh-token hash;
// - Session activity updates;
// - token-family lineage;
// - replacement/revocation invariants;
// - Session domain-event construction.
//
// -----------------------------------------------------------------------------
//
// RAW REFRESH TOKEN PROHIBITION
//
// The raw refresh token MUST NEVER enter:
//
// - RefreshSessionCommand;
// - SessionEntity;
// - SessionAggregate;
// - Session domain events;
// - SessionRepository;
// - persistence models;
// - domain logs.
//
// The Session domain receives only the domain-ready
// SessionRefreshTokenHash.
//
// -----------------------------------------------------------------------------
//
// THIS COMMAND DOES NOT
//
// - contain the raw refresh token;
// - verify refresh tokens;
// - hash refresh tokens;
// - generate refresh tokens;
// - sign access tokens;
// - sign refresh tokens;
// - compare refresh-token values;
// - validate Identity domain state;
// - validate Device domain state;
// - revoke an entire token family;
// - send notifications;
// - access Prisma;
// - construct SessionEntity;
// - construct SessionAggregate;
// - construct domain events.
//
// -----------------------------------------------------------------------------
//
// Aggregate affected:
//
// SessionAggregate
// └── SessionEntity
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
  SessionRefreshTokenHash,
  SessionLastActivityAt,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Represents the application intent to refresh an existing Session.
 *
 * The command contains only domain-ready values.
 *
 * In particular, `refreshTokenHash` contains the hash of the newly generated
 * refresh token and never the raw refresh token itself.
 */
export class RefreshSessionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identifier of the Session being refreshed.
     *
     * The surrounding authentication workflow must locate the Session and
     * successfully verify the incoming raw refresh token before dispatching
     * this command.
     */
    public readonly sessionPublicId: SessionPublicId,

    /**
     * Hash of the NEW refresh token.
     *
     * This value replaces the Session's existing refresh-token hash when the
     * aggregate performs refresh-token rotation.
     *
     * The raw refresh token MUST never enter this command.
     */
    public readonly refreshTokenHash: SessionRefreshTokenHash,

    /**
     * Timestamp representing the latest authenticated Session activity.
     *
     * The aggregate remains responsible for determining whether this timestamp
     * is valid according to its lifecycle invariants.
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
