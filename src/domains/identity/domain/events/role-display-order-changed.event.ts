import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class RoleDisplayOrderChangedEvent extends DomainEvent {
  constructor(
    public readonly roleId: string,
    public readonly publicId: string,
    public readonly previousDisplayOrder: number,
    public readonly displayOrder: number,
    public readonly changedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      roleId,
      'Role',
      'RoleDisplayOrderChanged',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      roleId: this.roleId,
      publicId: this.publicId,
      previousDisplayOrder: this.previousDisplayOrder,
      displayOrder: this.displayOrder,
      changedAt: this.changedAt,
    };
  }
}
