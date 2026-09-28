// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Model
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandScheduleResponse.
//
// Convenience flags are preserved because they are backend-provided facts.
// The frontend must not independently reconstruct these flags from dates.
// -----------------------------------------------------------------------------

export interface JourneyDemandScheduleWindow {
  readonly earliestDeparture: Date;
  readonly latestDeparture: Date;
}

export interface JourneyDemandArrivalWindow {
  readonly targetArrival: Date | undefined;
  readonly maximumArrival: Date | undefined;
}

/**
 * Journey Demand schedule response model.
 */
export interface JourneyDemandSchedule {
  /**
   * Stable public identifier exposed by the backend.
   */
  readonly publicId: string;

  /**
   * Allowed departure window.
   */
  readonly scheduleWindow: JourneyDemandScheduleWindow;

  /**
   * Optional arrival constraints.
   */
  readonly arrivalWindow: JourneyDemandArrivalWindow;

  /**
   * IANA timezone supplied by the backend.
   */
  readonly timezone: string;

  /**
   * Backend-provided schedule semantics.
   */
  readonly hasTargetArrival: boolean;
  readonly hasMaximumArrival: boolean;
  readonly hasArrivalConstraint: boolean;
  readonly hasDepartureWindow: boolean;

  /**
   * Backend-provided convenience flags describing exactness.
   */
  readonly isExactDepartureTime: boolean;
  readonly isExactArrivalTime: boolean;

  /**
   * Backend timestamps.
   */
  readonly createdAt: Date;
  readonly updatedAt: Date;
}