// -----------------------------------------------------------------------------
// sisiMove — Public Journey Detail Page
// -----------------------------------------------------------------------------
//
// Feature-level client boundary for the public Journey detail route.
//
// Product flow:
//
//     Discover Journey
//          │
//          ▼
//     Understand route
//          │
//          ▼
//     Check timing
//          │
//          ▼
//     Check seats + price
//          │
//          ▼
//     Review vehicle + expectations
//          │
//          ▼
//     See Journey
//          │
//          ▼
//     Book Journey
//          │
//          ▼
//     Authentication
//          │
//          ├── Login
//          │
//          └── Register
//               │
//               ▼
//        Return to this Journey
//               │
//               ▼
//        Continue booking
//
// Responsibilities:
// - consume the public route's Journey public ID;
// - load the public Journey projection;
// - resolve Journey-owned public Asset references;
// - provide loading/error/empty states;
// - compose the read-only JourneyDetail presentation;
// - provide presentation callbacks for public Journey actions;
// - lead unauthenticated visitors into the authentication flow when they
//   choose to book a Journey.
//
// The page does NOT:
// - construct Asset URLs;
// - access authenticated Asset endpoints;
// - expose vehicle registration;
// - recreate Journey domain entities;
// - calculate Journey capacity;
// - infer Journey lifecycle;
// - perform Journey mutations;
// - create Booking aggregates;
// - orchestrate payment;
// - implement authenticated booking workflows.
//
// -----------------------------------------------------------------------------
//
// DATA OWNERSHIP
// -----------------------------------------------------------------------------
//
// Public Journey
//     → usePublicJourney()
//     → backend PublicJourney projection
//
// Public Assets
//     → usePublicAssets()
//     → backend public Asset delivery boundary
//
// Journey Actions
//     → presentation callbacks
//     → public authentication entry point
//
// -----------------------------------------------------------------------------
//
// PUBLIC BOOKING ENTRY
// -----------------------------------------------------------------------------
//
//     Public Journey
//          │
//          ▼
//     Book Journey
//          │
//          ▼
//     /login?returnTo=/journeys/:publicId
//          │
//          ├── Login
//          │
//          └── Register
//               │
//               ▼
//        Return to Journey
//               │
//               ▼
//        Authenticated booking flow
//
// Booking creation remains outside this public presentation boundary.
//
// -----------------------------------------------------------------------------
//
// PRESENTATION
// -----------------------------------------------------------------------------
//
//     Application background
//          │
//          ▼
//     Focused responsive content canvas
//          │
//          ▼
//     Journey detail surface
//          │
//          ▼
//     JourneyDetail
//          ├── JourneyActions
//          ├── JourneyOverview
//          ├── JourneyTravelWindow
//          ├── JourneyCapacity
//          ├── JourneyPricing
//          ├── JourneyVehicle
//          ├── JourneyPreferences
//          └── JourneyAssets
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback } from "react";
import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { ErrorState, Spinner } from "@/components/ui";
import { cn } from "@/foundation";
import { AUTHENTICATION_ROUTES } from "@/foundation/routing";

import {
  usePublicAssets,
  type PublicAssetReferenceInput,
} from "@/features/assets/hooks";

import { usePublicJourney } from "@/features/journey/hooks/queries/use-public-journey";

import { JourneyDetail } from "./journey-detail";

// =============================================================================
// Props
// =============================================================================

export interface JourneyPublicDetailPageProps {
  /**
   * Public Journey identifier supplied by the route.
   */
  readonly publicId: string;

  /**
   * Optional callback invoked when the visitor chooses to begin booking.
   *
   * When omitted, the public page leads the visitor to authentication and
   * preserves the current Journey as the return destination.
   *
   * Booking orchestration remains outside this presentation boundary.
   */
  readonly onBook?: () => void;

  /**
   * Indicates that the booking action is currently processing.
   */
  readonly isBooking?: boolean;

