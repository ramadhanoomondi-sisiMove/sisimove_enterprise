// -----------------------------------------------------------------------------
// Infrastructure — Security — Recovery Token Hasher
// -----------------------------------------------------------------------------
//
// Recovery tokens are high-entropy random bearer credentials.
//
// Hashing strategy:
//
//     HMAC-SHA-256(server-side pepper, raw token)
//
// The resulting digest is persisted.
//
// Required environment variable:
//
//     SECURITY_RECOVERY_TOKEN_PEPPER
//
// The raw recovery token is NEVER persisted.
//
// Comparison uses timingSafeEqual to avoid timing side channels.
// -----------------------------------------------------------------------------

import { createHmac, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { RecoveryTokenHasher } from '../../foundation/security/recovery-token-hasher.interface';

@Injectable()
export class RecoveryTokenHasherService implements RecoveryTokenHasher {
  private readonly pepper: Buffer;

  constructor() {
    const configuredPepper = process.env.SECURITY_RECOVERY_TOKEN_PEPPER;

    if (!configuredPepper || configuredPepper.length < 32) {
      throw new Error(
        'SECURITY_RECOVERY_TOKEN_PEPPER must be configured and contain at least 32 characters.',
      );
    }

    this.pepper = Buffer.from(configuredPepper, 'utf8');
  }

  hash(token: string): string {
    this.validateToken(token);

    return createHmac('sha256', this.pepper)
      .update(token, 'utf8')
      .digest('hex');
  }

  compare(token: string, tokenHash: string): boolean {
    if (
      typeof token !== 'string' ||
      typeof tokenHash !== 'string' ||
      token.length === 0 ||
      tokenHash.length === 0
    ) {
      return false;
    }

    let expected: Buffer;

    try {
      expected = Buffer.from(this.hash(token), 'hex');
    } catch {
      return false;
    }

    const provided = Buffer.from(tokenHash, 'hex');

    if (provided.length !== expected.length) {
      return false;
    }

    return timingSafeEqual(expected, provided);
  }

  private validateToken(token: string): void {
    if (typeof token !== 'string' || token.length === 0) {
      throw new TypeError('Recovery token must be a non-empty string.');
    }
  }
}
