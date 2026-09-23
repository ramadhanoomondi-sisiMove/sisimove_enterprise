// -----------------------------------------------------------------------------
// sisiMove — Wallet Status Card
// -----------------------------------------------------------------------------
//
// Presentation component for the current financial account status.
//
// Backend source:
//
// FinancialAccount
// └── status
//     ├── ACTIVE
//     ├── SUSPENDED
//     └── CLOSED
//
// Responsibility:
// - Present the current wallet status.
// - Translate backend status values into user-facing labels and tones.
// - Optionally present contextual supporting information.
//
// This component does NOT:
// - fetch the financial account;
// - change account status;
// - determine whether an account should be suspended or closed;
// - perform financial operations;
// - know about API responses.
//
// The wallet feature owns data retrieval and mapping.
// This component owns presentation only.
// -----------------------------------------------------------------------------

import { FinancialStatusBadge } from '../shared/financial-status-badge';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type WalletAccountStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CLOSED';

export interface WalletStatusCardProps {
  /**
   * Current financial account status.
   */
  status: WalletAccountStatus;

  /**
   * Optional supporting message displayed below the status.
   */
  message?: string;
}

// -----------------------------------------------------------------------------
// Status Presentation
// -----------------------------------------------------------------------------

interface WalletStatusPresentation {
  label: string;
  tone: 'success' | 'warning' | 'danger';
}

const statusPresentation: Record<
  WalletAccountStatus,
  WalletStatusPresentation
> = {
  ACTIVE: {
    label: 'Active',
    tone: 'success',
  },
  SUSPENDED: {
    label: 'Suspended',
    tone: 'warning',
  },
  CLOSED: {
    label: 'Closed',
    tone: 'danger',
  },
};

// -----------------------------------------------------------------------------
// Wallet Status Card
// -----------------------------------------------------------------------------

export function WalletStatusCard({
  status,
  message,
}: WalletStatusCardProps) {
  const presentation = statusPresentation[status];

  return (
    <section
      aria-labelledby="wallet-status-card-title"
      className="surface p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2
            id="wallet-status-card-title"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Wallet status
          </h2>

          {message ? (
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              {message}
            </p>
          ) : null}
        </div>

        <div className="shrink-0">
          <FinancialStatusBadge
            label={presentation.label}
            tone={presentation.tone}
            size="sm"
          />
        </div>
      </div>
    </section>
  );
}