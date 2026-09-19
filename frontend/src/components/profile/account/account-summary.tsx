// -----------------------------------------------------------------------------
// sisiMove — Account Summary
// -----------------------------------------------------------------------------
//
// Presentation-only summary of the authenticated traveller's account.
//
// Responsibilities:
// - Display account contact/status information.
// - Keep sensitive account details visually concise.
//
// Non-responsibilities:
// - Fetching account data.
// - Editing contact information.
// - Managing sessions, security, or account settings.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

export interface AccountSummaryProps {
  email: string;
  phoneNumber: string;
  status: string;
}

export function AccountSummary({
  email,
  phoneNumber,
  status,
}: AccountSummaryProps): ReactNode {
  return (
    <div className="rounded-xl border border-border bg-background px-4">
      <div className="flex items-center justify-between gap-6 border-b border-border py-4">
        <span className="text-sm font-medium">Email</span>
        <span className="truncate text-right text-sm text-muted-foreground">
          {email}
        </span>
      </div>

      <div className="flex items-center justify-between gap-6 border-b border-border py-4">
        <span className="text-sm font-medium">Phone</span>
        <span className="truncate text-right text-sm text-muted-foreground">
          {phoneNumber}
        </span>
      </div>

      <div className="flex items-center justify-between gap-6 py-4">
        <span className="text-sm font-medium">Account status</span>
        <span className="text-right text-sm font-medium">
          {status}
        </span>
      </div>
    </div>
  );
}