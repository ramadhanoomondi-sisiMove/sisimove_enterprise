// -----------------------------------------------------------------------------
// Authentication Domain Exceptions — Barrel Export
// -----------------------------------------------------------------------------
//
// Central export surface for Authentication domain exceptions.
//
// Includes exceptions for:
//
// - Authentication;
// - Session;
// - Device;
// - Recovery;
// - OTP Challenge.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Authentication
// =============================================================================

export * from './authentication.exception';

export * from './authentication-not-found.exception';

export * from './authentication-already-exists.exception';

export * from './authentication-invalid-status.exception';

export * from './authentication-locked.exception';

export * from './authentication-disabled.exception';

export * from './authentication-invalid-credentials.exception';

export * from './authentication-password-change-required.exception';

// =============================================================================
// Session
// =============================================================================

export * from './session.exception';

export * from './session-not-found.exception';

export * from './session-already-revoked.exception';

export * from './session-expired.exception';

export * from './session-invalid-status.exception';

export * from './session-token-reuse.exception';

// =============================================================================
// Device
// =============================================================================

export * from './device.exception';

export * from './device-not-found.exception';

export * from './device-already-exists.exception';

export * from './device-revoked.exception';

export * from './device-invalid-status.exception';

// =============================================================================
// Recovery
// =============================================================================

export * from './recovery.exception';

export * from './recovery-not-found.exception';

export * from './recovery-invalid-status.exception';

export * from './recovery-expired.exception';

export * from './recovery-already-completed.exception';

export * from './recovery-already-cancelled.exception';

// =============================================================================
// OTP Challenge
// =============================================================================

export * from './otp-challenge.exception';

export * from './otp-challenge-not-found.exception';

export * from './otp-challenge-expired.exception';

export * from './otp-challenge-invalid-status.exception';

export * from './otp-challenge-max-attempts-exceeded.exception';

export * from './otp-challenge-invalid-code.exception';
