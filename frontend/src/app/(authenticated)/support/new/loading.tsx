// -----------------------------------------------------------------------------
// sisiMove — New Support Case Route Loading State
// -----------------------------------------------------------------------------
//
// Next.js route-level loading boundary for:
//
//   /support/new
//
// The loading component is intentionally presentation-only. It does not fetch
// Identity or Support data.
//
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

