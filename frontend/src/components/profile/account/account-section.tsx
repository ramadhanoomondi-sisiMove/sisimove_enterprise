'use client';

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
//
// Architectural note:
// - Account values are supplied by the parent/profile composition boundary.
// - Settings navigation remains a presentation-level action.
// - AccountSummary owns the visual presentation of the account values.
// - This section does not interpret or mutate account state.
//
// Visual language:
// - Compact mobile-first profile section.
// - sisiMove blue accent for section identity.
// - Consistent heading, copy, and action treatment with other profile sections.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { AccountSummary } from './account-summary';

export interface AccountSectionProps {
  readonly email: string;
  readonly phoneNumber: string;
  readonly status: string;
  readonly onSettings?: () => void;
}

export function AccountSection({
  email,
  phoneNumber,
  status,
  onSettings,
}: AccountSectionProps): ReactNode {
  return (
    <section className="space-y-5">
      {/* ---------------------------------------------------------------------
          Section header
          --------------------------------------------------------------------- */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
            />

            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-secondary)]">
              Account
            </h2>
          </div>

          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[var(--foreground-muted)]">
            Your account contact information and account status.
          </p>
        </div>

        {/* -------------------------------------------------------------------
            Presentation-level settings action

            Account/security workflows remain outside this component.
        ------------------------------------------------------------------- */}
        {onSettings !== undefined ? (
          <button
            type="button"
            onClick={onSettings}
            className="shrink-0 rounded-[var(--radius-md)] px-2 py-1 text-sm font-medium text-[var(--brand)] transition-colors hover:bg-[var(--brand-soft)] hover:text-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
          >
            Settings
          </button>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------------
          Account summary
          --------------------------------------------------------------------- */}
      <AccountSummary
        email={email}
        phoneNumber={phoneNumber}
        status={status}
      />
    </section>
  );
}