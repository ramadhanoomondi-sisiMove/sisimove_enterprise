// src/infrastructure/security/bcrypt-password.service.ts

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PasswordHasher } from '../../foundation/security/password-hasher.interface';

@Injectable()
export class BcryptPasswordService implements PasswordHasher {
  private static readonly SALT_ROUNDS = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, BcryptPasswordService.SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
