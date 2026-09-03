// -----------------------------------------------------------------------------
// Authentication Domain — Value Objects
// -----------------------------------------------------------------------------
//
// Central barrel export for Authentication domain value objects.
//
// Aggregate / entity boundaries:
//
// Authentication
// Session
// Device
// Recovery
// OtpChallenge
//
// Value objects encapsulate domain primitives and enforce their own
// invariants. Cross-domain references remain opaque public identifiers.
//

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

export * from './authentication-public-id.vo';
export * from './authentication-identity-public-id.vo';
export * from './authentication-status.vo';
export * from './authentication-password-hash.vo';
export * from './authentication-password-version.vo';
export * from './authentication-password-changed-at.vo';
export * from './authentication-password-must-change.vo';
export * from './authentication-failure-count.vo';
export * from './authentication-failure-reason.vo';
export * from './authentication-last-failed-at.vo';
export * from './authentication-locked-at.vo';
export * from './authentication-locked-until.vo';
export * from './authentication-last-authenticated-at.vo';

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export * from './session-public-id.vo';
export * from './session-identity-public-id.vo';
export * from './session-device-public-id.vo';
export * from './session-status.vo';
export * from './session-refresh-token-hash.vo';
export * from './session-token-family-public-id.vo';
export * from './session-replaced-by-public-id.vo';
export * from './session-ip-address.vo';
export * from './session-user-agent.vo';
export * from './session-country-code.vo';
export * from './session-city.vo';
export * from './session-authenticated-at.vo';
export * from './session-last-activity-at.vo';
export * from './session-expires-at.vo';
export * from './session-revoked-at.vo';
export * from './session-revocation-reason.vo';

// -----------------------------------------------------------------------------
// Device
// -----------------------------------------------------------------------------

export * from './device-public-id.vo';
export * from './device-identity-public-id.vo';
export * from './device-status.vo';
export * from './device-trust-level.vo';
export * from './device-fingerprint.vo';
export * from './device-name.vo';
export * from './device-platform.vo';
export * from './device-operating-system.vo';
export * from './device-operating-system-version.vo';
export * from './device-browser.vo';
export * from './device-browser-version.vo';
export * from './device-type.vo';
export * from './device-trusted-at.vo';
export * from './device-last-seen-at.vo';
export * from './device-revoked-at.vo';

// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

export * from './recovery-public-id.vo';
export * from './recovery-identity-public-id.vo';
export * from './recovery-type.vo';
export * from './recovery-status.vo';
export * from './recovery-token-hash.vo';
export * from './recovery-requested-at.vo';
export * from './recovery-expires-at.vo';
export * from './recovery-completed-at.vo';
export * from './recovery-cancelled-at.vo';

// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

export * from './otp-challenge-public-id.vo';
export * from './otp-challenge-identity-public-id.vo';
export * from './otp-challenge-purpose.vo';
export * from './otp-challenge-status.vo';
export * from './otp-challenge-destination.vo';
export * from './otp-challenge-hash.vo';
export * from './otp-challenge-attempts.vo';
export * from './otp-challenge-max-attempts.vo';
export * from './otp-challenge-expires-at.vo';
export * from './otp-challenge-verified-at.vo';
