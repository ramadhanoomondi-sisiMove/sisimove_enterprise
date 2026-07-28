// src/domains/authorization/domain/value-objects/role-code.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidRoleCodeException } from '../exceptions/invalid-role-code.exception';

interface RoleCodeProps {
  value: string;
}

export class RoleCode extends ValueObject<RoleCodeProps> {
  private static readonly PATTERN = /^[A-Z][A-Z0-9_]{2,63}$/;

  constructor(code: string) {
    RoleCode.validate(code);

    super({
      value: code,
    });
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(code: string): void {
    if (!code.trim()) {
      throw new InvalidRoleCodeException('Role code is required.');
    }

    if (!RoleCode.PATTERN.test(code)) {
      throw new InvalidRoleCodeException(
        'Role code must contain only uppercase letters, numbers, and underscores.',
      );
    }
  }
}
