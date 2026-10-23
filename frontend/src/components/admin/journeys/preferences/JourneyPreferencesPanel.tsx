
'use client';

/**
 * sisiMove — Journey Preferences Panel
 *
 * Displays passenger preferences configured for a journey.
 *
 * Responsibilities:
 * - Present smoking, pet, luggage, conversation, and music preferences.
 * - Keep the original recorded values visible.
 * - Handle missing values gracefully.
 * - Use consistent icons and styling across the admin journey detail view.
 *
 * This component is presentation-only. It does not modify preferences.
 */

import {
  MessageCircle,
  Music2,
  PawPrint,
  Cigarette,
  Luggage,
  SlidersHorizontal,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

export interface JourneyPreferencesPanelProps {
  journey: Pick<Journey, 'preferences'>;
  className?: string;
  compact?: boolean;
}

interface PreferenceItemProps {
  label: string;
  value: string | null | undefined;
  icon: typeof MessageCircle;
}

function PreferenceItem({
  label,
  value,
  icon: Icon,
}: PreferenceItemProps) {
  const displayValue = value?.trim() || 'Not specified';

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
        <Icon aria-hidden="true" className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
          {displayValue}
        </p>
      </div>
    </div>
  );
}

export default function JourneyPreferencesPanel({
  journey,
  className,
  compact = false,
}: JourneyPreferencesPanelProps) {
  const preferences = journey.preferences;

  return (
    <section
      aria-labelledby="journey-preferences-heading"
      className={cn('min-w-0 space-y-4', className)}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <SlidersHorizontal aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="journey-preferences-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Passenger preferences
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Preferences recorded for this journey
          </p>
        </div>
      </header>

      <div
        className={cn(
          'grid grid-cols-1 gap-3 sm:grid-cols-2',
          !compact && 'xl:grid-cols-3',
        )}
      >
        <PreferenceItem
          label="Smoking"
          value={preferences.smoking}
          icon={Cigarette}
        />

        <PreferenceItem
          label="Pets"
          value={preferences.pets}
          icon={PawPrint}
        />

        <PreferenceItem
          label="Luggage"
          value={preferences.luggage}
          icon={Luggage}
        />

        <PreferenceItem
          label="Conversation"
          value={preferences.conversation}
          icon={MessageCircle}
        />

        <PreferenceItem
          label="Music"
          value={preferences.music}
          icon={Music2}
        />
      </div>
    </section>
  );
}
