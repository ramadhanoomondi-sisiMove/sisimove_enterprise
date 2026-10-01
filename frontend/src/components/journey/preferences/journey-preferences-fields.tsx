// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Fields
// -----------------------------------------------------------------------------
//
// Presentation-only fields for Journey travel preferences.
//
// Preferences use the canonical Journey domain values directly.
// This component does not apply business rules.
// -----------------------------------------------------------------------------

import type { ChangeEvent } from "react";

import { cn } from "@/foundation/utils/cn";

import type {
  JourneyConversationPreference,
  JourneyLuggagePolicy,
  JourneyMusicPreference,
  JourneyPetsPolicy,
  JourneySmokingPolicy,
} from "@/features/journey/models";

// -----------------------------------------------------------------------------
// Field Values
// -----------------------------------------------------------------------------

export interface JourneyPreferencesFieldValues {
  readonly smoking: JourneySmokingPolicy;
  readonly pets: JourneyPetsPolicy;
  readonly luggage: JourneyLuggagePolicy;
  readonly conversation: JourneyConversationPreference;
  readonly music: JourneyMusicPreference;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPreferencesFieldsProps {
  readonly values: JourneyPreferencesFieldValues;

  readonly onChange: <
    TField extends keyof JourneyPreferencesFieldValues,
  >(
    field: TField,
    value: JourneyPreferencesFieldValues[TField],
  ) => void;

  readonly disabled?: boolean;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Canonical Presentation Options
// -----------------------------------------------------------------------------

const SMOKING_OPTIONS = [
  "ALLOWED",
  "NOT_ALLOWED",
] as const satisfies readonly JourneySmokingPolicy[];

const PETS_OPTIONS = [
  "ALLOWED",
  "NOT_ALLOWED",
  "SERVICE_ANIMALS_ONLY",
] as const satisfies readonly JourneyPetsPolicy[];

const LUGGAGE_OPTIONS = [
  "NONE",
  "LIMITED",
  "STANDARD",
  "LARGE",
] as const satisfies readonly JourneyLuggagePolicy[];

const CONVERSATION_OPTIONS = [
  "QUIET",
  "MODERATE",
  "SOCIAL",
] as const satisfies readonly JourneyConversationPreference[];

const MUSIC_OPTIONS = [
  "NONE",
  "LOW",
  "MODERATE",
  "ANY",
] as const satisfies readonly JourneyMusicPreference[];

// -----------------------------------------------------------------------------
// Shared Field Classes
// -----------------------------------------------------------------------------

const fieldClassName = cn(
  "flex",
  "min-w-0",
  "flex-col",
  "gap-1.5",
  "rounded-[var(--radius-md)]",
  "border",
  "border-[var(--border)]",
  "bg-[var(--surface)]",
  "px-3",
  "py-3",
);

const labelClassName = cn(
  "text-sm",
  "font-medium",
  "leading-5",
  "text-[var(--foreground)]",
);

const selectClassName = cn(
  "min-h-10",
  "w-full",
  "rounded-[var(--radius-sm)]",
  "border",
  "border-[var(--border)]",
  "bg-[var(--background)]",
  "px-3",
  "py-2",
  "text-sm",
  "leading-5",
  "text-[var(--foreground)]",
  "outline-none",
  "transition-colors",
  "focus:border-[var(--brand)]",
  "focus:ring-2",
  "focus:ring-[var(--brand-soft)]",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
);

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPreferencesFields({
  values,
  onChange,
  disabled = false,
  className,
}: JourneyPreferencesFieldsProps) {
  function handleSmokingChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    const value = findOption(
      SMOKING_OPTIONS,
      event.target.value,
    );

    if (value !== undefined) {
      onChange("smoking", value);
    }
  }

  function handlePetsChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    const value = findOption(
      PETS_OPTIONS,
      event.target.value,
    );

    if (value !== undefined) {
      onChange("pets", value);
    }
  }

  function handleLuggageChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    const value = findOption(
      LUGGAGE_OPTIONS,
      event.target.value,
    );

    if (value !== undefined) {
      onChange("luggage", value);
    }
  }

  function handleConversationChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    const value = findOption(
      CONVERSATION_OPTIONS,
      event.target.value,
    );

    if (value !== undefined) {
      onChange("conversation", value);
    }
  }

  function handleMusicChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    const value = findOption(
      MUSIC_OPTIONS,
      event.target.value,
    );

    if (value !== undefined) {
      onChange("music", value);
    }
  }

  return (
    <div
      className={cn(
        "grid",
        "gap-3",
        "sm:grid-cols-2",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Smoking                                                            */}
      {/* ------------------------------------------------------------------- */}

      <label className={fieldClassName}>
        <span className={labelClassName}>
          Smoking
        </span>

        <select
          value={values.smoking}
          onChange={handleSmokingChange}
          disabled={disabled}
          aria-label="Smoking policy"
          className={selectClassName}
        >
          {SMOKING_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {formatPreferenceLabel(option)}
            </option>
          ))}
        </select>
      </label>

      {/* ------------------------------------------------------------------- */}
      {/* Pets                                                               */}
      {/* ------------------------------------------------------------------- */}

      <label className={fieldClassName}>
        <span className={labelClassName}>
          Pets
        </span>

        <select
          value={values.pets}
          onChange={handlePetsChange}
          disabled={disabled}
          aria-label="Pets policy"
          className={selectClassName}
        >
          {PETS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {formatPreferenceLabel(option)}
            </option>
          ))}
        </select>
      </label>

      {/* ------------------------------------------------------------------- */}
      {/* Luggage                                                            */}
      {/* ------------------------------------------------------------------- */}

      <label className={fieldClassName}>
        <span className={labelClassName}>
          Luggage
        </span>

        <select
          value={values.luggage}
          onChange={handleLuggageChange}
          disabled={disabled}
          aria-label="Luggage policy"
          className={selectClassName}
        >
          {LUGGAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {formatPreferenceLabel(option)}
            </option>
          ))}
        </select>
      </label>

      {/* ------------------------------------------------------------------- */}
      {/* Conversation                                                       */}
      {/* ------------------------------------------------------------------- */}

      <label className={fieldClassName}>
        <span className={labelClassName}>
          Conversation
        </span>

        <select
          value={values.conversation}
          onChange={handleConversationChange}
          disabled={disabled}
          aria-label="Conversation preference"
          className={selectClassName}
        >
          {CONVERSATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {formatPreferenceLabel(option)}
            </option>
          ))}
        </select>
      </label>

      {/* ------------------------------------------------------------------- */}
      {/* Music                                                              */}
      {/* ------------------------------------------------------------------- */}

      <label className={fieldClassName}>
        <span className={labelClassName}>
          Music
        </span>

        <select
          value={values.music}
          onChange={handleMusicChange}
          disabled={disabled}
          aria-label="Music preference"
          className={selectClassName}
        >
          {MUSIC_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {formatPreferenceLabel(option)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function findOption<const T extends string>(
  options: readonly T[],
  value: string,
): T | undefined {
  return options.find((option) => option === value);
}

function formatPreferenceLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}