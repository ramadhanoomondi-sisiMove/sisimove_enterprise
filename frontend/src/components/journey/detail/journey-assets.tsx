// -----------------------------------------------------------------------------
// sisiMove — Journey Assets
// -----------------------------------------------------------------------------
//
// Presents the visual proof attached to a public Journey.
//
// Product role:
//
//     Journey information
//          │
//          ▼
//     Visual confidence
//          │
//          ▼
//     Traveller decision
//
// This is intentionally presented as a Journey visual experience rather than
// as a technical asset listing.
//
// Responsibilities:
// - present the Journey's attached public assets;
// - resolve an already-provided PublicAsset for safe rendering;
// - preserve backend-provided asset ordering;
// - make available Journey imagery visually prominent;
// - provide useful human-readable asset labels.
//
// Non-responsibilities:
// - no API calls;
// - no asset fetching;
// - no asset URL construction;
// - no upload/delete operations;
// - no ownership inference;
// - no asset classification inference.
//
// `assetPublicId` is an opaque reference. The component never constructs a URL
// from it. PublicAsset is the safe renderable representation supplied by the
// appropriate asset boundary.
//
// -----------------------------------------------------------------------------

import Image from "next/image";

import {
  Camera,
  CarFront,
  MapPinned,
  ImageOff,
} from "lucide-react";

import { cn } from "@/foundation";

import type { PublicAsset } from "@/features/assets/models";
import type { JourneyAsset } from "@/features/journey/models";

// =============================================================================
// Props
// =============================================================================

