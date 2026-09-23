// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Form
// -----------------------------------------------------------------------------
//
// Provider-declared travel preferences for Journey creation.
//
// Architectural rules:
// - JourneyPreferences is a child entity of Journey.
// - There is no preference catalogue.
// - The provider declares the preferences for this Journey.
// - This component is presentation-only.
// - The page owns persistence, API interaction, errors, and navigation.
// - The backend remains authoritative over validation.
//
// Responsibilities:
// - Present the provider's preference choices.
// - Capture the five JourneyPreferences fields.
// - Display the selected travel conditions clearly.
// - Delegate submission to the parent.
//
// Non-responsibilities:
// - No API calls.
// - No catalogue fetching.
// - No router usage.
// - No persistence.
// - No mutation.
// - No backend business-rule enforcement.
//
// Backend write operation:
//
// POST /journeys/:journeyPublicId/preferences
// {
//   smoking,
//   pets,
//   luggage,
//   conversation,
//   music
// }
//
// -----------------------------------------------------------------------------

'use client';

import {
  useState,
  type FormEvent,
} from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

// =============================================================================
// Types
// =============================================================================

export type JourneySmokingPolicy =
  | 'ALLOWED'
  | 'NOT_ALLOWED';

export type JourneyPetsPolicy =
  | 'ALLOWED'
  | 'NOT_ALLOWED'
  | 'SERVICE_ANIMALS_ONLY';

export type JourneyLuggagePolicy =
  | 'NONE'
  | 'LIMITED'
  | 'STANDARD'
  | 'LARGE';

export type JourneyConversationPreference =
  | 'QUIET'
  | 'MODERATE'
  | 'SOCIAL';

export type JourneyMusicPreference =
  | 'NONE'
  | 'LOW'
  | 'MODERATE'
  | 'ANY';

// =============================================================================
// Form Value
// =============================================================================

export interface JourneyPreferencesFormValue {
  smoking: JourneySmokingPolicy;
  pets: JourneyPetsPolicy;
  luggage: JourneyLuggagePolicy;
  conversation: JourneyConversationPreference;
  music: JourneyMusicPreference;
}

// =============================================================================
// Props
// =============================================================================

export interface JourneyPreferencesFormProps {
  /**
   * Existing Journey preferences, useful when resuming a draft.
   */
  defaultValue?: JourneyPreferencesFormValue;

  /**
   * Called after the provider submits the preference values.
   */
  onSubmit: (
    value: JourneyPreferencesFormValue,
  ) => void | Promise<void>;

  /**
   * Indicates that the parent is persisting the preferences.
   */
  isLoading?: boolean;

  /**
   * Optional error supplied by the parent.
   */
  error?: string | null;
}

// =============================================================================
// Formatting Helpers
// =============================================================================

function formatSmokingPolicy(
  policy: JourneySmokingPolicy,
): string {
  switch (policy) {
    case 'ALLOWED':
      return 'Smoking allowed';

    case 'NOT_ALLOWED':
      return 'No smoking';
  }
}

function formatPetsPolicy(
  policy: JourneyPetsPolicy,
): string {
  switch (policy) {
    case 'ALLOWED':
      return 'Pets allowed';

    case 'NOT_ALLOWED':
      return 'No pets';

    case 'SERVICE_ANIMALS_ONLY':
      return 'Service animals only';
  }
}

function formatLuggagePolicy(
  policy: JourneyLuggagePolicy,
): string {
  switch (policy) {
    case 'NONE':
      return 'No luggage';

    case 'LIMITED':
      return 'Limited luggage';

    case 'STANDARD':
      return 'Standard luggage';

    case 'LARGE':
      return 'Large luggage';
  }
}

function formatConversationPreference(
  preference: JourneyConversationPreference,
): string {
  switch (preference) {
    case 'QUIET':
      return 'Quiet';

    case 'MODERATE':
      return 'Moderate conversation';

    case 'SOCIAL':
      return 'Social';
  }
}

function formatMusicPreference(
  preference: JourneyMusicPreference,
): string {
  switch (preference) {
    case 'NONE':
      return 'No music';

    case 'LOW':
      return 'Low-volume music';

    case 'MODERATE':
      return 'Moderate-volume music';

    case 'ANY':
      return 'Music is fine';
  }
}

// =============================================================================
// Defaults
// =============================================================================
//
// These match the Prisma JourneyPreferences defaults:
//
// smoking      = NOT_ALLOWED
// pets         = NOT_ALLOWED
// luggage      = STANDARD
// conversation = MODERATE
// music        = LOW
//
// The defaults are UI defaults only. The backend remains authoritative.
// =============================================================================

const DEFAULT_VALUES: JourneyPreferencesFormValue = {
  smoking: 'NOT_ALLOWED',
  pets: 'NOT_ALLOWED',
  luggage: 'STANDARD',
  conversation: 'MODERATE',
  music: 'LOW',
};

// =============================================================================
// Component
// =============================================================================

