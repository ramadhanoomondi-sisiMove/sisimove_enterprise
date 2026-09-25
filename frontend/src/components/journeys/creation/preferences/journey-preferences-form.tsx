// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Form
// -----------------------------------------------------------------------------
//
// Presentation-only form for configuring Journey preferences.
//
// Architectural boundary:
// - This form owns local input state and presentation.
// - It emits plain primitive/enumeration values.
// - It does NOT call the Journey API.
// - It does NOT create JourneyPreferences.
// - It does NOT know about Journey aggregates.
// - It does NOT perform authorization.
// - It does NOT determine whether a Journey may be modified.
// - It does NOT navigate.
//
// The route/workflow owns persistence and invokes:
//
//   useAttachJourneyPreferences()
//          │
//          ▼
//   attachJourneyPreferences()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   AttachJourneyPreferencesCommand
//          │
//          ▼
//   Journey Aggregate
//          │
//          ▼
//        save()
//
// Existing persisted preferences may be supplied through `initialValue`.
//
// The frontend model represents Journey preference values as string unions
// with readonly runtime constant arrays. This form therefore uses the
// exported constants rather than assuming TypeScript runtime enums.
// -----------------------------------------------------------------------------

'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import {
  JOURNEY_CONVERSATION_PREFERENCES,
  JOURNEY_LUGGAGE_POLICIES,
  JOURNEY_MUSIC_PREFERENCES,
  JOURNEY_PETS_POLICIES,
  JOURNEY_SMOKING_POLICIES,
} from '@/features/journey';

import type {
  JourneyConversationPreference,
  JourneyLuggagePolicy,
  JourneyMusicPreference,
  JourneyPetsPolicy,
  JourneySmokingPolicy,
} from '@/features/journey';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyPreferencesFormInitialValue {
  /**
   * Existing Journey smoking policy.
   */
  smoking?: JourneySmokingPolicy;

  /**
   * Existing Journey pets policy.
   */
  pets?: JourneyPetsPolicy;

  /**
   * Existing Journey luggage policy.
   */
  luggage?: JourneyLuggagePolicy;

  /**
   * Existing Journey conversation preference.
   */
  conversation?: JourneyConversationPreference;

  /**
   * Existing Journey music preference.
   */
  music?: JourneyMusicPreference;
}

export interface JourneyPreferencesFormSubmitValue {
  /**
   * Smoking policy to configure on the Journey.
   */
  smoking: JourneySmokingPolicy;

  /**
   * Pets policy to configure on the Journey.
   */
  pets: JourneyPetsPolicy;

  /**
   * Luggage policy to configure on the Journey.
   */
  luggage: JourneyLuggagePolicy;

  /**
   * Conversation environment to configure on the Journey.
   */
  conversation: JourneyConversationPreference;

  /**
   * Music environment to configure on the Journey.
   */
  music: JourneyMusicPreference;
}

export interface JourneyPreferencesFormProps {
  /**
   * Existing Journey Preferences used to initialise the form.
   */
  initialValue?: JourneyPreferencesFormInitialValue;

  /**
   * Disables all form controls.
   */
  disabled?: boolean;

  /**
   * Called whenever the local form draft changes.
   *
   * The form emits the complete current draft rather than only the field
   * that changed. This keeps the parent workflow independent of individual
   * control state.
   */
  onChange?: (
    value: Partial<JourneyPreferencesFormSubmitValue>,
  ) => void;

