// src/domains/identity/domain/value-objects/email.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidEmailException } from '../exceptions/invalid-email.exception';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(normalizedEmail)) {
      throw new InvalidEmailException(email);
    }

    super({ value: normalizedEmail });
  }

  get value(): string {
    return this.props.value;
  }

  get domain(): string {
    const [, domain] = this.props.value.split('@');

    if (!domain) {
      throw new InvalidEmailException(this.props.value);
    }

    return domain;
  }

  get localPart(): string {
    const [localPart] = this.props.value.split('@');

    if (!localPart) {
      throw new InvalidEmailException(this.props.value);
    }

    return localPart;
  }
}
