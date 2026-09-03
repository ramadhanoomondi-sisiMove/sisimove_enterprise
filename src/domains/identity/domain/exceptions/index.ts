// -----------------------------------------------------------------------------
// Identity Domain — Exceptions
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

export * from './identity.exception';

export * from './identity-invariant.exception';

export * from './identity-not-found.exception';

export * from './identity-invalid-status-transition.exception';

export * from './identity-already-exists.exception';

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

export * from './verification.exception';

export * from './verification-invariant.exception';

export * from './verification-not-found.exception';

export * from './verification-invalid-status.exception';

export * from './verification-expired.exception';

export * from './verification-rejected.exception';

// -----------------------------------------------------------------------------
// Verification Request
// -----------------------------------------------------------------------------

export * from './verification-request.exception';

export * from './verification-request-not-found.exception';

export * from './verification-request-invalid-status.exception';

export * from './verification-request-already-submitted.exception';

// -----------------------------------------------------------------------------
// Role
// -----------------------------------------------------------------------------

export * from './role.exception';

export * from './role-not-found.exception';

export * from './role-already-exists.exception';

export * from './role-inactive.exception';

// -----------------------------------------------------------------------------
// Permission
// -----------------------------------------------------------------------------

export * from './permission.exception';

export * from './permission-not-found.exception';

export * from './permission-already-exists.exception';

// -----------------------------------------------------------------------------
// Identity Role
// -----------------------------------------------------------------------------

export * from './identity-role.exception';

export * from './identity-role-already-assigned.exception';

export * from './identity-role-revoked.exception';

// -----------------------------------------------------------------------------
// Role Permission
// -----------------------------------------------------------------------------

export * from './role-permission.exception';

export * from './role-permission-already-assigned.exception';

export * from './role-permission-revoked.exception';
export * from './role-permission-not-found.exception';
