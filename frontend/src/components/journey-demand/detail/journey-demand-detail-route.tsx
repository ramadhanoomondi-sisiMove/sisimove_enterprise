// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Detail Route
// -----------------------------------------------------------------------------
//
// Authenticated Journey Demand detail route/container.
//
// Responsibilities:
// - receive the Journey Demand public ID from the route;
// - load the authenticated owner's Journey Demand;
// - present loading state;
// - present backend/API error state;
// - render the owner detail composition once data is available.
//
// Architecture rules:
// - Authentication is established by the authenticated route boundary.
// - Ownership is resolved by the backend through the authenticated API.
// - The frontend does not compare requesterPublicId values.
// - The frontend does not authorize ownership.
// - The frontend does not fetch through the public Journey Demand API.
// - The frontend does not convert MyJourneyDemand into PublicJourneyDemand.
// - The frontend does not recreate aggregate/domain behaviour.
//
// Data flow:
//
//     route param
//         ↓
//     useMyJourneyDemand(publicId)
//         ↓
//     MyJourneyDemand
//         ↓
//     MyJourneyDemandDetail
//
// -----------------------------------------------------------------------------
// PRESENTATION
// -----------------------------------------------------------------------------
//
// The owner detail page uses the same Journey Demand visual language as the
// public marketplace, while allowing authenticated owner-management UI to be
// composed separately.
//
//     MyJourneyDemandDetail
//          ├── Demand overview
//          ├── Route
//          ├── Schedule
//          ├── Capacity
//          ├── Pricing
//          ├── Management
//          └── Owner-specific sections
//
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";

import { AlertCircle, RefreshCw } from "lucide-react";

import { cn } from "@/foundation";

import { useMyJourneyDemand } from "@/features/journey-demand/hooks/queries/use-my-journey-demand";

import { MyJourneyDemandDetail } from "../manage";

// =============================================================================
// Props
// =============================================================================

export interface MyJourneyDemandDetailRouteProps {
  /**
   * Public identifier supplied by the authenticated dynamic route.
   */
  readonly journeyDemandPublicId: string;

  /**
   * Optional owner-management UI supplied by the route/container.
   *
   * The route does not determine which management actions are available.
   */
  readonly management?: ReactNode;

