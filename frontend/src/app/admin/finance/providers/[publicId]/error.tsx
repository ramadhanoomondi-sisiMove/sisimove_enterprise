
"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";
import { ProviderErrorState } from "@/components/admin/finance/providers/shared";

export default function ProviderDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Payment Provider Detail Error:", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ProviderErrorState
        title="Unable to load provider details"
        description="Something went wrong while loading this payment provider. Please try again."
        retryAction={{
          label: "Try Again",
          onClick: reset,
        }}
      />

      <div className="mt-4 flex justify-center">
        <Link
          href={ADMIN_ROUTES.FINANCE_PROVIDERS}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
        >
          Back to Payment Providers
        </Link>
      </div>

      {error.digest && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Error reference: {error.digest}
        </p>
      )}
    </div>
  );
}
