
 // -----------------------------------------------------------------------------
 // sisiMove — Admin Member Profile Card
 // -----------------------------------------------------------------------------
 //
 // Responsibilities:
 // - Display data from the administrative Traveller Profile model.
 // - Show a photo only when an already-resolved asset URL is supplied.
 // - Display available profile, journey, preference, and corridor information.
 // - Handle missing data without inventing personal attributes.
 //
 // Non-responsibilities:
 // - Fetching profile data.
 // - Resolving asset URLs.
 // - Editing profile information.
 // - Inferring Profile data from Identity data.
 //
 // -----------------------------------------------------------------------------

import type { ReactNode } from "react";

import { MemberDataSection } from "@/components/admin/members/primitives/member-data-section";
import { MemberAvatar } from "@/components/admin/members/primitives/member-avatar";
import type {
  MemberProfile,
  MemberProfileCorridor,
} from "@/features/admin/members/models/member-profile.model";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberProfileCardProps {
  /**
   * Traveller Profile returned by the Profile feature.
   * Pass null when the member has no profile.
   */
  readonly profile: MemberProfile | null;
  readonly isLoading?: boolean;
  readonly className?: string;

  /**
   * Optional URL resolved by the caller through the Asset feature.
   * Never pass avatarAssetPublicId here.
   */
  readonly avatarUrl?: string | null;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value?: string | null): string {
  if (!value?.trim()) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(date);
}

function formatLabel(value?: string | null): string {
  if (!value?.trim()) return "Not recorded";

  return value
    .trim()
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatBoolean(value: boolean | null | undefined): string {
  if (value === undefined || value === null) return "Not recorded";
  return value ? "Enabled" : "Disabled";
}

// -----------------------------------------------------------------------------
// Reusable field
// -----------------------------------------------------------------------------

interface ProfileFieldProps {
  readonly label: string;
  readonly value: string | number | null | undefined;
}

function ProfileField({ label, value }: ProfileFieldProps): ReactNode {
  const resolvedValue =
    typeof value === "number"
      ? value.toLocaleString("en-KE")
      : value?.trim() || "Not recorded";

  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>
      <dd className="break-words text-sm text-[var(--foreground)]">
        {resolvedValue}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Loading state
// -----------------------------------------------------------------------------

function ProfileLoadingState(): ReactNode {
  return (
    <div
      className="space-y-5"
      role="status"
      aria-label="Loading member profile"
    >
      <div className="flex items-center gap-4">
        <div className="size-16 animate-pulse rounded-full bg-[var(--background-muted)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-[var(--background-muted)]" />
          <div className="h-3 w-28 animate-pulse rounded bg-[var(--background-muted)]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-[var(--background-muted)]" />
            <div className="h-4 w-36 animate-pulse rounded bg-[var(--background-muted)]" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading profile information…</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Corridors
// -----------------------------------------------------------------------------

function ProfileCorridors({
  corridors,
}: {
  readonly corridors: readonly MemberProfileCorridor[];
}): ReactNode {
  if (corridors.length === 0) {
    return (
      <p className="text-sm text-[var(--foreground-muted)]">
        No profile corridors recorded.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {corridors.map((corridor) => (
        <li
          key={corridor.publicId}
          className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="min-w-0 flex-1 text-sm font-medium text-[var(--foreground)]">
              {corridor.originName} <span aria-hidden="true">→</span>{" "}
              {corridor.destinationName}
            </p>

            {corridor.isPrimary ? (
              <span className="rounded-full bg-[var(--brand-soft)] px-2 py-1 text-xs font-medium text-[var(--brand)]">
                Primary
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Updated {formatDate(corridor.updatedAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberProfileCard({
  profile,
  isLoading = false,
  className,
  avatarUrl,
}: MemberProfileCardProps): ReactNode {
  return (
    <MemberDataSection
      title="Profile"
      description="Traveller profile information, preferences, and journey statistics."
      className={className}
    >
      {isLoading ? (
        <ProfileLoadingState />
      ) : !profile ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No profile information available
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            A Traveller Profile record has not been supplied for this member.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile identity */}
          <div className="flex min-w-0 items-center gap-4">
            <MemberAvatar
              src={avatarUrl ?? undefined}
              alt={`${profile.handle || "Member"} profile photo`}
              fallback={getInitials(profile.handle || "?")}
              size="xl"
            />

            <div className="min-w-0">
              <h3 className="break-words text-lg font-semibold text-[var(--foreground)]">
                {profile.handle ? `@${profile.handle}` : "Handle not provided"}
              </h3>

              {profile.bio?.trim() ? (
                <p className="mt-1 whitespace-pre-line break-words text-sm text-[var(--foreground-secondary)]">
                  {profile.bio.trim()}
                </p>
              ) : (
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  No profile biography provided.
                </p>
              )}
            </div>
          </div>

          {/* Profile attributes */}
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Profile information
            </h4>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <ProfileField label="Profile ID" value={profile.publicId} />
              <ProfileField label="Member ID" value={profile.memberPublicId} />
              <ProfileField label="Country code" value={profile.countryCode} />
              <ProfileField label="Profile status" value={formatLabel(profile.status)} />
              <ProfileField label="Visibility" value={formatLabel(profile.visibility)} />
              <ProfileField label="Profile created" value={formatDate(profile.createdAt)} />
              <ProfileField label="Profile last updated" value={formatDate(profile.updatedAt)} />
              <ProfileField
                label="Profile photo asset ID"
                value={profile.avatarAssetPublicId}
              />
            </dl>
          </section>

          {/* Journey statistics */}
          <section className="space-y-3 border-t border-[var(--border-subtle)] pt-5">
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Journey statistics
            </h4>

            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <ProfileField label="Total journeys" value={profile.totalJourneys} />
              <ProfileField label="Completed journeys" value={profile.completedJourneys} />
              <ProfileField label="Provider journeys" value={profile.providerJourneys} />
              <ProfileField label="Passenger journeys" value={profile.passengerJourneys} />
              <ProfileField
                label="Completed provider journeys"
                value={profile.completedProviderJourneys}
              />
              <ProfileField
                label="Completed passenger journeys"
                value={profile.completedPassengerJourneys}
              />
            </dl>
          </section>

          {/* Profile preferences */}
          <section className="space-y-3 border-t border-[var(--border-subtle)] pt-5">
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Profile preferences
            </h4>

            {profile.preferences ? (
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <ProfileField
                  label="Show journey history"
                  value={formatBoolean(profile.preferences.showJourneyHistory)}
                />
                <ProfileField
                  label="Show journey statistics"
                  value={formatBoolean(profile.preferences.showJourneyStatistics)}
                />
                <ProfileField
                  label="Allow journey invites"
                  value={formatBoolean(profile.preferences.allowJourneyInvites)}
                />
                <ProfileField
                  label="Preferences last updated"
                  value={formatDate(profile.preferences.updatedAt)}
                />
              </dl>
            ) : (
              <p className="text-sm text-[var(--foreground-muted)]">
                No profile preferences recorded.
              </p>
            )}
          </section>

          {/* Profile corridors */}
          <section className="space-y-3 border-t border-[var(--border-subtle)] pt-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                Preferred corridors
              </h4>
              <span className="text-xs text-[var(--foreground-muted)]">
                {profile.corridors.length}{" "}
                {profile.corridors.length === 1 ? "corridor" : "corridors"}
              </span>
            </div>

            <ProfileCorridors corridors={profile.corridors} />
          </section>
        </div>
      )}
    </MemberDataSection>
  );
}

export default MemberProfileCard;
