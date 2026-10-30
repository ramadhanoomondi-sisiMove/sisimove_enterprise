
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ProviderErrorState } from "@/components/admin/finance/providers";

interface ProvidersErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProvidersError({
  error,
  reset,
}: ProvidersErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error for monitoring and debugging.
    console.error("Payment Providers route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <ProviderErrorState
        title="Unable to load payment providers"
        description="We couldn't display the payment providers page. Please try again."
        retryAction={{
          label: "Try Again",
          onClick: reset,
        }}
        secondaryAction={{
          label: "Go to Finance Control Center",
          onClick: () => router.push("/admin/finance"),
        }}
        className="w-full max-w-xl"
      />
    </div>
  );
}
