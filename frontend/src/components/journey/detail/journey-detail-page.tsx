"use client";

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Journey Detail Page
// -----------------------------------------------------------------------------

import type { ReactNode } from "react";
import { useCallback } from "react";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { ErrorState, Spinner } from "@/components/ui";
import { cn } from "@/foundation";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

import { usePublicJourney } from "@/features/journey/hooks/queries/use-public-journey";

import { JourneyDetail } from "./journey-detail";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDetailPageProps {
  /**
   * Public Journey identifier used by the public Journey read API.
   */
  readonly publicId: string;

  /**
   * Whether the surrounding workflow currently represents a booking state.
   *
   * This is presentation state only. Booking creation itself belongs to the
   * Booking workflow.
   */
  readonly isBooking?: boolean;

  /**
   * Allows the parent workflow to disable the Booking action.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional page-level styling.
   */
  readonly className?: string;
}

// =============================================================================
// Loading / Error Surface
// =============================================================================

interface JourneyDetailSurfaceProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Shared surface used by loading, error, empty, and successful Journey states.
 *
 * Keeping these states inside the same page surface prevents the route from
 * changing its overall visual structure while the Journey request progresses.
 */
function JourneyDetailSurface({
  children,
  className,
}: JourneyDetailSurfaceProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

// =============================================================================
// Page Canvas
// =============================================================================

interface JourneyPageCanvasProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Page-level layout owned by the Journey detail feature.
 *
 * The authenticated application shell remains responsible for global
 * navigation, authentication, and the outer application layout.
 */
function JourneyPageCanvas({
  children,
  className,
}: JourneyPageCanvasProps) {
  return (
    <main
      className={cn(
        "page-container py-4 sm:py-6",
        className,
      )}
    >
      {children}
    </main>
  );
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDetailPage({
  publicId,
  isBooking = false,
  bookDisabled = false,
  className,
}: JourneyDetailPageProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Public Journey read-model query.
  //
  // The hook owns:
  //
  // - API execution;
  // - loading state;
  // - error state;
  // - refetching.
  //
  // This component consumes that state without recreating API behavior.
  // ---------------------------------------------------------------------------

  const {
    journey,
    isLoading: isJourneyLoading,
    error: journeyError,
    refetch: refetchJourney,
  } = usePublicJourney(publicId);

  // ---------------------------------------------------------------------------
  // Share
  // ---------------------------------------------------------------------------

  const handleShare = useCallback(async (): Promise<void> => {
    const url = window.location.href;

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: "sisiMove Journey",
          url,
        });

        return;
      } catch {
        // Native sharing may be cancelled by the user or rejected by the
        // browser. Clipboard sharing is attempted as the fallback.
      }
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Clipboard failure does not invalidate the Journey surface.
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Booking navigation
  // ---------------------------------------------------------------------------

  const handleBook = useCallback((): void => {
    router.push(
      AUTHENTICATED_ROUTES.BOOKING_NEW(publicId),
    );
  }, [publicId, router]);

  // ---------------------------------------------------------------------------
  // Retry
  //
  // ErrorState does not own retry behavior, so the retry action is kept here
  // at the page/query boundary.
  // ---------------------------------------------------------------------------

  const handleRetry = useCallback((): void => {
    void refetchJourney();
  }, [refetchJourney]);

  // ===========================================================================
  // Loading
  // ===========================================================================

  if (isJourneyLoading) {
    return (
      <JourneyPageCanvas className={className}>
        <JourneyDetailSurface>
          <div className="flex min-h-64 items-center justify-center p-6">
            <Spinner />
          </div>
        </JourneyDetailSurface>
      </JourneyPageCanvas>
    );
  }

  // ===========================================================================
  // Error
  // ===========================================================================

  if (journeyError) {
    return (
      <JourneyPageCanvas className={className}>
        <JourneyDetailSurface>
          <div className="p-6">
            <ErrorState
              icon={<AlertCircle />}
              title="Unable to load this journey"
              description={journeyError.message}
            />

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </JourneyDetailSurface>
      </JourneyPageCanvas>
    );
  }

  // ===========================================================================
  // Missing Journey
  // ===========================================================================

  if (!journey) {
    return (
      <JourneyPageCanvas className={className}>
        <JourneyDetailSurface>
          <div className="p-6">
            <ErrorState
              icon={<AlertCircle />}
              title="Journey unavailable"
              description="This journey could not be found or is no longer available."
            />

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </JourneyDetailSurface>
      </JourneyPageCanvas>
    );
  }

  // ===========================================================================
  // Journey
  // ===========================================================================

  return (
    <JourneyPageCanvas className={className}>
      <JourneyDetailSurface>
        <JourneyDetail
          journey={journey}
          onShare={() => {
            void handleShare();
          }}
          onBook={handleBook}
          isBooking={isBooking}
          bookDisabled={bookDisabled}
          shareDisabled={false}
        />
      </JourneyDetailSurface>
    </JourneyPageCanvas>
  );
}