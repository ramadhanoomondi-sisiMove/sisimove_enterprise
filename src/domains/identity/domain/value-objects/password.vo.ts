// src/domains/identity/domain/value-objects/password.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidPasswordException } from '../exceptions/invalid-password.exception';

interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  private static readonly MIN_LENGTH = 12;

  constructor(password: string) {
    Password.validate(password);

    super({ value: password });
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(password: string): void {
    if (password.length < Password.MIN_LENGTH) {
      throw new InvalidPasswordException(
        `Password must be at least ${Password.MIN_LENGTH} characters long.`,
      );
    }

    if (!/[A-Z]/.test(password)) {
      throw new InvalidPasswordException(
        'Password must contain at least one uppercase letter.',
      );
    }

    if (!/[a-z]/.test(password)) {
      throw new InvalidPasswordException(
        'Password must contain at least one lowercase letter.',
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new InvalidPasswordException(
        'Password must contain at least one number.',
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new InvalidPasswordException(
        'Password must contain at least one special character.',
      );
    }
  }
}
