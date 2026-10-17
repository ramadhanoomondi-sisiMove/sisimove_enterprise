// -----------------------------------------------------------------------------
// sisiMove — Verification Queue Route Loading
// -----------------------------------------------------------------------------

import { VerificationQueueSkeleton } from "@/components/admin/verifications/feedback";

export default function VerificationQueueLoading() {
  return (
    <main
      aria-label="Verification review queue"
      className="mx-auto w-full max-w-screen-2xl space-y-6 p-4 sm:p-6 lg:p-8"
    >
      <VerificationQueueSkeleton rows={5} />
    </main>
  );
}