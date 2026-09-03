// -----------------------------------------------------------------------------
// Infrastructure — Security — Recovery Token Service
// -----------------------------------------------------------------------------
//
// Coordinates:
//
//     TokenGenerator
//          ↓
//     RecoveryTokenHasher
//
// Responsibilities:
//
// - generate raw recovery token;
// - generate persistence-safe hash;
// - verify raw token against persisted hash.
//
// It does NOT:
//
// - create Recovery aggregates;
// - persist Recovery records;
// - modify Recovery lifecycle;
// - send emails/SMS;
// - authenticate identities;
// - generate JWTs;
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { RecoveryTokenService } from '../../foundation/security/recovery-token-service.interface';
import type { GeneratedRecoveryToken } from '../../foundation/security/recovery-token-service.interface';
import type { TokenGenerator } from '../../foundation/security/token-generator.interface';
import type { RecoveryTokenHasher } from '../../foundation/security/recovery-token-hasher.interface';

import {
  SECURITY_RECOVERY_TOKEN_HASHER,
  SECURITY_TOKEN_GENERATOR,
} from './security.tokens';

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class InfrastructureRecoveryTokenService implements RecoveryTokenService {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(SECURITY_TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGenerator,

    @Inject(SECURITY_RECOVERY_TOKEN_HASHER)
    private readonly tokenHasher: RecoveryTokenHasher,
  ) {}

  // ---------------------------------------------------------------------------
  // Generate
  // ---------------------------------------------------------------------------

  public generate(): GeneratedRecoveryToken {
    const token = this.tokenGenerator.generate(32);

    if (typeof token !== 'string' || token.length === 0) {
      throw new Error(
        'Security token generator returned an invalid recovery token.',
      );
    }

    const hash = this.tokenHasher.hash(token);

    if (typeof hash !== 'string' || hash.length === 0) {
      throw new Error('Recovery token hasher returned an invalid token hash.');
    }

    return {
      token,
      hash,
    };
  }

  // ---------------------------------------------------------------------------
  // Verify
  // ---------------------------------------------------------------------------

  public verify(token: string, tokenHash: string): boolean {
    if (typeof token !== 'string' || token.length === 0) {
      return false;
    }

    if (typeof tokenHash !== 'string' || tokenHash.length === 0) {
      return false;
    }

    return this.tokenHasher.compare(token, tokenHash);
  }
}
