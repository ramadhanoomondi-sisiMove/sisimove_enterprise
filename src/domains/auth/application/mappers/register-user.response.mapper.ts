// -----------------------------------------------------------------------------
// Authentication — Register User Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the composite RegisterUserResult application result into the
// transport-facing registration response.
//
// Registration is a complete application workflow, not an
// AuthenticationAggregate operation.
//
// The registration workflow creates and coordinates:
//
// RegisterUserResult
// ├── IdentityAggregate
// ├── VerificationAggregate
// ├── TravellerProfileAggregate
// ├── TrustProfileAggregate
// ├── AuthenticationAggregate
// └── FinancialAccountAggregate
//
// Therefore AuthenticationResponseMapper MUST NOT be reused for registration.
//
// The registration workflow has its own presentation boundary:
//
//     RegisterUserResult
//            ↓
//     RegisterUserResponseMapper
//            ↓
//     RegisterUserResponse
//
// AuthenticationResponseMapper remains responsible only for mapping the
// Authentication aggregate for Authentication-specific endpoints.
//
// RegisterUserResponseMapper represents the successful outcome of the
// complete registration workflow.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - map RegisterUserResult into the registration response contract;
// - expose only information appropriate after successful registration;
// - serialize domain value objects into transport primitives;
// - keep the HTTP response independent from aggregate implementation details;
// - keep the mapper independent from persistence and infrastructure.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - access Prisma;
// - access repositories;
// - query another bounded context;
// - mutate aggregates;
// - perform registration;
// - authenticate the user;
// - create a Session;
// - create a Device;
// - generate access tokens;
// - generate refresh tokens;
// - assign IdentityRole;
// - grant MEMBER verification;
// - expose passwordHash;
// - expose Authentication security/audit state;
// - expose financial account state;
// - expose financial balances;
// - expose internal persistence identifiers;
// - evaluate business rules.
//
// -----------------------------------------------------------------------------
//
// Registration completion:
//
// Registration successfully creates the account and its required onboarding
// records, including the user's foundational FinancialAccount.
//
// The FinancialAccount is an internal consequence of successful account
// registration. It is not part of the registration HTTP response contract.
//
// Authentication is explicitly activated by the registration workflow, but
// registration does NOT create a Session and does NOT authenticate the user.
//
// The client therefore proceeds to the login flow.
//
// -----------------------------------------------------------------------------
//
// Public handle convention:
//
// TravellerHandle stores the normalized handle without '@'.
//
// Example:
//
//     persisted/domain value: ramadhan_omondi
//     UI representation:       @ramadhan_omondi
//
// The mapper returns the domain handle value without adding presentation
// characters. The UI owns display formatting.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Application — Registration Result
// -----------------------------------------------------------------------------

import type { RegisterUserResult } from '../command-handlers/register-user.handler';

// =============================================================================
// Response Contract
// =============================================================================
//
// This is intentionally a registration-specific transport contract.
//
// It does not mirror RegisterUserResult and does not expose the internal
// structure of the aggregates involved in registration.
//
// In particular, FinancialAccountAggregate remains an internal application
// result and is deliberately not serialized into this response.
//
// =============================================================================

export interface RegisterUserResponse {
  /**
   * Indicates that the registration workflow completed successfully.
   */
  readonly status: 'REGISTERED';

  /**
   * Public identifier of the newly created Identity.
   *
   * This is the public domain identifier, never the internal persistence ID.
   */
  readonly identityPublicId: string;

  /**
   * Normalized traveller handle created during registration.
   *
   * The value does not contain the UI-only '@' prefix.
   */
  readonly travellerHandle: string;

  /**
   * The next client action after successful registration.
   *
   * Registration does not create a Session or authenticate the user.
   */
  readonly next: 'LOGIN';
}

// =============================================================================
// Mapper
// =============================================================================

export class RegisterUserResponseMapper {
  // ===========================================================================
  // Application Result → Response
  // ===========================================================================

  /**
   * Maps the complete registration workflow result into the public HTTP
   * registration response.
   *
   * RegisterUserResult contains multiple aggregates because registration
   * coordinates the records required to establish a usable user account.
   *
   * The FinancialAccount is part of that internal workflow result because
   * every registered Identity receives its foundational financial account.
   *
   * The HTTP response deliberately does not mirror that internal orchestration
   * structure.
   *
   * Only information required by the registration client crosses this
   * presentation boundary.
   */
  public static toResponse(result: RegisterUserResult): RegisterUserResponse {
    if (result === undefined || result === null) {
      throw new Error('Register user result is required.');
    }

    return {
      status: 'REGISTERED',

      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------
      //
      // IdentityAggregate exposes its public identifier through publicId.
      //
      // The internal IdentityEntity.id is deliberately not exposed.
      //
      identityPublicId: result.identity.publicId.value,

      // -----------------------------------------------------------------------
      // Traveller
      // -----------------------------------------------------------------------
      //
      // TravellerProfileAggregate exposes the TravellerHandle through its
      // handle accessor.
      //
      // TravellerHandle.value is the normalized persisted/domain value.
      // The '@' prefix remains a UI presentation concern.
      //
      travellerHandle: result.travellerProfile.handle.value,

      // -----------------------------------------------------------------------
      // Next Client Action
      // -----------------------------------------------------------------------
      //
      // Registration does not create:
      //
      // - Session
      // - Device
      // - access token
      // - refresh token
      //
      // The FinancialAccount created during registration is also not relevant
      // to the immediate client transition.
      //
      // Therefore the client must continue to the login flow.
      //
      next: 'LOGIN',
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterUserResponseMapper;
