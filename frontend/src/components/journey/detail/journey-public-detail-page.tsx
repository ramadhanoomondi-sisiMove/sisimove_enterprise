// -----------------------------------------------------------------------------
// sisiMove — Public Journey Detail Page
// -----------------------------------------------------------------------------
//
// Feature-level client boundary for the public Journey detail route.
//
// Responsibilities:
// - consume the public route's Journey public ID;
// - load the public Journey projection;
// - resolve Journey-owned public Asset references;
// - provide loading/error/empty states;
// - compose the read-only JourneyDetail presentation.
//
// The Next.js route remains intentionally thin.
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
// The component does NOT:
// - construct Asset URLs;
// - access authenticated Asset endpoints;
// - expose vehicle registration;
// - recreate Journey domain entities;
// - calculate Journey capacity;
// - infer Journey lifecycle;
// - perform Journey mutations.
//
// -----------------------------------------------------------------------------

"use client";

import { ErrorState, Spinner } from "@/components/ui";
import { cn } from "@/foundation";

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
// Component
// =============================================================================

export function JourneyPublicDetailPage({
  publicId,
  className,
}: JourneyPublicDetailPageProps) {
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
  // Asset loading is deliberately independent from Journey loading. A missing
  // image must not prevent the Journey itself from being displayed.
  // ---------------------------------------------------------------------------

  const {
    assets: publicAssets,
  } = usePublicAssets(assetReferences);

  // ---------------------------------------------------------------------------
  // Journey loading state.
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <section
        className={cn(
          "w-full",
          "py-8",
          className,
        )}
        aria-label="Loading Journey"
        aria-busy="true"
      >
        <div
          className={cn(
            "flex",
            "min-h-48",
            "items-center",
            "justify-center",
            "rounded-[var(--radius-lg)]",
            "border border-[var(--border)]",
            "bg-[var(--surface)]",
          )}
        >
          <Spinner
            size="md"
            label="Loading Journey"
          />
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Journey loading error.
  // ---------------------------------------------------------------------------
  //
  // ErrorState owns:
  // - the error heading;
  // - supporting description;
  // - retry action.
  //
  // This keeps the page aligned with the shared UI primitive contract.
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <section
        className={cn(
          "w-full",
          "py-8",
          className,
        )}
        aria-label="Journey error"
      >
        <ErrorState
          title="Unable to load this Journey"
          description={error.message}
          retryAction={{
            label: "Try again",
            onClick: () => {
              void refetch();
            },
          }}
        />
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // No Journey returned.
  //
  // This is separate from an error because the request itself may have
  // completed successfully without producing a public Journey projection.
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <section
        className={cn(
          "w-full",
          "py-8",
          className,
        )}
        aria-label="Journey unavailable"
      >
        <div
          className={cn(
            "rounded-[var(--radius-lg)]",
            "border border-[var(--border)]",
            "bg-[var(--surface)]",
            "p-6",
            "text-center",
          )}
        >
          <h1
            className={cn(
              "text-lg",
              "font-semibold",
              "text-[var(--foreground)]",
            )}
          >
            Journey unavailable
          </h1>

          <p
            className={cn(
              "mt-2",
              "text-sm",
              "text-[var(--foreground-muted)]",
            )}
          >
            This Journey could not be found or is no longer available.
          </p>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Public Journey detail.
  //
  // Asset resolution is non-blocking. JourneyDetail renders the Journey even
  // while individual public Asset references are being resolved.
  // ---------------------------------------------------------------------------

  return (
    <section
      className={cn(
        "w-full",
        "py-8",
        className,
      )}
      aria-label="Journey details"
    >
      <JourneyDetail
        journey={journey}
        publicAssets={publicAssets}
      />
    </section>
  );
}