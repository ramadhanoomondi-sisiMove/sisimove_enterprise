// -----------------------------------------------------------------------------
// sisiMove — Notification Preference Group
// -----------------------------------------------------------------------------
//
// Presentation component for a logical group of Notification Preferences.
//
// Responsibilities:
// - render group heading and description;
// - render individual preference toggles;
// - provide consistent SisiMove grouping and spacing.
//
// Non-responsibilities:
// - fetching preferences;
// - persisting preferences;
// - deciding notification policy;
// - performing HTTP requests.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Card } from '@/components/ui';

import type {
  NotificationPreferenceKey,
} from '@/features/notification/models/notification-preferences';
import { NotificationPreferenceToggle } from './notification-preference-toggle';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationPreferenceGroupItem {
  key: NotificationPreferenceKey;
  label: string;
  description?: string;
  enabled: boolean;
}

export interface NotificationPreferenceGroupProps {
  /**
   * Group heading.
   */
  title: string;

  /**
   * Optional supporting explanation for the group.
   */
  description?: string;

  /**
   * Preferences belonging to this group.
   */
  preferences: NotificationPreferenceGroupItem[];

  /**
   * Prevents interaction while an update is being persisted.
   */
  disabled?: boolean;

  /**
   * Called when an individual preference changes.
   *
   * The key is restricted to one of the nine backend preference fields.
   */
  onPreferenceChange: (
    key: NotificationPreferenceKey,
    enabled: boolean,
  ) => void;

  /**
   * Optional additional content rendered after the group preferences.
   */
  footer?: ReactNode;
}

// -----------------------------------------------------------------------------
// Notification Preference Group
// -----------------------------------------------------------------------------

export function NotificationPreferenceGroup({
  title,
  description,
  preferences,
  disabled = false,
  onPreferenceChange,
  footer,
}: NotificationPreferenceGroupProps) {
  return (
    <Card padding="none">
      <div className="border-b border-[var(--border-subtle)] px-4 py-4 sm:px-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        )}
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {preferences.map((preference) => (
          <NotificationPreferenceToggle
            key={preference.key}
            label={preference.label}
            description={preference.description}
            checked={preference.enabled}
            disabled={disabled}
            onCheckedChange={(enabled) =>
              onPreferenceChange(
                preference.key,
                enabled,
              )
            }
          />
        ))}
      </div>

      {footer && (
        <div className="border-t border-[var(--border-subtle)] px-4 py-4 sm:px-5">
          {footer}
        </div>
      )}
    </Card>
  );
}