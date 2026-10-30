
"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Provider Directory
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Load and display registered payment providers.
// - Create new payment providers.
// - Search across the complete filtered provider collection.
// - Apply provider type, status, environment and operational filters.
// - Display active filter chips.
// - Paginate search results.
// - Handle loading, empty and error states.
// - Use the shared ProviderPageToolbar layout.
//
// -----------------------------------------------------------------------------

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  useAdminProviders,
  useAdminProviderOperations,
} from "@/features/admin/finance/providers";

import type {
  AdminProvider,
  AdminProviderFilters,
  AdminCreateProviderInput,
} from "@/features/admin/finance/providers";

import {
  ProviderEmptyState,
  ProviderErrorState,
} from "../shared";

import {
  ProviderSectionHeader,
  ProviderPageToolbar,
} from "../layout";

import {
  ProviderCreateDialog,
  ProviderOperationFeedback,
} from "@/components/admin/finance/providers";

import { ProviderDirectoryHeader } from "./ProviderDirectoryHeader";
import { ProviderSearch } from "./ProviderSearch";
import { ProviderFilters } from "./ProviderFilters";
import { ProviderFilterChips } from "./ProviderFilterChips";
import { ProviderTable } from "./ProviderTable";
import { ProviderTableSkeleton } from "./ProviderTableSkeleton";
import { ProviderPagination } from "./ProviderPagination";

// =============================================================================
// Types
// =============================================================================

export interface ProviderDirectoryProps {
  className?: string;
}

interface OperationFeedback {
  type: "success" | "error";
  message: string;
  error?: unknown;
}

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_PAGE_SIZE = 20;

// =============================================================================
// Component
// =============================================================================

