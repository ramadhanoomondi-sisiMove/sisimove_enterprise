// src/infrastructure/security/aes-encryption.service.ts

import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

import { EncryptionService } from '../../foundation/security/encryption.interface';

@Injectable()
export class AesEncryptionService implements EncryptionService {
  private readonly algorithm = 'aes-256-gcm';

  private readonly key = Buffer.from(
    process.env.ENCRYPTION_KEY ?? '01234567890123456789012345678901',
  );

  encrypt(value: string): Promise<string> {
    const iv = randomBytes(16);

    const cipher = createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(value, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return Promise.resolve(
      Buffer.concat([iv, authTag, encrypted]).toString('base64'),
    );
  }

  decrypt(encryptedValue: string): Promise<string> {
    const buffer = Buffer.from(encryptedValue, 'base64');

    const iv = buffer.subarray(0, 16);
    const authTag = buffer.subarray(16, 32);
    const encrypted = buffer.subarray(32);

    const decipher = createDecipheriv(this.algorithm, this.key, iv);

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return Promise.resolve(decrypted.toString('utf8'));
  }
}
