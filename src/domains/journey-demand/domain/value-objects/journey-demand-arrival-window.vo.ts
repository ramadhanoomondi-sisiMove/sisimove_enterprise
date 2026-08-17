// -----------------------------------------------------------------------------
// Journey Demand Arrival Window
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandArrivalWindowProps {
  targetArrival: Date | undefined;
  maximumArrival: Date | undefined;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Arrival constraints for a Journey Demand.
 *
 * Target arrival represents the preferred arrival time.
 * Maximum arrival represents the latest acceptable arrival time.
 *
 * Constraints:
 *   targetArrival <= maximumArrival, when both are provided.
 */
export class JourneyDemandArrivalWindow extends ValueObject<JourneyDemandArrivalWindowProps> {
  constructor(targetArrival?: Date, maximumArrival?: Date) {
    const target = targetArrival
      ? JourneyDemandArrivalWindow.assertDate(targetArrival, 'Target arrival')
      : undefined;

    const maximum = maximumArrival
      ? JourneyDemandArrivalWindow.assertDate(maximumArrival, 'Maximum arrival')
      : undefined;

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------

    if (target && maximum && target > maximum) {
      throw new Error(
        'Journey demand target arrival cannot be after maximum arrival.',
      );
    }

    // -------------------------------------------------------------------------
    // Props
    // -------------------------------------------------------------------------

    super({
      targetArrival: target ? new Date(target.getTime()) : undefined,
      maximumArrival: maximum ? new Date(maximum.getTime()) : undefined,
    });
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  get targetArrival(): Date | undefined {
    return this.props.targetArrival
      ? new Date(this.props.targetArrival.getTime())
      : undefined;
  }

  get maximumArrival(): Date | undefined {
    return this.props.maximumArrival
      ? new Date(this.props.maximumArrival.getTime())
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  get hasTargetArrival(): boolean {
    return this.props.targetArrival !== undefined;
  }

  get hasMaximumArrival(): boolean {
    return this.props.maximumArrival !== undefined;
  }

  get hasWindow(): boolean {
    return (
      this.props.targetArrival !== undefined ||
      this.props.maximumArrival !== undefined
    );
  }

  get isExactArrivalTime(): boolean {
    return (
      this.props.targetArrival !== undefined &&
      this.props.maximumArrival !== undefined &&
      this.props.targetArrival.getTime() === this.props.maximumArrival.getTime()
    );
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  get windowDurationMilliseconds(): number | undefined {
    if (
      this.props.targetArrival === undefined ||
      this.props.maximumArrival === undefined
    ) {
      return undefined;
    }

    return (
      this.props.maximumArrival.getTime() - this.props.targetArrival.getTime()
    );
  }

  get windowDurationMinutes(): number | undefined {
    const milliseconds = this.windowDurationMilliseconds;

    return milliseconds === undefined ? undefined : milliseconds / 60_000;
  }

  // ---------------------------------------------------------------------------
  // Factory-style helpers
  // ---------------------------------------------------------------------------

  withTargetArrival(targetArrival: Date): JourneyDemandArrivalWindow {
    return new JourneyDemandArrivalWindow(
      targetArrival,
      this.props.maximumArrival,
    );
  }

  withMaximumArrival(maximumArrival: Date): JourneyDemandArrivalWindow {
    return new JourneyDemandArrivalWindow(
      this.props.targetArrival,
      maximumArrival,
    );
  }

  clearTargetArrival(): JourneyDemandArrivalWindow {
    return new JourneyDemandArrivalWindow(undefined, this.props.maximumArrival);
  }

  clearMaximumArrival(): JourneyDemandArrivalWindow {
    return new JourneyDemandArrivalWindow(this.props.targetArrival, undefined);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertDate(value: Date, fieldName: string): Date {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error(`${fieldName} must be a valid Date.`);
    }

    return value;
  }
}
