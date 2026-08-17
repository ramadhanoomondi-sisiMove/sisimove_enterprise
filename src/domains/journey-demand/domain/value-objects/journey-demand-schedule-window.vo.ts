// -----------------------------------------------------------------------------
// Journey Demand Schedule Window
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandScheduleWindowProps {
  earliestDeparture: Date;
  latestDeparture: Date;
  targetArrival: Date | undefined;
  maximumArrival: Date | undefined;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Flexible scheduling window for a Journey Demand.
 *
 * Departure:
 *   earliestDeparture <= latestDeparture
 *
 * Arrival:
 *   targetArrival <= maximumArrival, when both are provided.
 *
 * Arrival constraints must not precede the corresponding departure window.
 */
export class JourneyDemandScheduleWindow extends ValueObject<JourneyDemandScheduleWindowProps> {
  constructor(
    earliestDeparture: Date,
    latestDeparture: Date,
    targetArrival?: Date,
    maximumArrival?: Date,
  ) {
    const earliest = JourneyDemandScheduleWindow.assertDate(
      earliestDeparture,
      'Earliest departure',
    );

    const latest = JourneyDemandScheduleWindow.assertDate(
      latestDeparture,
      'Latest departure',
    );

    const target = targetArrival
      ? JourneyDemandScheduleWindow.assertDate(targetArrival, 'Target arrival')
      : undefined;

    const maximum = maximumArrival
      ? JourneyDemandScheduleWindow.assertDate(
          maximumArrival,
          'Maximum arrival',
        )
      : undefined;

    // -------------------------------------------------------------------------
    // Departure validation
    // -------------------------------------------------------------------------

    if (earliest > latest) {
      throw new Error(
        'Journey demand earliest departure cannot be after latest departure.',
      );
    }

    // -------------------------------------------------------------------------
    // Arrival validation
    // -------------------------------------------------------------------------

    if (target && maximum && target > maximum) {
      throw new Error(
        'Journey demand target arrival cannot be after maximum arrival.',
      );
    }

    if (target && target < earliest) {
      throw new Error(
        'Journey demand target arrival cannot be before earliest departure.',
      );
    }

    if (maximum && maximum < latest) {
      throw new Error(
        'Journey demand maximum arrival cannot be before latest departure.',
      );
    }

    // -------------------------------------------------------------------------
    // Props
    // -------------------------------------------------------------------------

    super({
      earliestDeparture: new Date(earliest.getTime()),
      latestDeparture: new Date(latest.getTime()),
      targetArrival: target ? new Date(target.getTime()) : undefined,
      maximumArrival: maximum ? new Date(maximum.getTime()) : undefined,
    });
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  get earliestDeparture(): Date {
    return new Date(this.props.earliestDeparture.getTime());
  }

  get latestDeparture(): Date {
    return new Date(this.props.latestDeparture.getTime());
  }

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

  get hasArrivalWindow(): boolean {
    return (
      this.props.targetArrival !== undefined ||
      this.props.maximumArrival !== undefined
    );
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  get departureDurationMilliseconds(): number {
    return (
      this.props.latestDeparture.getTime() -
      this.props.earliestDeparture.getTime()
    );
  }

  get departureDurationMinutes(): number {
    return this.departureDurationMilliseconds / 60_000;
  }

  get arrivalWindowDurationMilliseconds(): number | undefined {
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

  get arrivalWindowDurationMinutes(): number | undefined {
    const milliseconds = this.arrivalWindowDurationMilliseconds;

    return milliseconds === undefined ? undefined : milliseconds / 60_000;
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
