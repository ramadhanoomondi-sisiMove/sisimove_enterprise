import { Inject, Injectable } from '@nestjs/common';

import {
  GeneratedRecoveryToken,
  RecoveryTokenGenerator,
} from '../../domains/identity/application/services/recovery-token-generator';

import type { RecoveryTokenHasher } from './recovery-token-hasher.interface';
import type { TokenGenerator } from './token-generator.interface';

@Injectable()
export class RecoveryTokenGeneratorService implements RecoveryTokenGenerator {
  constructor(
    @Inject('TokenGenerator')
    private readonly tokenGenerator: TokenGenerator,

    @Inject('TokenHasher')
    private readonly tokenHasher: RecoveryTokenHasher,
  ) {}

  async generate(): Promise<GeneratedRecoveryToken> {
    const token = await this.tokenGenerator.generate(64);

    return {
      token,
      hash: this.tokenHasher.hash(token),
    };
  }
}
