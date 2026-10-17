
"use client";

// -----------------------------------------------------------------------------
// sisiMove — Admin Verification Review Queue
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Load the verification review queue.
// - Display aggregate overview metrics.
// - Filter loaded records by search, status, and verification level.
// - Navigate to an individual verification detail page.
// - Delegate API access to the existing query hook.
//
// -----------------------------------------------------------------------------

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";

import {
  VerificationFilterBar,
  VerificationOverviewCards,
  VerificationQueueTable,
  VerificationQueueToolbar,
  type VerificationLevelFilter,
  type VerificationStatusFilter,
} from "@/components/admin/verifications/queue";

import { useVerifications } from "@/features/admin/verifications/hooks/use-verifications";

import type { VerificationApiResponse } from "@/features/admin/verifications/types/verification-api.types";

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function VerificationQueuePage() {
  const router = useRouter();

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useVerifications();

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<VerificationStatusFilter>("ALL");
  const [level, setLevel] =
    useState<VerificationLevelFilter>("ALL");

  const verifications = useMemo<VerificationApiResponse[]>(
    () => data ?? [],
    [data],
  );

  // Filter only records returned by the review-queue endpoint.
  const filteredVerifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return verifications.filter((verification) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        verification.publicId.toLowerCase().includes(normalizedSearch) ||
        verification.identityPublicId
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === "ALL" || verification.status === status;

      const matchesLevel =
        level === "ALL" || verification.level === level;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [verifications, search, status, level]);

  function resetFilters(): void {
    setSearch("");
    setStatus("ALL");
    setLevel("ALL");
  }

  function openVerification(
    verification: VerificationApiResponse,
  ): void {
    router.push(
      ADMIN_ROUTES.VERIFICATION(verification.publicId),
    );
  }

  return (
    <main className="mx-auto w-full max-w-screen-2xl space-y-6 p-4 sm:p-6 lg:p-8">
      <VerificationQueueToolbar
        resultCount={filteredVerifications.length}
        isRefreshing={isFetching && !isLoading}
        onRefresh={() => {
          void refetch();
        }}
      />

      <VerificationOverviewCards
        verifications={verifications}
        isLoading={isLoading && !data}
      />

      <VerificationFilterBar
        search={search}
        status={status}
        level={level}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onLevelChange={setLevel}
        onReset={resetFilters}
      />

      <section
        aria-label="Verification records"
        className="space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Review requests
          </h2>

          <p className="text-sm text-[var(--foreground-muted)]">
            {filteredVerifications.length.toLocaleString()}{" "}
            {filteredVerifications.length === 1 ? "record" : "records"}
          </p>
        </div>

        <VerificationQueueTable
          verifications={filteredVerifications}
          isLoading={isLoading && !data}
          error={!data && error ? error.message : null}
          onRetry={() => {
            void refetch();
          }}
          onOpenVerification={openVerification}
        />
      </section>
    </main>
  );
}