export interface JourneyAssetsProps {
  readonly assets: readonly JourneyAsset[];
  readonly publicAssets?: readonly PublicAsset[];
  readonly className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

function getAssetLabel(type: string): string {
  switch (type) {
    case "VEHICLE":
      return "Vehicle";

    case "ROUTE":
      return "Route";

    default:
      return "Journey photo";
  }
}

function getAssetDescription(type: string): string {
  switch (type) {
    case "VEHICLE":
      return "See the vehicle for this Journey.";

    case "ROUTE":
      return "Get a visual feel for the route.";

    default:
      return "A photo attached to this Journey.";
  }
}

function getAssetIcon(type: string) {
  switch (type) {
    case "VEHICLE":
      return CarFront;

    case "ROUTE":
      return MapPinned;

    default:
      return Camera;
  }
}

// =============================================================================
// Component
// =============================================================================

export function JourneyAssets({
  assets,
  publicAssets = [],
  className,
}: JourneyAssetsProps) {
  if (assets.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "w-full",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        className,
      )}
      aria-labelledby="journey-assets-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Section Header                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "items-end",
          "justify-between",
          "gap-4",
          "border-b",
          "border-[var(--border-subtle)]",
          "px-5",
          "py-4",
          "sm:px-6",
          "sm:py-5",
        )}
      >
        <div className="min-w-0">
          <div
            className={cn(
              "inline-flex",
              "items-center",
              "gap-2",
              "text-xs",
              "font-bold",
              "uppercase",
              "tracking-[0.14em]",
              "text-[var(--brand)]",
            )}
          >
            <Camera
              aria-hidden="true"
              className="size-3.5"
            />

            <span>See the Journey</span>
          </div>

          <h2
            id="journey-assets-heading"
            className={cn(
              "mt-1.5",
              "text-xl",
              "font-bold",
              "tracking-tight",
              "text-[var(--foreground)]",
            )}
          >
            Travel with confidence.
          </h2>

          <p
            className={cn(
              "mt-1",
              "max-w-xl",
              "text-sm",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            Take a closer look at the vehicle and other Journey details shared
            by the provider.
          </p>
        </div>

        <div
          className={cn(
            "hidden",
            "shrink-0",
            "items-center",
            "gap-1.5",
            "rounded-full",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background-subtle)]",
            "px-2.5",
            "py-1.5",
            "text-xs",
            "font-medium",
            "text-[var(--foreground-muted)]",
            "sm:inline-flex",
          )}
        >
          <Camera
            aria-hidden="true"
            className="size-3.5"
          />

          <span>
            {assets.length} {assets.length === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Visual Gallery                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="p-3 sm:p-4">
        <div
          className={cn(
            "grid",
            "grid-cols-1",
            "gap-3",
            assets.length > 1
              ? "sm:grid-cols-2"
              : "sm:grid-cols-1",
          )}
        >
          {assets.map((asset, index) => {
            const publicAsset =
              publicAssets.find(
                (candidate) =>
                  candidate.publicId === asset.assetPublicId,
              ) ?? null;

            const AssetIcon = getAssetIcon(asset.type);

            const isFeatured = index === 0;

            return (
              <article
                key={asset.publicId}
                className={cn(
                  "group",
                  "relative",
                  "overflow-hidden",
                  "rounded-[var(--radius-lg)]",
                  "border",
                  "border-[var(--border-subtle)]",
                  "bg-[var(--background-subtle)]",
                  "shadow-[var(--shadow-sm)]",
                  "transition-shadow",
                  "duration-200",
                  "hover:shadow-[var(--shadow-md)]",
                  isFeatured && assets.length > 1
                    ? "sm:col-span-2"
                    : null,
                )}
              >
                {/* --------------------------------------------------------- */}
                {/* Image                                                      */}
                {/* --------------------------------------------------------- */}

                {publicAsset ? (
                  <div
                    className={cn(
                      "relative",
                      "w-full",
                      "overflow-hidden",
                      "bg-[var(--background-muted)]",
                      isFeatured && assets.length > 1
                        ? "aspect-[16/7]"
                        : "aspect-[16/9]",
                    )}
                  >
                    <Image
                      src={publicAsset.url}
                      alt={
                        publicAsset.alt ??
                        getAssetLabel(asset.type)
                      }
                      fill
                      priority={index === 0}
                      sizes={
                        isFeatured && assets.length > 1
                          ? "(min-width: 640px) 100vw, 100vw"
                          : "(min-width: 640px) 50vw, 100vw"
                      }
                      className={cn(
                        "object-cover",
                        "transition-transform",
                        "duration-500",
                        "ease-out",
                        "group-hover:scale-[1.025]",
                      )}
                    />

                    {/* ----------------------------------------------------- */}
                    {/* Image readability gradient                            */}
                    {/* ----------------------------------------------------- */}

                    <div
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none",
                        "absolute",
                        "inset-x-0",
                        "bottom-0",
                        "h-24",
                        "bg-gradient-to-t",
                        "from-black/45",
                        "to-transparent",
                        "opacity-80",
                      )}
                    />

                    {/* ----------------------------------------------------- */}
                    {/* Asset type badge                                       */}
                    {/* ----------------------------------------------------- */}

                    <div
                      className={cn(
                        "absolute",
                        "left-3",
                        "top-3",
                        "inline-flex",
                        "items-center",
                        "gap-1.5",
                        "rounded-full",
                        "border",
                        "border-white/30",
                        "bg-black/45",
                        "px-2.5",
                        "py-1.5",
                        "text-xs",
                        "font-semibold",
                        "text-white",
                        "backdrop-blur-md",
                      )}
                    >
                      <AssetIcon
                        aria-hidden="true"
                        className="size-3.5"
                      />

                      <span>{getAssetLabel(asset.type)}</span>
                    </div>

                    {/* ----------------------------------------------------- */}
                    {/* Image caption                                          */}
                    {/* ----------------------------------------------------- */}

                    <div
                      className={cn(
                        "absolute",
                        "inset-x-0",
                        "bottom-0",
                        "p-4",
                        "sm:p-5",
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm",
                          "font-semibold",
                          "text-white",
                        )}
                      >
                        {getAssetLabel(asset.type)}
                      </p>

                      <p
                        className={cn(
                          "mt-0.5",
                          "text-xs",
                          "text-white/80",
                        )}
                      >
                        {getAssetDescription(asset.type)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative",
                      "flex",
                      "aspect-[16/9]",
                      "w-full",
                      "items-center",
                      "justify-center",
                      "bg-[var(--background-muted)]",
                    )}
                    aria-label={`${getAssetLabel(asset.type)} unavailable`}
                  >
                    <div
                      className={cn(
                        "flex",
                        "flex-col",
                        "items-center",
                        "gap-2",
                        "text-center",
                        "text-[var(--foreground-muted)]",
                      )}
                    >
                      <div
                        className={cn(
                          "flex",
                          "size-11",
                          "items-center",
                          "justify-center",
                          "rounded-full",
                          "bg-[var(--surface)]",
                          "shadow-[var(--shadow-sm)]",
                        )}
                      >
                        <ImageOff
                          aria-hidden="true"
                          className="size-5"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground-secondary)]">
                          {getAssetLabel(asset.type)}
                        </p>

                        <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                          Image unavailable
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default JourneyAssets;