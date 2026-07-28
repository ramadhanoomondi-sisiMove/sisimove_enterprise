// src/foundation/security/hashing.interface.ts

export interface HashingService {
  hash(value: string): Promise<string>;

  verify(value: string, hash: string): Promise<boolean>;
}
