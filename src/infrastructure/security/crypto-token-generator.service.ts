// -----------------------------------------------------------------------------
// Infrastructure — Security — Cryptographic Token Generator
// -----------------------------------------------------------------------------
//
// Generates opaque bearer tokens using Node.js cryptographically secure
// random bytes.
//
// Default:
//     32 bytes = 256 bits of entropy
//
// Encoding:
//     Base64URL
//
// Suitable for:
// - refresh tokens;
// - recovery tokens;
// - email verification tokens;
// - password reset tokens;
// - other opaque security credentials.
// -----------------------------------------------------------------------------

import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { TokenGenerator } from '../../foundation/security/token-generator.interface';

@Injectable()
export class CryptoTokenGeneratorService implements TokenGenerator {
  private static readonly DEFAULT_BYTE_LENGTH = 32;
  private static readonly MIN_BYTE_LENGTH = 16;
  private static readonly MAX_BYTE_LENGTH = 256;

  generate(
    byteLength = CryptoTokenGeneratorService.DEFAULT_BYTE_LENGTH,
  ): string {
    if (
      !Number.isInteger(byteLength) ||
      byteLength < CryptoTokenGeneratorService.MIN_BYTE_LENGTH ||
      byteLength > CryptoTokenGeneratorService.MAX_BYTE_LENGTH
    ) {
      throw new Error(
        `Token byte length must be between ` +
          `${CryptoTokenGeneratorService.MIN_BYTE_LENGTH} and ` +
          `${CryptoTokenGeneratorService.MAX_BYTE_LENGTH}.`,
      );
    }

    return randomBytes(byteLength).toString('base64url');
  }
}