export function JourneyPreferencesForm({
  defaultValue,
  onSubmit,
  isLoading = false,
  error = null,
}: JourneyPreferencesFormProps) {
  // ===========================================================================
  // Local form state
  // ===========================================================================

  const [smoking, setSmoking] = useState<JourneySmokingPolicy>(
    defaultValue?.smoking ?? DEFAULT_VALUES.smoking,
  );

  const [pets, setPets] = useState<JourneyPetsPolicy>(
    defaultValue?.pets ?? DEFAULT_VALUES.pets,
  );

  const [luggage, setLuggage] = useState<JourneyLuggagePolicy>(
    defaultValue?.luggage ?? DEFAULT_VALUES.luggage,
  );

  const [conversation, setConversation] =
    useState<JourneyConversationPreference>(
      defaultValue?.conversation ?? DEFAULT_VALUES.conversation,
    );

  const [music, setMusic] = useState<JourneyMusicPreference>(
    defaultValue?.music ?? DEFAULT_VALUES.music,
  );

  // ===========================================================================
  // Submit
  // ===========================================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    await onSubmit({
      smoking,
      pets,
      luggage,
      conversation,
      music,
    });
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Travel conditions                                                    */}
      {/* ------------------------------------------------------------------- */}

      <Card className="space-y-5 p-4 sm:p-5">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Travel conditions
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            Set the conditions passengers should know before booking
            your journey.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Smoking                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="space-y-2">
          <label
            htmlFor="journey-smoking"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            Smoking
          </label>

          <Select
            id="journey-smoking"
            value={smoking}
            onChange={(event) => {
              setSmoking(
                event.target.value as JourneySmokingPolicy,
              );
            }}
            disabled={isLoading}
          >
            <option value="NOT_ALLOWED">
              No smoking
            </option>

            <option value="ALLOWED">
              Smoking allowed
            </option>
          </Select>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Pets                                                              */}
        {/* ----------------------------------------------------------------- */}

        <div className="space-y-2">
          <label
            htmlFor="journey-pets"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            Pets
          </label>

          <Select
            id="journey-pets"
            value={pets}
            onChange={(event) => {
              setPets(
                event.target.value as JourneyPetsPolicy,
              );
            }}
            disabled={isLoading}
          >
            <option value="NOT_ALLOWED">
              No pets
            </option>

            <option value="SERVICE_ANIMALS_ONLY">
              Service animals only
            </option>

            <option value="ALLOWED">
              Pets allowed
            </option>
          </Select>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Luggage                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="space-y-2">
          <label
            htmlFor="journey-luggage"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            Luggage
          </label>

          <Select
            id="journey-luggage"
            value={luggage}
            onChange={(event) => {
              setLuggage(
                event.target.value as JourneyLuggagePolicy,
              );
            }}
            disabled={isLoading}
          >
            <option value="NONE">
              No luggage
            </option>

            <option value="LIMITED">
              Limited luggage
            </option>

            <option value="STANDARD">
              Standard luggage
            </option>

            <option value="LARGE">
              Large luggage
            </option>
          </Select>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Conversation                                                      */}
        {/* ----------------------------------------------------------------- */}

        <div className="space-y-2">
          <label
            htmlFor="journey-conversation"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            Conversation
          </label>

          <Select
            id="journey-conversation"
            value={conversation}
            onChange={(event) => {
              setConversation(
                event.target.value as JourneyConversationPreference,
              );
            }}
            disabled={isLoading}
          >
            <option value="QUIET">
              Quiet
            </option>

            <option value="MODERATE">
              Moderate conversation
            </option>

            <option value="SOCIAL">
              Social
            </option>
          </Select>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Music                                                             */}
        {/* ----------------------------------------------------------------- */}

        <div className="space-y-2">
          <label
            htmlFor="journey-music"
            className="text-sm font-medium text-[var(--foreground)]"
          >
            Music
          </label>

          <Select
            id="journey-music"
            value={music}
            onChange={(event) => {
              setMusic(
                event.target.value as JourneyMusicPreference,
              );
            }}
            disabled={isLoading}
          >
            <option value="NONE">
              No music
            </option>

            <option value="LOW">
              Low-volume music
            </option>

            <option value="MODERATE">
              Moderate-volume music
            </option>

            <option value="ANY">
              Music is fine
            </option>
          </Select>
        </div>
      </Card>

      {/* ------------------------------------------------------------------- */}
      {/* Passenger preview                                                    */}
      {/* ------------------------------------------------------------------- */}

      <Card className="space-y-4 p-4 sm:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Passenger preview
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            These conditions will be visible to passengers when they
            review the journey.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Smoking
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {formatSmokingPolicy(smoking)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Pets
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {formatPetsPolicy(pets)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Luggage
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {formatLuggagePolicy(luggage)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Conversation
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {formatConversationPreference(conversation)}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Music
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {formatMusicPreference(music)}
            </p>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------------- */}
      {/* Parent/application error                                             */}
      {/* ------------------------------------------------------------------- */}

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Form action                                                          */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving…' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}