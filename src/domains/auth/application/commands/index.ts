// -----------------------------------------------------------------------------
// Authentication — Commands Barrel
// -----------------------------------------------------------------------------
//
// Central export for all Authentication application commands.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication Lifecycle
// -----------------------------------------------------------------------------

export { CreateAuthenticationCommand } from './create-authentication.command';

export { ActivateAuthenticationCommand } from './activate-authentication.command';

export { LockAuthenticationCommand } from './lock-authentication.command';

export { UnlockAuthenticationCommand } from './unlock-authentication.command';

export { DisableAuthenticationCommand } from './disable-authentication.command';

export { AuthenticateLoginCommand } from './authenticate-login.command';

// -----------------------------------------------------------------------------
// Authentication Operations
// -----------------------------------------------------------------------------

export { AuthenticateCommand } from './authenticate.command';

export { RecordAuthenticationFailureCommand } from './record-authentication-failure.command';

// -----------------------------------------------------------------------------
// Credential Management
// -----------------------------------------------------------------------------

export { ChangePasswordCommand } from './change-password.command';
// -----------------------------------------------------------------------------
// Session — Application Commands
// -----------------------------------------------------------------------------
//
// Central barrel export for Session application commands.
//
// Commands:
//
// - CreateSessionCommand
// - RefreshSessionCommand
// - RevokeSessionCommand
// - ExpireSessionCommand
// - DetectSessionTokenReuseCommand
//
// -----------------------------------------------------------------------------

export { CreateSessionCommand } from './create-session.command';

export { RefreshSessionCommand } from './refresh-session.command';

export { RevokeSessionCommand } from './revoke-session.command';

export { ExpireSessionCommand } from './expire-session.command';

export { DetectSessionTokenReuseCommand } from './detect-session-token-reuse.command';
// -----------------------------------------------------------------------------
// Device — Commands
// -----------------------------------------------------------------------------

export { CreateDeviceCommand } from './create-device.command';

export { TrustDeviceCommand } from './trust-device.command';

export { RecordDeviceSeenCommand } from './record-device-seen.command';

export { RevokeDeviceCommand } from './revoke-device.command';

//
// Commands:
//
// - CreateRecoveryCommand
// - CompleteRecoveryCommand
// - CancelRecoveryCommand
// - ExpireRecoveryCommand
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------

export { CreateRecoveryCommand } from './create-recovery.command';

// -----------------------------------------------------------------------------
// Complete
// -----------------------------------------------------------------------------

export { CompleteRecoveryCommand } from './complete-recovery.command';

// -----------------------------------------------------------------------------
// Cancel
// -----------------------------------------------------------------------------

export { CancelRecoveryCommand } from './cancel-recovery.command';

// -----------------------------------------------------------------------------
// Expire
// -----------------------------------------------------------------------------

export { ExpireRecoveryCommand } from './expire-recovery.command';
// -----------------------------------------------------------------------------
// OTP Challenge — Commands
// -----------------------------------------------------------------------------
//
// Central export surface for OTP Challenge application commands.
//
// -----------------------------------------------------------------------------

export * from './create-otp-challenge.command';

export * from './verify-otp-challenge.command';

export * from './fail-otp-challenge.command';

export * from './expire-otp-challenge.command';

export * from './cancel-otp-challenge.command';
