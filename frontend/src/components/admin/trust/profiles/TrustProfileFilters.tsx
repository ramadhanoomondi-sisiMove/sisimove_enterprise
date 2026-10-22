
"use client";

import type { HTMLAttributes } from "react";

// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Filters
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Collect profile search text, status, and verification-level filters.
// - Keep all filter values controlled by the parent.
// - Provide a single clear action for resetting filters.
//
// Non-responsibilities:
// - Fetching or filtering profile records.
// - Defining backend query parameter names.
// - Making permission or moderation decisions.
// -----------------------------------------------------------------------------

export type TrustProfileStatusFilter =
  | "all"
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "unknown";

export type TrustProfileVerificationFilter =
  | "all"
  | "verified"
  | "unverified"
  | "pending"
  | "unknown";

export interface TrustProfileFiltersValue {
  search: string;
  status: TrustProfileStatusFilter;
  verification: TrustProfileVerificationFilter;
}

export interface TrustProfileFiltersProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onChange" | "onSubmit"> {
  value: TrustProfileFiltersValue;
  onChange: (value: TrustProfileFiltersValue) => void;
  onReset?: () => void;
  disabled?: boolean;
}

const STATUS_OPTIONS: {
  value: TrustProfileStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "unknown", label: "Other / unknown" },
];

const VERIFICATION_OPTIONS: {
  value: TrustProfileVerificationFilter;
  label: string;
}[] = [
  { value: "all", label: "All verification levels" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
  { value: "pending", label: "Verification pending" },
  { value: "unknown", label: "Other / unknown" },
];

const DEFAULT_FILTERS: TrustProfileFiltersValue = {
  search: "",
  status: "all",
  verification: "all",
};

export function TrustProfileFilters({
  value,
  onChange,
  onReset,
  disabled = false,
  className,
  ...props
}: TrustProfileFiltersProps) {
  const hasActiveFilters =
    value.search.trim().length > 0 ||
    value.status !== "all" ||
    value.verification !== "all";

  function updateFilter<K extends keyof TrustProfileFiltersValue>(
    key: K,
    nextValue: TrustProfileFiltersValue[K],
  ) {
    onChange({
      ...value,
      [key]: nextValue,
    });
  }

  function resetFilters() {
    onChange({ ...DEFAULT_FILTERS });
    onReset?.();
  }

  return (
    <form
      className={[
        "space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onSubmit={(event) => event.preventDefault()}
      {...props}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Filter trust profiles
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Narrow the directory by search, status, or verification.
          </p>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          disabled={disabled || !hasActiveFilters}
          className="self-start rounded-md px-3 py-2 text-sm font-medium text-[var(--brand)] transition-colors hover:bg-[var(--brand-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
        >
          Clear filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1.5 md:col-span-1">
          <label
            htmlFor="trust-profile-search"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Search
          </label>

          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--foreground-muted)]"
            >
              <SearchIcon />
            </span>

            <input
              id="trust-profile-search"
              name="search"
              type="search"
              value={value.search}
              onChange={(event) =>
                updateFilter("search", event.currentTarget.value)
              }
              disabled={disabled}
              placeholder="Profile or member public ID"
              autoComplete="off"
              className="min-h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 pl-10 pr-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="trust-profile-status"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Profile status
          </label>

          <select
            id="trust-profile-status"
            name="status"
            value={value.status}
            onChange={(event) =>
              updateFilter(
                "status",
                event.currentTarget.value as TrustProfileStatusFilter,
              )
            }
            disabled={disabled}
            className="min-h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="trust-profile-verification"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Verification
          </label>

          <select
            id="trust-profile-verification"
            name="verification"
            value={value.verification}
            onChange={(event) =>
              updateFilter(
                "verification",
                event.currentTarget.value as TrustProfileVerificationFilter,
              )
            }
            disabled={disabled}
            className="min-h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {VERIFICATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export default TrustProfileFilters;
