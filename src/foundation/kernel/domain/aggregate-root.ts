import type { DomainEvent } from './domain-event';
import { Entity } from './entity';
import type { PublicEntityId } from './public-entity-id';
import type { UniqueEntityId } from './unique-entity-id';

export abstract class AggregateRoot<
  TProps,
  TPublicId extends PublicEntityId = PublicEntityId,
> extends Entity<TProps, TPublicId> {
  private readonly _domainEvents: DomainEvent[] = [];

  protected constructor(
    props: TProps,
    id?: UniqueEntityId,
    publicId?: TPublicId,
  ) {
    super(props, id, publicId);
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;

    return events;
  }

  public get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }
}
