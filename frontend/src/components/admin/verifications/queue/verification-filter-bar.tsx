// -----------------------------------------------------------------------------
// sisiMove — Verification Filter Bar
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Search verification records.
// - Filter by aggregate verification status and level.
// - Keep filter state controlled by the parent.
// - Use the shared Select component and its accessible labels.
// - Perform no API calls.
//
// -----------------------------------------------------------------------------

"use client";

import { Select, type SelectOption } from "@/components/ui";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type VerificationStatusFilter =
  | "ALL"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED"
  | "REVOKED";

export type VerificationLevelFilter =
  | "ALL"
  | "NONE"
  | "MEMBER"
  | "DRIVER";

export interface VerificationFilterBarProps {
  search: string;
  status: VerificationStatusFilter;
  level: VerificationLevelFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: VerificationStatusFilter) => void;
  onLevelChange: (value: VerificationLevelFilter) => void;
  onReset?: () => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Options
// -----------------------------------------------------------------------------

const statusOptions: SelectOption[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Revoked", value: "REVOKED" },
];

const levelOptions: SelectOption[] = [
  { label: "All levels", value: "ALL" },
  { label: "None", value: "NONE" },
  { label: "Member", value: "MEMBER" },
  { label: "Driver", value: "DRIVER" },
];

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationFilterBar({
  search,
  status,
  level,
  onSearchChange,
  onStatusChange,
  onLevelChange,
  onReset,
  className,
}: VerificationFilterBarProps) {
  return (
    <section
      aria-label="Filter verification records"
      className={[
        "w-full",
        "rounded-[var(--radius-lg)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end">
        {/* Search */}
        <div className="min-w-0">
          <label
            htmlFor="verification-search"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            Search
          </label>

          <input
            id="verification-search"
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.currentTarget.value)
            }
            placeholder="Search by verification or identity ID"
            autoComplete="off"
            className={[
              "min-h-10",
              "w-full",
              "rounded-[var(--radius-md)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-3",
              "text-sm",
              "text-[var(--foreground)]",
              "placeholder:text-[var(--foreground-muted)]",
              "outline-none",
              "transition-colors",
              "focus:border-[var(--brand)]",
              "focus:ring-2",
              "focus:ring-[var(--brand)]/20",
            ].join(" ")}
          />
        </div>

        {/* Aggregate status */}
        <Select
          id="verification-status-filter"
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(event) => {
            const value = event.currentTarget.value;

            if (
              statusOptions.some((option) => option.value === value)
            ) {
              onStatusChange(value as VerificationStatusFilter);
            }
          }}
        />

        {/* Verification level */}
        <Select
          id="verification-level-filter"
          label="Verification level"
          options={levelOptions}
          value={level}
          onChange={(event) => {
            const value = event.currentTarget.value;

            if (
              levelOptions.some((option) => option.value === value)
            ) {
              onLevelChange(value as VerificationLevelFilter);
            }
          }}
        />

        {/* Reset */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className={[
              "inline-flex",
              "min-h-10",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-md)]",
              "border",
              "border-[var(--border)]",
              "px-4",
              "text-sm",
              "font-medium",
              "text-[var(--foreground-secondary)]",
              "transition-colors",
              "hover:bg-[var(--background-muted)]",
              "hover:text-[var(--foreground)]",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--brand)]",
              "focus-visible:outline-offset-2",
            ].join(" ")}
          >
            Reset filters
          </button>
        )}
      </div>
    </section>
  );
}

export default VerificationFilterBar;