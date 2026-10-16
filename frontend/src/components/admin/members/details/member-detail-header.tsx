// -----------------------------------------------------------------------------
// sisiMove — Admin Member Detail Header
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Identify the member currently being viewed.
// - Display the member's avatar, contact details and lifecycle status.
// - Resolve the public profile image when available.
// - Expose optional actions supplied by the parent.
// - Remain independent of member status and contact mutations.
//
// -----------------------------------------------------------------------------

'use client';

import { useEffect, type ReactNode } from 'react';

import type { MemberIdentity } from '@/features/admin/members/models/member.model';
import { useMemberProfile } from '@/features/admin/members/hooks/use-member-profile';
import { usePublicAsset } from '@/features/assets/hooks/use-public-asset';

import { MemberAvatar } from '@/components/admin/members/primitives/member-avatar';
import { MemberStatusBadge } from '@/components/admin/members/primitives/member-status-badge';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberDetailHeaderProps {
  readonly member: MemberIdentity;
  readonly avatarUrl?: string | null;
  readonly displayName?: string | null;
  readonly actions?: ReactNode;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getInitials(value: string): string {
  const normalized = value.trim();

  if (!normalized) {
    return '?';
  }

  const parts = normalized.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatMemberReference(publicId: string): string {
  const normalized = publicId.trim();
  return normalized || 'Unavailable';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberDetailHeader({
  member,
  avatarUrl,
  displayName,
  actions,
  className,
}: MemberDetailHeaderProps): ReactNode {
  const profileQuery = useMemberProfile(member.publicId);
  const profile = profileQuery.data ?? null;

  const profilePhoto = usePublicAsset(profile?.avatarAssetPublicId);
  const resolvedAvatarUrl = avatarUrl ?? profilePhoto.asset?.url ?? null;

  const resolvedName =
    displayName?.trim() || profile?.handle || member.email || 'Member';

  const initials = getInitials(resolvedName);
  const memberReference = formatMemberReference(member.publicId);

  // Keep the profile query and asset query responsible for their own loading
  // and error states. A missing photo falls back to the member's initials.
  useEffect(() => {
    // No side effect is required; image resolution is handled by the hooks.
  }, [resolvedAvatarUrl]);

  return (
    <header
      className={cn(
        'min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm sm:p-6',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <MemberAvatar
            src={resolvedAvatarUrl}
            alt={`${resolvedName} profile photo`}
            fallback={initials}
            size="xl"
            priority
            className="shrink-0"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="break-words text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                {resolvedName}
              </h1>

              <MemberStatusBadge status={member.status} size="sm" />
            </div>

            {profile?.handle ? (
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                @{profile.handle}
              </p>
            ) : null}

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex min-w-0 items-start gap-2 text-[var(--foreground-secondary)]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="mt-0.5 size-4 shrink-0"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <span className="break-all">
                  {member.email || 'No email recorded'}
                </span>
              </div>

              <div className="flex min-w-0 items-start gap-2 text-[var(--foreground-secondary)]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="mt-0.5 size-4 shrink-0"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2
                    19.79 19.79 0 0 1-8.63-3.07
                    19.5 19.5 0 0 1-6-6
                    19.79 19.79 0 0 1-3.07-8.67
                    A2 2 0 0 1 4.11 2h3
                    a2 2 0 0 1 2 1.72
                    c.12.96.36 1.9.7 2.8
                    a2 2 0 0 1-.45 2.11L8.09 9.91
                    a16 16 0 0 0 6 6l1.27-1.27
                    a2 2 0 0 1 2.11-.45
                    c.9.34 1.84.58 2.8.7
                    A2 2 0 0 1 22 16.92Z"
                  />
                </svg>

                <span className="break-all">
                  {member.phoneNumber || 'No phone number recorded'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--foreground-muted)]">
              <span className="font-medium">Member ID</span>
              <code className="max-w-full break-all rounded-[var(--radius-sm)] bg-[var(--background-subtle)] px-2 py-1 font-mono text-[var(--foreground-secondary)]">
                {memberReference}
              </code>
            </div>
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default MemberDetailHeader;