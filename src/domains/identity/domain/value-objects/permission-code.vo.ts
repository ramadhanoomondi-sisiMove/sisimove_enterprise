// src/domains/authorization/domain/value-objects/permission-code.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidPermissionCodeException } from '../exceptions/invalid-permission-code.exception';

interface PermissionCodeProps {
  value: string;
}

export class PermissionCode extends ValueObject<PermissionCodeProps> {
  private static readonly PATTERN =
    /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+\.[a-z][a-z0-9_]*$/;

  constructor(code: string) {
    PermissionCode.validate(code);

    super({
      value: code,
    });
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(code: string): void {
    if (!code.trim()) {
      throw new InvalidPermissionCodeException('Permission code is required.');
    }

    if (!PermissionCode.PATTERN.test(code)) {
      throw new InvalidPermissionCodeException(
        'Permission code must follow the format resource.subresource.action.',
      );
    }
  }
}
