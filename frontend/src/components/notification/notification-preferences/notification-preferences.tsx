// -----------------------------------------------------------------------------
// sisiMove — Notification Preferences
// -----------------------------------------------------------------------------
//
// Authenticated notification-preference presentation and orchestration.
//
// Responsibilities:
// - load the authenticated user's notification preferences;
// - render preferences grouped by notification category;
// - submit complete preference changes through the notification mutation hook;
// - expose loading and error states;
// - keep preference persistence outside presentation primitives.
//
// Non-responsibilities:
// - deciding notification policy;
// - performing HTTP requests directly;
// - reading authentication/session storage;
// - calculating backend summary fields;
// - maintaining a second local persistence model.
//
// IMPORTANT:
//
// NotificationPreferenceEntity treats updates as complete desired state.
//
// Therefore:
//
//     one toggle change
//             ↓
//     complete nine-field request
//             ↓
//     PATCH /notification-preferences/:preferencePublicId
//
// The backend response remains authoritative.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useMemo,
} from 'react';

import {
  Button,
  Card,
  ErrorState,
  Skeleton,
} from '@/components/ui';

import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/features/notification/hooks';

import type {
  NotificationPreferences as NotificationPreferencesModel,
  UpdateNotificationPreferencesRequest,
} from '@/features/notification/models';

import { NotificationPreferenceGroup } from './notification-preference-group';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type NotificationPreferenceKey =
  | 'journeyEnabled'
  | 'bookingEnabled'
  | 'paymentEnabled'
  | 'walletEnabled'
  | 'trustEnabled'
  | 'verificationEnabled'
  | 'messageEnabled'
  | 'supportEnabled'
  | 'systemEnabled';

interface PreferenceEntry {
  key: NotificationPreferenceKey;
  label: string;
  description?: string;
  enabled: boolean;
}

interface PreferenceGroup {
  key: string;
  title: string;
  description?: string;
  preferences: PreferenceEntry[];
}

// -----------------------------------------------------------------------------
// Preference Definitions
// -----------------------------------------------------------------------------

/**
 * Presentation metadata only.
 *
 * These definitions do not replace or redefine the backend preference model.
 * Each key maps directly to one NotificationPreferences boolean.
 */
const preferenceDefinitions: Array<{
  key: NotificationPreferenceKey;
  label: string;
  description: string;
  group: string;
}> = [
  {
    key: 'journeyEnabled',
    label: 'Journey updates',
    description:
      'Receive notifications about journeys and journey activity.',
    group: 'journeys',
  },
  {
    key: 'bookingEnabled',
    label: 'Booking updates',
    description:
      'Receive notifications about your bookings and booking activity.',
    group: 'journeys',
  },
  {
    key: 'paymentEnabled',
    label: 'Payment updates',
    description:
      'Receive notifications about payments related to your activity.',
    group: 'financial',
  },
  {
    key: 'walletEnabled',
    label: 'Wallet updates',
    description:
      'Receive notifications about changes and activity in your wallet.',
    group: 'financial',
  },
  {
    key: 'trustEnabled',
    label: 'Trust updates',
    description:
      'Receive notifications related to trust and account activity.',
    group: 'account',
  },
  {
    key: 'verificationEnabled',
    label: 'Verification updates',
    description:
      'Receive notifications about identity and account verification.',
    group: 'account',
  },
  {
    key: 'messageEnabled',
    label: 'Messages',
    description:
      'Receive notifications about relevant messages.',
    group: 'communication',
  },
  {
    key: 'supportEnabled',
    label: 'Support',
    description:
      'Receive notifications about support activity.',
    group: 'communication',
  },
  {
    key: 'systemEnabled',
    label: 'System notifications',
    description:
      'Receive important SisiMove service notifications.',
    group: 'system',
  },
];

const groupDefinitions: Array<{
  key: string;
  title: string;
  description: string;
}> = [
  {
    key: 'journeys',
    title: 'Journeys & bookings',
    description:
      'Updates about your journeys and booking activity.',
  },
  {
    key: 'financial',
    title: 'Payments & wallet',
    description:
      'Updates about payments and wallet activity.',
  },
  {
    key: 'account',
    title: 'Account & trust',
    description:
      'Updates related to verification and trust.',
  },
  {
    key: 'communication',
    title: 'Communication',
    description:
      'Updates about messages and support activity.',
  },
  {
    key: 'system',
    title: 'System',
    description:
      'Important SisiMove service notifications.',
  },
];

// -----------------------------------------------------------------------------
// Preference Request Builder
// -----------------------------------------------------------------------------

