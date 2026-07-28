import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface PermissionResourceProps {
  value: string;
}

export class PermissionResource extends ValueObject<PermissionResourceProps> {
  constructor(value: string) {
    super({
      value: value.trim().toUpperCase(),
    });
  }

  get value(): string {
    return this.props.value;
  }

  override equals(other?: PermissionResource): boolean {
    return other !== undefined && this.value === other.value;
  }

  override toString(): string {
    return this.value;
  }
}
