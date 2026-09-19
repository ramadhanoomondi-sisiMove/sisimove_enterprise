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
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { TravellerProfilePreferences } from '@/features/traveller-profile/models';

import { PreferenceRow } from './preference-row';

export interface TravelPreferencesSectionProps {
  readonly preferences: TravellerProfilePreferences | null;
  readonly onEdit?: () => void;
}

function getBooleanValue(value: boolean): string {
  return value ? 'Enabled' : 'Disabled';
}

export function TravelPreferencesSection({
  preferences,
  onEdit,
}: TravelPreferencesSectionProps): ReactNode {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Travel Preferences
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your preferred way to travel on sisiMove.
          </p>
        </div>

        {onEdit !== undefined ? (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Edit
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-background px-4">
        {preferences === null ? (
          <div className="py-6 text-sm text-muted-foreground">
            No travel preferences have been set yet.
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