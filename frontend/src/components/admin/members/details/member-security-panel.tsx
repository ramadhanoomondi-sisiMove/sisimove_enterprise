// -----------------------------------------------------------------------------
// sisiMove — Admin Member Security Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display identity lifecycle information relevant to security.
// - Distinguish identity status from authentication security.
// - Show whether authentication security data was retrieved successfully.
// - Avoid inventing security indicators unsupported by the API contract.
//
// Non-responsibilities:
// - Fetching identity or authentication data.
// - Assuming missing security data means the account is secure.
// - Inferring session revocation from account suspension.
// - Performing security mutations or authorization decisions.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type {
  MemberSecurityOverview,
} from '@/features/admin/members/models/member-security.model';

import { MemberDataSection } from '@/components/admin/members/primitives/member-data-section';

import { Button } from '@/components/ui/button';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberSecurityPanelProps {
  readonly security: MemberSecurityOverview | null;
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
  readonly onViewSessions?: () => void;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatTimestamp(value?: string): string {
  if (!value?.trim()) {
    return 'Not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

// -----------------------------------------------------------------------------
// Field
// -----------------------------------------------------------------------------

interface SecurityFieldProps {
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

function SecurityField({
  label,
  value,
  className,
}: SecurityFieldProps): ReactNode {
  return (
    <div className={cn('min-w-0 space-y-1', className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd className="break-words text-sm text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function SecurityLoadingState(): ReactNode {
  return (
    <div
      role="status"
      aria-label="Loading member security information"
      className="space-y-4"
    >
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse space-y-2"
        >
          <div className="h-3 w-32 rounded bg-[var(--background-muted)]" />
          <div className="h-4 w-44 rounded bg-[var(--background-muted)]" />
        </div>
      ))}

      <span className="sr-only">
        Loading member security information…
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberSecurityPanel({
  security,
  isLoading = false,
  error,
  onRetry,
  onViewSessions,
  className,
}: MemberSecurityPanelProps): ReactNode {
  return (
    <MemberDataSection
      title="Security"
      description="Identity lifecycle and the availability of authentication security information."
      className={className}
    >
      {isLoading ? (
        <SecurityLoadingState />
      ) : error ? (
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Security information could not be loaded.
          </p>

          <p className="mt-1 break-words text-sm text-[var(--foreground-secondary)]">
            {error}
          </p>

          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              Try again
            </Button>
          ) : null}
        </div>
      ) : !security ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Security information unavailable
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            No security overview has been supplied for this member. This does
            not establish whether the account is secure.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section aria-labelledby="member-security-identity-heading">
            <h3
              id="member-security-identity-heading"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              Identity lifecycle
            </h3>

            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <SecurityField
                label="Identity public ID"
                value={security.identity.identityPublicId}
              />

              <SecurityField
                label="Identity status"
                value={security.identity.status}
              />

              <SecurityField
                label="Account created"
                value={formatTimestamp(security.identity.createdAt)}
              />

              <SecurityField
                label="Last identity update"
                value={formatTimestamp(security.identity.updatedAt)}
              />

              <SecurityField
                label="Activated at"
                value={formatTimestamp(security.identity.activatedAt)}
              />

              <SecurityField
                label="Suspended at"
                value={formatTimestamp(security.identity.suspendedAt)}
              />

              <SecurityField
                label="Closed at"
                value={formatTimestamp(security.identity.closedAt)}
              />
            </dl>
          </section>

          <section
            aria-labelledby="member-security-authentication-heading"
            className="border-t border-[var(--border-subtle)] pt-5"
          >
            <h3
              id="member-security-authentication-heading"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              Authentication security data
            </h3>

            {security.authentication?.dataAvailable === true ? (
              <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--success)]/25 bg-[var(--success-soft)] p-4">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Authentication security data available
                </p>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  The corresponding security information was retrieved
                  successfully. Its availability alone does not establish
                  that the account is secure.
                </p>
              </div>
            ) : security.authentication?.dataAvailable === false ? (
              <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--warning)]/25 bg-[var(--warning-soft)] p-4">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Authentication security data unavailable
                </p>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Security details could not be confirmed from the supplied
                  authentication data.
                </p>
              </div>
            ) : (
              <div className="mt-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] p-4">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Authentication information not supplied
                </p>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  No authentication security result is available in this
                  overview. Account security cannot be determined from this
                  absence.
                </p>
              </div>
            )}
          </section>

          {onViewSessions ? (
            <div className="border-t border-[var(--border-subtle)] pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onViewSessions}
              >
                View sessions and devices
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </MemberDataSection>
  );
}

export default MemberSecurityPanel;
