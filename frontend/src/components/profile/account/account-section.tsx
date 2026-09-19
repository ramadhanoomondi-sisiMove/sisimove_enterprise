// -----------------------------------------------------------------------------
// sisiMove — Account Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section for basic account information.
//
// Responsibilities:
// - Present the account summary.
// - Provide the presentation-level Settings action.
//
// Non-responsibilities:
// - Fetching account data.
// - Changing email or phone number.
// - Managing authentication sessions.
// - Managing password/recovery/security workflows.
//
// Those concerns belong to their respective account/authentication features.
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { AccountSummary } from './account-summary';

export interface AccountSectionProps {
  email: string;
  phoneNumber: string;
  status: string;
  onSettings?: () => void;
}

export function AccountSection({
  email,
  phoneNumber,
  status,
  onSettings,
}: AccountSectionProps): ReactNode {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Account
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and account settings.
          </p>
        </div>

        {onSettings !== undefined ? (
          <button
            type="button"
            onClick={onSettings}
            className="shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Settings
          </button>
        ) : null}
      </div>

      <AccountSummary
        email={email}
        phoneNumber={phoneNumber}
        status={status}
      />
    </section>
  );
}