  /**
   * Additional owner-specific detail sections.
   */
  readonly sections?: Parameters<
    typeof MyJourneyDemandDetail
  >[0]["sections"];

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Authenticated Journey Demand detail route/container.
 */
export function MyJourneyDemandDetailRoute({
  journeyDemandPublicId,
  management,
  sections = [],
  className,
}: MyJourneyDemandDetailRouteProps) {
  const {
    demand,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemand(
    journeyDemandPublicId,
  );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <MyJourneyDemandDetailLoading
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Backend/API error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <MyJourneyDemandDetailError
        error={error}
        onRetry={refetch}
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Defensive unavailable state
  // ---------------------------------------------------------------------------

  if (!demand) {
    return (
      <MyJourneyDemandDetailUnavailable
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Owner Journey Demand detail
  // ---------------------------------------------------------------------------

  return (
    <MyJourneyDemandDetail
      demand={demand}
      sections={sections}
      management={management}
      className={className}
    />
  );
}

// =============================================================================
// Loading
// =============================================================================

interface MyJourneyDemandDetailLoadingProps {
  readonly className?: string;
}

/**
 * Loading presentation for the authenticated owner detail.
 *
 * This component contains no data access or business logic.
 */
function MyJourneyDemandDetailLoading({
  className,
}: MyJourneyDemandDetailLoadingProps) {
  return (
    <main
      className={cn(
        "w-full",
        "min-w-0",
        "bg-[var(--background-brand)]",
        className,
      )}
      aria-busy="true"
      aria-labelledby="my-journey-demand-loading-heading"
    >
      <div
        className={cn(
          "page-container",
          "py-6",
          "sm:py-8",
          "lg:py-10",
        )}
      >
        <section
          className={cn(
            "mx-auto",
            "w-full",
            "max-w-5xl",
            "overflow-hidden",
            "rounded-[var(--radius-xl)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--surface)]",
            "shadow-[var(--shadow-md)]",
          )}
        >
          <h1
            id="my-journey-demand-loading-heading"
            className="sr-only"
          >
            Loading Journey Demand
          </h1>

          <div
            className={cn(
              "space-y-6",
              "p-5",
              "sm:p-7",
              "lg:p-9",
            )}
          >
            {/* Demand header skeleton */}
            <div
              className={cn(
                "space-y-3",
                "animate-pulse",
              )}
            >
              <div
                className={cn(
                  "h-3",
                  "w-32",
                  "rounded-full",
                  "bg-[var(--background-muted)]",
                )}
              />

              <div
                className={cn(
                  "h-8",
                  "w-72",
                  "max-w-full",
                  "rounded-lg",
                  "bg-[var(--background-muted)]",
                )}
              />

              <div
                className={cn(
                  "h-4",
                  "w-full",
                  "max-w-2xl",
                  "rounded",
                  "bg-[var(--background-muted)]",
                )}
              />
            </div>

            {/* Route skeleton */}
            <div
              className={cn(
                "grid",
                "animate-pulse",
                "grid-cols-1",
                "gap-3",
                "sm:grid-cols-2",
              )}
            >
              <div
                className={cn(
                  "h-24",
                  "rounded-[var(--radius-lg)]",
                  "bg-[var(--background-subtle)]",
                )}
              />

              <div
                className={cn(
                  "h-24",
                  "rounded-[var(--radius-lg)]",
                  "bg-[var(--background-subtle)]",
                )}
              />
            </div>

            {/* Detail skeleton */}
            <div
              className={cn(
                "space-y-3",
                "animate-pulse",
              )}
            >
              <div
                className={cn(
                  "h-4",
                  "w-40",
                  "rounded",
                  "bg-[var(--background-muted)]",
                )}
              />

              <div
                className={cn(
                  "h-20",
                  "w-full",
                  "rounded-[var(--radius-lg)]",
                  "bg-[var(--background-subtle)]",
                )}
              />

              <div
                className={cn(
                  "h-20",
                  "w-full",
                  "rounded-[var(--radius-lg)]",
                  "bg-[var(--background-subtle)]",
                )}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// =============================================================================
// Error
// =============================================================================

interface MyJourneyDemandDetailErrorProps {
  readonly error: Error;
  readonly onRetry: () => Promise<void>;
  readonly className?: string;
}

/**
 * Error presentation for a failed authenticated owner read.
 *
 * Backend/API errors remain errors. They are not converted into an empty
 * Journey Demand or a successful null state.
 */
function MyJourneyDemandDetailError({
  error,
  onRetry,
  className,
}: MyJourneyDemandDetailErrorProps) {
  return (
    <main
      className={cn(
        "w-full",
        "min-w-0",
        "bg-[var(--background-brand)]",
        className,
      )}
      aria-labelledby="my-journey-demand-error-heading"
    >
      <div
        className={cn(
          "page-container",
          "py-6",
          "sm:py-8",
          "lg:py-10",
        )}
      >
        <section
          className={cn(
            "mx-auto",
            "w-full",
            "max-w-2xl",
            "overflow-hidden",
            "rounded-[var(--radius-xl)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--surface)]",
            "shadow-[var(--shadow-md)]",
          )}
        >
          <div
            className={cn(
              "border-l-4",
              "border-l-[var(--danger)]",
              "bg-[var(--danger-soft)]",
              "px-5",
              "py-5",
              "sm:px-6",
            )}
          >
            <div
              className={cn(
                "flex",
                "items-start",
                "gap-3",
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "flex",
                  "size-9",
                  "shrink-0",
                  "items-center",
                  "justify-center",
                  "rounded-full",
                  "bg-[var(--surface)]",
                  "text-[var(--danger)]",
                )}
              >
                <AlertCircle className="size-4" />
              </div>

              <div className="min-w-0">
                <h1
                  id="my-journey-demand-error-heading"
                  className={cn(
                    "text-base",
                    "font-bold",
                    "tracking-tight",
                    "text-[var(--foreground)]",
                  )}
                >
                  Unable to load Journey Demand
                </h1>

                <p
                  className={cn(
                    "mt-1",
                    "text-sm",
                    "leading-6",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  {error.message}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void onRetry();
                  }}
                  className={cn(
                    "mt-4",
                    "inline-flex",
                    "h-9",
                    "items-center",
                    "justify-center",
                    "gap-2",
                    "rounded-[var(--radius-md)]",
                    "border",
                    "border-[var(--border-strong)]",
                    "bg-[var(--surface)]",
                    "px-3.5",
                    "text-sm",
                    "font-semibold",
                    "text-[var(--foreground)]",
                    "shadow-[var(--shadow-sm)]",
                    "transition-colors",
                    "hover:bg-[var(--background-subtle)]",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-[var(--brand)]",
                    "focus-visible:ring-offset-2",
                  )}
                >
                  <RefreshCw
                    aria-hidden="true"
                    className="size-3.5"
                  />
                  Try again
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// =============================================================================
// Unexpected unavailable state
// =============================================================================

interface MyJourneyDemandDetailUnavailableProps {
  readonly className?: string;
}

/**
 * Defensive presentation for the state where loading has completed without
 * an error but no owner read model was returned.
 *
 * The API contract should normally either return MyJourneyDemand or throw.
 */
function MyJourneyDemandDetailUnavailable({
  className,
}: MyJourneyDemandDetailUnavailableProps) {
  return (
    <main
      className={cn(
        "w-full",
        "min-w-0",
        "bg-[var(--background-brand)]",
        className,
      )}
      aria-labelledby="my-journey-demand-unavailable-heading"
    >
      <div
        className={cn(
          "page-container",
          "py-6",
          "sm:py-8",
          "lg:py-10",
        )}
      >
        <section
          className={cn(
            "mx-auto",
            "w-full",
            "max-w-2xl",
            "overflow-hidden",
            "rounded-[var(--radius-xl)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--surface)]",
            "shadow-[var(--shadow-md)]",
          )}
        >
          <div
            className={cn(
              "border-l-4",
              "border-l-[var(--brand)]",
              "bg-[var(--background-brand)]",
              "px-5",
              "py-6",
              "sm:px-7",
              "sm:py-8",
            )}
          >
            <div
              className={cn(
                "flex",
                "items-start",
                "gap-3",
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "flex",
                  "size-9",
                  "shrink-0",
                  "items-center",
                  "justify-center",
                  "rounded-full",
                  "bg-[var(--brand-soft)]",
                  "text-[var(--brand)]",
                )}
              >
                <AlertCircle className="size-4" />
              </div>

              <div className="min-w-0">
                <h1
                  id="my-journey-demand-unavailable-heading"
                  className={cn(
                    "text-base",
                    "font-bold",
                    "tracking-tight",
                    "text-[var(--foreground)]",
                  )}
                >
                  Journey Demand unavailable
                </h1>

                <p
                  className={cn(
                    "mt-1",
                    "text-sm",
                    "leading-6",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  This Journey Demand could not be loaded.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}