  /**
   * Disables the booking action.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional presentation class.
   */
  readonly className?: string;
}

// =============================================================================
// Asset Presentation Helpers
// =============================================================================

function getJourneyAssetAlt(assetType: string): string {
  switch (assetType) {
    case "VEHICLE":
      return "Vehicle image";

    case "ROUTE":
      return "Journey route image";

    default:
      return "Journey image";
  }
}

// =============================================================================
// Shared Page Surface
// =============================================================================

interface JourneyDetailSurfaceProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly ariaBusy?: boolean;
}

function JourneyDetailSurface({
  children,
  className,
  ariaBusy,
}: JourneyDetailSurfaceProps) {
  return (
    <div
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
        className,
      )}
      aria-busy={ariaBusy}
    >
      {children}
    </div>
  );
}

// =============================================================================
// Page Canvas
// =============================================================================

interface JourneyPageStateProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly ariaLabel: string;
}

function JourneyPageCanvas({
  children,
  className,
  ariaLabel,
}: JourneyPageStateProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        "w-full",
        "min-w-0",
        "bg-[var(--background-brand)]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto",
          "w-full",
          "max-w-7xl",
          "px-4",
          "py-6",
          "sm:px-6",
          "sm:py-8",
          "lg:px-8",
          "lg:py-10",
          "xl:py-12",
        )}
      >
        {children}
      </div>
    </section>
  );
}

// =============================================================================
// Loading State
// =============================================================================

function JourneyLoadingState({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <JourneyPageCanvas
      ariaLabel="Loading Journey"
      className={className}
    >
      <JourneyDetailSurface
        ariaBusy
        className={cn(
          "p-6",
          "sm:p-8",
          "lg:p-10",
        )}
      >
        <div
          className={cn(
            "flex",
            "min-h-56",
            "items-center",
            "justify-center",
          )}
        >
          <Spinner
            size="md"
            label="Loading Journey"
          />
        </div>
      </JourneyDetailSurface>
    </JourneyPageCanvas>
  );
}

// =============================================================================
// Error State
// =============================================================================

interface JourneyErrorStateProps {
  readonly error: Error;
  readonly onRetry: () => void;
  readonly className?: string;
}

function JourneyErrorState({
  error,
  onRetry,
  className,
}: JourneyErrorStateProps) {
  return (
    <JourneyPageCanvas
      ariaLabel="Journey error"
      className={className}
    >
      <JourneyDetailSurface
        className={cn(
          "p-5",
          "sm:p-8",
          "lg:p-10",
        )}
      >
        <ErrorState
          title="Unable to load this Journey"
          description={error.message}
          retryAction={{
            label: "Try again",
            onClick: onRetry,
          }}
        />
      </JourneyDetailSurface>
    </JourneyPageCanvas>
  );
}

// =============================================================================
// Empty State
// =============================================================================

function JourneyUnavailableState({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <JourneyPageCanvas
      ariaLabel="Journey unavailable"
      className={className}
    >
      <div
        className={cn(
          "mx-auto",
          "w-full",
          "max-w-2xl",
          "rounded-[var(--radius-xl)]",
          "border",
          "border-[var(--border)]",
          "bg-[var(--surface)]",
          "px-6",
          "py-12",
          "text-center",
          "shadow-[var(--shadow-md)]",
          "sm:px-10",
          "sm:py-16",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "mx-auto",
            "mb-5",
            "flex",
            "size-12",
            "items-center",
            "justify-center",
            "rounded-full",
            "bg-[var(--brand-soft)]",
            "text-[var(--brand)]",
          )}
        >
          <AlertCircle className="size-5" />
        </div>

        <h1
          className={cn(
            "text-xl",
            "font-bold",
            "tracking-tight",
            "text-[var(--foreground)]",
            "sm:text-2xl",
          )}
        >
          Journey unavailable
        </h1>

        <p
          className={cn(
            "mx-auto",
            "mt-2",
            "max-w-md",
            "text-sm",
            "leading-6",
            "text-[var(--foreground-muted)]",
          )}
        >
          This Journey could not be found or is no longer available.
        </p>
      </div>
    </JourneyPageCanvas>
  );
}

