
import {
  AdminBoardingEventType,
  AdminBoardingParticipantRole,
  AdminBoardingParticipantStatus,
  AdminBoardingStatus,
} from './admin-boarding.enums';

// -----------------------------------------------------------------------------
// Boarding Participant
// -----------------------------------------------------------------------------

export interface AdminBoardingParticipant {
  publicId: string;
  boardingId: string;
  memberPublicId: string;
  bookingPublicId?: string | null;

  role: AdminBoardingParticipantRole;
  status: AdminBoardingParticipantStatus;

  expectedAt: string;
  boardedAt?: string | null;
  withdrawnAt?: string | null;
  noShowAt?: string | null;
  removedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Boarding Event
// -----------------------------------------------------------------------------

export interface AdminBoardingEvent {
  publicId: string;
  boardingId: string;
  type: AdminBoardingEventType;

  memberPublicId?: string | null;
  bookingPublicId?: string | null;
  actorPublicId?: string | null;

  occurredAt: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Admin Boarding
// -----------------------------------------------------------------------------

export interface AdminBoarding {
  /** Public ID of the boarding record. */
  publicId: string;

  /** Public ID of the associated journey. */
  journeyId: string;

  /** Public ID of the journey provider. */
  providerPublicId: string;

  status: AdminBoardingStatus;

  boardingStartedAt?: string | null;
  journeyStartedAt?: string | null;
  cancelledAt?: string | null;

  version: number;

  participants: AdminBoardingParticipant[];
  events: AdminBoardingEvent[];

  createdAt: string;
  updatedAt: string;
}
