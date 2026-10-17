// -----------------------------------------------------------------------------
// sisiMove — Verification Queue Toolbar
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the verification queue heading and supporting text.
// - Optionally display the number of records in the current result set.
// - Expose a refresh action.
// - Remain presentational; fetching and state management belong to the parent.
//
// -----------------------------------------------------------------------------

"use client";

export interface VerificationQueueToolbarProps {
  title?: string;
  description?: string;
  resultCount?: number;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function VerificationQueueToolbar({
  title = "Verification review queue",
  description = "Review submitted verification requests and their current status.",
  resultCount,
  isRefreshing = false,
  onRefresh,
  actions,
  className,
}: VerificationQueueToolbarProps) {
  const hasResultCount =
    typeof resultCount === "number" &&
    Number.isFinite(resultCount) &&
    resultCount >= 0;

  return (
    <section
      aria-label="Verification queue toolbar"
      className={[
        "flex",
        "flex-col",
        "gap-4",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Heading and result count */}
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {title}
          </h1>

          {hasResultCount && (
            <span
              aria-label={`${resultCount} verification records`}
              className={[
                "inline-flex",
                "min-h-6",
                "items-center",
                "rounded-full",
                "border",
                "border-[var(--border)]",
                "bg-[var(--background-muted)]",
                "px-2.5",
                "text-xs",
                "font-medium",
                "tabular-nums",
                "text-[var(--foreground-secondary)]",
              ].join(" ")}
            >
              {resultCount.toLocaleString()}
            </span>
          )}
        </div>

        {description && (
          <p className="max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
        )}
      </div>

      {/* Toolbar actions */}
      {(onRefresh || actions) && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label={
                isRefreshing
                  ? "Refreshing verification queue"
                  : "Refresh verification queue"
              }
              className={[
                "inline-flex",
                "min-h-10",
                "items-center",
                "justify-center",
                "gap-2",
                "rounded-[var(--radius-md)]",
                "border",
                "border-[var(--border)]",
                "bg-[var(--surface)]",
                "px-3",
                "text-sm",
                "font-medium",
                "text-[var(--foreground)]",
                "transition-colors",
                "hover:bg-[var(--background-muted)]",
                "focus-visible:outline-2",
                "focus-visible:outline-[var(--brand)]",
                "focus-visible:outline-offset-2",
                "disabled:cursor-not-allowed",
                "disabled:opacity-60",
              ].join(" ")}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className={[
                  "h-4",
                  "w-4",
                  isRefreshing ? "animate-spin" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
              >
                <path
                  d="M16 10a6 6 0 0 1-10.8 3.6M4 10a6 6 0 0 1 10.8-3.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 10H3V8M15 10h2v2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {isRefreshing ? "Refreshing…" : "Refresh"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default VerificationQueueToolbar;