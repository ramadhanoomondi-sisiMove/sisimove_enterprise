// src/foundation/security/password-hasher.interface.ts

export interface PasswordHasher {
  hash(password: string): Promise<string>;

  compare(password: string, hash: string): Promise<boolean>;
}
