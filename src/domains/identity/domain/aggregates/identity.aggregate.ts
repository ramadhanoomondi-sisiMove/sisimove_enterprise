// src/domains/identity/domain/aggregates/identity.aggregate.ts

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { IdentityAlreadyActiveException } from '../exceptions/identity-already-active.exception';
import { IdentityClosedException } from '../exceptions/identity-closed.exception';
import { IdentityNotPendingException } from '../exceptions/identity-not-pending.exception';
import { IdentityActivatedEvent } from '../events/identity-activated.event';
import { IdentityRegisteredEvent } from '../events/identity-registered.event';
import type { Email } from '../value-objects/email.vo';
import { IdentityId } from '../value-objects/identity-id.vo';
import type { IdentityType } from '../value-objects/identity-type.enum';

export enum IdentityStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

interface IdentityProps {
  email: Email;
  phoneNumber: string | undefined;
  type: IdentityType;
  status: IdentityStatus;
  createdAt: Date;
  updatedAt: Date;
  activatedAt: Date | undefined;
  suspendedAt: Date | undefined;
  closedAt: Date | undefined;
}

export class IdentityAggregate extends AggregateRoot<IdentityProps> {
  public constructor(
    props: IdentityProps,
    id?: UniqueEntityId,
    publicId?: IdentityId,
  ) {
    super(props, id, publicId);
  }

  static register(
    type: IdentityType,
    email: Email,
    phoneNumber: string | undefined,
    correlationId: string,
  ): IdentityAggregate {
    const now = new Date();

    const identity = new IdentityAggregate(
      {
        email,
        phoneNumber,
        type,
        status: IdentityStatus.PENDING,
        createdAt: now,
        updatedAt: now,
        activatedAt: undefined,
        suspendedAt: undefined,
        closedAt: undefined,
      },
      new UniqueEntityId(),
      new IdentityId(),
    );

    identity.addDomainEvent(
      new IdentityRegisteredEvent(
        identity.id.value,
        identity.publicId.value,
        identity.email.value,
        correlationId,
      ),
    );

    return identity;
  }

  get email(): Email {
    return this.props.email;
  }

  get phoneNumber(): string | undefined {
    return this.props.phoneNumber;
  }

  get type(): IdentityType {
    return this.props.type;
  }

  get status(): IdentityStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get activatedAt(): Date | undefined {
    return this.props.activatedAt;
  }

  get suspendedAt(): Date | undefined {
    return this.props.suspendedAt;
  }

  get closedAt(): Date | undefined {
    return this.props.closedAt;
  }

  activate(correlationId: string): void {
    if (this.props.status === IdentityStatus.ACTIVE) {
      throw new IdentityAlreadyActiveException();
    }

    if (this.props.status !== IdentityStatus.PENDING) {
      throw new IdentityNotPendingException();
    }

    const now = new Date();

    this.props.status = IdentityStatus.ACTIVE;
    this.props.activatedAt = now;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new IdentityActivatedEvent(
        this.id.value,
        this.publicId.value,
        correlationId,
      ),
    );
  }

  suspend(): void {
    if (this.props.status === IdentityStatus.CLOSED) {
      throw new IdentityClosedException();
    }

    const now = new Date();

    this.props.status = IdentityStatus.SUSPENDED;
    this.props.suspendedAt = now;
    this.props.updatedAt = now;
  }

  close(): void {
    if (this.props.status === IdentityStatus.CLOSED) {
      throw new IdentityClosedException();
    }

    const now = new Date();

    this.props.status = IdentityStatus.CLOSED;
    this.props.closedAt = now;
    this.props.updatedAt = now;
  }
}
