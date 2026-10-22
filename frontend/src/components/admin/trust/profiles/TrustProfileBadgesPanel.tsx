/**
 * sisiMove — Trust Profile Badges Panel
 *
 * Displays badge assignments associated with an individual Trust profile.
 *
 * Responsibilities:
 * - Display assigned badge information.
 * - Distinguish active and inactive badge assignments.
 * - Show award and revocation timestamps when available.
 * - Present an empty state when the profile has no badge assignments.
 *
 * Non-responsibilities:
 * - Fetching badge definitions or assignments.
 * - Awarding or revoking badges.
 * - Inferring assignment status from badge-definition status.
 */

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type {
  TrustBadgeModel,
  TrustProfileBadgeModel,
} from "@/features/admin/trust/models";
import { TrustEmptyState } from "../shared/TrustEmptyState";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustProfileBadgesPanelProps {
  /**
   * Badge assignments for the selected Trust profile.
   */
  profileBadges: TrustProfileBadgeModel[];

  /**
   * Badge definitions available to resolve assignment badge IDs.
   */
  badges: TrustBadgeModel[];

  /**
   * Optional panel heading.
   */
  title?: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Additional classes for the panel root.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatLabel(value: string | null | undefined): string {
  if (!value?.trim()) {
    return "Not specified";
  }

  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

// -----------------------------------------------------------------------------
// Badge Assignment Card
// -----------------------------------------------------------------------------

function TrustProfileBadgeItem({
  assignment,
  definition,
}: {
  assignment: TrustProfileBadgeModel;
  definition?: TrustBadgeModel;
}) {
  const badgeName = definition?.name ?? "Unknown badge";

  return (
    <Card variant="default" padding="md" className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-[var(--foreground)]">
            {badgeName}
          </h3>

          {definition?.description && (
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--foreground-secondary)]">
              {definition.description}
            </p>
          )}

          {definition && (
            <p className="mt-2 text-xs text-[var(--foreground-muted)]">
              Type: {formatLabel(definition.type)}
            </p>
          )}
        </div>

        <Badge
          variant={assignment.active ? "success" : "outline"}
          size="sm"
        >
          {assignment.active ? "Active assignment" : "Inactive assignment"}
        </Badge>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs text-[var(--foreground-muted)]">
            Awarded
          </dt>

          <dd className="mt-1 text-sm text-[var(--foreground)]">
            <time dateTime={assignment.awardedAt}>
              {formatDate(assignment.awardedAt)}
            </time>
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="text-xs text-[var(--foreground-muted)]">
            Revoked
          </dt>

          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {assignment.revokedAt ? (
              <time dateTime={assignment.revokedAt}>
                {formatDate(assignment.revokedAt)}
              </time>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileBadgesPanel({
  profileBadges,
  badges,
  title = "Badges",
  description = "Badge assignments recorded for this Trust profile.",
  className,
}: TrustProfileBadgesPanelProps) {
  const badgesById = new Map(
    badges.map((badge) => [badge.id, badge]),
  );

  return (
    <section
      aria-label={title}
      className={["w-full min-w-0", className ?? ""].join(" ")}
    >
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h2>

          <Badge variant="outline" size="sm">
            {profileBadges.length}
          </Badge>
        </div>

        {description && (
          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {description}
          </p>
        )}
      </header>

      {profileBadges.length === 0 ? (
        <TrustEmptyState variant="badges" />
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {profileBadges.map((assignment) => (
            <TrustProfileBadgeItem
              key={assignment.publicId}
              assignment={assignment}
              definition={badgesById.get(assignment.badgeId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TrustProfileBadgesPanel;
