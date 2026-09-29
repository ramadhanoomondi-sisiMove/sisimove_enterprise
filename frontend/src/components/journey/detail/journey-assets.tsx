// -----------------------------------------------------------------------------
// sisiMove — Journey Assets
// -----------------------------------------------------------------------------
//
// Presents assets explicitly attached to a Journey.
//
// Responsibilities:
// - present the Journey's attached public assets;
// - resolve an already-provided PublicAsset for safe rendering;
// - preserve the backend-provided asset ordering.
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

import { cn } from "@/foundation";

import type { PublicAsset } from "@/features/assets/models";
import type { JourneyAsset } from "@/features/journey/models";

export interface JourneyAssetsProps {
  readonly assets: readonly JourneyAsset[];
  readonly publicAssets?: readonly PublicAsset[];
  readonly className?: string;
}

export function JourneyAssets({
  assets,
  publicAssets = [],
  className,
}: JourneyAssetsProps) {
  return (
    <section
      className={cn(
        "w-full",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-4",
        className,
      )}
      aria-labelledby="journey-assets-heading"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          Media
        </p>

        <h2
          id="journey-assets-heading"
          className="mt-1 text-lg font-semibold text-[var(--foreground)]"
        >
          Journey assets
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Images and other media attached to this Journey.
        </p>
      </div>

      {assets.length === 0 ? (
        <div
          className={cn(
            "rounded-[var(--radius-md)]",
            "bg-[var(--background-subtle)]",
            "p-4",
            "text-sm text-[var(--foreground-muted)]",
          )}
        >
          No Journey assets are available.
        </div>
      ) : (
        <div
          className={cn(
            "grid",
            "grid-cols-1",
            "gap-3",
            "sm:grid-cols-2",
            "lg:grid-cols-3",
          )}
        >
          {assets.map((asset) => {
            const publicAsset =
              publicAssets.find(
                (candidate) => candidate.publicId === asset.assetPublicId,
              ) ?? null;

            return (
              <article
                key={asset.publicId}
                className={cn(
                  "overflow-hidden",
                  "rounded-[var(--radius-md)]",
                  "border border-[var(--border-subtle)]",
                  "bg-[var(--background-subtle)]",
                )}
              >
                {publicAsset ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--background-muted)]">
                    <Image
                      src={publicAsset.url}
                      alt={publicAsset.alt ?? "Journey asset"}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex",
                      "aspect-[4/3]",
                      "w-full",
                      "items-center",
                      "justify-center",
                      "bg-[var(--background-muted)]",
                      "text-[var(--foreground-muted)]",
                    )}
                    aria-label="Journey asset unavailable"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <circle cx="8.5" cy="9" r="1.5" />
                      <path d="m21 15-4.5-4.5L7 20" />
                    </svg>
                  </div>
                )}

                <div className="p-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {asset.type === "VEHICLE"
                      ? "Vehicle"
                      : asset.type === "ROUTE"
                        ? "Route"
                        : "Journey asset"}
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    {publicAsset
                      ? "Public asset"
                      : "Asset preview unavailable"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}