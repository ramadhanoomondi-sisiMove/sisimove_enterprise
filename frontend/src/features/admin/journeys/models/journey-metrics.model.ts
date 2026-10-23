
/**
 * sisiMove — Journey Metrics Model
 *
 * Frontend models for journey administration metrics.
 *
 * These interfaces describe aggregation results for the control center.
 * They do not imply that a backend endpoint already supplies them.
 */

import type { JourneyStatus } from '../utils/journey-status';

// -----------------------------------------------------------------------------
// Lifecycle metrics
// -----------------------------------------------------------------------------

export type JourneyStatusCounts = Partial<Record<JourneyStatus, number>>;

export interface JourneyLifecycleMetrics {
  total: number;
  byStatus: JourneyStatusCounts;
}

// -----------------------------------------------------------------------------
// Operational metrics
// -----------------------------------------------------------------------------

export interface JourneyOperationsMetrics {
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  journeysAtCapacity: number;
  journeysInProgress: number;
  journeysAwaitingCompletion: number;
}

// -----------------------------------------------------------------------------
// Activity metrics
// -----------------------------------------------------------------------------

export interface JourneyActivityMetrics {
  createdToday: number;
  publishedToday: number;
  startedToday: number;
  completedToday: number;
  cancelledToday: number;
}

// -----------------------------------------------------------------------------
// Control center metrics
// -----------------------------------------------------------------------------

export interface JourneyMetrics {
  lifecycle: JourneyLifecycleMetrics;
  operations: JourneyOperationsMetrics;
  activity: JourneyActivityMetrics;
  generatedAt: string;
}

// -----------------------------------------------------------------------------
// Optional metric display model
// -----------------------------------------------------------------------------

export type JourneyMetricTrend = 'up' | 'down' | 'stable' | 'unknown';

export interface JourneyMetricComparison {
  current: number;
  previous: number | null;
  change: number | null;
  changePercentage: number | null;
  trend: JourneyMetricTrend;
}
