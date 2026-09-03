// -----------------------------------------------------------------------------
// Infrastructure — Security — BCrypt Password Service
// -----------------------------------------------------------------------------
//
// Password hashing implementation.
//
// BCrypt automatically generates and embeds a unique salt in the resulting
// hash.
//
// Cost is configurable:
//
//     SECURITY_BCRYPT_ROUNDS=12
//
// Recommended production starting point:
//     12
//
// The correct value should ultimately be benchmarked against the production
// hardware and adjusted as infrastructure evolves.
// -----------------------------------------------------------------------------

import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { PasswordHasher } from '../../foundation/security/password-hasher.interface';

@Injectable()
export class BcryptPasswordService implements PasswordHasher {
  private static readonly DEFAULT_ROUNDS = 12;
  private static readonly MIN_ROUNDS = 10;
  private static readonly MAX_ROUNDS = 15;

  private readonly rounds: number;

  constructor() {
    this.rounds = BcryptPasswordService.resolveRounds(
      process.env.SECURITY_BCRYPT_ROUNDS,
    );
  }

  async hash(password: string): Promise<string> {
    BcryptPasswordService.validatePassword(password);

    return bcrypt.hash(password, this.rounds);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    if (typeof password !== 'string' || typeof passwordHash !== 'string') {
      return false;
    }

    if (password.length === 0 || passwordHash.length === 0) {
      return false;
    }

    try {
      return await bcrypt.compare(password, passwordHash);
    } catch {
      return false;
    }
  }

  private static validatePassword(password: string): void {
    if (typeof password !== 'string') {
      throw new TypeError('Password must be a string.');
    }

    if (password.length === 0) {
      throw new Error('Password cannot be empty.');
    }

    // BCrypt only processes the first 72 bytes.
    //
    // Rejecting passwords beyond that limit prevents users from believing
    // that characters beyond BCrypt's effective input limit are protected.
    const byteLength = Buffer.byteLength(password, 'utf8');

    if (byteLength > 72) {
      throw new Error(
        'Password exceeds the maximum supported BCrypt input length.',
      );
    }
  }

  private static resolveRounds(value?: string): number {
    if (!value || value.trim() === '') {
      return BcryptPasswordService.DEFAULT_ROUNDS;
    }

    const rounds = Number.parseInt(value, 10);

    if (
      !Number.isInteger(rounds) ||
      rounds < BcryptPasswordService.MIN_ROUNDS ||
      rounds > BcryptPasswordService.MAX_ROUNDS
    ) {
      throw new Error(
        `SECURITY_BCRYPT_ROUNDS must be an integer between ` +
          `${BcryptPasswordService.MIN_ROUNDS} and ` +
          `${BcryptPasswordService.MAX_ROUNDS}.`,
      );
    }

    return rounds;
  }
}
