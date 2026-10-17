// -----------------------------------------------------------------------------
// sisiMove — Verification Queue Route Error
// -----------------------------------------------------------------------------

"use client";

import { useEffect } from "react";

import { VerificationErrorState } from "@/components/admin/verifications/feedback";

interface VerificationQueueRouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function VerificationQueueRouteError({
  error,
  reset,
}: VerificationQueueRouteErrorProps) {
  useEffect(() => {
    // Keep diagnostic logging limited to the error boundary.
    console.error("Verification queue route error:", error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8">
      <VerificationErrorState
        title="Unable to display the verification queue"
        description="An unexpected error occurred while displaying this page. Please try again."
        onRetry={reset}
        retryLabel="Retry"
      />
    </main>
  );
}