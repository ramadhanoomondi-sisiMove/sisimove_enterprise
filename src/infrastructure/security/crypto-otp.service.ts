// -----------------------------------------------------------------------------
// Infrastructure — Security — OTP Service
// -----------------------------------------------------------------------------
//
// Concrete infrastructure implementation of the Foundation OtpService
// abstraction.
//
// Responsibilities:
//
// - generate cryptographically secure numeric OTPs;
// - hash generated OTPs using PasswordHasher;
// - verify raw OTPs against persisted hashes.
//
// This service does NOT:
//
// - create OtpChallenge aggregates;
// - persist OTPs;
// - persist OTP hashes directly;
// - modify OTP Challenge lifecycle state;
// - send notifications;
// - access Prisma;
// - authenticate users;
// - create Sessions.
//
// -----------------------------------------------------------------------------
//
// Security properties:
//
// - uses Node.js crypto.randomInt() for cryptographically secure randomness;
// - generates each decimal digit independently;
// - does not use Math.random();
// - does not use modulo reduction;
// - never logs OTP material;
// - delegates hashing and comparison to PasswordHasher.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js
// -----------------------------------------------------------------------------

import { randomInt } from 'node:crypto';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type {
  GeneratedOtp,
  OtpService,
} from '../../foundation/security/otp-service.interface';

import type { PasswordHasher } from '../../foundation/security/password-hasher.interface';

// -----------------------------------------------------------------------------
// Infrastructure — Security Tokens
// -----------------------------------------------------------------------------

import { SECURITY_PASSWORD_HASHER } from './security.tokens';

// =============================================================================
// Service
// =============================================================================

/**
 * Cryptographically secure OTP service.
 *
 * Generates numeric OTPs using Node.js cryptographic randomness and delegates
 * hashing and verification to the Foundation PasswordHasher abstraction.
 */
@Injectable()
export class CryptoOtpService implements OtpService {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(SECURITY_PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  // ===========================================================================
  // Generate
  // ===========================================================================

  /**
   * Generates a cryptographically secure numeric OTP and its persistence-safe
   * hash.
   *
   * Each decimal digit is generated independently using crypto.randomInt().
   *
   * This avoids:
   *
   * - Math.random();
   * - predictable pseudo-random generation;
   * - modulo bias.
   *
   * The raw OTP exists only transiently in this security/application
   * operation and is returned to the immediate caller for delivery.
   */
  public async generate(length: number): Promise<GeneratedOtp> {
    this.validateLength(length);

    let otp = '';

    for (let index = 0; index < length; index += 1) {
      otp += randomInt(0, 10).toString();
    }

    const hash = await this.passwordHasher.hash(otp);

    return {
      otp,
      hash,
    };
  }

  // ===========================================================================
  // Verify
  // ===========================================================================

  /**
   * Safely verifies a raw OTP against a persisted OTP hash.
   *
   * Invalid input returns false rather than throwing because verification is
   * a comparison operation and invalid credentials are not infrastructure
   * failures.
   */
  public async verify(otp: string, otpHash: string): Promise<boolean> {
    if (typeof otp !== 'string' || otp.length === 0) {
      return false;
    }

    if (typeof otpHash !== 'string' || otpHash.length === 0) {
      return false;
    }

    return this.passwordHasher.compare(otp, otpHash);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Validates the requested OTP length.
   *
   * OTP security-format constraints belong to the security infrastructure
   * abstraction rather than the OtpChallenge domain aggregate.
   */
  private validateLength(length: number): void {
    if (!Number.isSafeInteger(length)) {
      throw new RangeError('OTP length must be a safe integer.');
    }

    if (length < 4 || length > 12) {
      throw new RangeError('OTP length must be between 4 and 12 digits.');
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CryptoOtpService;
