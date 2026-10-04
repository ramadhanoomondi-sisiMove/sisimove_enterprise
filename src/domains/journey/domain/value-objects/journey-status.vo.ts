// src/domains/journey/domain/value-objects/journey-status.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Journey Status
// -----------------------------------------------------------------------------

export enum JourneyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  FULL = 'FULL',
  BOARDING = 'BOARDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETION_PENDING = 'COMPLETION_PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyStatusProps {
  value: JourneyStatus;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyStatusValueObject extends ValueObject<JourneyStatusProps> {
  constructor(status: JourneyStatus) {
    if (!Object.values(JourneyStatus).includes(status)) {
      throw new Error(`Invalid journey status "${status}".`);
    }

    super({
      value: status,
    });
  }

  // ===========================================================================
  // Value
  // ===========================================================================

  get value(): JourneyStatus {
    return this.props.value;
  }

  // ===========================================================================
  // Status Checks
  // ===========================================================================

  get isDraft(): boolean {
    return this.props.value === JourneyStatus.DRAFT;
  }

  get isPublished(): boolean {
    return this.props.value === JourneyStatus.PUBLISHED;
  }

  get isFull(): boolean {
    return this.props.value === JourneyStatus.FULL;
  }

  get isBoarding(): boolean {
    return this.props.value === JourneyStatus.BOARDING;
  }

  get isInProgress(): boolean {
    return this.props.value === JourneyStatus.IN_PROGRESS;
  }

  get isCompletionPending(): boolean {
    return this.props.value === JourneyStatus.COMPLETION_PENDING;
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

  // ===========================================================================
  // Lifecycle Classification
  // ===========================================================================

  get isTerminal(): boolean {
    return (
      this.props.value === JourneyStatus.COMPLETED ||
      this.props.value === JourneyStatus.CANCELLED ||
      this.props.value === JourneyStatus.EXPIRED
    );
  }

  get isActive(): boolean {
    return (
      this.props.value === JourneyStatus.PUBLISHED ||
      this.props.value === JourneyStatus.FULL ||
      this.props.value === JourneyStatus.BOARDING ||
      this.props.value === JourneyStatus.IN_PROGRESS ||
      this.props.value === JourneyStatus.COMPLETION_PENDING
    );
  }

  // ===========================================================================
  // Marketplace Visibility
  // ===========================================================================

  get isMarketplaceVisible(): boolean {
    return (
      this.props.value === JourneyStatus.PUBLISHED ||
      this.props.value === JourneyStatus.FULL ||
      this.props.value === JourneyStatus.BOARDING ||
      this.props.value === JourneyStatus.IN_PROGRESS ||
      this.props.value === JourneyStatus.COMPLETION_PENDING
    );
  }

  get isMarketplaceHidden(): boolean {
    return !this.isMarketplaceVisible;
  }

  // ===========================================================================
  // Lifecycle Transitions
  // ===========================================================================

  get canPublish(): boolean {
    return this.props.value === JourneyStatus.DRAFT;
  }

  get canStart(): boolean {
    return (
      this.props.value === JourneyStatus.PUBLISHED ||
      this.props.value === JourneyStatus.FULL
    );
  }

  get canRequestCompletion(): boolean {
    return this.props.value === JourneyStatus.IN_PROGRESS;
  }

  get canComplete(): boolean {
    return this.props.value === JourneyStatus.COMPLETION_PENDING;
  }

  get canCancel(): boolean {
    return [
      JourneyStatus.DRAFT,
      JourneyStatus.PUBLISHED,
      JourneyStatus.FULL,
      JourneyStatus.BOARDING,
      JourneyStatus.IN_PROGRESS,
      JourneyStatus.COMPLETION_PENDING,
    ].includes(this.props.value);
  }

  get canExpire(): boolean {
    return (
      this.props.value === JourneyStatus.PUBLISHED ||
      this.props.value === JourneyStatus.FULL
    );
  }
}
