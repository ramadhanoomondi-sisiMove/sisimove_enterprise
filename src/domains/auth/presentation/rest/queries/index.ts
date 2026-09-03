// -----------------------------------------------------------------------------
// Authentication — Query DTOs
// -----------------------------------------------------------------------------
//
// Barrel export for Authentication presentation query DTOs.
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
// This module exports transport-level query DTOs only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

export { GetAuthenticationQueryDto } from './get-authentication.query.dto';

export { GetAuthenticationByIdentityQueryDto } from './get-authentication-by-identity.query.dto';

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export { GetSessionQueryDto } from './get-session.query.dto';

export { GetSessionsQueryDto } from './get-sessions.query.dto';

export { GetActiveSessionsQueryDto } from './get-active-sessions.query.dto';

// -----------------------------------------------------------------------------
// Device
// -----------------------------------------------------------------------------

export { GetDeviceQueryDto } from './get-device.query.dto';

export { GetDevicesQueryDto } from './get-devices.query.dto';

export { GetActiveDevicesQueryDto } from './get-active-devices.query.dto';

// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

export { GetRecoveryQueryDto } from './get-recovery.query.dto';

export { GetRecoveriesQueryDto } from './get-recoveries.query.dto';

// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

export { GetOtpChallengeQueryDto } from './get-otp-challenge.query.dto';

export { GetActiveOtpChallengesQueryDto } from './get-active-otp-challenges.query.dto';
