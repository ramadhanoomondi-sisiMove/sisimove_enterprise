
"use client";

import { useEffect } from "react";
import { VerificationErrorState } from "@/components/admin/verifications";

interface VerificationDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function VerificationDetailError({
  error,
  reset,
}: VerificationDetailErrorProps) {
  useEffect(() => {
    // Keep the error available to the framework's error reporting.
    console.error("Verification detail route error:", error);
  }, [error]);

  return (
    <VerificationErrorState
      title="Unable to load verification details"
      description="An unexpected error occurred while displaying this verification. Try again."
      onRetry={reset}
      retryLabel="Try again"
    />
  );
}
