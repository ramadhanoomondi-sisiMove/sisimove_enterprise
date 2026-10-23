'use client';

import {
  FileImage,
  Layers3,
  ShieldCheck,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyAsset } from '@/features/admin/journeys/models/journey.model';

import { JourneyAssetList } from './JourneyAssetList';

interface JourneyAssetsPanelProps {
  assets: readonly JourneyAsset[];
  linkedVehicleAssetPublicId?: string | null;
  className?: string;
  loading?: boolean;
}

export function JourneyAssetsPanel({
  assets,
  linkedVehicleAssetPublicId = null,
  className,
  loading = false,
}: JourneyAssetsPanelProps) {
  const vehicleAssetId = linkedVehicleAssetPublicId?.trim() || null;

  // Count unique linked asset references across both sources.
  const linkedAssetIds = new Set(
    assets
      .map((asset) => asset.assetPublicId.trim())
      .filter(Boolean),
  );

  if (vehicleAssetId) {
    linkedAssetIds.add(vehicleAssetId);
  }

  const totalLinkedAssets = linkedAssetIds.size;

  // Count distinct asset types among the Journey attachment records.
  // The vehicle reference is treated as an image asset when it is
  // not already represented by an attachment record.
  const assetTypes = new Set(
    assets
      .filter((asset) => linkedAssetIds.has(asset.assetPublicId.trim()))
      .map((asset) => asset.type.trim().toUpperCase())
      .filter(Boolean),
  );

  const vehicleAlreadyAttached =
    vehicleAssetId !== null &&
    assets.some(
      (asset) => asset.assetPublicId.trim() === vehicleAssetId,
    );

  if (vehicleAssetId && !vehicleAlreadyAttached) {
    assetTypes.add('IMAGE');
  }

  const assetTypeCount = assetTypes.size;

  return (
    <section
      aria-label="Journey assets"
      className={cn('space-y-5', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Journey assets
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            Review all assets linked to this journey, including vehicle
            images and other linked files.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground-secondary)]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Read-only
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
              <FileImage className="h-5 w-5" aria-hidden="true" />
            </div>

            <div>
              <p className="text-sm text-[var(--foreground-muted)]">
                Total linked assets
              </p>

              <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                {loading ? '—' : totalLinkedAssets}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
              <Layers3 className="h-5 w-5" aria-hidden="true" />
            </div>

            <div>
              <p className="text-sm text-[var(--foreground-muted)]">
                Distinct linked asset types
              </p>

              <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                {loading ? '—' : assetTypeCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Linked assets
          </h3>

          {!loading && (
            <span className="text-xs text-[var(--foreground-muted)]">
              {totalLinkedAssets}{' '}
              {totalLinkedAssets === 1 ? 'asset' : 'assets'}
            </span>
          )}
        </div>

        <JourneyAssetList
          assets={assets}
          linkedVehicleAssetPublicId={vehicleAssetId}
          loading={loading}
        />
      </div>
    </section>
  );
}

export default JourneyAssetsPanel;
