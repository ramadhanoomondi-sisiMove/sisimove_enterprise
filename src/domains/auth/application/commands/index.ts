// -----------------------------------------------------------------------------
// Application — Commands Barrel
// -----------------------------------------------------------------------------
//
// Central export surface for application commands.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Member Registration
// =============================================================================
//
// Complete member registration workflow.
//
// Coordinates:
//
//     Identity
//          │
//          ├── MEMBER role
//          │
//          └── Authentication
//                    │
//                    ▼
//              Verification
//                    │
//                    ▼
//             TravellerProfile
//                    │
//                    ├── Preferences
//                    │
//                    ▼
//                TrustProfile
//
// The registration command represents the application intent to create the
// initial member account and its required cross-domain onboarding state.
//
// -----------------------------------------------------------------------------

export { RegisterUserCommand } from './register-user.command';

// =============================================================================
// Authentication Lifecycle
// =============================================================================

export { CreateAuthenticationCommand } from './create-authentication.command';

export { ActivateAuthenticationCommand } from './activate-authentication.command';

export { LockAuthenticationCommand } from './lock-authentication.command';

export { UnlockAuthenticationCommand } from './unlock-authentication.command';

export { DisableAuthenticationCommand } from './disable-authentication.command';

// =============================================================================
// Authentication Login
// =============================================================================

export { AuthenticateLoginCommand } from './authenticate-login.command';

// =============================================================================
// Authentication Operations
// =============================================================================

export { AuthenticateCommand } from './authenticate.command';

export { RecordAuthenticationFailureCommand } from './record-authentication-failure.command';

// =============================================================================
// Credential Management
// =============================================================================

export { ChangePasswordCommand } from './change-password.command';

// =============================================================================
// Session — Application Commands
// =============================================================================
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

// =============================================================================
// Device — Application Commands
// =============================================================================

export { CreateDeviceCommand } from './create-device.command';

export { TrustDeviceCommand } from './trust-device.command';

export { RecordDeviceSeenCommand } from './record-device-seen.command';

export { RevokeDeviceCommand } from './revoke-device.command';

// =============================================================================
// Recovery — Application Commands
// =============================================================================
//
// Commands:
//
// - CreateRecoveryCommand
// - CompleteRecoveryCommand
// - CancelRecoveryCommand
// - ExpireRecoveryCommand
//
// -----------------------------------------------------------------------------

export { CreateRecoveryCommand } from './create-recovery.command';

export { CompleteRecoveryCommand } from './complete-recovery.command';

export { CancelRecoveryCommand } from './cancel-recovery.command';

export { ExpireRecoveryCommand } from './expire-recovery.command';

// =============================================================================
// OTP Challenge — Application Commands
// =============================================================================
//
// Commands:
//
// - CreateOtpChallengeCommand
// - VerifyOtpChallengeCommand
// - FailOtpChallengeCommand
// - ExpireOtpChallengeCommand
// - CancelOtpChallengeCommand
//
// -----------------------------------------------------------------------------

export { CreateOtpChallengeCommand } from './create-otp-challenge.command';

export { VerifyOtpChallengeCommand } from './verify-otp-challenge.command';

export { FailOtpChallengeCommand } from './fail-otp-challenge.command';

export { ExpireOtpChallengeCommand } from './expire-otp-challenge.command';

export { CancelOtpChallengeCommand } from './cancel-otp-challenge.command';
