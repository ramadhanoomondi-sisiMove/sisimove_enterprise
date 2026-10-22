/**
 * sisiMove — Trust Profile Management Header
 *
 * Header for the individual Trust profile administration workspace.
 *
 * Responsibilities:
 * - Identify the selected Trust profile and member reference.
 * - Display profile status and verification level.
 * - Show optional supporting context.
 * - Expose caller-controlled navigation and profile actions.
 *
 * Non-responsibilities:
 * - Fetching profile or member data.
 * - Enforcing permissions.
 * - Executing Trust mutations.
 */

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/foundation/utils/cn";
import type { TrustProfileModel } from "@/features/admin/trust/models/trust-profile.model";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustProfileManagementHeaderAction {
  /**
   * Stable action identifier.
   */
  id: string;

  /**
   * Visible action label.
   */
  label: string;

  /**
   * Callback supplied by the consuming workspace.
   */
  onClick: () => void;

  /**
   * Optional icon or visual content preceding the label.
   */
  leadingContent?: ReactNode;

  /**
   * Visual treatment for the action.
   */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";

  /**
   * Disable the action.
   */
  disabled?: boolean;
}

export interface TrustProfileManagementHeaderProps {
  /**
   * Mapped Trust profile data from the frontend model layer.
   */
  profile: Pick<
    TrustProfileModel,
    "publicId" | "memberPublicId" | "status" | "verificationLevel"
  >;

  /**
   * Optional main heading override.
   */
  title?: string;

  /**
   * Optional explanatory text beneath the heading.
   */
  description?: string;

  /**
   * Optional contextual label above the heading.
   */
  eyebrow?: string;

  /**
   * Optional content rendered beneath the profile identity.
   */
  children?: ReactNode;

  /**
   * Optional profile-level actions.
   */
  actions?: TrustProfileManagementHeaderAction[];

  /**
   * Additional classes for the header root.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDisplayValue(value: string | null | undefined): string {
  if (!value?.trim()) {
    return "Not specified";
  }

  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function truncateReference(value: string, maxLength = 30): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, 14)}…${value.slice(-10)}`;
}

// -----------------------------------------------------------------------------
// Action Styles
// -----------------------------------------------------------------------------

const actionVariantClasses: Record<
  NonNullable<TrustProfileManagementHeaderAction["variant"]>,
  string
> = {
  primary: [
    "border border-transparent",
    "bg-[var(--brand)] text-[var(--brand-foreground)]",
    "hover:bg-[var(--brand-hover)]",
    "focus-visible:outline-[var(--brand)]",
  ].join(" "),

  secondary: [
    "border border-transparent",
    "bg-[var(--background-muted)] text-[var(--foreground)]",
    "hover:bg-[var(--background-subtle)]",
    "focus-visible:outline-[var(--brand)]",
  ].join(" "),

  outline: [
    "border border-[var(--border)]",
    "bg-[var(--surface)] text-[var(--foreground)]",
    "hover:border-[var(--border-strong)]",
    "hover:bg-[var(--background-muted)]",
    "focus-visible:outline-[var(--brand)]",
  ].join(" "),

  ghost: [
    "border border-transparent",
    "bg-transparent text-[var(--foreground-secondary)]",
    "hover:bg-[var(--background-muted)]",
    "focus-visible:outline-[var(--brand)]",
  ].join(" "),

  danger: [
    "border border-[var(--danger)]",
    "bg-[var(--danger)] text-white",
    "hover:opacity-90",
    "focus-visible:outline-[var(--danger)]",
  ].join(" "),
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileManagementHeader({
  profile,
  title,
  description = "Review and manage this member’s Trust profile.",
  eyebrow = "TRUST MANAGEMENT",
  children,
  actions = [],
  className,
}: TrustProfileManagementHeaderProps) {
  const displayTitle = title ?? "Trust profile";

  return (
    <header
      className={cn(
        "w-full min-w-0",
        "border-b border-[var(--border-subtle)] pb-6",
        className,
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
              {eyebrow}
            </p>
          )}

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {displayTitle}
          </h1>

          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)]">
              {description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" size="md">
              {formatDisplayValue(profile.status)}
            </Badge>

            <Badge variant="brand" size="md">
              {formatDisplayValue(profile.verificationLevel)}
            </Badge>
          </div>

          <dl className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                Trust profile ID
              </dt>

              <dd
                className="mt-1 break-all text-sm text-[var(--foreground)]"
                title={profile.publicId}
              >
                {truncateReference(profile.publicId)}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                Member ID
              </dt>

              <dd
                className="mt-1 break-all text-sm text-[var(--foreground)]"
                title={profile.memberPublicId}
              >
                {truncateReference(profile.memberPublicId)}
              </dd>
            </div>
          </dl>
        </div>

        {actions.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions.map((action) => {
              const variant = action.variant ?? "outline";

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cn(
                    "inline-flex min-h-10 items-center justify-center gap-2",
                    "rounded-[var(--radius-md)] px-4",
                    "text-sm font-medium transition-colors duration-150",
                    "focus-visible:outline-2 focus-visible:outline-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    actionVariantClasses[variant],
                  )}
                >
                  {action.leadingContent && (
                    <span
                      aria-hidden="true"
                      className="inline-flex shrink-0 items-center"
                    >
                      {action.leadingContent}
                    </span>
                  )}

                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}

export default TrustProfileManagementHeader;
