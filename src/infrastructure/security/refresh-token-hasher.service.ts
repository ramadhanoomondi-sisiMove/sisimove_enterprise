// -----------------------------------------------------------------------------
// Security Infrastructure — Refresh Token Hasher
// -----------------------------------------------------------------------------
//
// Infrastructure implementation of RefreshTokenHasher.
//
// Refresh tokens are cryptographically random, high-entropy bearer
// credentials. SHA-256 is therefore sufficient for deriving the persisted
// token representation.
//
// Lifecycle:
//
//     TokenGenerator
//          │
//          ▼
//     Raw refresh token
//          │
//          ├──────────────────────────────► Client
//          │
//          ▼
//     RefreshTokenHasherService.hash()
//          │
//          ▼
//     SHA-256 digest
//          │
//          ▼
//     SessionRefreshTokenHash
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js
// -----------------------------------------------------------------------------

import { createHash } from 'node:crypto';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type { RefreshTokenHasher } from '../../foundation/security/refresh-token-hasher.interface';

// =============================================================================
// Service
// =============================================================================

/**
 * SHA-256 implementation of RefreshTokenHasher.
 */
@Injectable()
export class RefreshTokenHasherService implements RefreshTokenHasher {
  // ===========================================================================
  // Constants
  // ===========================================================================

  private static readonly ALGORITHM = 'sha256';

  // ===========================================================================
  // Hash
  // ===========================================================================

  /**
   * Hashes a raw refresh token.
   *
   * The raw token is never persisted or logged.
   */
  public hash(token: string): string {
    this.validateToken(token);

    return createHash(RefreshTokenHasherService.ALGORITHM)
      .update(token, 'utf8')
      .digest('hex');
  }

  // ===========================================================================
  // Compare
  // ===========================================================================

  /**
   * Compares a raw refresh token against its persisted hash.
   */
  public compare(token: string, hash: string): boolean {
    if (
      typeof token !== 'string' ||
      token.length === 0 ||
      typeof hash !== 'string' ||
      hash.length === 0
    ) {
      return false;
    }

    const calculatedHash = this.hash(token);

    return calculatedHash === hash;
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Validates the raw refresh token.
   *
   * Refresh tokens are opaque credentials and therefore MUST NOT be trimmed
   * or otherwise normalized.
   */
  private validateToken(token: string): void {
    if (typeof token !== 'string' || token.length === 0) {
      throw new Error('Refresh token is required.');
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RefreshTokenHasherService;
