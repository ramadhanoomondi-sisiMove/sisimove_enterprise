// src/domains/journey/domain/value-objects/journey-status.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum JourneyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETION_REQUESTED = 'COMPLETION_REQUESTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

interface JourneyStatusProps {
  value: JourneyStatus;
}

export class JourneyStatusValueObject extends ValueObject<JourneyStatusProps> {
  constructor(status: JourneyStatus) {
    if (!Object.values(JourneyStatus).includes(status)) {
      throw new Error(`Invalid journey status "${status}".`);
    }

    super({
      value: status,
    });
  }

  get value(): JourneyStatus {
    return this.props.value;
  }

  get isDraft(): boolean {
    return this.props.value === JourneyStatus.DRAFT;
  }

  get isPublished(): boolean {
    return this.props.value === JourneyStatus.PUBLISHED;
  }

  get isInProgress(): boolean {
    return this.props.value === JourneyStatus.IN_PROGRESS;
  }

  get isCompletionRequested(): boolean {
    return this.props.value === JourneyStatus.COMPLETION_REQUESTED;
  }

  get isCompleted(): boolean {
    return this.props.value === JourneyStatus.COMPLETED;
  }

  get isCancelled(): boolean {
    return this.props.value === JourneyStatus.CANCELLED;
  }

  get isExpired(): boolean {
    return this.props.value === JourneyStatus.EXPIRED;
  }

  get canPublish(): boolean {
    return this.props.value === JourneyStatus.DRAFT;
  }

  get canStart(): boolean {
    return this.props.value === JourneyStatus.PUBLISHED;
  }

  get canRequestCompletion(): boolean {
    return this.props.value === JourneyStatus.IN_PROGRESS;
  }

  get canComplete(): boolean {
    return this.props.value === JourneyStatus.COMPLETION_REQUESTED;
  }

  get canCancel(): boolean {
    return [
      JourneyStatus.DRAFT,
      JourneyStatus.PUBLISHED,
      JourneyStatus.IN_PROGRESS,
      JourneyStatus.COMPLETION_REQUESTED,
    ].includes(this.props.value);
  }

  get canExpire(): boolean {
    return this.props.value === JourneyStatus.PUBLISHED;
  }
}
