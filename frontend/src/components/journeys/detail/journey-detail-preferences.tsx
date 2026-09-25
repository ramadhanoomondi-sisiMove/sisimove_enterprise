// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Preferences
// -----------------------------------------------------------------------------
//
// Presentation component for Journey travel preferences.
//
// Architectural boundary:
// - Does NOT fetch preferences.
// - Does NOT modify preferences.
// - Does NOT interpret preferences as booking rules.
// - Displays the JourneyPreferences value already composed into the Journey.
//
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';

import { Badge, Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailPreferencesProps {
  journey: Journey;
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatPreferenceValue(value: string): string {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

// -----------------------------------------------------------------------------
// Preference item
// -----------------------------------------------------------------------------

interface PreferenceItemProps {
  label: string;
  value: string;
}

function PreferenceItem({
  label,
  value,
}: PreferenceItemProps) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
        {formatPreferenceValue(value)}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDetailPreferences({
  journey,
  className,
}: JourneyDetailPreferencesProps) {
  const preferences = journey.preferences;

  if (!preferences) {
    return (
      <Card
        variant="outlined"
        padding="md"
        className={className}
      >
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Preferences
          </h2>

          <p className="text-sm leading-6 text-[var(--foreground-muted)]">
            No travel preferences have been configured for this Journey.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      padding="md"
      className={className}
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Preferences
            </h2>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              The provider&apos;s stated preferences for this Journey.
            </p>
          </div>

          <Badge
            variant="outline"
            size="sm"
          >
            Travel preferences
          </Badge>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PreferenceItem
            label="Smoking"
            value={preferences.smoking}
          />

          <PreferenceItem
            label="Pets"
            value={preferences.pets}
          />

          <PreferenceItem
            label="Luggage"
            value={preferences.luggage}
          />

          <PreferenceItem
            label="Conversation"
            value={preferences.conversation}
          />

          <PreferenceItem
            label="Music"
            value={preferences.music}
          />
        </dl>
      </div>
    </Card>
  );
}