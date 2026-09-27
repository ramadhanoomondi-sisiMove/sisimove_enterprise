// -----------------------------------------------------------------------------
// sisiMove — Support Loading State
// -----------------------------------------------------------------------------
//
// Next.js route-level loading boundary for the authenticated Support surface.
//
// Responsibilities:
// - provide immediate visual feedback while the Support route is loading.
//
// Non-responsibilities:
// - fetching Support data;
// - authentication;
// - query management;
// - rendering Support business state.
// -----------------------------------------------------------------------------

import { SupportCaseLoading } from '@/components/support-case';

export default function Loading() {
  return (
    <main className="page-container py-6">
      <div className="mx-auto w-full max-w-3xl">
        <SupportCaseLoading />
      </div>
    </main>
  );
}

