// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Provider
// -----------------------------------------------------------------------------
//
// Provider participant presentation for the Journey Boarding experience.
//
// Responsibilities:
// - Locate the provider participant within the boarding aggregate.
// - Present the provider's current boarding status.
// - Expose provider identity metadata through the opaque member public ID.
// - Keep the provider visually separate from passenger participants.
//
// Architectural rules:
// - No boarding lifecycle rules are implemented here.
// - The backend aggregate remains authoritative.
// - No provider profile data is fetched here.
// - No booking data is invented for the provider.
// - Actions are intentionally owned by the boarding-actions components.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Model
// -----------------------------------------------------------------------------

import {
  JourneyBoardingParticipantRole,
  type JourneyBoarding,
  type JourneyBoardingParticipant,
} from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBoardingProviderProps {
  /**
   * Current Journey Boarding aggregate.
   */
  boarding: JourneyBoarding;

  /**
   * Optional provider participant override.
   *
   * When omitted, the component resolves the provider participant from the
   * boarding aggregate.
   */
  participant?: JourneyBoardingParticipant;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingProvider({
  boarding,
  participant,
}: JourneyBoardingProviderProps) {
  const providerParticipant =
    participant ??
    boarding.participants.find(
      (item) =>
        item.role === JourneyBoardingParticipantRole.PROVIDER,
    );

  return (
    <section
      aria-labelledby="journey-boarding-provider-title"
      className={[
        'surface-brand',
        'p-4',
        'sm:p-5',
      ].join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'flex',
          'items-start',
          'justify-between',
          'gap-4',
        ].join(' ')}
      >
        <div className="min-w-0">
          <p
            className={[
              'text-xs',
              'font-medium',
              'uppercase',
              'tracking-wide',
              'text-[var(--brand)]',
            ].join(' ')}
          >
            Provider
          </p>

          <h2
            id="journey-boarding-provider-title"
            className={[
              'mt-1',
              'text-base',
              'font-semibold',
              'text-[var(--foreground)]',
            ].join(' ')}
          >
            Journey provider
          </h2>
        </div>

        {providerParticipant && (
          <span
            className={[
              'shrink-0',
              'rounded-[var(--radius-full)]',
              'bg-[var(--background)]',
              'px-2.5',
              'py-1',
              'text-xs',
              'font-medium',
              'text-[var(--foreground-secondary)]',
            ].join(' ')}
          >
            {providerParticipant.status.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Provider Details                                                    */}
      {/* ------------------------------------------------------------------- */}

      {providerParticipant ? (
        <div
          className={[
            'mt-4',
            'flex',
            'items-center',
            'gap-3',
          ].join(' ')}
        >
          <div
            aria-hidden="true"
            className={[
              'flex',
              'h-10',
              'w-10',
              'shrink-0',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-full)]',
              'bg-[var(--brand-soft)]',
              'text-sm',
              'font-semibold',
              'text-[var(--brand)]',
            ].join(' ')}
          >
            P
          </div>

          <div className="min-w-0">
            <p
              className={[
                'truncate',
                'text-sm',
                'font-medium',
                'text-[var(--foreground)]',
              ].join(' ')}
            >
              Provider
            </p>

            <p
              className={[
                'truncate',
                'text-xs',
                'text-[var(--foreground-muted)]',
              ].join(' ')}
              title={providerParticipant.memberPublicId}
            >
              {providerParticipant.memberPublicId}
            </p>
          </div>
        </div>
      ) : (
        <p
          className={[
            'mt-4',
            'text-sm',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          Provider boarding participant is not currently available.
        </p>
      )}
    </section>
  );
}