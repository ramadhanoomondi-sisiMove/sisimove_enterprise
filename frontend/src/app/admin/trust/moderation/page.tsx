/**
 * sisiMove — Trust Ratings and Reviews Moderation
 *
 * Responsibilities:
 * - Load the paginated Trust profile directory.
 * - Let an administrator select a profile.
 * - Load that profile's ratings and reviews.
 * - Execute supported moderation operations through useTrustOperations.
 * - Keep moderation failures available to the dialog caller.
 *
 * The current read contract is profile-scoped, not a global moderation feed.
 * Backend authorization and lifecycle rules remain server-owned.
 */

"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  TrustPageContainer,
  TrustControlCenterHeader,
  TrustModerationWorkspace,
  TrustLoadingState,
  TrustErrorState,
  TrustEmptyState,
} from "@/components/admin/trust";

import type {
  TrustModerationActionRequest,
} from "@/components/admin/trust";

import {
  useTrustProfile,
  useTrustProfilesPage,
} from "@/features/admin/trust/queries/trust.queries";

import { useTrustOperations } from "@/features/admin/trust/hooks";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Trust moderation data could not be loaded. Please try again.";
}

function normalizeAction(actionId: string): string {
  return actionId.trim().toLowerCase().replace(/[\s_-]+/g, " ");
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function TrustModerationPage() {
  const [page, setPage] = useState(1);
  const [selectedProfilePublicId, setSelectedProfilePublicId] =
    useState("");

  const pageSize = 50;

  const profilesQuery = useTrustProfilesPage(page, pageSize);
  const profileQuery = useTrustProfile(selectedProfilePublicId);
  const operations = useTrustOperations();

  const profiles = useMemo(
    () => profilesQuery.data?.profiles ?? [],
    [profilesQuery.data?.profiles],
  );

  const selectedProfile = useMemo(
    () =>
      profiles.find(
        (profile) => profile.publicId === selectedProfilePublicId,
      ),
    [profiles, selectedProfilePublicId],
  );

  const isMutationPending =
    operations.hideRating.isPending ||
    operations.removeRating.isPending ||
    operations.restoreRating.isPending ||
    operations.removeReview.isPending;

  const handleSelectProfile = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedProfilePublicId(event.target.value);
    },
    [],
  );

const { refetch: refetchProfiles } = profilesQuery;
const { refetch: refetchProfile } = profileQuery;

const handleRetryProfiles = useCallback(() => {
  void refetchProfiles();
}, [refetchProfiles]);

