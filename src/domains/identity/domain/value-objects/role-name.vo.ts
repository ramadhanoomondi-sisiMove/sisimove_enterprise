// src/domains/authorization/domain/value-objects/role-name.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidRoleNameException } from '../exceptions/invalid-role-name.exception';

interface RoleNameProps {
  value: string;
}

export class RoleName extends ValueObject<RoleNameProps> {
  private static readonly MAX_LENGTH = 100;

  constructor(name: string) {
    RoleName.validate(name);

    super({
      value: name.trim(),
    });
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(name: string): void {
    const value = name.trim();

    if (!value) {
      throw new InvalidRoleNameException('Role name is required.');
    }

    if (value.length > RoleName.MAX_LENGTH) {
      throw new InvalidRoleNameException(
        `Role name cannot exceed ${RoleName.MAX_LENGTH} characters.`,
      );
    }
  }
}
