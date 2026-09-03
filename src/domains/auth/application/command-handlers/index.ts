// -----------------------------------------------------------------------------
// Authentication — Command Handlers
// -----------------------------------------------------------------------------
//
// Central export surface for Authentication application command handlers.
//
// Command handlers coordinate application workflows and delegate business
// invariants and lifecycle transitions to their respective aggregates.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

export { CreateAuthenticationHandler } from './create-authentication.handler';

export { ActivateAuthenticationHandler } from './activate-authentication.handler';

export { LockAuthenticationHandler } from './lock-authentication.handler';

export { UnlockAuthenticationHandler } from './unlock-authentication.handler';

export { DisableAuthenticationHandler } from './disable-authentication.handler';

export { AuthenticateHandler } from './authenticate.handler';

export { RecordAuthenticationFailureHandler } from './record-authentication-failure.handler';

export { ChangePasswordHandler } from './change-password.handler';

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export { CreateSessionHandler } from './create-session.handler';

export { RefreshSessionHandler } from './refresh-session.handler';

export { RevokeSessionHandler } from './revoke-session.handler';

export { ExpireSessionHandler } from './expire-session.handler';

export { DetectSessionTokenReuseHandler } from './detect-session-token-reuse.handler';

// -----------------------------------------------------------------------------
// Device
// -----------------------------------------------------------------------------

export { CreateDeviceHandler } from './create-device.handler';

export { TrustDeviceHandler } from './trust-device.handler';

export { RecordDeviceSeenHandler } from './record-device-seen.handler';

export { RevokeDeviceHandler } from './revoke-device.handler';

// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

export { CreateRecoveryHandler } from './create-recovery.handler';

export { CompleteRecoveryHandler } from './complete-recovery.handler';

export { CancelRecoveryHandler } from './cancel-recovery.handler';

export { ExpireRecoveryHandler } from './expire-recovery.handler';

// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

export { CreateOtpChallengeHandler } from './create-otp-challenge.handler';

export { VerifyOtpChallengeHandler } from './verify-otp-challenge.handler';

export { FailOtpChallengeHandler } from './fail-otp-challenge.handler';

export { ExpireOtpChallengeHandler } from './expire-otp-challenge.handler';

export { CancelOtpChallengeHandler } from './cancel-otp-challenge.handler';