/**
 * Builds the complete backend update request from the authoritative frontend
 * NotificationPreferences model.
 *
 * The five computed summary fields are intentionally excluded because they
 * are response-only fields owned by the backend.
 */
function buildPreferenceRequest(
  current: NotificationPreferencesModel,
  changedKey: NotificationPreferenceKey,
  enabled: boolean,
): UpdateNotificationPreferencesRequest {
  return {
    journeyEnabled:
      changedKey === 'journeyEnabled'
        ? enabled
        : current.journeyEnabled,

    bookingEnabled:
      changedKey === 'bookingEnabled'
        ? enabled
        : current.bookingEnabled,

    paymentEnabled:
      changedKey === 'paymentEnabled'
        ? enabled
        : current.paymentEnabled,

    walletEnabled:
      changedKey === 'walletEnabled'
        ? enabled
        : current.walletEnabled,

    trustEnabled:
      changedKey === 'trustEnabled'
        ? enabled
        : current.trustEnabled,

    verificationEnabled:
      changedKey === 'verificationEnabled'
        ? enabled
        : current.verificationEnabled,

    messageEnabled:
      changedKey === 'messageEnabled'
        ? enabled
        : current.messageEnabled,

    supportEnabled:
      changedKey === 'supportEnabled'
        ? enabled
        : current.supportEnabled,

    systemEnabled:
      changedKey === 'systemEnabled'
        ? enabled
        : current.systemEnabled,
  };
}

// -----------------------------------------------------------------------------
// Presentation Group Builder
// -----------------------------------------------------------------------------

function buildPreferenceGroups(
  preferences: NotificationPreferencesModel,
): PreferenceGroup[] {
  return groupDefinitions.map(
    (groupDefinition) => ({
      key: groupDefinition.key,
      title: groupDefinition.title,
      description: groupDefinition.description,

      preferences:
        preferenceDefinitions
          .filter(
            (definition) =>
              definition.group ===
              groupDefinition.key,
          )
          .map((definition) => ({
            key: definition.key,
            label: definition.label,
            description:
              definition.description,
            enabled:
              preferences[definition.key],
          })),
    }),
  );
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function NotificationPreferencesSkeleton() {
  return (
    <div className="space-y-4">
      <Card padding="md">
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />

          <div className="space-y-3 pt-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div className="space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-60" />

          <div className="space-y-3 pt-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface NotificationPreferencesProps {
  /**
   * Authenticated member public identifier.
   *
   * This value comes from the existing authenticated Identity boundary.
   */
  memberPublicId: string | undefined;
}

// -----------------------------------------------------------------------------
// Notification Preferences
// -----------------------------------------------------------------------------

export function NotificationPreferences({
  memberPublicId,
}: NotificationPreferencesProps) {
  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useNotificationPreferences(
    memberPublicId,
  );

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const {
    mutate,
    isPending,
  } = useUpdateNotificationPreferences();

  // ---------------------------------------------------------------------------
  // Presentation Groups
  // ---------------------------------------------------------------------------

  const groups = useMemo(
    () =>
      data
        ? buildPreferenceGroups(data)
        : [],
    [data],
  );

  // ---------------------------------------------------------------------------
  // Preference Change
  // ---------------------------------------------------------------------------

  const handleChange = useCallback(
    (
      key: NotificationPreferenceKey,
      enabled: boolean,
    ) => {
      if (
        !memberPublicId ||
        !data
      ) {
        return;
      }

      const preferences =
        buildPreferenceRequest(
          data,
          key,
          enabled,
        );

      mutate({
        preferencePublicId:
          data.publicId,

        preferences,

        memberPublicId,
      });
    },
    [
      data,
      memberPublicId,
      mutate,
    ],
  );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (
    !memberPublicId ||
    isLoading
  ) {
    return (
      <NotificationPreferencesSkeleton />
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <Card padding="md">
        <ErrorState
          title="Unable to load notification preferences"
          description="Your notification preferences could not be loaded. Please try again."
        />

        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch();
            }}
          >
            Try again
          </Button>
        </div>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty State
  // ---------------------------------------------------------------------------

  if (!data || groups.length === 0) {
    return (
      <Card
        variant="muted"
        padding="lg"
      >
        <div className="text-center">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            No notification preferences available
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Notification preferences are not currently available
            for this account.
          </p>
        </div>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <NotificationPreferenceGroup
          key={group.key}
          title={group.title}
          description={group.description}
          preferences={group.preferences}
          disabled={isPending}
          onPreferenceChange={handleChange}
        />
      ))}
    </div>
  );
}