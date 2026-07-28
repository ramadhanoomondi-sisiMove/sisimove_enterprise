// src/domains/identity/domain/exceptions/invalid-credentials.exception.ts

import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Invalid credentials.');
  }
}
