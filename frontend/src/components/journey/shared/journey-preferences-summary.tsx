// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyPreferencesSummary.tsx
// -----------------------------------------------------------------------------

import {
  Cigarette,
  Luggage,
  MessageCircle,
  Music,
  PawPrint,
} from "lucide-react";

import type { JourneyPreferences } from "@/features/journey/models";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPreferencesSummaryProps {
  readonly preferences: JourneyPreferences;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

interface PreferenceItem {
  readonly label: string;
  readonly value: string;
  readonly icon: typeof Cigarette;
}

function getPreferenceItems(
  preferences: JourneyPreferences,
): readonly PreferenceItem[] {
  return [
    {
      label: "Smoking",
      value: getSmokingLabel(preferences.smoking),
      icon: Cigarette,
    },
    {
      label: "Pets",
      value: getPetsLabel(preferences.pets),
      icon: PawPrint,
    },
    {
      label: "Luggage",
      value: getLuggageLabel(preferences.luggage),
      icon: Luggage,
    },
    {
      label: "Conversation",
      value: getConversationLabel(preferences.conversation),
      icon: MessageCircle,
    },
    {
      label: "Music",
      value: getMusicLabel(preferences.music),
      icon: Music,
    },
  ];
}

// -----------------------------------------------------------------------------
// Policy labels
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
        "gap-x-3",
        "gap-y-2.5",
        "sm:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className={cn(
              "min-w-0",
              "flex",
              "items-start",
              "gap-2",
            )}
          >
            <Icon
              className={cn(
                "mt-0.5",
                "size-3.5",
                "shrink-0",
                "text-[var(--foreground-muted)]",
              )}
              aria-hidden="true"
            />

            <div className="min-w-0">
              <dt
                className={cn(
                  "text-[0.65rem]",
                  "font-medium",
                  "text-[var(--foreground-muted)]",
                )}
              >
                {item.label}
              </dt>

              <dd
                className={cn(
                  "truncate",
                  "text-xs",
                  "font-medium",
                  "text-[var(--foreground)]",
                )}
              >
                {item.value}
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}