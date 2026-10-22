/**
 * sisiMove — Trust Profile Overview Panel
 *
 * Overview composition for an individual Trust profile.
 *
 * Responsibilities:
 * - Display core profile status and verification information.
 * - Compose the existing profile and journey metrics.
 * - Optionally expose caller-controlled verification actions.
 * - Keep each underlying panel independently reusable.
 *
 * Non-responsibilities:
 * - Fetching Trust profile data.
 * - Executing mutations or enforcing permissions.
 * - Recalculating metrics or deriving verification policy.
 */

import type { TrustProfileModel } from "@/features/admin/trust/models/trust-profile.model";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { TrustProfileMetrics } from "./TrustProfileMetrics";
import { TrustProfileJourneyMetrics } from "./TrustProfileJourneyMetrics";
import { TrustProfileVerificationPanel } from "./TrustProfileVerificationPanel";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustProfileOverviewPanelProps {
  /**
   * Mapped Trust profile data from the frontend model layer.
   */
  profile: TrustProfileModel;

  /**
   * Optional callback to request granting verification.
   */
  onGrantVerification?: () => void;

  /**
   * Optional callback to request revoking verification.
   */
  onRevokeVerification?: () => void;

  /**
   * Whether a verification operation is pending.
   */
  verificationPending?: boolean;

  /**
   * Whether verification actions should be disabled.
   */
  verificationActionsDisabled?: boolean;

  /**
   * Additional classes for the root element.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDisplayValue(value: string | null | undefined): string {
  if (!value?.trim()) {
    return "Not specified";
  }

  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

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

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileOverviewPanel({
  profile,
  onGrantVerification,
  onRevokeVerification,
  verificationPending = false,
  verificationActionsDisabled = false,
  className,
}: TrustProfileOverviewPanelProps) {
  return (
    <section
      aria-label="Trust profile overview"
      className={["w-full min-w-0 space-y-6", className ?? ""].join(" ")}
    >
      {/* Profile summary */}

      <Card variant="default" padding="lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
              Trust profile
            </p>

            <h2 className="mt-2 break-words text-xl font-semibold tracking-tight text-[var(--foreground)]">
              {profile.publicId}
            </h2>

            <p className="mt-1 break-all text-sm text-[var(--foreground-secondary)]">
              Member reference: {profile.memberPublicId}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" size="md">
              {formatDisplayValue(profile.status)}
            </Badge>

            <Badge variant="brand" size="md">
              {formatDisplayValue(profile.verificationLevel)}
            </Badge>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              Profile created
            </p>

            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDate(profile.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              Last updated
            </p>

            <p className="mt-1 text-sm text-[var(--foreground)]">
              {formatDate(profile.updatedAt)}
            </p>
          </div>
        </div>
      </Card>

      {/* Core Trust metrics */}

      <div>
        <h3 className="mb-3 text-base font-semibold text-[var(--foreground)]">
          Trust performance
        </h3>

        <TrustProfileMetrics profile={profile} />
      </div>

      {/* Journey performance */}

      <TrustProfileJourneyMetrics profile={profile} />

      {/* Verification */}

      <TrustProfileVerificationPanel
        profile={profile}
        onGrantVerification={onGrantVerification}
        onRevokeVerification={onRevokeVerification}
        isPending={verificationPending}
        actionsDisabled={verificationActionsDisabled}
      />
    </section>
  );
}

export default TrustProfileOverviewPanel;
