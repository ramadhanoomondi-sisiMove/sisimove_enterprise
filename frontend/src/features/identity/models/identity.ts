// -----------------------------------------------------------------------------
// sisiMove — Identity Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the Identity aggregate returned by the Identity
// HTTP API.
//
// Architectural ownership:
//
//     Identity feature
//         │
//         ├── API
//         ├── server-state hooks
//         └── frontend models
//
// Authentication remains responsible for:
//
//     - access tokens;
//     - sessions;
//     - authenticated HTTP transport;
//     - authentication state.
//
// Identity remains responsible for:
//
//     - identity profile data;
//     - email;
//     - phone number;
//     - lifecycle status.
//
// IMPORTANT
//
// This model intentionally represents the HTTP response rather than exposing
// backend domain entities or value objects.
//
// The frontend must not recreate:
//
//     IdentityAggregate
//     IdentityEntity
//     IdentityEmail
//     IdentityPhoneNumber
//     IdentityPublicId
//
// Those are backend domain concerns.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Identity Status
// =============================================================================

export type IdentityStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CLOSED';

// =============================================================================
// Identity
// =============================================================================
//
// Identity is the account-level identity returned by:
//
//     GET /identities/me
//
// The public identifier is opaque to the frontend.
//
// -----------------------------------------------------------------------------

export interface Identity {
  readonly publicId: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly status: IdentityStatus;
  readonly createdAt: string;
  readonly updatedAt: string;

  readonly activatedAt: string | null;
  readonly suspendedAt: string | null;
  readonly closedAt: string | null;
}