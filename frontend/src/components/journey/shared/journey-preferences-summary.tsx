// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Summary
// -----------------------------------------------------------------------------
//
// Compact read-only presentation of Journey preferences.
//
// Responsibilities:
// - Present the explicit JourneyPreferences projection.
// - Translate backend policy values into human-readable labels.
// - Keep backend enum values intact at the model boundary.
// - Provide a compact summary suitable for Journey cards and detail views.
//
// This component does NOT:
// - reconstruct preferences from booleans;
// - infer policies from other Journey fields;
// - mutate preferences;
// - validate domain rules;
// - decide whether a preference is required;
// - recreate JourneyPreferences domain behavior.
//
// The Journey backend remains authoritative for the actual preference values.
//
// -----------------------------------------------------------------------------
//
// JourneyPreferences
//      │
//      ├── smoking
//      ├── pets
//      ├── luggage
//      ├── conversation
//      └── music
//              │
//              ▼
//      JourneyPreferencesSummary
//              │
//              └── human-readable presentation
//
// -----------------------------------------------------------------------------

import type { JourneyPreferences } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPreferencesSummaryProps {
  /**
   * Backend-projected Journey preferences.
   */
  readonly preferences: JourneyPreferences;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

interface PreferenceItem {
  readonly label: string;
  readonly value: string;
}

function getPreferenceItems(
  preferences: JourneyPreferences,
): readonly PreferenceItem[] {
  return [
    {
      label: "Smoking",
      value: getSmokingLabel(preferences.smoking),
    },
    {
      label: "Pets",
      value: getPetsLabel(preferences.pets),
    },
    {
      label: "Luggage",
      value: getLuggageLabel(preferences.luggage),
    },
    {
      label: "Conversation",
      value: getConversationLabel(preferences.conversation),
    },
    {
      label: "Music",
      value: getMusicLabel(preferences.music),
    },
  ];
}

// -----------------------------------------------------------------------------
// Policy labels
// -----------------------------------------------------------------------------
//
// These functions intentionally perform presentation mapping only.
//
// They do not alter, normalize, or reinterpret the backend values.
// -----------------------------------------------------------------------------

function getSmokingLabel(
  value: JourneyPreferences["smoking"],
): string {
  switch (value) {
    case "ALLOWED":
      return "Allowed";

    case "NOT_ALLOWED":
      return "Not allowed";
  }
}

function getPetsLabel(
  value: JourneyPreferences["pets"],
): string {
  switch (value) {
    case "ALLOWED":
      return "Allowed";

    case "NOT_ALLOWED":
      return "Not allowed";

    case "SERVICE_ANIMALS_ONLY":
      return "Service animals only";
  }
}

function getLuggageLabel(
  value: JourneyPreferences["luggage"],
): string {
  switch (value) {
    case "NONE":
      return "None";

    case "LIMITED":
      return "Limited";

    case "STANDARD":
      return "Standard";

    case "LARGE":
      return "Large";
  }
}

function getConversationLabel(
  value: JourneyPreferences["conversation"],
): string {
  switch (value) {
    case "QUIET":
      return "Quiet";

    case "MODERATE":
      return "Moderate";

    case "SOCIAL":
      return "Social";
  }
}

function getMusicLabel(
  value: JourneyPreferences["music"],
): string {
  switch (value) {
    case "NONE":
      return "None";

    case "LOW":
      return "Low";

    case "MODERATE":
      return "Moderate";

    case "ANY":
      return "Any";
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPreferencesSummary({
  preferences,
  className,
}: JourneyPreferencesSummaryProps) {
  const items = getPreferenceItems(preferences);

  return (
    <dl
      className={cn(
        "grid",
        "grid-cols-2",
        "gap-x-4",
        "gap-y-3",
        "sm:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "min-w-0",
            "space-y-0.5",
          )}
        >
          <dt className="text-xs text-[var(--foreground-muted)]">
            {item.label}
          </dt>

          <dd className="truncate text-sm font-medium text-[var(--foreground)]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}