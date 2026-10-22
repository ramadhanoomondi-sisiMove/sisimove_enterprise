"use client";

import { useState } from "react";
import type { HTMLAttributes } from "react";

import type {
  TrustRatingApiResponse,
  TrustReviewApiResponse,
} from "@/features/admin/trust/types/trust.types";

import { TrustControlCenterHeader } from "../layout/TrustControlCenterHeader";
import { TrustModerationDialog } from "./TrustModerationDialog";
import { TrustRatingList } from "./TrustRatingList";
import type { TrustRatingCardAction } from "./TrustRatingCard";
import { TrustReviewList } from "./TrustReviewList";
import type { TrustReviewCardAction } from "./TrustReviewCard";

// -----------------------------------------------------------------------------
// sisiMove — Trust Moderation Workspace
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present ratings and reviews in a unified moderation workspace.
// - Let the admin switch between rating and review queues.
// - Open a reason-required confirmation dialog for a selected action.
// - Delegate data fetching, permissions, and mutations to the parent.
//
// Non-responsibilities:
// - Fetching moderation records.
// - Defining backend status transitions.
// - Determining permissions.
// - Executing backend operations directly.
// -----------------------------------------------------------------------------

export type TrustModerationTab = "ratings" | "reviews";

export interface TrustModerationActionRequest {
  target: "rating" | "review";
  rating?: TrustRatingApiResponse;
  review?: TrustReviewApiResponse;
  actionId: string;
  reason: string;
}

export interface TrustModerationWorkspaceProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  ratings: TrustRatingApiResponse[];
  reviews: TrustReviewApiResponse[];

  onModerate: (
    request: TrustModerationActionRequest,
  ) => void | Promise<void>;

  getRatingActions?: (
    rating: TrustRatingApiResponse,
  ) => TrustRatingCardAction[];

  getReviewActions?: (
    review: TrustReviewApiResponse,
  ) => TrustReviewCardAction[];

  isLoadingRatings?: boolean;
  isLoadingReviews?: boolean;
  isErrorRatings?: boolean;
  isErrorReviews?: boolean;
  ratingsErrorMessage?: string;
  reviewsErrorMessage?: string;
  onRetryRatings?: () => void;
  onRetryReviews?: () => void;

  isMutationPending?: boolean;
  disabled?: boolean;

  initialTab?: TrustModerationTab;
}

interface PendingModerationAction {
  target: "rating" | "review";
  actionId: string;
  rating?: TrustRatingApiResponse;
  review?: TrustReviewApiResponse;
  label: string;
}

export function TrustModerationWorkspace({
  ratings,
  reviews,
  onModerate,
  getRatingActions,
  getReviewActions,
  isLoadingRatings = false,
  isLoadingReviews = false,
  isErrorRatings = false,
  isErrorReviews = false,
  ratingsErrorMessage,
  reviewsErrorMessage,
  onRetryRatings,
  onRetryReviews,
  isMutationPending = false,
  disabled = false,
  initialTab = "ratings",
  className,
  ...props
}: TrustModerationWorkspaceProps) {
  const [activeTab, setActiveTab] =
    useState<TrustModerationTab>(initialTab);

  const [pendingAction, setPendingAction] =
    useState<PendingModerationAction | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  function requestRatingAction(
    rating: TrustRatingApiResponse,
    action: TrustRatingCardAction,
  ) {
    if (disabled || isMutationPending) return;

    setPendingAction({
      target: "rating",
      rating,
      actionId: action.label,
      label: action.label,
    });

    setDialogOpen(true);
  }

  function requestReviewAction(
    review: TrustReviewApiResponse,
    action: TrustReviewCardAction,
  ) {
    if (disabled || isMutationPending) return;

    setPendingAction({
      target: "review",
      review,
      actionId: action.label,
      label: action.label,
    });

    setDialogOpen(true);
  }

  async function confirmModeration(reason: string) {
    if (!pendingAction || disabled || isMutationPending) {
      return;
    }

    await onModerate({
      target: pendingAction.target,
      rating: pendingAction.rating,
      review: pendingAction.review,
      actionId: pendingAction.actionId,
      reason,
    });

    // TrustModerationDialog handles successful closure by calling
    // onOpenChange(false). The parent resets pendingAction there.
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    if (isMutationPending && !nextOpen) return;

    setDialogOpen(nextOpen);

    if (!nextOpen) {
      setPendingAction(null);
    }
  }

  const ratingActions = (rating: TrustRatingApiResponse) =>
    (getRatingActions?.(rating) ?? []).map((action) => ({
      ...action,
      onClick: () => requestRatingAction(rating, action),
    }));

  const reviewActions = (review: TrustReviewApiResponse) =>
    (getReviewActions?.(review) ?? []).map((action) => ({
      ...action,
      onClick: () => requestReviewAction(review, action),
    }));

  return (
    <div
      className={["space-y-6", className].filter(Boolean).join(" ")}
      {...props}
    >
      <TrustControlCenterHeader
        eyebrow="TRUST OPERATIONS"
        title="Ratings & Reviews Moderation"
        description="Review trust feedback and take moderation actions with a documented reason."
      />

      <div
        role="tablist"
        aria-label="Moderation queues"
        className="flex flex-wrap items-center gap-2 border-b border-[var(--border)]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "ratings"}
          onClick={() => setActiveTab("ratings")}
          className={[
            "min-h-11 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
            activeTab === "ratings"
              ? "border-[var(--brand)] text-[var(--brand)]"
              : "border-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)]",
          ].join(" ")}
        >
          Ratings
          <span className="ml-2 rounded-full bg-[var(--background-muted)] px-2 py-0.5 text-xs tabular-nums">
            {ratings.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "reviews"}
          onClick={() => setActiveTab("reviews")}
          className={[
            "min-h-11 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
            activeTab === "reviews"
              ? "border-[var(--brand)] text-[var(--brand)]"
              : "border-transparent text-[var(--foreground-secondary)] hover:text-[var(--foreground)]",
          ].join(" ")}
        >
          Reviews
          <span className="ml-2 rounded-full bg-[var(--background-muted)] px-2 py-0.5 text-xs tabular-nums">
            {reviews.length}
          </span>
        </button>
      </div>

      {activeTab === "ratings" ? (
        <div role="tabpanel" aria-label="Ratings moderation">
          <TrustRatingList
            ratings={ratings}
            getActions={ratingActions}
            isLoading={isLoadingRatings}
            isError={isErrorRatings}
            errorMessage={ratingsErrorMessage}
            onRetry={onRetryRatings}
            disabled={disabled || isMutationPending}
          />
        </div>
      ) : (
        <div role="tabpanel" aria-label="Reviews moderation">
          <TrustReviewList
            reviews={reviews}
            getActions={reviewActions}
            isLoading={isLoadingReviews}
            isError={isErrorReviews}
            errorMessage={reviewsErrorMessage}
            onRetry={onRetryReviews}
            disabled={disabled || isMutationPending}
          />
        </div>
      )}

      <TrustModerationDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        title={
          pendingAction
            ? `Confirm: ${pendingAction.label}`
            : "Confirm moderation action"
        }
        description={
          pendingAction
            ? `Provide a reason before proceeding with this ${pendingAction.target} action.`
            : "Provide a reason for this moderation action."
        }
        confirmLabel={pendingAction?.label ?? "Confirm action"}
        tone="danger"
        isPending={isMutationPending}
        onConfirm={confirmModeration}
      />
    </div>
  );
}

export default TrustModerationWorkspace;