// -----------------------------------------------------------------------------
// sisiMove — Support Case Detail Loading State
// -----------------------------------------------------------------------------
//
// Next.js route-level loading boundary for:
//
//   /support/cases/[publicId]
//
// This boundary is presentation-only. The Support feature owns all case and
// conversation data fetching.
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

