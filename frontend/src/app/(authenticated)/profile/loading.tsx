// -----------------------------------------------------------------------------
// sisiMove — Verification Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for the authenticated Verification page.
//
// Responsibilities:
// - Communicate that the verification workflow is loading.
// - Use the shared Spinner design-system primitive.
// - Remain independent of verification data and business logic.
//
// Non-responsibilities:
// - Fetching verification data.
// - Verification business rules.
// - Request submission or cancellation.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Spinner } from '@/components/ui/spinner';

// =============================================================================
// Loading
// =============================================================================

export default function Loading(): ReactNode {
  return (
    <main>
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner
          size="md"
          label="Loading verification"
        />
      </div>
    </main>
  );
}