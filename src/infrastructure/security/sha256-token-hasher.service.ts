import { Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';

import type { RecoveryTokenHasher } from './recovery-token-hasher.interface';

@Injectable()
export class Sha256TokenHasherService implements RecoveryTokenHasher {
  hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  verify(value: string, hash: string): boolean {
    const valueHash = this.hash(value);

    return timingSafeEqual(Buffer.from(valueHash), Buffer.from(hash));
  }
}
