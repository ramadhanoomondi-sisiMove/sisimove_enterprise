
/**
 * sisiMove — Trust Profile Management Workspace
 *
 * Composes the individual Trust profile administration workspace.
 *
 * Responsibilities:
 * - Present the selected profile's identity and current Trust state.
 * - Compose overview, ratings, reviews, badges, and event history.
 * - Display loading and error states for related data supplied by the parent.
 * - Forward verification actions to the parent workspace.
 * - Keep data fetching, permissions, and mutation execution outside
 *   this presentation component.
 *
 * Non-responsibilities:
 * - Fetching profile data or journeys.
 * - Defining backend contracts.
 * - Enforcing authorization.
 * - Executing mutations directly.
 */

"use client";

import type { ReactNode } from "react";

import type { TrustProfileModel } from "@/features/admin/trust/models/trust-profile.model";

import { TrustPageContainer } from "../layout/TrustPageContainer";
import { TrustErrorState } from "../shared/TrustErrorState";

import {
  TrustProfileManagementHeader,
  type TrustProfileManagementHeaderAction,
} from "./TrustProfileManagementHeader";

import { TrustProfileOverviewPanel } from "./TrustProfileOverviewPanel";
import { TrustProfileRatingsPanel } from "./TrustProfileRatingsPanel";
import { TrustProfileReviewsPanel } from "./TrustProfileReviewsPanel";
import { TrustProfileBadgesPanel } from "./TrustProfileBadgesPanel";
import { TrustEventTimeline } from "../timeline/TrustEventTimeline";

// -----------------------------------------------------------------------------
// Related-data state
// -----------------------------------------------------------------------------

/**
 * Query state supplied by the parent page.
 *
 * The workspace does not fetch or refetch data itself. It only presents
 * the current state and invokes the retry callback when requested.
 */
export interface TrustRelatedSectionState {
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * Query states for independently loaded Trust profile collections.
 */
export interface TrustProfileManagementRelatedData {
  ratings?: TrustRelatedSectionState;
  reviews?: TrustRelatedSectionState;
  badges?: TrustRelatedSectionState;
  events?: TrustRelatedSectionState;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustProfileManagementWorkspaceProps {
  /**
   * Fully mapped Trust profile, including available related collections.
   */
  profile: TrustProfileModel;

  /**
   * Loading, error, and retry states for related collections.
   * These are provided by the parent route or container.
   */
  relatedData?: TrustProfileManagementRelatedData;

  /**
   * Optional actions displayed in the profile workspace header.
   * The parent determines which actions are appropriate.
   */
  headerActions?: TrustProfileManagementHeaderAction[];

  /**
   * Called when the administrator requests granting verification.
   * Typically opens a confirmation dialog in the parent.
   */
  onGrantVerification?: () => void;

  /**
   * Called when the administrator requests revoking verification.
   * Typically opens a confirmation dialog in the parent.
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
   * Whether the event timeline should be displayed.
   */
  showTimeline?: boolean;

  /**
   * Additional classes for the workspace root.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Related-data status
// -----------------------------------------------------------------------------

interface RelatedSectionStatusProps {
  label: string;
  state?: TrustRelatedSectionState;
}

function RelatedSectionStatus({
  label,
  state,
}: RelatedSectionStatusProps) {
  if (!state) {
    return null;
  }

  const isLoading = state.isLoading === true;
  const error = state.error?.trim();

  if (!isLoading && !error) {
    return null;
  }

  return (
    <section
      aria-label={`${label} data status`}
      aria-live="polite"
      className="space-y-3"
    >
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading {label.toLowerCase()}…
        </p>
      )}

      {error && (
        <TrustErrorState
          title={`Unable to load ${label.toLowerCase()}`}
          description={error}
          retryAction={
            state.onRetry
              ? {
                  label: `Retry ${label.toLowerCase()}`,
                  onClick: state.onRetry,
                }
              : undefined
          }
        />
      )}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileManagementWorkspace({
  profile,
  relatedData,
  headerActions = [],
  onGrantVerification,
  onRevokeVerification,
  verificationPending = false,
  verificationActionsDisabled = false,
  showTimeline = true,
  className,
}: TrustProfileManagementWorkspaceProps) {
  const sections: ReactNode[] = [
    <section key="ratings" className="space-y-4">
      <RelatedSectionStatus
        label="Ratings"
        state={relatedData?.ratings}
      />

      <TrustProfileRatingsPanel
        ratings={profile.ratings}
        title="Member ratings"
        description="Ratings associated with this Trust profile."
      />
    </section>,

    <section key="reviews" className="space-y-4">
      <RelatedSectionStatus
        label="Reviews"
        state={relatedData?.reviews}
      />

      <TrustProfileReviewsPanel
        reviews={profile.reviews}
        title="Member reviews"
        description="Written reviews associated with this Trust profile."
      />
    </section>,

    <section key="badges" className="space-y-4">
      <RelatedSectionStatus
        label="Badges"
        state={relatedData?.badges}
      />

      <TrustProfileBadgesPanel
        profileBadges={profile.profileBadges}
        badges={profile.badges}
        title="Member badges"
        description="Badge assignments and their current status."
      />
    </section>,
  ];

  return (
    <TrustPageContainer
      size="2xl"
      className={["space-y-8 py-6", className ?? ""].join(" ")}
    >
      {/* Profile identity and workspace actions */}

      <TrustProfileManagementHeader
        profile={profile}
        title="Member Trust Workspace"
        description="Review and manage this member's trust profile, verification, ratings, reviews, badges, and recorded activity."
        actions={headerActions}
      />

      {/* Core profile metrics and verification */}

      <TrustProfileOverviewPanel
        profile={profile}
        onGrantVerification={onGrantVerification}
        onRevokeVerification={onRevokeVerification}
        verificationPending={verificationPending}
        verificationActionsDisabled={verificationActionsDisabled}
      />

      {/* Ratings, reviews, and badge assignments */}

      {sections}

      {/* Recorded Trust events */}

      {showTimeline && (
        <section className="space-y-4">
          <RelatedSectionStatus
            label="Trust history"
            state={relatedData?.events}
          />

          <TrustEventTimeline
            events={profile.events}
            order="newest-first"
            title="Trust history"
            description="Recorded Trust events associated with this profile."
          />
        </section>
      )}
    </TrustPageContainer>
  );
}

export default TrustProfileManagementWorkspace;
