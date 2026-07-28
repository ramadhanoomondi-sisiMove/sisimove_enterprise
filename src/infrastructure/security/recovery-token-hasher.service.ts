// recovery-token-hasher.service.ts

import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';

import type { RecoveryTokenHasher } from './recovery-token-hasher.interface';

@Injectable()
export class RecoveryTokenHasherService implements RecoveryTokenHasher {
  hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  verify(value: string, hash: string): boolean {
    const computed = this.hash(value);

    return timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(hash, 'hex'),
    );
  }
}
