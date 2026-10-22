
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import type {
  AssetCategory,
  AssetStatus,
  AssetStorageProvider,
} from '@/features/admin/assets/models/asset.enums';

import {
  AssetControlCenterHeader,
  AssetPageContainer,
} from '@/components/admin/assets/layout';
import { AssetDirectory } from '@/components/admin/assets';
import { AssetOverviewDashboard } from '@/components/admin/assets/overview';
import { useAssets } from '@/features/admin/assets/hooks';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

export default function AdminAssetsPage() {
  const router = useRouter();
  const { assets, isLoading, isError, error, refresh } = useAssets();

  const overview = useMemo(() => {
    const lifecycleCounts = new Map<AssetStatus, number>();
    const categoryCounts = new Map<AssetCategory, number>();
    const providerCounts = new Map<
      AssetStorageProvider,
      { count: number; bytes: number }
    >();

    for (const asset of assets) {
      lifecycleCounts.set(
        asset.status,
        (lifecycleCounts.get(asset.status) ?? 0) + 1,
      );

      categoryCounts.set(
        asset.category,
        (categoryCounts.get(asset.category) ?? 0) + 1,
      );

      const current = providerCounts.get(asset.storageProvider) ?? {
        count: 0,
        bytes: 0,
      };

      providerCounts.set(asset.storageProvider, {
        count: current.count + 1,
        bytes: current.bytes + asset.sizeBytes,
      });
    }

    return {
      metrics: {
        totalAssets: assets.length,
        readyAssets: assets.filter((asset) => asset.status === 'READY').length,
        archivedAssets: assets.filter((asset) => asset.status === 'ARCHIVED').length,
        totalStorageBytes: assets.reduce(
          (total, asset) => total + asset.sizeBytes,
          0,
        ),
      },

      lifecycle: Array.from(lifecycleCounts, ([status, count]) => ({
        status,
        count,
      })),

      categories: Array.from(categoryCounts, ([category, count]) => ({
        category,
        count,
      })),

      storageProviders: Array.from(
        providerCounts,
        ([provider, usage]) => ({
          provider,
          assetCount: usage.count,
          sizeBytes: usage.bytes,
        }),
      ),

      // No verified health-check results are available from the current API.
      healthIssues: [],
    };
  }, [assets]);

  return (
    <AssetPageContainer>
      <div className="space-y-8">
        <AssetControlCenterHeader />

        {isError ? (
          <section
            role="alert"
            className="rounded-xl border border-[var(--border)] p-4"
          >
            <h2 className="font-semibold">Asset overview unavailable</h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {error?.message ?? 'The asset list could not be loaded.'}
            </p>

            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-3 text-sm font-medium underline"
            >
              Retry loading assets
            </button>
          </section>
        ) : (
          <AssetOverviewDashboard
            {...overview}
            loading={isLoading}
          />
        )}

        <AssetDirectory
          onOpenAsset={(asset) => {
            router.push(ADMIN_ROUTES.ASSET(asset.publicId));
          }}
        />
      </div>
    </AssetPageContainer>
  );
}
