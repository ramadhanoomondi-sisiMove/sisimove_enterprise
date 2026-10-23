
import type {
  AdminBoarding,
  AdminBoardingEvent,
  AdminBoardingParticipant,
} from '../models';

// -----------------------------------------------------------------------------
// Date Formatting
// -----------------------------------------------------------------------------

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-KE', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const DATE_FORMATTER = new Intl.DateTimeFormat('en-KE', {
  dateStyle: 'medium',
});

export function formatAdminBoardingDateTime(
  value?: string | null,
): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return DATE_TIME_FORMATTER.format(date);
}

export function formatAdminBoardingDate(
  value?: string | null,
): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return DATE_FORMATTER.format(date);
}

// -----------------------------------------------------------------------------
// Identifier Formatting
// -----------------------------------------------------------------------------

export function formatAdminBoardingPublicId(
  publicId?: string | null,
  visibleCharacters = 12,
): string {
  if (!publicId) return '—';

  if (publicId.length <= visibleCharacters) return publicId;

  return `${publicId.slice(0, visibleCharacters)}…`;
}

// -----------------------------------------------------------------------------
// Participant Counts
// -----------------------------------------------------------------------------

export function formatAdminBoardingParticipantCount(
  participants?: AdminBoardingParticipant[] | null,
): string {
  const count = participants?.length ?? 0;

  return `${count} ${count === 1 ? 'participant' : 'participants'}`;
}

// -----------------------------------------------------------------------------
// Boarding Summary
// -----------------------------------------------------------------------------

export function formatAdminBoardingSummary(
  boarding: AdminBoarding,
): string {
  return [
    `Boarding: ${boarding.publicId}`,
    `Journey: ${boarding.journeyId}`,
    `Status: ${boarding.status}`,
    formatAdminBoardingParticipantCount(boarding.participants),
  ].join(' · ');
}

// -----------------------------------------------------------------------------
// Event Description
// -----------------------------------------------------------------------------

export function formatAdminBoardingEventTimestamp(
  event: AdminBoardingEvent,
): string {
  return formatAdminBoardingDateTime(event.occurredAt);
}
