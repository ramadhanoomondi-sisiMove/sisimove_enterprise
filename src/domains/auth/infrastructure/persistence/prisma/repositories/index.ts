// -----------------------------------------------------------------------------
// Authentication — Prisma Repositories
// -----------------------------------------------------------------------------
//
// Central export for Authentication infrastructure repositories.
//
// Repositories:
//
// - Authentication
// - Session
// - Device
// - Recovery
// - OTP Challenge
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

export { PrismaAuthenticationRepository } from './prisma-authentication.repository';

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export { PrismaSessionRepository } from './prisma-session.repository';

// -----------------------------------------------------------------------------
// Device
// -----------------------------------------------------------------------------

export { PrismaDeviceRepository } from './prisma-device.repository';

// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

export { PrismaRecoveryRepository } from './prisma-recovery.repository';

// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

export { PrismaOtpChallengeRepository } from './prisma-otp-challenge.repository';
