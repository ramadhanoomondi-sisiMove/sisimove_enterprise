// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences
// -----------------------------------------------------------------------------
//
// Presents the Journey's travel preferences.
//
// Responsibilities:
// - present smoking policy;
// - present pets policy;
// - present luggage policy;
// - present conversation preference;
// - present music preference.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no preference mutation;
// - no inference;
// - no policy transformation beyond presentation.
//
// The backend preference projection is authoritative. This component presents
// the supplied values without changing their meaning.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

import type { JourneyPreferences as JourneyPreferencesModel } from "@/features/journey/models";

import { JourneyPreferencesSummary } from "../shared";

export interface JourneyPreferencesProps {
  readonly preferences: JourneyPreferencesModel;
  readonly className?: string;
}

export function JourneyPreferences({
  preferences,
  className,
}: JourneyPreferencesProps) {
  return (
    <section
      className={cn(
        "w-full",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-4",
        className,
      )}
      aria-labelledby="journey-preferences-heading"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          Preferences
        </p>

        <h2
          id="journey-preferences-heading"
          className="mt-1 text-lg font-semibold text-[var(--foreground)]"
        >
          Travel preferences
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Preferences set for passengers travelling on this Journey.
        </p>
      </div>

      <div
        className={cn(
          "rounded-[var(--radius-md)]",
          "bg-[var(--background-subtle)]",
          "p-4",
        )}
      >
        <JourneyPreferencesSummary preferences={preferences} />
      </div>
    </section>
  );
}