// -----------------------------------------------------------------------------
// sisiMove — Profile Visibility Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section for controlling traveller profile visibility.
//
// Responsibilities:
// - Present the available visibility options.
// - Maintain the currently selected value while editing.
// - Expose the Save action to the parent.
//
// Non-responsibilities:
// - Fetching the persisted visibility setting.
// - Persisting changes.
// - Enforcing visibility at the API/domain level.
// - Determining what information is exposed for each visibility level.
//
// The parent/profile workflow owns persistence and supplies the initial value.
//
// Architecture:
// - Local editing state belongs to this interactive presentation component.
// - Persistence remains outside this component.
// - The visibility value uses the same closed contract as VisibilityOption.
// - No useEffect is required to synchronize the initial value; the parent
//   owns the persisted value and this component represents the current edit
//   session.
//
// Visual language:
// - Compact authenticated-product section.
// - SisiMove blue is reserved for active interaction and the save action.
// - Unsaved changes are made visually obvious without becoming intrusive.
// - No additional visual tokens are introduced.
// -----------------------------------------------------------------------------

'use client';

import {
  useState,
  type ReactNode,
} from 'react';

import { Button } from '@/components/ui/button';

import {
  VisibilityOption,
  type ProfileVisibilityOptionValue,
} from './visibility-option';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ProfileVisibility =
  ProfileVisibilityOptionValue;

export interface ProfileVisibilitySectionProps {
  /**
   * Persisted/current profile visibility supplied by the parent.
   */
  readonly value: ProfileVisibility;

  /**
   * Presentation-level save action.
   *
   * Persistence remains the responsibility of the parent/workflow.
   */
  readonly onSave?: (
    visibility: ProfileVisibility,
  ) => void;
}

// -----------------------------------------------------------------------------
// Visibility Options
// -----------------------------------------------------------------------------

const VISIBILITY_OPTIONS: ReadonlyArray<{
  readonly value: ProfileVisibility;
  readonly label: string;
  readonly description: string;
}> = [
  {
    value: 'PUBLIC',
    label: 'Public',
    description:
      'Anyone can view your public traveller profile and trust information.',
  },
  {
    value: 'LIMITED',
    label: 'Limited',
    description:
      'Only selected profile information is visible to other travellers.',
  },
  {
    value: 'PRIVATE',
    label: 'Private',
    description:
      'Your traveller profile is not publicly discoverable.',
  },
];

// -----------------------------------------------------------------------------
// Profile Visibility Section
// -----------------------------------------------------------------------------

export function ProfileVisibilitySection({
  value,
  onSave,
}: ProfileVisibilitySectionProps): ReactNode {
  const [
    selectedVisibility,
    setSelectedVisibility,
  ] = useState<ProfileVisibility>(value);

  const hasChanges =
    selectedVisibility !== value;

  return (
    <section
      aria-labelledby="profile-visibility-title"
      className="p-5 sm:p-6"
    >
      {/* ---------------------------------------------------------------------
          Section Header
         --------------------------------------------------------------------- */}

      <div className="max-w-2xl">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="
              h-2
              w-2
              shrink-0
              rounded-full
              bg-[var(--brand)]
            "
          />

          <h2
            id="profile-visibility-title"
            className="
              text-base
              font-semibold
              tracking-[-0.01em]
              text-[var(--foreground)]
            "
          >
            Profile visibility
          </h2>
        </div>

        <p className="mt-1.5 text-sm leading-6 text-[var(--foreground-secondary)]">
          Choose how your traveller profile appears to other people on
          sisiMove.
        </p>
      </div>

      {/* ---------------------------------------------------------------------
          Visibility Options
         --------------------------------------------------------------------- */}

      <div
        className="mt-5 space-y-2.5"
        role="radiogroup"
        aria-labelledby="profile-visibility-title"
      >
        {VISIBILITY_OPTIONS.map((option) => (
          <VisibilityOption
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            selected={
              selectedVisibility === option.value
            }
            onSelect={setSelectedVisibility}
          />
        ))}
      </div>

      {/* ---------------------------------------------------------------------
          Save Area
         --------------------------------------------------------------------- */}

      <div
        className={[
          'mt-5 flex flex-col gap-3 border-t pt-4',
          'sm:flex-row sm:items-center sm:justify-between',
          'border-[var(--border-subtle)]',
        ].join(' ')}
      >
        <div className="min-h-5">
          {hasChanges ? (
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              You have unsaved changes.
            </p>
          ) : (
            <p className="text-xs text-[var(--foreground-subtle)]">
              Your current visibility is saved.
            </p>
          )}
        </div>

        {onSave !== undefined ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() =>
              onSave(selectedVisibility)
            }
            disabled={!hasChanges}
            className="
              w-full
              sm:w-auto
            "
          >
            Save visibility
          </Button>
        ) : null}
      </div>
    </section>
  );
}

