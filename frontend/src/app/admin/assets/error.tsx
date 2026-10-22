
'use client';

/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Assets Route Error
 * -----------------------------------------------------------------------------
 *
 * Route-level error boundary for the admin asset collection.
 *
 * Uses the shared AssetErrorState component for consistent error presentation.
 * Next.js supplies the reset callback to retry rendering the route.
 *
 * -----------------------------------------------------------------------------
 */

import { AssetErrorState } from '@/components/admin/assets/shared';

interface AdminAssetsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminAssetsError({
  reset,
}: AdminAssetsErrorProps) {
  return (
    <AssetErrorState
      variant="load"
      onRetry={reset}
      retryLabel="Try again"
    />
  );
}
