// -----------------------------------------------------------------------------
// Journey Demand Participant Status Value Object
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Participant Status
// -----------------------------------------------------------------------------

export enum JourneyDemandParticipantStatus {
  ACTIVE = 'ACTIVE',
  WITHDRAWN = 'WITHDRAWN',
  REMOVED = 'REMOVED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandParticipantStatusProps {
  value: JourneyDemandParticipantStatus;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Journey Demand participant.
 *
 * ACTIVE:
 *   The member is currently participating in the Journey Demand.
 *
 * WITHDRAWN:
 *   The member voluntarily left the Journey Demand.
 *
 * REMOVED:
 *   The member was removed from the Journey Demand.
 */
export class JourneyDemandParticipantStatusValueObject extends ValueObject<JourneyDemandParticipantStatusProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    status: JourneyDemandParticipantStatus = JourneyDemandParticipantStatus.ACTIVE,
  ) {
    JourneyDemandParticipantStatusValueObject.assertValid(status);

    super({
      value: status,
    });
  }

  // ===========================================================================
  // Factory Methods
  // ===========================================================================

  public static active(): JourneyDemandParticipantStatusValueObject {
    return new JourneyDemandParticipantStatusValueObject(
      JourneyDemandParticipantStatus.ACTIVE,
    );
  }

  public static withdrawn(): JourneyDemandParticipantStatusValueObject {
    return new JourneyDemandParticipantStatusValueObject(
      JourneyDemandParticipantStatus.WITHDRAWN,
    );
  }

  public static removed(): JourneyDemandParticipantStatusValueObject {
    return new JourneyDemandParticipantStatusValueObject(
      JourneyDemandParticipantStatus.REMOVED,
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Reconstructs the value object from a persisted string value.
   *
   * This is intentionally strict so invalid persisted state cannot enter
   * the domain model.
   */
  public static fromString(
    value: string,
  ): JourneyDemandParticipantStatusValueObject {
    if (!JourneyDemandParticipantStatusValueObject.isValid(value)) {
      throw new Error(
        `Invalid persisted JourneyDemandParticipantStatus "${value}".`,
      );
    }

    return new JourneyDemandParticipantStatusValueObject(
      value as JourneyDemandParticipantStatus,
    );
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  public static isValid(value: string): boolean {
    return Object.values(JourneyDemandParticipantStatus).includes(
      value as JourneyDemandParticipantStatus,
    );
  }

  private static assertValid(status: JourneyDemandParticipantStatus): void {
    if (!JourneyDemandParticipantStatusValueObject.isValid(status)) {
      throw new Error(`Invalid journey demand participant status "${status}".`);
    }
  }

  // ===========================================================================
  // Accessor
  // ===========================================================================

  public get value(): JourneyDemandParticipantStatus {
    return this.props.value;
  }

  // ===========================================================================
  // State Predicates
  // ===========================================================================

  public get isActive(): boolean {
    return this.props.value === JourneyDemandParticipantStatus.ACTIVE;
  }

  public get isWithdrawn(): boolean {
    return this.props.value === JourneyDemandParticipantStatus.WITHDRAWN;
  }

  public get isRemoved(): boolean {
    return this.props.value === JourneyDemandParticipantStatus.REMOVED;
  }

  // ===========================================================================
  // Lifecycle Predicates
  // ===========================================================================

  public get isTerminal(): boolean {
    return (
      this.props.value === JourneyDemandParticipantStatus.WITHDRAWN ||
      this.props.value === JourneyDemandParticipantStatus.REMOVED
    );
  }

  public get canWithdraw(): boolean {
    return this.props.value === JourneyDemandParticipantStatus.ACTIVE;
  }

  public get canRemove(): boolean {
    return (
      this.props.value === JourneyDemandParticipantStatus.ACTIVE ||
      this.props.value === JourneyDemandParticipantStatus.WITHDRAWN
    );
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyDemandParticipantStatusProps };
