// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Assets
// -----------------------------------------------------------------------------
//
// Presentation component for Journey asset attachments.
//
// Architectural boundary:
// - Does NOT fetch assets.
// - Does NOT upload assets.
// - Does NOT attach or detach assets.
// - Does NOT resolve storage URLs.
// - Displays Journey-side asset attachment metadata.
//
// The JourneyAsset model contains:
//
//     publicId
//     assetPublicId
//     type
//     sortOrder
//
// Public URL and accessibility metadata belong to PublicAsset and must be
// resolved through the Asset public-read boundary rather than inferred here.
//
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';

import { Badge, Card, EmptyState } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailAssetsProps {
  journey: Journey;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatAssetType(type: string): string {
  return type
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDetailAssets({
  journey,
  className,
}: JourneyDetailAssetsProps) {
  const assets = [...(journey.assets ?? [])].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );

  return (
    <Card
      variant="outlined"
      padding="md"
      className={className}
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Photos
            </h2>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              Assets attached to this Journey.
            </p>
          </div>

          <Badge
            variant="outline"
            size="sm"
          >
            {assets.length}{' '}
            {assets.length === 1 ? 'asset' : 'assets'}
          </Badge>
        </div>

        {assets.length === 0 ? (
          <EmptyState
            title="No photos"
            description="No assets have been attached to this Journey."
          />
        ) : (
          <div className="space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.publicId}
                className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-subtle)] p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {formatAssetType(asset.type)}
                  </p>

                  <p className="mt-1 truncate text-xs text-[var(--foreground-muted)]">
                    Asset {asset.assetPublicId}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  size="sm"
                >
                  #{asset.sortOrder + 1}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}