const handleRetryProfile = useCallback(() => {
  void refetchProfile();
}, [refetchProfile]);

  const handleNextPage = useCallback(() => {
    const totalPages = profilesQuery.data?.totalPages ?? 1;

    setPage((currentPage) =>
      Math.min(currentPage + 1, totalPages),
    );
  }, [profilesQuery.data?.totalPages]);

  const handlePreviousPage = useCallback(() => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }, []);

  // ---------------------------------------------------------------------------
  // Moderation actions
  // ---------------------------------------------------------------------------

  const handleModerate = useCallback(
    async (request: TrustModerationActionRequest) => {
      const profile = profileQuery.data;

      if (!profile) {
        throw new Error(
          "Select a Trust profile before moderating content.",
        );
      }

      const action = normalizeAction(request.actionId);
      const reason = request.reason.trim();

      if (!reason) {
        throw new Error("A moderation reason is required.");
      }

      if (request.target === "rating") {
        const rating = request.rating;

        if (!rating) {
          throw new Error(
            "The selected rating could not be identified.",
          );
        }

        if (action.includes("restore")) {
          await operations.restoreRating.mutateAsync([
            profile.id,
            rating.id,
          ]);
          return;
        }

        if (action.includes("hide")) {
          await operations.hideRating.mutateAsync([
            profile.id,
            rating.id,
            { reason },
          ]);
          return;
        }

        if (action.includes("remove")) {
          await operations.removeRating.mutateAsync([
            profile.id,
            rating.id,
            { reason },
          ]);
          return;
        }

        throw new Error(
          `Unsupported rating moderation action: ${request.actionId}`,
        );
      }

      const review = request.review;

      if (!review) {
        throw new Error(
          "The selected review could not be identified.",
        );
      }

      if (action.includes("remove") || action.includes("hide")) {
        await operations.removeReview.mutateAsync([
          profile.id,
          review.id,
          { reason },
        ]);
        return;
      }

      throw new Error(
        `Unsupported review moderation action: ${request.actionId}`,
      );
    },
    [
      operations.hideRating,
      operations.removeRating,
      operations.restoreRating,
      operations.removeReview,
      profileQuery.data,
    ],
  );

  // ---------------------------------------------------------------------------
  // Loading and error states
  // ---------------------------------------------------------------------------

  if (profilesQuery.isPending) {
    return (
      <TrustPageContainer size="2xl" className="space-y-6 py-6">
        <TrustControlCenterHeader
          eyebrow="TRUST & SAFETY"
          title="Ratings and Reviews Moderation"
          description="Inspect and moderate ratings and reviews associated with Trust profiles."
        />

        <TrustLoadingState />
      </TrustPageContainer>
    );
  }

  if (profilesQuery.isError) {
    return (
      <TrustPageContainer size="2xl" className="space-y-6 py-6">
        <TrustControlCenterHeader
          eyebrow="TRUST & SAFETY"
          title="Ratings and Reviews Moderation"
          description="Inspect and moderate ratings and reviews associated with Trust profiles."
        />

        <TrustErrorState
          title="Unable to load Trust profiles"
          description={getErrorMessage(profilesQuery.error)}
          retryAction={{
            label: "Retry",
            onClick: handleRetryProfiles,
          }}
        />
      </TrustPageContainer>
    );
  }

  // ---------------------------------------------------------------------------
  // Workspace
  // ---------------------------------------------------------------------------

  return (
    <TrustPageContainer size="2xl" className="space-y-6 py-6">
      <TrustControlCenterHeader
        eyebrow="TRUST & SAFETY"
        title="Ratings and Reviews Moderation"
        description="Inspect ratings and reviews, review profile context, and apply supported moderation actions with a recorded reason."
      />

      <Card variant="default" padding="lg">
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Select a Trust profile
            </h2>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              Ratings and reviews are loaded for the selected profile.
            </p>
          </div>

          {profiles.length === 0 ? (
            <TrustEmptyState
              title="No Trust profiles found"
              description="There are no Trust profiles available to inspect."
            />
          ) : (
            <>
              <label
                htmlFor="trust-moderation-profile"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Trust profile
              </label>

              <select
                id="trust-moderation-profile"
                value={selectedProfilePublicId}
                onChange={handleSelectProfile}
                className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
              >
                <option value="">Choose a profile…</option>

                {profiles.map((profile) => (
                  <option
                    key={profile.publicId}
                    value={profile.publicId}
                  >
                    {profile.memberPublicId} — {profile.publicId}
                  </option>
                ))}
              </select>

              {profilesQuery.data &&
                profilesQuery.data.totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[var(--foreground-muted)]">
                      Page {profilesQuery.data.page} of{" "}
                      {profilesQuery.data.totalPages} ·{" "}
                      {profilesQuery.data.total} profiles
                    </p>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={page <= 1}
                      >
                        Previous
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={
                          page >= profilesQuery.data.totalPages
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </Card>

      {!selectedProfilePublicId ? (
        <TrustEmptyState
          title="Choose a profile to begin"
          description="Select a Trust profile above to inspect its ratings and reviews and access available moderation actions."
        />
      ) : profileQuery.isPending ? (
        <TrustLoadingState />
      ) : profileQuery.isError ? (
        <TrustErrorState
          title="Unable to load the selected profile"
          description={getErrorMessage(profileQuery.error)}
          retryAction={{
            label: "Retry",
            onClick: handleRetryProfile,
          }}
        />
      ) : !profileQuery.data ? (
        <TrustEmptyState
          title="Trust profile not found"
          description="The selected profile could not be returned. Retry the request or select another profile."
        />
      ) : (
        <TrustModerationWorkspace
          ratings={profileQuery.data.ratings}
          reviews={profileQuery.data.reviews}
          onModerate={handleModerate}
          isMutationPending={isMutationPending}
          disabled={!selectedProfile}
          initialTab="ratings"
        />
      )}
    </TrustPageContainer>
  );
}
