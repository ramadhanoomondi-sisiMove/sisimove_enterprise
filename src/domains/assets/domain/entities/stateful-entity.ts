// src/domains/assets/domain/entities/stateful-entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

export abstract class StatefulEntity<
  TProps extends {
    status: TStatus;
    updatedAt: Date;
  },
  TStatus,
  TPublicId extends PublicEntityId = PublicEntityId,
> extends Entity<TProps, TPublicId> {
  protected constructor(
    props: TProps,
    id?: UniqueEntityId,
    publicId?: TPublicId,
  ) {
    super(props, id, publicId);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  get status(): TStatus {
    return this.props.status;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------------------------------------------
  // State Machine
  // --------------------------------------------------------------------------

  protected abstract get allowedTransitions(): ReadonlyMap<
    TStatus,
    readonly TStatus[]
  >;

  protected canTransitionTo(next: TStatus): boolean {
    const allowed = this.allowedTransitions.get(this.status);

    return allowed?.includes(next) ?? false;
  }

  protected transitionTo(next: TStatus, at: Date = new Date()): void {
    if (Object.is(this.status, next)) {
      return;
    }

    if (!this.canTransitionTo(next)) {
      this.onInvalidTransition(this.status, next);
    }

    this.props.status = next;

    this.touch(at);
  }

  // --------------------------------------------------------------------------
  // Infrastructure
  // --------------------------------------------------------------------------

  protected touch(at: Date = new Date()): void {
    this.props.updatedAt = at;
  }

  // --------------------------------------------------------------------------
  // Validation
  // --------------------------------------------------------------------------

  protected abstract onInvalidTransition(
    current: TStatus,
    next: TStatus,
  ): never;
}
