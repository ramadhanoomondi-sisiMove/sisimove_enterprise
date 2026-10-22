/**
 * sisiMove — Trust Profile Verification Panel
 *
 * Displays verification information for an individual Trust profile and
 * optionally exposes caller-controlled verification actions.
 *
 * Responsibilities:
 * - Display the profile status and verification level.
 * - Provide optional grant and revoke verification actions.
 * - Represent pending operations and disabled actions accessibly.
 * - Reuse existing design-system components.
 *
 * Non-responsibilities:
 * - Determining verification eligibility.
 * - Inferring verification state from undocumented values.
 * - Enforcing permissions or executing API mutations directly.
 */

"use client";

import type { TrustProfileModel } from "@/features/admin/trust/models/trust-profile.model";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type VerificationProfileFields = Pick<
  TrustProfileModel,
  "status" | "verificationLevel"
>;

export interface TrustProfileVerificationPanelProps {
  /**
   * Verification fields from the mapped Trust profile model.
   */
  profile: VerificationProfileFields;

  /**
   * Called when the administrator requests verification to be granted.
   * Supply only when the caller allows this action.
   */
  onGrantVerification?: () => void;

  /**
   * Called when the administrator requests verification to be revoked.
   * Supply only when the caller allows this action.
   */
  onRevokeVerification?: () => void;

  /**
   * Whether a verification operation is currently pending.
   */
  isPending?: boolean;

  /**
   * Disable verification actions, for example while permissions are loading.
   */
  actionsDisabled?: boolean;

  /**
   * Optional explanatory note supplied by the parent.
   */
  description?: string;

  /**
   * Additional classes for the panel.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
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

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileVerificationPanel({
  profile,
  onGrantVerification,
  onRevokeVerification,
  isPending = false,
  actionsDisabled = false,
  description,
  className,
}: TrustProfileVerificationPanelProps) {
  const hasActions =
    Boolean(onGrantVerification) || Boolean(onRevokeVerification);

  const disableActions = actionsDisabled || isPending;

  return (
    <Card variant="default" padding="lg" className={className}>
      <div className="space-y-5">
        <header>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Verification
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Review the verification information recorded for this Trust profile.
          </p>

          {description && (
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </header>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0 rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
            <dt className="text-sm text-[var(--foreground-muted)]">
              Profile status
            </dt>

            <dd className="mt-2">
              <Badge variant="outline" size="md">
                {formatDisplayValue(profile.status)}
              </Badge>
            </dd>
          </div>

          <div className="min-w-0 rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
            <dt className="text-sm text-[var(--foreground-muted)]">
              Verification level
            </dt>

            <dd className="mt-2">
              <Badge variant="brand" size="md">
                {formatDisplayValue(profile.verificationLevel)}
              </Badge>
            </dd>
          </div>
        </dl>

        {hasActions && (
          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
            {onGrantVerification && (
              <button
                type="button"
                onClick={onGrantVerification}
                disabled={disableActions}
                className={[
                  "inline-flex min-h-10 items-center justify-center gap-2",
                  "rounded-[var(--radius-md)] px-4",
                  "bg-[var(--brand)] text-[var(--brand-foreground)]",
                  "text-sm font-medium transition-colors",
                  "hover:bg-[var(--brand-hover)]",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--brand)]",
                  "focus-visible:outline-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                {isPending ? "Processing…" : "Grant verification"}
              </button>
            )}

            {onRevokeVerification && (
              <button
                type="button"
                onClick={onRevokeVerification}
                disabled={disableActions}
                className={[
                  "inline-flex min-h-10 items-center justify-center",
                  "rounded-[var(--radius-md)] border px-4",
                  "border-[var(--danger)] text-[var(--danger)]",
                  "text-sm font-medium transition-colors",
                  "hover:bg-[var(--danger-soft)]",
                  "focus-visible:outline-2",
                  "focus-visible:outline-[var(--danger)]",
                  "focus-visible:outline-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                {isPending ? "Processing…" : "Revoke verification"}
              </button>
            )}
          </div>
        )}

        {isPending && (
          <p role="status" className="text-sm text-[var(--foreground-muted)]">
            Updating verification…
          </p>
        )}
      </div>
    </Card>
  );
}

export default TrustProfileVerificationPanel;
