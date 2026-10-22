"use client";

import { useCallback, useState } from "react";
import type { HTMLAttributes } from "react";

import type { TrustProfileSummaryModel } from "@/features/admin/trust/models/trust-profile.model";

import {
  TrustProfileFilters,
  type TrustProfileFiltersValue,
} from "./TrustProfileFilters";
import { TrustProfileTable } from "./TrustProfileTable";

// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Directory
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Compose directory filters and the profile table.
// - Maintain the current filter values.
// - Notify the parent when filters or pagination change.
// - Delegate loading, error, empty, and row rendering to TrustProfileTable.
//
// Non-responsibilities:
// - Fetching profile records.
// - Assuming backend filter parameter names or enum values.
// - Performing trust mutations.
// - Making authorization decisions.
// -----------------------------------------------------------------------------

export interface TrustProfileDirectoryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  profiles: TrustProfileSummaryModel[];

  page: number;
  pageSize: number;
  total: number;
  totalPages: number;

  onPageChange: (page: number) => void;
  onSelectProfile: (profile: TrustProfileSummaryModel) => void;
  onFiltersChange: (filters: TrustProfileFiltersValue) => void;

  initialFilters?: TrustProfileFiltersValue;

  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;

  disabled?: boolean;
}

const DEFAULT_FILTERS: TrustProfileFiltersValue = {
  search: "",
  status: "all",
  verification: "all",
};

export function TrustProfileDirectory({
  profiles,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onSelectProfile,
  onFiltersChange,
  initialFilters,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  disabled = false,
  className,
  ...props
}: TrustProfileDirectoryProps) {
  const [filters, setFilters] = useState<TrustProfileFiltersValue>(
    () => ({ ...(initialFilters ?? DEFAULT_FILTERS) }),
  );

  const handleFiltersChange = useCallback(
    (nextFilters: TrustProfileFiltersValue) => {
      setFilters({ ...nextFilters });

      // Return to the first page whenever filters change.
      onPageChange(1);
      onFiltersChange(nextFilters);
    },
    [onFiltersChange, onPageChange],
  );

  const handleReset = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
    onPageChange(1);
    onFiltersChange({ ...DEFAULT_FILTERS });
  }, [onFiltersChange, onPageChange]);

  return (
    <div
      className={["space-y-5", className].filter(Boolean).join(" ")}
      {...props}
    >
      <TrustProfileFilters
        value={filters}
        onChange={handleFiltersChange}
        onReset={handleReset}
        disabled={disabled || isLoading}
      />

      <TrustProfileTable
        profiles={profiles}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onSelectProfile={onSelectProfile}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        onRetry={onRetry}
        disabled={disabled}
      />
    </div>
  );
}

export default TrustProfileDirectory;
