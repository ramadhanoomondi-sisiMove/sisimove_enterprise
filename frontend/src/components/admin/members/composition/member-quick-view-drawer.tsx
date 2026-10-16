
'use client';

import {
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

import type { MemberIdentity } from '@/features/admin/members/models/member.model';
import { useMemberProfile } from '@/features/admin/members/hooks/use-member-profile';
import { usePublicAsset } from '@/features/assets/hooks/use-public-asset';

import {
  MemberAvatar,
  MemberDataSection,
  MemberStatusBadge,
} from '@/components/admin/members/primitives';

export interface MemberQuickViewDrawerProps {
  /** Whether the drawer is visible. */
  readonly open: boolean;

  /** Member to display. */
  readonly member: MemberIdentity | null;

  /** Close the drawer. */
  readonly onClose: () => void;

  /** Navigate to the full member detail page. */
  readonly onViewDetails?: (member: MemberIdentity) => void;

  /** Optional additional CSS classes. */
  readonly className?: string;
}

function formatCreatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Keeps profile and asset hooks unconditional while allowing the drawer
 * to handle a missing selected member.
 */
function MemberQuickViewContent({
  member,
  onClose,
  onViewDetails,
  className,
}: {
  readonly member: MemberIdentity;
  readonly onClose: () => void;
  readonly onViewDetails?: (member: MemberIdentity) => void;
  readonly className?: string;
}): ReactNode {
  const profileQuery = useMemberProfile(member.publicId);
  const profile = profileQuery.data ?? null;

  const profilePhoto = usePublicAsset(
    profile?.avatarAssetPublicId,
  );

  const avatarUrl = profilePhoto.asset?.url ?? null;

  const memberLabel =
    member.email.trim() || member.phoneNumber || member.publicId;

  const activeRoles = member.roles.filter(
    (role) => !role.revokedAt,
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(member);
  }, [member, onViewDetails]);

  useEffect(() => {
    if (!profile?.avatarAssetPublicId) {
      return;
    }

    // The public asset hook handles asset retrieval and delivery.
    // No additional endpoint is needed here.
  }, [profile?.avatarAssetPublicId]);

  return (
    <div
      className="fixed inset-0 z-40"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close member quick view"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-quick-view-title"
        aria-describedby="member-quick-view-description"
        className={[
          'absolute inset-y-0 right-0 flex w-full max-w-lg flex-col',
          'border-l border-[var(--border)] bg-[var(--surface)] shadow-xl',
          'outline-none',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        tabIndex={-1}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] p-5">
          <div className="min-w-0">
            <h2
              id="member-quick-view-title"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              Member quick view
            </h2>

            <p
              id="member-quick-view-description"
              className="mt-1 text-sm text-[var(--foreground-muted)]"
            >
              Identity information and available actions.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--foreground-secondary)] hover:bg-[var(--background-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <section className="flex min-w-0 items-center gap-4">
            <MemberAvatar
              src={avatarUrl}
              alt={`${profile?.handle || memberLabel} profile photo`}
              fallback={memberLabel.slice(0, 2).toUpperCase()}
              size="xl"
            />

            <div className="min-w-0 flex-1">
              <h3 className="break-words text-base font-semibold text-[var(--foreground)]">
                {memberLabel}
              </h3>

              {profile?.handle ? (
                <p className="mt-1 break-words text-sm text-[var(--foreground-secondary)]">
                  @{profile.handle}
                </p>
              ) : null}

              <p className="mt-1 break-all text-xs text-[var(--foreground-muted)]">
                ID: {member.publicId}
              </p>

              <div className="mt-2">
                <MemberStatusBadge status={member.status} />
              </div>
            </div>
          </section>

          <MemberDataSection title="Contact information">
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                  Email
                </dt>

                <dd className="mt-1 break-all text-sm text-[var(--foreground)]">
                  {member.email || 'Not provided'}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                  Phone number
                </dt>

                <dd className="mt-1 break-all text-sm text-[var(--foreground)]">
                  {member.phoneNumber || 'Not provided'}
                </dd>
              </div>
            </dl>
          </MemberDataSection>

          <MemberDataSection title="Identity summary">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                  Active roles
                </dt>

                <dd className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                  {activeRoles.length}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                  Created
                </dt>

                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {formatCreatedAt(member.createdAt)}
                </dd>
              </div>
            </dl>
          </MemberDataSection>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-[var(--border-subtle)] p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground-secondary)] hover:bg-[var(--background-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30"
          >
            Close
          </button>

          {onViewDetails ? (
            <button
              type="button"
              onClick={handleViewDetails}
              className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-sm font-medium text-[var(--brand-foreground)] hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30"
            >
              View full details
            </button>
          ) : null}
        </footer>
      </aside>
    </div>
  );
}

export function MemberQuickViewDrawer({
  open,
  member,
  onClose,
  onViewDetails,
  className,
}: MemberQuickViewDrawerProps): ReactNode {
  if (!open || !member) {
    return null;
  }

  return (
    <MemberQuickViewContent
      member={member}
      onClose={onClose}
      onViewDetails={onViewDetails}
      className={className}
    />
  );
}

export default MemberQuickViewDrawer;
