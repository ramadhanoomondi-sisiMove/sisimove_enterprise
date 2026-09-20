// -----------------------------------------------------------------------------
// sisiMove — Travel Preferences Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section displaying the traveller's travel preferences.
//
// Responsibilities:
// - Present the configured Traveller Profile preferences.
// - Provide the presentation-level Edit action.
// - Delegate individual preference rendering to PreferenceRow.
//
// Non-responsibilities:
// - Fetching preferences.
// - Editing preferences.
// - Persisting preference changes.
// - Applying preferences to Journey matching.
//
// Architectural note:
// - TravellerProfilePreferences is the authoritative frontend model.
// - Preferences have their own API lifecycle and therefore remain a dedicated
//   feature model rather than being flattened into TravellerProfile.
// - The management workflow owns the publicId/profileId required for mutations.
//
// Visual language:
// - Compact authenticated-profile section.
// - sisiMove blue accent for section identity.
// - Edit remains a lightweight secondary action.
// - Preference rows provide the detailed presentation.
// - Empty state uses the same surface language as the rest of the profile.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { TravellerProfilePreferences } from '@/features/traveller-profile/models';

import { PreferenceRow } from './preference-row';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravelPreferencesSectionProps {
  readonly preferences: TravellerProfilePreferences | null;
  readonly onEdit?: () => void;
}

// -----------------------------------------------------------------------------
// Presentation Helpers
// -----------------------------------------------------------------------------

function getBooleanValue(value: boolean): string {
  return value ? 'Enabled' : 'Disabled';
}

// -----------------------------------------------------------------------------
// Travel Preferences Section
// -----------------------------------------------------------------------------

export function TravelPreferencesSection({
  preferences,
  onEdit,
}: TravelPreferencesSectionProps): ReactNode {
  return (
    <section className="space-y-5">
      {/* -------------------------------------------------------------------
          Section Header
          ------------------------------------------------------------------- */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-[var(--brand)]"
            />

            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]">
              Travel Preferences
            </h2>
          </div>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            Choose how you prefer to travel and how your profile information
            may be shared on sisiMove.
          </p>
        </div>

        {onEdit !== undefined ? (
          <button
            type="button"
            onClick={onEdit}
            className={[
              'self-start shrink-0 rounded-[var(--radius-md)]',
              'px-2.5 py-1.5',
              'text-sm font-medium',
              'text-[var(--brand)]',
              'transition-colors',
              'hover:bg-[var(--brand-soft)]',
              'hover:text-[var(--brand-hover)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Edit preferences
          </button>
        ) : null}
      </div>

      {/* -------------------------------------------------------------------
          Preferences
          ------------------------------------------------------------------- */}

      <div
        className={[
          'overflow-hidden rounded-[var(--radius-2xl)]',
          'border border-[var(--border)]',
          'bg-[var(--surface)]',
          'px-4',
          'shadow-[var(--shadow-sm)]',
        ].join(' ')}
      >
        {preferences === null ? (
          <div className="px-1 py-6 sm:px-2">
            <p className="text-sm font-medium text-[var(--foreground)]">
              No travel preferences set
            </p>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              Set your preferences to control how your profile information is
              presented and how other travellers may interact with you.
            </p>

            {onEdit !== undefined ? (
              <button
                type="button"
                onClick={onEdit}
                className={[
                  'mt-4 inline-flex items-center rounded-[var(--radius-md)]',
                  'bg-[var(--brand)] px-3 py-2',
                  'text-sm font-medium text-[var(--brand-foreground)]',
                  'transition-colors',
                  'hover:bg-[var(--brand-hover)]',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[var(--brand)]',
                  'focus-visible:ring-offset-2',
                ].join(' ')}
              >
                Set preferences
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <PreferenceRow
              label="Journey history"
              value={getBooleanValue(preferences.showJourneyHistory)}
              description="Whether your journey history may be displayed on your traveller profile."
            />

            <PreferenceRow
              label="Journey statistics"
              value={getBooleanValue(preferences.showJourneyStatistics)}
              description="Whether your journey statistics may be displayed on your traveller profile."
            />

            <PreferenceRow
              label="Journey invites"
              value={getBooleanValue(preferences.allowJourneyInvites)}
              description="Whether you may receive journey invitations from other travellers."
            />
          </>
        )}
      </div>
    </section>
  );
}