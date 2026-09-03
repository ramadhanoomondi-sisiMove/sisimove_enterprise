// -----------------------------------------------------------------------------
// Authentication — Repository Index
// -----------------------------------------------------------------------------
//
// Central barrel export for Authentication-domain repository contracts.
//
// Repository boundaries:
//
// AuthenticationAggregate
// SessionAggregate
// DeviceAggregate
// RecoveryAggregate
// OtpChallengeAggregate
//
// Responsibilities:
//
// - Expose repository contracts through a single import boundary.
// - Keep application-layer imports independent of individual repository files.
// - Prevent consumers from depending on repository implementation details.
//
// Concrete repository implementations belong to the infrastructure layer.
//
// -----------------------------------------------------------------------------

export * from './authentication.repository';

export * from './session.repository';

export * from './device.repository';

export * from './recovery.repository';

export * from './otp-challenge.repository';