export function ProviderDirectory({
  className,
}: ProviderDirectoryProps) {
  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<AdminProviderFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateDialogOpen, setIsCreateDialogOpen] =
    useState(false);

  const [feedback, setFeedback] =
    useState<OperationFeedback | null>(null);

  // ---------------------------------------------------------------------------
  // Provider Operations
  // ---------------------------------------------------------------------------

  const operations = useAdminProviderOperations();

  // ---------------------------------------------------------------------------
  // Provider Collection
  // ---------------------------------------------------------------------------

  const {
    filteredProviders,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminProviders(filters);

  // ---------------------------------------------------------------------------
  // Create Provider
  // ---------------------------------------------------------------------------

  const handleCreateProvider = async (
    input: AdminCreateProviderInput,
  ) => {
    setFeedback(null);

    try {
      await operations.createProvider.mutateAsync(input);

      setIsCreateDialogOpen(false);
      setCurrentPage(1);
      setSearch("");
      setFilters({});

      setFeedback({
        type: "success",
        message: "The payment provider was created successfully.",
      });
    } catch (createError) {
      setFeedback({
        type: "error",
        message: "The payment provider could not be created.",
        error: createError,
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  const searchedProviders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return filteredProviders;
    }

    return filteredProviders.filter((provider: AdminProvider) => {
      const searchableValues = [
        provider.name,
        provider.code,
        provider.type,
        provider.status,
        provider.environment,
        provider.publicId,
      ];

      return searchableValues.some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [filteredProviders, search]);

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const totalItems = searchedProviders.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / DEFAULT_PAGE_SIZE),
  );

  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedProviders = useMemo(() => {
    const startIndex =
      (effectivePage - 1) * DEFAULT_PAGE_SIZE;

    return searchedProviders.slice(
      startIndex,
      startIndex + DEFAULT_PAGE_SIZE,
    );
  }, [searchedProviders, effectivePage]);

  // ---------------------------------------------------------------------------
  // Search Handler
  // ---------------------------------------------------------------------------

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // ---------------------------------------------------------------------------
  // Filter Handler
  // ---------------------------------------------------------------------------

  const handleFiltersChange = (
    nextFilters: AdminProviderFilters,
  ) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  // ---------------------------------------------------------------------------
  // Clear Filters
  // ---------------------------------------------------------------------------

  const handleClearFilters = () => {
    setFilters({});
    setSearch("");
    setCurrentPage(1);
  };

  // ---------------------------------------------------------------------------
  // Pagination Handler
  // ---------------------------------------------------------------------------

  const handlePageChange = (page: number) => {
    setCurrentPage(
      Math.min(Math.max(page, 1), totalPages),
    );
  };

  // ---------------------------------------------------------------------------
  // Active Filter Detection
  // ---------------------------------------------------------------------------

  const hasActiveFilters =
    Boolean(filters.type) ||
    Boolean(filters.status) ||
    Boolean(filters.environment) ||
    filters.operational !== undefined;

  const hasSearch = search.trim().length > 0;

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setFeedback(null);
              setIsCreateDialogOpen(true);
            }}
          >
            Create Provider
          </Button>
        </div>

        <ProviderErrorState
          title="Unable to load payment providers"
          description={
            error instanceof Error
              ? error.message
              : "Something went wrong while loading payment providers. Please try again."
          }
          retryAction={{
            label: "Try Again",
            onClick: () => {
              void refetch();
            },
          }}
        />

        <ProviderCreateDialog
          isOpen={isCreateDialogOpen}
          isLoading={operations.isCreating}
          onConfirm={(input) => {
            void handleCreateProvider(input);
          }}
          onCancel={() => setIsCreateDialogOpen(false)}
        />

        {feedback && (
          <ProviderOperationFeedback
            isSuccess={feedback.type === "success"}
            isError={feedback.type === "error"}
            successTitle="Provider created"
            successMessage={feedback.message}
            errorTitle="Creation failed"
            errorMessage={feedback.message}
            error={feedback.error}
            onDismiss={() => setFeedback(null)}
          />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section className={className ?? "space-y-6"}>

      {/* ----------------------------------------------------------------- */}
      {/* Operation Feedback                                                */}
      {/* ----------------------------------------------------------------- */}

      {feedback && (
        <ProviderOperationFeedback
          isSuccess={feedback.type === "success"}
          isError={feedback.type === "error"}
          successTitle="Provider created"
          successMessage={feedback.message}
          errorTitle="Creation failed"
          errorMessage={feedback.message}
          error={feedback.error}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Directory Header and Create Action                                */}
      {/* ----------------------------------------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProviderDirectoryHeader />

        <Button
          onClick={() => {
            setFeedback(null);
            setIsCreateDialogOpen(true);
          }}
          disabled={operations.isCreating}
        >
          Create Provider
        </Button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Shared Search and Filter Toolbar                                  */}
      {/* ----------------------------------------------------------------- */}

      <ProviderPageToolbar
        search={
          <ProviderSearch
            value={search}
            onChange={handleSearchChange}
          />
        }
        filters={
          <div className="flex flex-wrap items-center gap-2">
            <ProviderFilters
              filters={filters}
              onChange={handleFiltersChange}
            />

            <ProviderFilterChips
              filters={filters}
              search={search}
              onFiltersChange={handleFiltersChange}
              onSearchChange={handleSearchChange}
              onClear={handleClearFilters}
            />
          </div>
        }
      />

      {/* ----------------------------------------------------------------- */}
      {/* Provider Records                                                  */}
      {/* ----------------------------------------------------------------- */}

      <div className="space-y-4">

        <ProviderSectionHeader
          title="Payment Providers"
          description={
            isLoading
              ? "Loading registered providers..."
              : `${totalItems.toLocaleString("en-KE")} provider${totalItems === 1 ? "" : "s"} found`
          }
        />

        {/* Loading State */}

        {isLoading ? (
          <ProviderTableSkeleton />
        ) : totalItems === 0 ? (

          /* Empty State */

          <ProviderEmptyState
            title="No providers found"
            description={
              hasSearch || hasActiveFilters
                ? "Try changing your search or filters."
                : "No payment providers have been registered yet. Use Create Provider to register your first provider."
            }
          />

        ) : (

          /* Provider Table and Pagination */

          <>
            <ProviderTable
              providers={paginatedProviders}
              isFetching={isFetching}
            />

            <ProviderPagination
              currentPage={effectivePage}
              totalPages={totalPages}
              pageSize={DEFAULT_PAGE_SIZE}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </>

        )}

      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Create Provider Dialog                                            */}
      {/* ----------------------------------------------------------------- */}

      <ProviderCreateDialog
        isOpen={isCreateDialogOpen}
        isLoading={operations.isCreating}
        onConfirm={(input) => {
          void handleCreateProvider(input);
        }}
        onCancel={() => setIsCreateDialogOpen(false)}
      />

    </section>
  );
}
