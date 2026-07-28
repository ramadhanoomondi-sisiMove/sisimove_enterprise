import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface PermissionActionProps {
  value: string;
}

export class PermissionAction extends ValueObject<PermissionActionProps> {
  constructor(value: string) {
    super({
      value: value.trim().toUpperCase(),
    });
  }

  get value(): string {
    return this.props.value;
  }

  override equals(other?: PermissionAction): boolean {
    return other !== undefined && this.value === other.value;
  }

  override toString(): string {
    return this.value;
  }
}
