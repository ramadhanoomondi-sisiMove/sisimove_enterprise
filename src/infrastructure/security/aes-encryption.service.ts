// -----------------------------------------------------------------------------
// Infrastructure — Security — AES Encryption Service
// -----------------------------------------------------------------------------
//
// Concrete authenticated-encryption implementation.
//
// Algorithm:
//     AES-256-GCM
//
// Ciphertext format:
//
//     version.iv.authTag.ciphertext
//
// where every component is Base64URL encoded.
//
// Required environment variable:
//
//     SECURITY_ENCRYPTION_KEY
//
// Accepted key format:
//
//     64 hexadecimal characters = 32 bytes
//
// IMPORTANT:
//
// - never hard-code the encryption key;
// - never log the encryption key;
// - never persist the raw encryption key;
// - authentication failures must throw;
// - ciphertext integrity is authenticated by AES-GCM.
// -----------------------------------------------------------------------------

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import { EncryptionService } from '../../foundation/security/encryption.interface';

@Injectable()
export class AesEncryptionService implements EncryptionService {
  // ---------------------------------------------------------------------------
  // Cryptographic Configuration
  // ---------------------------------------------------------------------------

  private static readonly ALGORITHM = 'aes-256-gcm';

  /**
   * 96-bit IV is the recommended IV size for AES-GCM.
   */
  private static readonly IV_LENGTH = 12;

  /**
   * 128-bit authentication tag.
   */
  private static readonly AUTH_TAG_LENGTH = 16;

  /**
   * AES-256 requires exactly 32 bytes.
   */
  private static readonly KEY_LENGTH = 32;

  /**
   * Version allows future ciphertext-format migrations.
   */
  private static readonly VERSION = 'v1';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  private readonly key: Buffer;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor() {
    const configuredKey = process.env.SECURITY_ENCRYPTION_KEY;

    if (configuredKey === undefined) {
      throw new Error(
        'SECURITY_ENCRYPTION_KEY is required for AES encryption.',
      );
    }

    this.key = AesEncryptionService.parseKey(configuredKey);
  }

  // ---------------------------------------------------------------------------
  // Encrypt
  // ---------------------------------------------------------------------------

  encrypt(plaintext: string): string {
    if (typeof plaintext !== 'string') {
      throw new TypeError('Encryption plaintext must be a string.');
    }

    const iv = randomBytes(AesEncryptionService.IV_LENGTH);

    const cipher = createCipheriv(
      AesEncryptionService.ALGORITHM,
      this.key,
      iv,
      {
        authTagLength: AesEncryptionService.AUTH_TAG_LENGTH,
      },
    );

    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
      AesEncryptionService.VERSION,
      AesEncryptionService.toBase64Url(iv),
      AesEncryptionService.toBase64Url(authTag),
      AesEncryptionService.toBase64Url(ciphertext),
    ].join('.');
  }

  // ---------------------------------------------------------------------------
  // Decrypt
  // ---------------------------------------------------------------------------

  decrypt(ciphertext: string): string {
    if (typeof ciphertext !== 'string' || ciphertext.length === 0) {
      throw new TypeError('Encrypted value must be a non-empty string.');
    }

    const parts = ciphertext.split('.');

    // -------------------------------------------------------------------------
    // Validate structure BEFORE destructuring.
    //
    // TypeScript still considers array indexing potentially undefined under
    // noUncheckedIndexedAccess. A tuple guard solves this correctly without
    // unsafe non-null assertions.
    // -------------------------------------------------------------------------

    if (parts.length !== 4) {
      throw new Error('Invalid encrypted value format.');
    }

    const parsed = AesEncryptionService.asCiphertextParts(parts);

    const { version, encodedIv, encodedAuthTag, encodedCiphertext } = parsed;

    if (version !== AesEncryptionService.VERSION) {
      throw new Error(`Unsupported encrypted value version: ${version}`);
    }

    try {
      const iv = AesEncryptionService.fromBase64Url(encodedIv);

      const authTag = AesEncryptionService.fromBase64Url(encodedAuthTag);

      const encrypted = AesEncryptionService.fromBase64Url(encodedCiphertext);

      // -----------------------------------------------------------------------
      // Validate cryptographic component sizes.
      // -----------------------------------------------------------------------

      if (iv.length !== AesEncryptionService.IV_LENGTH) {
        throw new Error('Invalid AES-GCM IV length.');
      }

      if (authTag.length !== AesEncryptionService.AUTH_TAG_LENGTH) {
        throw new Error('Invalid AES-GCM authentication tag length.');
      }

      const decipher = createDecipheriv(
        AesEncryptionService.ALGORITHM,
        this.key,
        iv,
        {
          authTagLength: AesEncryptionService.AUTH_TAG_LENGTH,
        },
      );

      // -----------------------------------------------------------------------
      // Authentication tag MUST be supplied before final().
      //
      // If ciphertext or tag has been modified, final() throws.
      // -----------------------------------------------------------------------

      decipher.setAuthTag(authTag);

      const plaintext = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);

      return plaintext.toString('utf8');
    } catch {
      // -----------------------------------------------------------------------
      // Do not expose low-level cryptographic errors to callers.
      //
      // In particular, do not distinguish:
      //
      // - invalid IV;
      // - invalid tag;
      // - corrupted ciphertext;
      // - authentication failure.
      //
      // They are all treated as an invalid encrypted value.
      // -----------------------------------------------------------------------

      throw new Error('Unable to decrypt encrypted value.');
    }
  }

  // ---------------------------------------------------------------------------
  // Ciphertext Parser
  // ---------------------------------------------------------------------------

  private static asCiphertextParts(parts: string[]): {
    readonly version: string;
    readonly encodedIv: string;
    readonly encodedAuthTag: string;
    readonly encodedCiphertext: string;
  } {
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted value format.');
    }

    const version = parts[0];
    const encodedIv = parts[1];
    const encodedAuthTag = parts[2];
    const encodedCiphertext = parts[3];

    if (
      version === undefined ||
      encodedIv === undefined ||
      encodedAuthTag === undefined ||
      encodedCiphertext === undefined
    ) {
      throw new Error('Invalid encrypted value format.');
    }

    if (
      version.length === 0 ||
      encodedIv.length === 0 ||
      encodedAuthTag.length === 0 ||
      encodedCiphertext.length === 0
    ) {
      throw new Error('Invalid encrypted value format.');
    }

    return {
      version,
      encodedIv,
      encodedAuthTag,
      encodedCiphertext,
    };
  }

  // ---------------------------------------------------------------------------
  // Encryption Key Parser
  // ---------------------------------------------------------------------------

  private static parseKey(value: string): Buffer {
    const normalized = value.trim();

    if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
      throw new Error(
        'SECURITY_ENCRYPTION_KEY must contain exactly 64 hexadecimal characters.',
      );
    }

    const key = Buffer.from(normalized, 'hex');

    if (key.length !== AesEncryptionService.KEY_LENGTH) {
      throw new Error('SECURITY_ENCRYPTION_KEY must be exactly 32 bytes.');
    }

    return key;
  }

  // ---------------------------------------------------------------------------
  // Base64URL Encoding
  // ---------------------------------------------------------------------------

  private static toBase64Url(value: Buffer): string {
    return value
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  // ---------------------------------------------------------------------------
  // Base64URL Decoding
  // ---------------------------------------------------------------------------

  private static fromBase64Url(value: string): Buffer {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');

    const padding = normalized.length % 4;

    return Buffer.from(
      normalized + (padding === 0 ? '' : '='.repeat(4 - padding)),
      'base64',
    );
  }
}
