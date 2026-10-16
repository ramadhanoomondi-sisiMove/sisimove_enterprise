// -----------------------------------------------------------------------------
// sisiMove — Admin Member Identity Card
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the core Identity-domain fields.
// - Present lifecycle status using MemberStatusBadge.
// - Format account timestamps consistently.
// - Handle missing optional timestamps without inventing values.
//
// Non-responsibilities:
// - Fetching identity data.
// - Updating account details.
// - Changing member status.
// - Displaying Profile, Verification or Trust information.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type { MemberIdentity } from '@/features/admin/members/models/member.model';

import { MemberStatusBadge } from '@/components/admin/members/primitives/member-status-badge';
import { MemberDataSection } from '@/components/admin/members/primitives/member-data-section';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberIdentityCardProps {
  readonly member: MemberIdentity;
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
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

interface IdentityFieldProps {
  readonly label: string;
  readonly value: string;
  readonly valueClassName?: string;
}

function IdentityField({
  label,
  value,
  valueClassName,
}: IdentityFieldProps): ReactNode {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd
        className={cn(
          'break-words text-sm text-[var(--foreground)]',
          valueClassName,
        )}
      >
        {value}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberIdentityCard({
  member,
  className,
}: MemberIdentityCardProps): ReactNode {
  return (
    <MemberDataSection
      title="Identity"
      description="Core account information and identity lifecycle."
      className={className}
    >
      <div className="space-y-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <IdentityField
            label="Public ID"
            value={member.publicId || 'Not available'}
            valueClassName="font-mono text-xs"
          />

          <div className="min-w-0 space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Account status
            </dt>

            <dd className="pt-1">
              <MemberStatusBadge status={member.status} size="sm" />
            </dd>
          </div>

          <IdentityField
            label="Email address"
            value={member.email || 'Not recorded'}
          />

          <IdentityField
            label="Phone number"
            value={member.phoneNumber || 'Not recorded'}
          />
        </dl>

        <div className="border-t border-[var(--border-subtle)] pt-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
            Account timeline
          </h3>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <IdentityField
              label="Account created"
              value={formatTimestamp(member.createdAt)}
            />

            <IdentityField
              label="Last updated"
              value={formatTimestamp(member.updatedAt)}
            />

            <IdentityField
              label="Activated at"
              value={formatTimestamp(member.activatedAt)}
            />

            <IdentityField
              label="Suspended at"
              value={formatTimestamp(member.suspendedAt)}
            />

            <IdentityField
              label="Closed at"
              value={formatTimestamp(member.closedAt)}
            />
          </dl>
        </div>
      </div>
    </MemberDataSection>
  );
}

export default MemberIdentityCard;
