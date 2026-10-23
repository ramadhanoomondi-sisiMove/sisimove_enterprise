
import {
  AdminBoardingParticipantStatus,
  AdminBoardingStatus,
} from './admin-boarding.enums';

// -----------------------------------------------------------------------------
// Boarding Status Metrics
// -----------------------------------------------------------------------------

export type AdminBoardingStatusCounts = Record<AdminBoardingStatus, number>;

export type AdminBoardingParticipantStatusCounts = Record<
  AdminBoardingParticipantStatus,
  number
>;

// -----------------------------------------------------------------------------
// Boarding Metrics
// -----------------------------------------------------------------------------

export interface AdminBoardingMetrics {
  totalBoardings: number;
  statusCounts: AdminBoardingStatusCounts;

  totalParticipants: number;
  participantStatusCounts: AdminBoardingParticipantStatusCounts;

  totalEvents: number;

  boardingsCreatedToday: number;
  boardingsStartedToday: number;
  boardingsCancelledToday: number;

  lastUpdatedAt?: string | null;
}
