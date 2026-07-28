// src/foundation/security/encryption.interface.ts

export interface EncryptionService {
  encrypt(value: string): Promise<string>;

  decrypt(encryptedValue: string): Promise<string>;
}
