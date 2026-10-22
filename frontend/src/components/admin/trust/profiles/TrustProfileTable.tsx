
"use client";

import type { HTMLAttributes } from "react";

import type { TrustProfileSummaryModel } from "@/features/admin/trust/models/trust-profile.model";
import { TrustEmptyState } from "../shared/TrustEmptyState";
import { TrustErrorState } from "../shared/TrustErrorState";
import { TrustLoadingState } from "../shared/TrustLoadingState";
import { TrustProfilePagination } from "./TrustProfilePagination";
import { TrustProfileRow } from "./TrustProfileRow";

// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Table
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render the paginated trust-profile directory.
// - Present loading, error, empty, and populated states.
// - Delegate each profile's presentation to TrustProfileRow.
// - Delegate pagination controls to TrustProfilePagination.
//
// Non-responsibilities:
// - Fetching profiles.
// - Applying filters.
// - Performing trust mutations.
// - Making authorization decisions.
//
// Data contract:
// - Uses TrustProfileSummaryModel because the paginated endpoint returns
//   summary models without nested ratings, reviews, badges, or events.
// -----------------------------------------------------------------------------

export interface TrustProfileTableProps
  extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  profiles: TrustProfileSummaryModel[];

  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  onSelectProfile: (profile: TrustProfileSummaryModel) => void;

  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;

  disabled?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TrustProfileTable({
  profiles,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onSelectProfile,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  disabled = false,
  emptyTitle = "No trust profiles found",
  emptyDescription = "Profiles matching your current filters will appear here.",
  className,
  ...props
}: TrustProfileTableProps) {
  const rootClassName = ["space-y-4", className]
    .filter(Boolean)
    .join(" ");

  if (isError) {
    return (
      <section
        aria-label="Trust profile directory"
        className={rootClassName}
        {...props}
      >
        <TrustErrorState
          variant="load"
          title="Unable to load trust profiles"
          description={
            errorMessage ||
            "The trust profile directory could not be loaded. Try again."
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

  if (isLoading && profiles.length === 0) {
    return (
      <section
        aria-label="Trust profile directory"
        aria-busy="true"
        className={rootClassName}
        {...props}
      >
        <TrustLoadingState
          variant="skeleton"
          label="Loading trust profiles"
          rows={4}
          showHeading
          showDescription={false}
        />
      </section>
    );
  }

  if (profiles.length === 0) {
    return (
      <section
        aria-label="Trust profile directory"
        className={rootClassName}
        {...props}
      >
        <TrustEmptyState
          variant="profiles"
          title={emptyTitle}
          description={emptyDescription}
        />
      </section>
    );
  }

  return (
    <section
      aria-label="Trust profile directory"
      aria-busy={isLoading}
      className={rootClassName}
      {...props}
    >
      {isLoading && (
        <p
          role="status"
          className="text-sm text-[var(--foreground-secondary)]"
        >
          Updating profiles…
        </p>
      )}

      <div className="space-y-3">
        {profiles.map((profile) => (
          <TrustProfileRow
            key={profile.publicId}
            profile={profile}
            onSelect={onSelectProfile}
            disabled={disabled || isLoading}
          />
        ))}
      </div>

      <TrustProfilePagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={disabled || isLoading}
      />
    </section>
  );
}

export default TrustProfileTable;