// =============================================================================
// Component
// =============================================================================

export function JourneyPublicDetailPage({
  publicId,
  onBook,
  isBooking = false,
  bookDisabled = false,
  className,
}: JourneyPublicDetailPageProps) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Load the public Journey projection.
  // ---------------------------------------------------------------------------

  const {
    journey,
    isLoading,
    error,
    refetch,
  } = usePublicJourney(publicId);

  // ---------------------------------------------------------------------------
  // Build public Asset references from the Journey projection.
  //
  // `assetPublicId` remains opaque. No URL is constructed here.
  // ---------------------------------------------------------------------------

  const assetReferences: readonly PublicAssetReferenceInput[] =
    journey?.assets.map((asset) => ({
      publicId: asset.assetPublicId,
      alt: getJourneyAssetAlt(asset.type),
    })) ?? [];

  // ---------------------------------------------------------------------------
  // Resolve public Asset delivery references.
  //
  // Asset loading remains independent from Journey loading. A missing or
  // delayed image must not prevent the Journey projection from rendering.
  // ---------------------------------------------------------------------------

  const { assets: publicAssets } =
    usePublicAssets(assetReferences);

  // ---------------------------------------------------------------------------
  // Share the currently displayed public Journey.
  //
  // Uses the browser's native share API when available and falls back to
  // copying the public Journey URL to the clipboard.
  // ---------------------------------------------------------------------------

  const handleShare = useCallback(async (): Promise<void> => {
    const shareUrl = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "SisiMove Journey",
          url: shareUrl,
        });
      } catch {
        // Native share cancellation is intentionally ignored.
      }

      return;
    }

    if (typeof navigator.clipboard?.writeText === "function") {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        // Clipboard access may be unavailable in the current browser context.
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Begin booking from the public marketplace.
  //
  // The public Journey page does not create a Booking.
  //
  // If a caller supplies `onBook`, that callback remains the extension point
  // for an application-level booking flow.
  //
  // Otherwise the default public marketplace behavior is to lead the visitor
  // to Login and preserve this Journey as the return destination.
  // ---------------------------------------------------------------------------

  const handleBook = useCallback((): void => {
    if (onBook) {
      onBook();
      return;
    }

    const returnTo = `/journeys/${encodeURIComponent(publicId)}`;

    const loginUrl =
      `${AUTHENTICATION_ROUTES.LOGIN}?returnTo=` +
      encodeURIComponent(returnTo);

    router.push(loginUrl);
  }, [onBook, publicId, router]);

  // ---------------------------------------------------------------------------
  // Journey loading state.
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <JourneyLoadingState
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Journey loading error.
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <JourneyErrorState
        error={error}
        onRetry={() => {
          void refetch();
        }}
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // No Journey returned.
  //
  // This is separate from an error because the request may have completed
  // successfully without producing a public Journey projection.
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <JourneyUnavailableState
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Public Journey detail.
  //
  // JourneyDetail owns the action presentation. This page supplies the
  // public Journey callbacks.
  //
  // Book Journey:
  //
  //     Public Journey
  //          ↓
  //     Login
  //          ↓
  //     returnTo this Journey
  //
  // The authenticated booking workflow begins only after authentication.
  //
  // Asset resolution is non-blocking. JourneyDetail renders the Journey even
  // while individual public Asset references are being resolved.
  // ---------------------------------------------------------------------------

  return (
    <JourneyPageCanvas
      ariaLabel="Journey details"
      className={className}
    >
      <JourneyDetailSurface>
        <JourneyDetail
          journey={journey}
          publicAssets={publicAssets}
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

export default JourneyPublicDetailPage;