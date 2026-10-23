
import {
  AdminBoardingEventType,
  AdminBoardingParticipantStatus,
  AdminBoardingStatus,
} from '../models';

// -----------------------------------------------------------------------------
// Boarding Status Labels
// -----------------------------------------------------------------------------

export function getAdminBoardingStatusLabel(
  status: AdminBoardingStatus,
): string {
  const labels: Record<AdminBoardingStatus, string> = {
    [AdminBoardingStatus.NOT_STARTED]: 'Not Started',
    [AdminBoardingStatus.BOARDING]: 'Boarding',
    [AdminBoardingStatus.STARTED]: 'Started',
    [AdminBoardingStatus.CANCELLED]: 'Cancelled',
  };

  return labels[status];
}

// -----------------------------------------------------------------------------
// Participant Status Labels
// -----------------------------------------------------------------------------

export function getAdminBoardingParticipantStatusLabel(
  status: AdminBoardingParticipantStatus,
): string {
  const labels: Record<AdminBoardingParticipantStatus, string> = {
    [AdminBoardingParticipantStatus.EXPECTED]: 'Expected',
    [AdminBoardingParticipantStatus.BOARDED]: 'Boarded',
    [AdminBoardingParticipantStatus.WITHDRAWN]: 'Withdrawn',
    [AdminBoardingParticipantStatus.NO_SHOW]: 'No Show',
    [AdminBoardingParticipantStatus.REMOVED]: 'Removed',
  };

  return labels[status];
}

// -----------------------------------------------------------------------------
// Boarding Event Labels
// -----------------------------------------------------------------------------

export function getAdminBoardingEventLabel(
  type: AdminBoardingEventType,
): string {
  const labels: Record<AdminBoardingEventType, string> = {
    [AdminBoardingEventType.BOARDING_OPENED]: 'Boarding Opened',
    [AdminBoardingEventType.PROVIDER_BOARDED]: 'Provider Boarded',
    [AdminBoardingEventType.PASSENGER_BOARDED]: 'Passenger Boarded',
    [AdminBoardingEventType.PASSENGER_NO_SHOW]: 'Passenger No-Show',
    [AdminBoardingEventType.BOARDING_WITHDRAWN]: 'Boarding Withdrawn',
    [AdminBoardingEventType.PARTICIPANT_REMOVED]: 'Participant Removed',
    [AdminBoardingEventType.JOURNEY_STARTED]: 'Journey Started',
    [AdminBoardingEventType.BOARDING_CANCELLED]: 'Boarding Cancelled',
  };

  return labels[type];
}

// -----------------------------------------------------------------------------
// Boarding Lifecycle Helpers
// -----------------------------------------------------------------------------

export function isAdminBoardingActive(
  status: AdminBoardingStatus,
): boolean {
  return (
    status === AdminBoardingStatus.NOT_STARTED ||
    status === AdminBoardingStatus.BOARDING
  );
}

export function isAdminBoardingTerminal(
  status: AdminBoardingStatus,
): boolean {
  return (
    status === AdminBoardingStatus.STARTED ||
    status === AdminBoardingStatus.CANCELLED
  );
}

export function canAdminBoardingBeStarted(
  status: AdminBoardingStatus,
): boolean {
  return status === AdminBoardingStatus.BOARDING;
}

export function isAdminBoardingParticipantComplete(
  status: AdminBoardingParticipantStatus,
): boolean {
  return status !== AdminBoardingParticipantStatus.EXPECTED;
}
