// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Preferences
// -----------------------------------------------------------------------------
//
// Presentation component for public traveller preferences.
//
// Responsibilities:
// - Present public travel-style preferences.
// - Present daytime/nighttime preference.
// - Present departure flexibility.
// - Present preferred companion count.
//
// Non-responsibilities:
// - No API calls.
// - No authentication logic.
// - No authorization logic.
// - No booking rules.
// - No commercial rules.
// - No financial information.
// - No Trust information.
//
// -----------------------------------------------------------------------------

import type {
  TravellerPreferences,
} from '@/features/traveller-profile';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerProfilePreferencesProps {
  preferences: TravellerPreferences;
}

// -----------------------------------------------------------------------------
// Preference Item
// -----------------------------------------------------------------------------

interface PreferenceItemProps {
  label: string;
  value: string;
}

function PreferenceItem({
  label,
  value,
}: PreferenceItemProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium text-neutral-900">
        {value}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Travel Style
// -----------------------------------------------------------------------------

function formatTravelStyle(
  travelStyle: TravellerPreferences['travelStyle'],
): string | null {
  switch (travelStyle) {
    case 'QUIET':
      return 'Quiet';

    case 'SOCIAL':
      return 'Social';

    case 'FLEXIBLE':
      return 'Flexible';

    default:
      return null;
  }
}

// -----------------------------------------------------------------------------
// Boolean Preference
// -----------------------------------------------------------------------------

function formatBooleanPreference(
  value: boolean | null,
  positiveLabel: string,
  negativeLabel: string,
): string | null {
  if (value === null) {
    return null;
  }

  return value
    ? positiveLabel
    : negativeLabel;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerProfilePreferences({
  preferences,
}: TravellerProfilePreferencesProps) {
  const travelStyle =
    formatTravelStyle(
      preferences.travelStyle,
    );

  const daytimePreference =
    formatBooleanPreference(
      preferences.prefersDaytimeTravel,
      'Prefers daytime travel',
      'Does not prefer daytime travel',
    );

  const nighttimePreference =
    formatBooleanPreference(
      preferences.prefersNighttimeTravel,
      'Prefers nighttime travel',
      'Does not prefer nighttime travel',
    );

  const departurePreference =
    formatBooleanPreference(
      preferences.flexibleDeparture,
      'Flexible departure',
      'Fixed departure preference',
    );

  const companionCount =
    preferences.preferredCompanionCount;

  const hasPreferences =
    travelStyle !== null ||
    daytimePreference !== null ||
    nighttimePreference !== null ||
    departurePreference !== null ||
    companionCount !== null;

  if (!hasPreferences) {
    return null;
  }

  return (
    <section
      aria-labelledby="traveller-preferences-title"
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Travel style
        </p>

        <h2
          id="traveller-preferences-title"
          className="mt-1 text-lg font-semibold text-neutral-950"
        >
          Travel preferences
        </h2>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Preferences                                                         */}
      {/* ------------------------------------------------------------------- */}

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {travelStyle !== null ? (
          <PreferenceItem
            label="Style"
            value={travelStyle}
          />
        ) : null}

        {daytimePreference !== null ? (
          <PreferenceItem
            label="Daytime"
            value={daytimePreference}
          />
        ) : null}

        {nighttimePreference !== null ? (
          <PreferenceItem
            label="Nighttime"
            value={nighttimePreference}
          />
        ) : null}

        {departurePreference !== null ? (
          <PreferenceItem
            label="Departure"
            value={departurePreference}
          />
        ) : null}

        {companionCount !== null ? (
          <PreferenceItem
            label="Companions"
            value={
              companionCount === 1
                ? '1 preferred companion'
                : `${companionCount} preferred companions`
            }
          />
        ) : null}
      </dl>
    </section>
  );
}