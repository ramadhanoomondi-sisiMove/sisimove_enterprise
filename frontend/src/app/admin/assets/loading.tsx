
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Assets Route Loading
 * -----------------------------------------------------------------------------
 *
 * Provides a page-level skeleton while the admin asset directory loads.
 * Reuses the shared AssetLoadingState component.
 *
 * -----------------------------------------------------------------------------
 */

import { AssetLoadingState } from '@/components/admin/assets/shared/AssetLoadingState';

export default function AdminAssetsLoading() {
  return (
    <AssetLoadingState
      variant="page"
      count={8}
      label="Loading admin assets"
    />
  );
}
