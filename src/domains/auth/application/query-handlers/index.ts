// -----------------------------------------------------------------------------
// Authentication — Query Handlers
// -----------------------------------------------------------------------------
//
// Central export barrel for Authentication application query handlers.
//
// Includes:
//
// AuthenticationAggregate
// ├── GetAuthenticationHandler
// └── GetAuthenticationByIdentityHandler
//
// SessionAggregate
// ├── GetSessionHandler
// ├── GetSessionsHandler
// └── GetActiveSessionsHandler
//
// DeviceAggregate
// ├── GetDeviceHandler
// ├── GetDevicesHandler
// └── GetActiveDevicesHandler
//
// RecoveryAggregate
// ├── GetRecoveryHandler
// └── GetRecoveriesHandler
//
// OtpChallengeAggregate
// ├── GetOtpChallengeHandler
// └── GetActiveOtpChallengesHandler
//
// This file contains exports only.
// No business logic belongs here.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

export { GetAuthenticationHandler } from './get-authentication.handler';

export { GetAuthenticationByIdentityHandler } from './get-authentication-by-identity.handler';

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export { GetSessionHandler } from './get-session.handler';

export { GetSessionsHandler } from './get-sessions.handler';

export { GetActiveSessionsHandler } from './get-active-sessions.handler';

// -----------------------------------------------------------------------------
// Device
// -----------------------------------------------------------------------------

export { GetDeviceHandler } from './get-device.handler';

export { GetDevicesHandler } from './get-devices.handler';

export { GetActiveDevicesHandler } from './get-active-devices.handler';

// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

export { GetRecoveryHandler } from './get-recovery.handler';

export { GetRecoveriesHandler } from './get-recoveries.handler';

// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

export { GetOtpChallengeHandler } from './get-otp-challenge.handler';

export { GetActiveOtpChallengesHandler } from './get-active-otp-challenges.handler';
