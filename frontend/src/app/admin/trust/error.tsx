
"use client";

import { useEffect } from "react";

import { TrustPageContainer } from "@/components/admin/trust/layout/TrustPageContainer";
import { TrustErrorState } from "@/components/admin/trust/shared/TrustErrorState";

interface TrustErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TrustError({
  error,
  reset,
}: TrustErrorProps) {
  useEffect(() => {
    // Keep the error available to development tooling without displaying
    // internal details in the user-facing interface.
    console.error("Trust Control Center route error:", error);
  }, [error]);

  return (
    <TrustPageContainer size="2xl" className="py-6">
      <TrustErrorState
        variant="load"
        title="Trust Control Center is unavailable"
        description="Something went wrong while loading this area. Please try again."
        retryAction={{
          label: "Try again",
          onClick: reset,
        }}
      />
    </TrustPageContainer>
  );
}
