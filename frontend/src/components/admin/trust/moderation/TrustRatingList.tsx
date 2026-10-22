
"use client";

import type { HTMLAttributes } from "react";

import type { TrustRatingApiResponse } from '@/features/admin/trust/types/trust.types';
import { TrustEmptyState } from "../shared/TrustEmptyState";
import { TrustErrorState } from "../shared/TrustErrorState";
import { TrustLoadingState } from "../shared/TrustLoadingState";
import {
  TrustRatingCard,
  type TrustRatingCardAction,
} from "./TrustRatingCard";

// -----------------------------------------------------------------------------
// sisiMove — Trust Rating List
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render a collection of trust ratings.
// - Provide loading, error, and empty states.
// - Delegate rating presentation and actions to TrustRatingCard.
//
// Non-responsibilities:
// - Fetching ratings.
// - Applying moderation mutations.
// - Making authorization decisions.
// -----------------------------------------------------------------------------

export interface TrustRatingListProps
  extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  ratings: TrustRatingApiResponse[];

  onSelectRating?: (rating: TrustRatingApiResponse) => void;

  getActions?: (
    rating: TrustRatingApiResponse,
  ) => TrustRatingCardAction[];

  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;

  disabled?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TrustRatingList({
  ratings,
  onSelectRating,
  getActions,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  disabled = false,
  emptyTitle = "No ratings found",
  emptyDescription = "Ratings matching your current view will appear here.",
  className,
  ...props
}: TrustRatingListProps) {
  const rootClassName = ["space-y-4", className]
    .filter(Boolean)
    .join(" ");

  if (isError) {
    return (
      <section
        aria-label="Trust ratings"
        className={rootClassName}
        {...props}
      >
        <TrustErrorState
          variant="load"
          title="Unable to load ratings"
          description={
            errorMessage ||
            "Ratings could not be loaded. Please try again."
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

  if (isLoading && ratings.length === 0) {
    return (
      <section
        aria-label="Trust ratings"
        aria-busy="true"
        className={rootClassName}
        {...props}
      >
        <TrustLoadingState
          variant="skeleton"
          label="Loading trust ratings"
          rows={3}
          showHeading
          showDescription={false}
        />
      </section>
    );
  }

  if (ratings.length === 0) {
    return (
      <section
        aria-label="Trust ratings"
        className={rootClassName}
        {...props}
      >
        <TrustEmptyState
          variant="ratings"
          title={emptyTitle}
          description={emptyDescription}
        />
      </section>
    );
  }

  return (
    <section
      aria-label="Trust ratings"
      aria-busy={isLoading}
      className={rootClassName}
      {...props}
    >
      {isLoading && (
        <p role="status" className="text-sm text-[var(--foreground-secondary)]">
          Updating ratings…
        </p>
      )}

      <div className="space-y-3">
        {ratings.map((rating) => (
          <TrustRatingCard
            key={rating.publicId}
            rating={rating}
            onSelect={onSelectRating}
            actions={getActions?.(rating)}
            disabled={disabled || isLoading}
          />
        ))}
      </div>
    </section>
  );
}

export default TrustRatingList;
