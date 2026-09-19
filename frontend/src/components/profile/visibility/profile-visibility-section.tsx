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
// -----------------------------------------------------------------------------

'use client';

import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import {
  VisibilityOption,
  type ProfileVisibilityOptionValue,
} from './visibility-option';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ProfileVisibility = ProfileVisibilityOptionValue;

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
  readonly onSave?: (visibility: ProfileVisibility) => void;
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
  const [selectedVisibility, setSelectedVisibility] =
    useState<ProfileVisibility>(value);

  const hasChanges = selectedVisibility !== value;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          Profile Visibility
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose how your traveller profile appears to other people on
          sisiMove.
        </p>
      </div>

      <div className="space-y-2">
        {VISIBILITY_OPTIONS.map((option) => (
          <VisibilityOption
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            selected={selectedVisibility === option.value}
            onSelect={setSelectedVisibility}
          />
        ))}
      </div>

      {onSave !== undefined ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onSave(selectedVisibility)}
            disabled={!hasChanges}
          >
            Save visibility
          </Button>
        </div>
      ) : null}
    </section>
  );
}