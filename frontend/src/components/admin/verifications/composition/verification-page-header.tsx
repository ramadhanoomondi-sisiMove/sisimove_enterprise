
import type { ReactNode } from "react";

export interface VerificationPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function VerificationPageHeader({
  title,
  description,
  actions,
  className,
}: VerificationPageHeaderProps) {
  return (
    <header
      className={[
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)]">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}

export default VerificationPageHeader;
