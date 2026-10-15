/**
 * -----------------------------------------------------------------------------
 * Admin Overview — Model
 * -----------------------------------------------------------------------------
 *
 * Frontend representation of the aggregate metrics displayed by the sisiMove
 * administration dashboard.
 *
 * Architectural ownership:
 *
 *     Admin Overview feature
 *         └── models
 *             └── AdminOverviewModel
 *
 * Responsibilities:
 *
 * - Represent dashboard metrics consumed by the frontend.
 * - Provide explicit types for overview values.
 * - Keep the dashboard independent of backend persistence models.
 * - Allow the overview model to grow incrementally as API contracts are
 *   integrated.
 *
 * Current data sources:
 *
 * - GET /identities/count
 * - GET /verifications/pending-count
 * - GET /journeys/active-count
 * - GET /journey-bookings/count
 * - GET /journey-boardings/participants/count
 * - GET /journey-completions/count-by-status?status=PENDING
 * - GET /journey-settlements/count-by-status?status=PENDING
 * - GET /financial-payments/count
 *
 * All eight endpoints return a number.
 *
 * Architectural boundaries:
 *
 * - This is a frontend presentation model.
 * - It does not reproduce backend aggregates or entities.
 * - It does not perform HTTP requests.
 * - It does not implement authorization.
 * - It does not assume response formats for unintegrated endpoints.
 *
 * -----------------------------------------------------------------------------
 */

/**
 * Aggregate metrics presented by the Admin Overview dashboard.
 *
 * Additional metrics will be introduced as their backend response contracts
 * are integrated and verified.
 */
export interface AdminOverviewModel {
  /**
   * Total number of registered platform identities.
   *
   * Source: GET /identities/count
   */
  readonly totalMembers: number;

  /**
   * Total number of Verification aggregates with PENDING status.
   *
   * Source: GET /verifications/pending-count
   */
  readonly pendingVerifications: number;

  /**
   * Total number of active journeys.
   *
   * Includes journeys with PUBLISHED, FULL, BOARDING, IN_PROGRESS,
   * or COMPLETION_PENDING status, regardless of departure time.
   *
   * Source: GET /journeys/active-count
   */
  readonly activeJourneys: number;

  /**
   * Total number of Journey Booking root records.
   *
   * This is the total booking count, not only confirmed bookings.
   *
   * Source: GET /journey-bookings/count
   */
  readonly totalBookings: number;

  /**
   * Total number of participants across all Journey Boardings.
   *
   * This counts participants, not Journey Boarding aggregates or journeys.
   *
   * Source: GET /journey-boardings/participants/count
   */
  readonly totalBoardingParticipants: number;

  /**
   * Total number of Journey Completion aggregates with PENDING status.
   *
   * Source: GET /journey-completions/count-by-status?status=PENDING
   */
  readonly pendingJourneyCompletions: number;

  /**
   * Total number of Journey Settlement aggregates with PENDING status.
   *
   * Source: GET /journey-settlements/count-by-status?status=PENDING
   */
  readonly pendingJourneySettlements: number;

  /**
   * Total number of Financial Payment records, regardless of payment status.
   *
   * Source: GET /financial-payments/count
   */
  readonly totalFinancialPayments: number;
}
