// -----------------------------------------------------------------------------
// sisiMove — Journey Create Preferences
// -----------------------------------------------------------------------------
//
// Presentation-only creation step for collecting Journey preferences.
//
// Responsibilities:
// - collect the Journey preference flags;
// - emit primitive boolean values through onChange;
// - render the preference controls.
//
// The parent JourneyCreateForm owns:
// - any domain validation;
// - attachJourneyPreferences();
// - persistence errors;
// - navigation to the next creation step.
//
// No API calls, domain entities, or preference defaults are created here.
//
// The values intentionally mirror JourneyPreferences:
// - smoking
// - pets
// - luggage
// - conversation
// - music
//
// A boolean is used directly because these are already explicit boolean
// preferences in the frontend model and backend command.
// -----------------------------------------------------------------------------

import { cn } from "@/foundation/utils/cn";

export interface JourneyCreatePreferencesValues {
  readonly smoking: boolean;
  readonly pets: boolean;
  readonly luggage: boolean;
  readonly conversation: boolean;
  readonly music: boolean;
}

export interface JourneyCreatePreferencesProps {
  readonly values: JourneyCreatePreferencesValues;
  readonly onChange: (
    field: keyof JourneyCreatePreferencesValues,
    value: boolean,
  ) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

interface PreferenceOption {
  readonly field: keyof JourneyCreatePreferencesValues;
  readonly label: string;
  readonly description: string;
}

const PREFERENCE_OPTIONS: readonly PreferenceOption[] = [
  {
    field: "smoking",
    label: "Smoking",
    description: "Allow smoking during the journey.",
  },
  {
    field: "pets",
    label: "Pets",
    description: "Allow passengers to travel with pets.",
  },
  {
    field: "luggage",
    label: "Luggage",
    description: "Allow passengers to bring luggage.",
  },
  {
    field: "conversation",
    label: "Conversation",
    description: "Allow conversation during the journey.",
  },
  {
    field: "music",
    label: "Music",
    description: "Allow music during the journey.",
  },
];

export function JourneyCreatePreferences({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyCreatePreferencesProps) {
  return (
    <section
      aria-labelledby="journey-create-preferences-title"
      className={cn("space-y-6", className)}
    >
      <div className="space-y-1">
        <h2
          id="journey-create-preferences-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          What are your journey preferences?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Let passengers know what to expect during the journey.
        </p>
      </div>

      <div className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
        {PREFERENCE_OPTIONS.map((option) => {
          const checked = values[option.field];

          return (
            <label
              key={option.field}
              className={cn(
                "flex items-start gap-4 p-4",
                "cursor-pointer",
                "transition-colors",
                "hover:bg-[var(--background-subtle)]",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) =>
                  onChange(option.field, event.target.checked)
                }
                disabled={disabled}
                className={cn(
                  "mt-0.5",
                  "size-4",
                  "shrink-0",
                  "accent-[var(--brand)]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[var(--brand)]",
                  "focus-visible:ring-offset-2",
                )}
              />

              <span className="min-w-0 space-y-0.5">
                <span className="block text-sm font-medium text-[var(--foreground)]">
                  {option.label}
                </span>

                <span className="block text-xs leading-5 text-[var(--foreground-muted)]">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}