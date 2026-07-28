// src/domains/authorization/domain/value-objects/permission-name.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidPermissionNameException } from '../exceptions/invalid-permission-name.exception';

interface PermissionNameProps {
  value: string;
}

export class PermissionName extends ValueObject<PermissionNameProps> {
  private static readonly MAX_LENGTH = 100;

  constructor(name: string) {
    PermissionName.validate(name);

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
      throw new InvalidPermissionNameException('Permission name is required.');
    }

    if (value.length > PermissionName.MAX_LENGTH) {
      throw new InvalidPermissionNameException(
        `Permission name cannot exceed ${PermissionName.MAX_LENGTH} characters.`,
      );
    }
  }
}
