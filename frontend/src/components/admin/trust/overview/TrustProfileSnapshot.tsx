
import { Card } from '@/components/ui/card';
import {
  TrustEmptyState,
  TrustLoadingState,
  TrustStatusBadge,
} from '@/components/admin/trust';

// -----------------------------------------------------------------------------
// sisiMove — Admin Trust Profile Snapshot
// -----------------------------------------------------------------------------

export interface TrustProfileSnapshotItem {
  publicId: string;
  memberPublicId: string;
  status: string;
  verificationLevel: string;
  ratingAverage: number;
  ratingCount: number;
  completedJourneys: number;
}

export interface TrustProfileSnapshotProps {
  profiles: TrustProfileSnapshotItem[];
  isLoading?: boolean;
  title?: string;
  description?: string;
  onSelectProfile?: (publicId: string) => void;
  className?: string;
}

function formatCount(value: number): string {
  return Number.isFinite(value)
    ? new Intl.NumberFormat().format(value)
    : '—';
}

function formatRating(average: number, count: number): string {
  if (!Number.isFinite(count) || count <= 0) {
    return '—';
  }

  return Number.isFinite(average) ? average.toFixed(1) : '—';
}

function getMemberInitials(memberPublicId: string): string {
  const parts = memberPublicId.trim().split(/[-_\s]+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return memberPublicId.trim().slice(0, 2).toUpperCase() || 'M';
}

export function TrustProfileSnapshot({
  profiles,
  isLoading = false,
  title = 'Trust profiles',
  description = 'Monitor member verification, ratings, and journey history.',
  onSelectProfile,
  className,
}: TrustProfileSnapshotProps) {
  return (
    <section
      className={className}
      aria-labelledby="trust-profile-snapshot-title"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="trust-profile-snapshot-title"
            className="text-lg font-semibold tracking-tight text-[var(--foreground)]"
          >
            {title}
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {description}
          </p>
        </div>

        {!isLoading && profiles.length > 0 && (
          <span className="inline-flex w-fit items-center rounded-full border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-3 py-1 text-xs font-medium text-[var(--foreground-secondary)]">
            {formatCount(profiles.length)}{' '}
            {profiles.length === 1 ? 'profile' : 'profiles'}
          </span>
        )}
      </div>

      {isLoading ? (
        <TrustLoadingState rows={4} />
      ) : profiles.length === 0 ? (
        <TrustEmptyState
          title="No trust profiles to display"
          description="Profiles will appear here when profile data is available."
        />
      ) : (
        <Card variant="default" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <caption className="sr-only">
                Trust profiles showing member identity, account status,
                verification level, ratings, and completed journeys.
              </caption>

              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--background-subtle)]">
                  <th
                    scope="col"
                    className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary)]"
                  >
                    Member
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary)]"
                  >
                    Account status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary)]"
                  >
                    Verification
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary)]"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary)]"
                  >
                    Reviews
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary)]"
                  >
                    Completed
                  </th>

                  {onSelectProfile && (
                    <th scope="col" className="w-16 px-4 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border-subtle)]">
                {profiles.map((profile) => {
                  const rating = formatRating(
                    profile.ratingAverage,
                    profile.ratingCount,
                  );

                  const memberContent = (
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] text-xs font-semibold text-[var(--foreground-secondary)]"
                      >
                        {getMemberInitials(profile.memberPublicId)}
                      </span>

                      <span className="min-w-0">
                        <span className="block max-w-[240px] truncate text-sm font-semibold text-[var(--foreground)]">
                          Member {profile.memberPublicId}
                        </span>
                        <span
                          title={profile.publicId}
                          className="mt-1 block max-w-[240px] truncate text-xs text-[var(--foreground-muted)]"
                        >
                          Profile ID: {profile.publicId}
                        </span>
                      </span>
                    </div>
                  );

                  return (
                    <tr
                      key={profile.publicId}
                      className="transition-colors hover:bg-[var(--background-subtle)]"
                    >
                      <td className="px-5 py-4">
                        {onSelectProfile ? (
                          <button
                            type="button"
                            onClick={() =>
                              onSelectProfile(profile.publicId)
                            }
                            aria-label={`View trust profile for member ${profile.memberPublicId}`}
                            className="block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                          >
                            {memberContent}
                          </button>
                        ) : (
                          memberContent
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <TrustStatusBadge
                          status={profile.status}
                          size="sm"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <TrustStatusBadge
                          status={profile.verificationLevel}
                          size="sm"
                        />
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-[var(--foreground)]">
                            {rating !== '—' && (
                              <span
                                aria-hidden="true"
                                className="text-amber-500"
                              >
                                ★
                              </span>
                            )}
                            {rating}
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)]">
                            {rating === '—' ? 'Not rated' : 'Average score'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                          {formatCount(profile.ratingCount)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                          {formatCount(profile.completedJourneys)}
                        </span>
                      </td>

                      {onSelectProfile && (
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              onSelectProfile(profile.publicId)
                            }
                            aria-label={`Open profile ${profile.publicId}`}
                            title="View profile"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                          >
                            <span aria-hidden="true">→</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--foreground-muted)]">
              Showing {formatCount(profiles.length)}{' '}
              {profiles.length === 1 ? 'trust profile' : 'trust profiles'}
            </p>

            <p className="text-xs text-[var(--foreground-muted)]">
              Data provided by the trust service
            </p>
          </div>
        </Card>
      )}
    </section>
  );
}

export default TrustProfileSnapshot;
