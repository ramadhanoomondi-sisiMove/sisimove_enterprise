import type { ReactNode } from "react";

export interface MemberDataSectionProps {
  /** Heading displayed at the top of the section. */
  title: string;
  /** Optional supporting text beneath the heading. */
  description?: string;
  /** Optional controls aligned with the heading. */
  actions?: ReactNode;
  /** Section content. */
  children: ReactNode;
  /** Optional classes appended to the section surface. */
  className?: string;
  /** Optional stable anchor for in-page navigation. */
  id?: string;
}

/**
 * sisiMove — Member Data Section
 *
 * Low-dependency layout primitive for grouping related member information.
 * Uses the project's existing global design tokens through Tailwind arbitrary
 * values; it does not introduce new global styles or make API calls.
 */
export function MemberDataSection({
  title,
  description,
  actions,
  children,
  className,
  id,
}: MemberDataSectionProps) {
  const sectionClassName = [
    "min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={id}
      aria-label={title}
      className={sectionClassName}
    >
      <header className="flex flex-col gap-3 border-b border-[var(--border)] px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0 space-y-1">
          <h2 className="text-sm font-semibold tracking-tight sm:text-base">
            {title}
          </h2>

          {description ? (
            <p className="max-w-3xl text-sm text-[var(--foreground-muted)]">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </header>

      <div className="min-w-0 p-4 sm:p-5">
        {children}
      </div>
    </section>
  );
}

export default MemberDataSection;
