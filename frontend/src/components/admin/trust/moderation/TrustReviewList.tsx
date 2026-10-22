
"use client";

import type { HTMLAttributes } from "react";

import type { TrustReviewApiResponse } from '@/features/admin/trust/types/trust.types';
import { TrustEmptyState } from "../shared/TrustEmptyState";
import { TrustErrorState } from "../shared/TrustErrorState";
import { TrustLoadingState } from "../shared/TrustLoadingState";
import {
  TrustReviewCard,
  type TrustReviewCardAction,
} from "./TrustReviewCard";

// -----------------------------------------------------------------------------
// sisiMove — Trust Review List
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render a collection of trust reviews.
// - Provide loading, error, and empty states.
// - Delegate review presentation and actions to TrustReviewCard.
//
// Non-responsibilities:
// - Fetching reviews.
// - Applying moderation mutations.
// - Inferring moderation status or reviewer identity.
// - Making authorization decisions.
// -----------------------------------------------------------------------------

export interface TrustReviewListProps
  extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  reviews: TrustReviewApiResponse[];

  onSelectReview?: (review: TrustReviewApiResponse) => void;

  getActions?: (
    review: TrustReviewApiResponse,
  ) => TrustReviewCardAction[];

  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;

  disabled?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TrustReviewList({
  reviews,
  onSelectReview,
  getActions,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  disabled = false,
  emptyTitle = "No reviews found",
  emptyDescription = "Reviews matching your current view will appear here.",
  className,
  ...props
}: TrustReviewListProps) {
  const rootClassName = ["space-y-4", className]
    .filter(Boolean)
    .join(" ");

  if (isError) {
    return (
      <section
        aria-label="Trust reviews"
        className={rootClassName}
        {...props}
      >
        <TrustErrorState
          variant="load"
          title="Unable to load reviews"
          description={
            errorMessage ||
            "Reviews could not be loaded. Please try again."
          }
          retryAction={
            onRetry
              ? {
                  label: "Retry",
                  onClick: onRetry,
                }
              : undefined
          }
        />
      </section>
    );
  }

  if (isLoading && reviews.length === 0) {
    return (
      <section
        aria-label="Trust reviews"
        aria-busy="true"
        className={rootClassName}
        {...props}
      >
        <TrustLoadingState
          variant="skeleton"
          label="Loading trust reviews"
          rows={3}
          showHeading
          showDescription={false}
        />
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section
        aria-label="Trust reviews"
        className={rootClassName}
        {...props}
      >
        <TrustEmptyState
          variant="reviews"
          title={emptyTitle}
          description={emptyDescription}
        />
      </section>
    );
  }

  return (
    <section
      aria-label="Trust reviews"
      aria-busy={isLoading}
      className={rootClassName}
      {...props}
    >
      {isLoading && (
        <p
          role="status"
          className="text-sm text-[var(--foreground-secondary)]"
        >
          Updating reviews…
        </p>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <TrustReviewCard
            key={review.publicId}
            review={review}
            onSelect={onSelectReview}
            actions={getActions?.(review)}
            disabled={disabled || isLoading}
          />
        ))}
      </div>
    </section>
  );
}

export default TrustReviewList;
