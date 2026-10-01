// -----------------------------------------------------------------------------
// Path: src/features/journey/components/create/JourneyCreatePreferences.tsx
// -----------------------------------------------------------------------------
// sisiMove — Journey Create Preferences
//
// Presentation-only creation step for collecting Journey preferences.
//
// Preference types:
//
//   smoking      → boolean presentation
//   pets         → boolean presentation
//   luggage      → NONE | LIMITED | STANDARD | LARGE
//   conversation → QUIET | MODERATE | SOCIAL
//   music        → NONE | LOW | MODERATE | ANY
//
// The parent JourneyCreateForm owns all values.
// This component only presents and edits them.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Types
// =============================================================================

export type JourneyLuggagePreference =
  | "NONE"
  | "LIMITED"
  | "STANDARD"
  | "LARGE";

export type JourneyConversationPreference =
  | "QUIET"
  | "MODERATE"
  | "SOCIAL";

export type JourneyMusicPreference =
  | "NONE"
  | "LOW"
  | "MODERATE"
  | "ANY";

export interface JourneyCreatePreferencesValues {
  readonly smoking: boolean;
  readonly pets: boolean;
  readonly luggage: JourneyLuggagePreference;
  readonly conversation: JourneyConversationPreference;
  readonly music: JourneyMusicPreference;
}

export interface JourneyCreatePreferencesProps {
  readonly values: JourneyCreatePreferencesValues;

  readonly onBooleanChange: (
    field: "smoking" | "pets",
    value: boolean,
  ) => void;

  readonly onLuggageChange: (
    value: JourneyLuggagePreference,
  ) => void;

  readonly onConversationChange: (
    value: JourneyConversationPreference,
  ) => void;

  readonly onMusicChange: (
    value: JourneyMusicPreference,
  ) => void;

  readonly disabled?: boolean;

  readonly className?: string;
}

// =============================================================================
// Boolean Preference Options
// =============================================================================

interface BooleanPreferenceOption {
  readonly field: "smoking" | "pets";
  readonly label: string;
  readonly description: string;
}

const BOOLEAN_PREFERENCE_OPTIONS: readonly BooleanPreferenceOption[] = [
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
];

// =============================================================================
// Luggage Options
// =============================================================================

interface LuggageOption {
  readonly value: JourneyLuggagePreference;
  readonly label: string;
  readonly description: string;
}

const LUGGAGE_OPTIONS: readonly LuggageOption[] = [
  {
    value: "NONE",
    label: "No luggage",
    description: "Passengers cannot bring luggage.",
  },
  {
    value: "LIMITED",
    label: "Limited",
    description: "Only limited luggage is allowed.",
  },
  {
    value: "STANDARD",
    label: "Standard",
    description: "Normal passenger luggage is allowed.",
  },
  {
    value: "LARGE",
    label: "Large",
    description: "Larger luggage is allowed.",
  },
];

// =============================================================================
// Conversation Options
// =============================================================================

interface ConversationOption {
  readonly value: JourneyConversationPreference;
  readonly label: string;
  readonly description: string;
}

const CONVERSATION_OPTIONS: readonly ConversationOption[] = [
  {
    value: "QUIET",
    label: "Quiet",
    description: "A quieter journey with minimal conversation.",
  },
  {
    value: "MODERATE",
    label: "Moderate",
    description: "Normal conversation is welcome.",
  },
  {
    value: "SOCIAL",
    label: "Social",
    description: "Conversation is welcome throughout the journey.",
  },
];

// =============================================================================
// Music Options
// =============================================================================

interface MusicOption {
  readonly value: JourneyMusicPreference;
  readonly label: string;
  readonly description: string;
}

const MUSIC_OPTIONS: readonly MusicOption[] = [
  {
    value: "NONE",
    label: "No music",
    description: "No music during the journey.",
  },
  {
    value: "LOW",
    label: "Low",
    description: "Music is welcome at a low volume.",
  },
  {
    value: "MODERATE",
    label: "Moderate",
    description: "Music is welcome at a moderate volume.",
  },
  {
    value: "ANY",
    label: "Any",
    description: "Any music level is acceptable.",
  },
];

// =============================================================================
// Component
// =============================================================================

export function JourneyCreatePreferences({
  values,
  onBooleanChange,
  onLuggageChange,
  onConversationChange,
  onMusicChange,
  disabled = false,
  className,
}: JourneyCreatePreferencesProps) {
  return (
    <section
      aria-labelledby="journey-create-preferences-title"
      className={cn("space-y-6", className)}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

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

      {/* ------------------------------------------------------------------- */}
      {/* Boolean Preferences                                                 */}
      {/* ------------------------------------------------------------------- */}

      <div className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
        {BOOLEAN_PREFERENCE_OPTIONS.map((option) => {
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
                  onBooleanChange(
                    option.field,
                    event.target.checked,
                  )
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

      {/* ------------------------------------------------------------------- */}
      {/* Luggage                                                             */}
      {/* ------------------------------------------------------------------- */}

      <PreferenceChoiceGroup
        title="Luggage"
        description="Let passengers know how much luggage they can bring."
        name="journey-luggage"
        value={values.luggage}
        options={LUGGAGE_OPTIONS}
        onChange={onLuggageChange}
        disabled={disabled}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Conversation                                                        */}
      {/* ------------------------------------------------------------------- */}

      <PreferenceChoiceGroup
        title="Conversation"
        description="Let passengers know the expected conversation level."
        name="journey-conversation"
        value={values.conversation}
        options={CONVERSATION_OPTIONS}
        onChange={onConversationChange}
        disabled={disabled}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Music                                                               */}
      {/* ------------------------------------------------------------------- */}

      <PreferenceChoiceGroup
        title="Music"
        description="Let passengers know the expected music level."
        name="journey-music"
        value={values.music}
        options={MUSIC_OPTIONS}
        onChange={onMusicChange}
        disabled={disabled}
      />
    </section>
  );
}

// =============================================================================
// Shared Choice Group
// =============================================================================

interface PreferenceChoiceOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly description: string;
}

interface PreferenceChoiceGroupProps<T extends string> {
  readonly title: string;
  readonly description: string;
  readonly name: string;
  readonly value: T;
  readonly options: readonly PreferenceChoiceOption<T>[];
  readonly onChange: (value: T) => void;
  readonly disabled: boolean;
}

function PreferenceChoiceGroup<T extends string>({
  title,
  description,
  name,
  value,
  options,
  onChange,
  disabled,
}: PreferenceChoiceGroupProps<T>) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-[var(--foreground)]">
        {title}
      </legend>

      <p className="text-xs leading-5 text-[var(--foreground-muted)]">
        {description}
      </p>

      <div className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
        {options.map((option) => {
          const checked = value === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                "flex items-start gap-4 p-4",
                "cursor-pointer",
                "transition-colors",
                "hover:bg-[var(--background-subtle)]",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => {
                  onChange(option.value);
                }}
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
    </fieldset>
  );
}