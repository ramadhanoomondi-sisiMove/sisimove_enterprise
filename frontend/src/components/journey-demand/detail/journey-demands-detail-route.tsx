// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Detail Route Container
// -----------------------------------------------------------------------------
//
// Client-side container for one public Journey Demand.
//
// Responsibilities:
// - receive the route's publicId;
// - load the public Journey Demand projection;
// - render detail-page actions;
// - delegate loading through useJourneyDemand;
// - navigate unauthenticated users into authentication while preserving the
//   current Demand as returnTo;
// - throw query errors to the route error boundary;
// - handle the missing-resource case;
// - pass the loaded PublicJourneyDemand to JourneyDemandDetail.
//
// Non-responsibilities:
// - no detail presentation;
// - no projection mapping;
// - no lifecycle reconstruction;
// - no authorization decisions;
// - no Journey Demand mutation execution;
// - no route construction.
//
// Architecture:
//
//   /demands/[publicId]
//          ↓
//   JourneyDemandsDetailRoute
//          ↓
//   useJourneyDemand(publicId)
//          ↓
//   PublicJourneyDemand
//          ↓
//   JourneyDemandActions
//          ↓
//   Join Demand
//          ↓
//   /login?returnTo=/demands/[publicId]
// -----------------------------------------------------------------------------

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui";

import { useJourneyDemand } from "@/features/journey-demand/hooks";

import { AUTHENTICATION_ROUTES } from "@/foundation/routing";

import { JourneyDemandActions } from "../shared/journey-demand-actions";

import { JourneyDemandDetail } from "./journey-demand-detail";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandsDetailRouteProps {
  readonly publicId: string;
}

// =============================================================================
// Loading
// =============================================================================

function JourneyDemandDetailRouteLoading() {
  return (
    <main
      className={[
        "min-h-full",
        "w-full",
        "min-w-0",
        "bg-[var(--background-brand)]",
      ].join(" ")}
      aria-busy="true"
      aria-label="Loading journey demand"
    >
      <div className="page-container">
        <span className="sr-only">
          Loading journey demand…
        </span>

        <section
          className="py-6 sm:py-8"
          aria-hidden="true"
        >
          <div className="mx-auto w-full max-w-5xl">
            <div
              className={[
                "overflow-hidden",
                "rounded-[var(--radius-xl)]",
                "border",
                "border-[var(--border)]",
                "bg-[var(--surface)]",
                "shadow-[var(--shadow-md)]",
              ].join(" ")}
            >
              {/* ----------------------------------------------------------- */}
              {/* Demand identity                                             */}
              {/* ----------------------------------------------------------- */}

              <div
                className={[
                  "border-l-4",
                  "border-[var(--brand)]",
                  "bg-[var(--background-brand)]",
                  "px-5",
                  "py-5",
                  "sm:px-6",
                  "sm:py-6",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton
                      className="h-3 w-32"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-7 w-80 max-w-full"
                      radius="md"
                    />

                    <Skeleton
                      className="h-4 w-[30rem] max-w-full"
                      radius="sm"
                    />
                  </div>

                  <Skeleton
                    className="h-6 w-16 shrink-0"
                    radius="full"
                  />
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Requester                                                   */}
              {/* ----------------------------------------------------------- */}

              <div className="border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <Skeleton
                    className="size-10 shrink-0"
                    radius="full"
                  />

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton
                      className="h-4 w-32"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-3 w-52 max-w-full"
                      radius="sm"
                    />
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Route                                                       */}
              {/* ----------------------------------------------------------- */}

              <div className="px-5 py-6 sm:px-6 sm:py-7">
                <div className="mb-3 flex items-center gap-2">
                  <Skeleton
                    className="size-4"
                    radius="full"
                  />

                  <Skeleton
                    className="h-3 w-32"
                    radius="sm"
                  />
                </div>

                <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-5">
                  <div className="space-y-3">
                    <Skeleton
                      className="h-8 w-80 max-w-full"
                      radius="md"
                    />

                    <Skeleton
                      className="h-4 w-56 max-w-full"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-4 w-48 max-w-full"
                      radius="sm"
                    />
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Travel need                                                 */}
              {/* ----------------------------------------------------------- */}

              <div className="border-t border-[var(--border-subtle)] px-5 py-5 sm:px-6">
                <Skeleton
                  className="mb-3 h-3 w-24"
                  radius="sm"
                />

                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-5">
                    <div className="space-y-3">
                      <Skeleton
                        className="h-3 w-28"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-6 w-52 max-w-full"
                        radius="md"
                      />

                      <Skeleton
                        className="h-3 w-40"
                        radius="sm"
                      />
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-5">
                    <div className="space-y-3">
                      <Skeleton
                        className="h-3 w-24"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-7 w-16"
                        radius="md"
                      />

                      <Skeleton
                        className="h-3 w-40"
                        radius="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Pricing                                                     */}
              {/* ----------------------------------------------------------- */}

              <div className="border-t border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-5 sm:px-6">
                <Skeleton
                  className="mb-3 h-3 w-28"
                  radius="sm"
                />

                <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton
                        className="h-3 w-28"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-7 w-32"
                        radius="md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Skeleton
                        className="h-3 w-28"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-7 w-32"
                        radius="md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Lower detail surfaces                                       */}
              {/* ----------------------------------------------------------- */}

              <div className="space-y-4 border-t border-[var(--border-subtle)] p-5 sm:p-6">
                <div className="rounded-[var(--radius-xl)] border border-[var(--border)] p-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        className="size-9 shrink-0"
                        radius="md"
                      />

                      <div className="space-y-1.5">
                        <Skeleton
                          className="h-4 w-36"
                          radius="sm"
                        />

                        <Skeleton
                          className="h-3 w-52"
                          radius="sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Skeleton
                        className="h-24 w-full"
                        radius="lg"
                      />

                      <Skeleton
                        className="h-24 w-full"
                        radius="lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[var(--radius-xl)] border border-[var(--border)] p-5">
                  <div className="space-y-3">
                    <Skeleton
                      className="h-4 w-32"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-3 w-64 max-w-full"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-16 w-full"
                      radius="lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandsDetailRoute({
  publicId,
}: JourneyDemandsDetailRouteProps) {
  const router = useRouter();

  const {
    data,
    isLoading,
    error,
  } = useJourneyDemand(publicId);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleShare = useCallback((): void => {
    // Sharing implementation remains owned by the application/container layer.
  }, []);

  const handleJoin = useCallback((): void => {
    const returnTo =
      `/demands/${encodeURIComponent(publicId)}`;

    const loginUrl =
      `${AUTHENTICATION_ROUTES.LOGIN}?returnTo=` +
      encodeURIComponent(returnTo);

    router.push(loginUrl);
  }, [publicId, router]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <JourneyDemandDetailRouteLoading />;
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error !== null) {
    throw error;
  }

  // ---------------------------------------------------------------------------
  // Missing resource
  // ---------------------------------------------------------------------------

  if (data === null) {
    throw new Error("Journey Demand was not found.");
  }

  // ---------------------------------------------------------------------------
  // Loaded public projection
  // ---------------------------------------------------------------------------

  return (
    <main
      className={[
        "min-h-full",
        "w-full",
        "min-w-0",
        "bg-[var(--background-brand)]",
      ].join(" ")}
    >
      <div className="page-container">
        <section className="py-6 sm:py-8">
          <div className="mx-auto w-full max-w-5xl">
            <JourneyDemandDetail
              demand={data}
              actions={
                <JourneyDemandActions
                  onView={() => {}}
                  onShare={handleShare}
                  onJoin={handleJoin}
                  viewDisabled
                />
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}