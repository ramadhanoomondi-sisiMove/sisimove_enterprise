// -----------------------------------------------------------------------------
// sisiMove — Assets Error State
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the authenticated Assets page.
//
// Responsibilities:
// - Present failures that prevent the Assets route from rendering
// - Allow the route segment to be retried
//
// AssetManager remains responsible for errors returned while loading or
// mutating the Asset collection after the route has rendered.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useEffect,
} from 'react';

import {
  ErrorState,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetsErrorProps {
  readonly error: Error & {
    readonly digest?: string;
  };
  readonly reset: () => void;
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AssetsError({
  error,
  reset,
}: AssetsErrorProps) {
  useEffect(() => {
    // Route-level error boundaries receive the error from Next.js.
    // Logging here keeps the boundary side-effect limited to diagnostics.
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Unable to load your assets"
      description={
        error.message ||
        'Something went wrong while loading your assets. Please try again.'
      }
      retryAction={{
        label: 'Try again',
        onClick: reset,
      }}
      secondaryAction={{
        label: 'Go back',
        variant: 'ghost',
        onClick: () => window.history.back(),
      }}
    />
  );
}