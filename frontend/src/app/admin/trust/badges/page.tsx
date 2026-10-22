"use client";

import { useCallback, useMemo, useState } from "react";

import {
  TrustBadgeCatalogue,
  TrustBadgeForm,
} from "@/components/admin/trust";

import type { TrustBadgeCardAction } from "@/components/admin/trust/badges/TrustBadgeCard";
import type { TrustBadgeFormPayload } from "@/components/admin/trust/badges/TrustBadgeForm";

import type { TrustBadgeModel } from "@/features/admin/trust/models";
import { TrustBadgeModelMapper } from "@/features/admin/trust/models";

import {
  useActiveTrustBadges,
} from "@/features/admin/trust/queries/trust.queries";

import {
  useCreateTrustBadge,
  useUpdateTrustBadge,
  useActivateTrustBadge,
  useDeactivateTrustBadge,
} from "@/features/admin/trust/queries/trust.mutations";

type BadgeFilter = "all" | "active" | "inactive";

export default function TrustBadgesPage() {
  const [selectedBadge, setSelectedBadge] =
    useState<TrustBadgeModel | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState<BadgeFilter>("all");
  const [pageError, setPageError] = useState<string | null>(null);

  const badgesQuery = useActiveTrustBadges();

  const createBadge = useCreateTrustBadge();
  const updateBadge = useUpdateTrustBadge();
  const activateBadge = useActivateTrustBadge();
  const deactivateBadge = useDeactivateTrustBadge();

  const badges = useMemo(
    () =>
      TrustBadgeModelMapper.fromApiList(
        badgesQuery.data ?? [],
      ),
    [badgesQuery.data],
  );

  const isMutationPending =
    createBadge.isPending ||
    updateBadge.isPending ||
    activateBadge.isPending ||
    deactivateBadge.isPending;

  const refreshBadges = useCallback(async () => {
    setPageError(null);

    try {
      await badgesQuery.refetch();
    } catch {
      setPageError("Unable to reload the badge catalogue.");
    }
  }, [badgesQuery]);

  const openCreateForm = useCallback(() => {
    setSelectedBadge(null);
    setFormOpen(true);
    setPageError(null);
  }, []);

  const openEditForm = useCallback((badge: TrustBadgeModel) => {
    setSelectedBadge(badge);
    setFormOpen(true);
    setPageError(null);
  }, []);

  const closeForm = useCallback(() => {
    if (isMutationPending) return;

    setFormOpen(false);
    setSelectedBadge(null);
  }, [isMutationPending]);

  async function handleSubmit(values: TrustBadgeFormPayload) {
    setPageError(null);

    // Keep description compatible with the API request contracts.
    const requestPayload = {
      name: values.name.trim(),
      type: values.type.trim(),
      description: values.description?.trim() ?? "",
      assetPublicId: values.assetPublicId?.trim() || null,
    };

    try {
      if (selectedBadge) {
        await updateBadge.mutateAsync([
          selectedBadge.id,
          requestPayload,
        ]);
      } else {
        await createBadge.mutateAsync([requestPayload]);
      }

      setFormOpen(false);
      setSelectedBadge(null);

      await badgesQuery.refetch();
    } catch {
      throw new Error(
        selectedBadge
          ? "Unable to update the badge."
          : "Unable to create the badge.",
      );
    }
  }

  async function handleStatusChange(
    badge: TrustBadgeModel,
    nextActive: boolean,
  ) {
    setPageError(null);

    try {
      if (nextActive) {
        await activateBadge.mutateAsync([badge.id]);
      } else {
        await deactivateBadge.mutateAsync([badge.id]);
      }

      await badgesQuery.refetch();
    } catch {
      setPageError(
        `Unable to ${nextActive ? "activate" : "deactivate"} "${badge.name}". Please try again.`,
      );
    }
  }

  const getBadgeActions = useCallback(
    (badge: TrustBadgeModel): TrustBadgeCardAction[] => [
      {
        label: "Edit badge",
        variant: "outline",
        onClick: () => openEditForm(badge),
        disabled: isMutationPending,
      },
    ],
    [isMutationPending, openEditForm],
  );

  const filteredBadges = useMemo(() => {
    if (filter === "active") {
      return badges.filter((badge) => badge.active);
    }

    if (filter === "inactive") {
      return badges.filter((badge) => !badge.active);
    }

    return badges;
  }, [badges, filter]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--brand)]">
            Trust &amp; Reputation
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Trust badge catalogue
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
            Manage badge definitions used to recognize trusted members
            across sisiMove.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          disabled={isMutationPending}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-[var(--brand)] bg-[var(--brand)] px-4 text-sm font-medium text-[var(--brand-foreground)] transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create badge
        </button>
      </header>

      {pageError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-[var(--danger)]/30 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-[var(--danger)]">{pageError}</p>

          <button
            type="button"
            onClick={() => void refreshBadges()}
            className="min-h-9 shrink-0 rounded-md border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
          >
            Retry
          </button>
        </div>
      )}

      {formOpen ? (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {selectedBadge ? "Edit badge" : "Create badge"}
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {selectedBadge
                ? "Update this badge's definition."
                : "Enter the details for the new badge definition."}
            </p>
          </div>

          <TrustBadgeForm
            key={selectedBadge?.publicId ?? "new-badge"}
            initialBadge={selectedBadge ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={
              createBadge.isPending || updateBadge.isPending
            }
            disabled={isMutationPending}
          />
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm text-[var(--foreground-secondary)]">
                Returned badges
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {badges.length}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm text-[var(--foreground-secondary)]">
                Active
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--success)]">
                {badges.filter((badge) => badge.active).length}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm text-[var(--foreground-secondary)]">
                Inactive in current results
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {badges.filter((badge) => !badge.active).length}
              </p>
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                The current API returns active badges only.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Badge definitions
                </h2>
                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Select a badge to inspect or edit its definition.
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                <span>Filter</span>
                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.currentTarget.value as BadgeFilter)
                  }
                  className="min-h-9 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)]"
                >
                  <option value="all">All returned</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            <TrustBadgeCatalogue
              badges={filteredBadges}
              isLoading={badgesQuery.isLoading}
                        error={
                badgesQuery.isError
                    ? "Unable to load the trust badge catalogue."
                    : null
                }
              onRetry={() => void refreshBadges()}
              onSelectBadge={openEditForm}
              onCreateBadge={openCreateForm}
              onBadgeStatusChange={handleStatusChange}
              getBadgeActions={getBadgeActions}
              isMutationPending={isMutationPending}
              disabled={isMutationPending}
              initialFilter={filter}
              showCreateAction={false}
              title="Badge catalogue"
              description="Browse and manage the available trust badge definitions."
            />
          </section>
        </>
      )}
    </main>
  );
}