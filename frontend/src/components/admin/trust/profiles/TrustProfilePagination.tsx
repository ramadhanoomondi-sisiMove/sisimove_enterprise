
"use client";

import type { HTMLAttributes } from "react";

// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Pagination
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the current page and total profile count.
// - Provide previous/next and numbered-page navigation.
// - Keep pagination state controlled by the parent.
//
// Non-responsibilities:
// - Fetching profiles.
// - Changing query parameters or browser history.
// - Inferring total pages from loaded records.
// -----------------------------------------------------------------------------

export interface TrustProfilePaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  siblingCount?: number;
}

type PageItem = number | "ellipsis";

function getPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  if (totalPages <= 0) return [];

  const pages = new Set<number>([1, totalPages]);

  const start = Math.max(1, currentPage - siblingCount);
  const end = Math.min(totalPages, currentPage + siblingCount);

  for (let page = start; page <= end; page += 1) {
    pages.add(page);
  }

  const sortedPages = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];

  for (let index = 0; index < sortedPages.length; index += 1) {
    const current = sortedPages[index];
    const previous = sortedPages[index - 1];

    if (index > 0 && current - previous > 1) {
      items.push(current - previous === 2 ? previous + 1 : "ellipsis");
    }

    items.push(current);
  }

  return items;
}

function getRangeStart(page: number, pageSize: number, total: number) {
  if (total === 0) return 0;
  return (page - 1) * pageSize + 1;
}

function getRangeEnd(page: number, pageSize: number, total: number) {
  return Math.min(page * pageSize, total);
}

export function TrustProfilePagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  disabled = false,
  siblingCount = 1,
  className,
  ...props
}: TrustProfilePaginationProps) {
  const safeTotal = Math.max(0, total);
  const safePageSize = Math.max(1, pageSize);
  const safeTotalPages = Math.max(0, totalPages);
  const safePage =
    safeTotalPages === 0
      ? 1
      : Math.min(Math.max(1, page), safeTotalPages);

  const pageItems = getPageItems(
    safePage,
    safeTotalPages,
    Math.max(0, Math.floor(siblingCount)),
  );

  const canGoPrevious = !disabled && safePage > 1;
  const canGoNext = !disabled && safePage < safeTotalPages;

  if (safeTotal === 0 || safeTotalPages === 0) {
    return null;
  }

  function goToPage(nextPage: number) {
    if (disabled || nextPage < 1 || nextPage > safeTotalPages) {
      return;
    }

    if (nextPage !== safePage) {
      onPageChange(nextPage);
    }
  }

  return (
    <nav
      aria-label="Trust profile pagination"
      className={["flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p
        className="text-sm text-[var(--foreground-secondary)]"
        aria-live="polite"
      >
        Showing{" "}
        <span className="font-medium text-[var(--foreground)]">
          {getRangeStart(safePage, safePageSize, safeTotal)}
        </span>
        {"–"}
        <span className="font-medium text-[var(--foreground)]">
          {getRangeEnd(safePage, safePageSize, safeTotal)}
        </span>
        {" of "}
        <span className="font-medium text-[var(--foreground)]">
          {safeTotal.toLocaleString()}
        </span>{" "}
        profiles
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(safePage - 1)}
          disabled={!canGoPrevious}
          aria-label="Go to previous page"
          className="inline-flex min-h-9 items-center justify-center rounded-md border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="flex h-9 min-w-8 items-center justify-center px-1 text-sm text-[var(--foreground-muted)]"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              disabled={disabled}
              aria-label={`Go to page ${item}`}
              aria-current={item === safePage ? "page" : undefined}
              className={[
                "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40",
                item === safePage
                  ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)]"
                  : "border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-subtle)]",
              ].join(" ")}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goToPage(safePage + 1)}
          disabled={!canGoNext}
          aria-label="Go to next page"
          className="inline-flex min-h-9 items-center justify-center rounded-md border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default TrustProfilePagination;
