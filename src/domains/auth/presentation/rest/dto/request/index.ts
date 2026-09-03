// -----------------------------------------------------------------------------
// Authentication — Request DTOs
// -----------------------------------------------------------------------------
//
// Barrel export for Authentication presentation request DTOs.
//
// Aggregate boundaries:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// SessionAggregate
// └── SessionEntity
//
// DeviceAggregate
// └── DeviceEntity
//
// RecoveryAggregate
// └── RecoveryEntity
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// This module exports transport-level request DTOs only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

export { CreateAuthenticationRequestDto } from './create-authentication.request.dto';

export { ActivateAuthenticationRequestDto } from './activate-authentication.request.dto';

export { LockAuthenticationRequestDto } from './lock-authentication.request.dto';

export { UnlockAuthenticationRequestDto } from './unlock-authentication.request.dto';

export { DisableAuthenticationRequestDto } from './disable-authentication.request.dto';

export { AuthenticateRequestDto } from './authenticate.request.dto';

export { RecordAuthenticationFailureRequestDto } from './record-authentication-failure.request.dto';

export { ChangePasswordRequestDto } from './change-password.request.dto';

export { AuthenticateLoginRequestDto } from './authenticate-login.request.dto';

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export { CreateSessionRequestDto } from './create-session.request.dto';

export { RefreshSessionRequestDto } from './refresh-session.request.dto';

export { RevokeSessionRequestDto } from './revoke-session.request.dto';

export { ExpireSessionRequestDto } from './expire-session.request.dto';

export { DetectSessionTokenReuseRequestDto } from './detect-session-token-reuse.request.dto';

// -----------------------------------------------------------------------------
// Device
// -----------------------------------------------------------------------------

export { CreateDeviceRequestDto } from './create-device.request.dto';

export { TrustDeviceRequestDto } from './trust-device.request.dto';

export { RecordDeviceSeenRequestDto } from './record-device-seen.request.dto';

export { RevokeDeviceRequestDto } from './revoke-device.request.dto';

// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

export { CreateRecoveryRequestDto } from './create-recovery.request.dto';

export { CompleteRecoveryRequestDto } from './complete-recovery.request.dto';

export { CancelRecoveryRequestDto } from './cancel-recovery.request.dto';

export { ExpireRecoveryRequestDto } from './expire-recovery.request.dto';

// -----------------------------------------------------------------------------
// Default Exports
// -----------------------------------------------------------------------------
//
// Request DTOs are intentionally exported as named exports from this barrel.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

export { CreateOtpChallengeRequestDto } from './create-otp-challenge.request.dto';

export { VerifyOtpChallengeRequestDto } from './verify-otp-challenge.request.dto';

export { CancelOtpChallengeRequestDto } from './cancel-otp-challenge.request.dto';