  /**
   * Called with the complete Preferences configuration after submission.
   */
  onSubmit?: (
    value: JourneyPreferencesFormSubmitValue,
  ) => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_SMOKING: JourneySmokingPolicy =
  'NOT_ALLOWED';

const DEFAULT_PETS: JourneyPetsPolicy =
  'NOT_ALLOWED';

const DEFAULT_LUGGAGE: JourneyLuggagePolicy =
  'STANDARD';

const DEFAULT_CONVERSATION: JourneyConversationPreference =
  'MODERATE';

const DEFAULT_MUSIC: JourneyMusicPreference =
  'NONE';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toLabel(
  value: string,
): string {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPreferencesForm({
  initialValue,
  disabled = false,
  onChange,
  onSubmit,
}: JourneyPreferencesFormProps) {
  const [
    smoking,
    setSmoking,
  ] = useState<JourneySmokingPolicy>(
    initialValue?.smoking ??
      DEFAULT_SMOKING,
  );

  const [
    pets,
    setPets,
  ] = useState<JourneyPetsPolicy>(
    initialValue?.pets ??
      DEFAULT_PETS,
  );

  const [
    luggage,
    setLuggage,
  ] = useState<JourneyLuggagePolicy>(
    initialValue?.luggage ??
      DEFAULT_LUGGAGE,
  );

  const [
    conversation,
    setConversation,
  ] =
    useState<JourneyConversationPreference>(
      initialValue?.conversation ??
        DEFAULT_CONVERSATION,
    );

  const [
    music,
    setMusic,
  ] = useState<JourneyMusicPreference>(
    initialValue?.music ??
      DEFAULT_MUSIC,
  );

  // ---------------------------------------------------------------------------
  // Draft change
  // ---------------------------------------------------------------------------

  function emitChange(
    overrides: Partial<JourneyPreferencesFormSubmitValue>,
  ) {
    onChange?.({
      smoking,
      pets,
      luggage,
      conversation,
      music,
      ...overrides,
    });
  }

  // ---------------------------------------------------------------------------
  // Field changes
  // ---------------------------------------------------------------------------

  function handleSmokingChange(
    value: JourneySmokingPolicy,
  ) {
    setSmoking(value);

    emitChange({
      smoking: value,
    });
  }

  function handlePetsChange(
    value: JourneyPetsPolicy,
  ) {
    setPets(value);

    emitChange({
      pets: value,
    });
  }

  function handleLuggageChange(
    value: JourneyLuggagePolicy,
  ) {
    setLuggage(value);

    emitChange({
      luggage: value,
    });
  }

  function handleConversationChange(
    value: JourneyConversationPreference,
  ) {
    setConversation(value);

    emitChange({
      conversation: value,
    });
  }

  function handleMusicChange(
    value: JourneyMusicPreference,
  ) {
    setMusic(value);

    emitChange({
      music: value,
    });
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const value: JourneyPreferencesFormSubmitValue =
      {
        smoking,
        pets,
        luggage,
        conversation,
        music,
      };

    await onSubmit?.(value);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      id="journey-preferences-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Smoking                                                             */}
      {/* ------------------------------------------------------------------- */}

      <PreferenceField
        id="journey-preferences-smoking"
        label="Smoking"
        description="Choose whether smoking is allowed during the Journey."
        value={smoking}
        disabled={disabled}
        options={
          JOURNEY_SMOKING_POLICIES
        }
        onChange={(value) =>
          handleSmokingChange(
            value as JourneySmokingPolicy,
          )
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* Pets                                                                */}
      {/* ------------------------------------------------------------------- */}

      <PreferenceField
        id="journey-preferences-pets"
        label="Pets"
        description="Choose which pets, if any, can travel on this Journey."
        value={pets}
        disabled={disabled}
        options={
          JOURNEY_PETS_POLICIES
        }
        onChange={(value) =>
          handlePetsChange(
            value as JourneyPetsPolicy,
          )
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* Luggage                                                             */}
      {/* ------------------------------------------------------------------- */}

      <PreferenceField
        id="journey-preferences-luggage"
        label="Luggage"
        description="Set the amount of luggage passengers can bring."
        value={luggage}
        disabled={disabled}
        options={
          JOURNEY_LUGGAGE_POLICIES
        }
        onChange={(value) =>
          handleLuggageChange(
            value as JourneyLuggagePolicy,
          )
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* Conversation                                                        */}
      {/* ------------------------------------------------------------------- */}

      <PreferenceField
        id="journey-preferences-conversation"
        label="Conversation"
        description="Set the preferred conversation level during the Journey."
        value={conversation}
        disabled={disabled}
        options={
          JOURNEY_CONVERSATION_PREFERENCES
        }
        onChange={(value) =>
          handleConversationChange(
            value as JourneyConversationPreference,
          )
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* Music                                                               */}
      {/* ------------------------------------------------------------------- */}

      <PreferenceField
        id="journey-preferences-music"
        label="Music"
        description="Set the preferred music environment during the Journey."
        value={music}
        disabled={disabled}
        options={
          JOURNEY_MUSIC_PREFERENCES
        }
        onChange={(value) =>
          handleMusicChange(
            value as JourneyMusicPreference,
          )
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* Native submit                                                       */}
      {/* ------------------------------------------------------------------- */}

      <button
        type="submit"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        Save preferences
      </button>
    </form>
  );
}

// -----------------------------------------------------------------------------
// Preference Field
// -----------------------------------------------------------------------------

interface PreferenceFieldProps {
  id: string;
  label: string;
  description: string;
  value: string;
  options: readonly string[];
  disabled: boolean;
  onChange: (
    value: string,
  ) => void;
}

function PreferenceField({
  id,
  label,
  description,
  value,
  options,
  disabled,
  onChange,
}: PreferenceFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--foreground)]"
      >
        {label}
      </label>

      <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
        {description}
      </p>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={[
          'w-full',
          'rounded-[var(--radius-md)]',
          'border',
          'border-[var(--border)]',
          'bg-[var(--surface)]',
          'px-3',
          'py-2.5',
          'text-sm',
          'text-[var(--foreground)]',
          'shadow-[var(--shadow-sm)]',
          'outline-none',
          'transition',
          'focus:border-[var(--brand)]',
          'focus:ring-2',
          'focus:ring-[var(--brand)]/20',
          'disabled:cursor-not-allowed',
          'disabled:opacity-60',
        ].join(' ')}
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {toLabel(option)}
            </option>
          ),
        )}
      </select>
    </div>
  );
}