import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

import type { TokenGenerator } from './token-generator.interface';

@Injectable()
export class CryptoTokenGeneratorService implements TokenGenerator {
  generate(bytes = 32): Promise<string> {
    return Promise.resolve(randomBytes(bytes).toString('hex'));
  }
}
