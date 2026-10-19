
"use client";

// -----------------------------------------------------------------------------
// sisiMove — Admin Member Identity Card
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display core Identity information and lifecycle timestamps.
// - Present lifecycle actions backed by existing Identity mutations.
// - Allow authorized operators to request email and phone-number changes.
// - Refresh identity data through membersMutations.
//
// Security:
// - Backend permissions and domain rules remain authoritative.
// - CLOSED is terminal; no reactivation action is offered.
// - This component does not invent permissions or domain timestamps.
// -----------------------------------------------------------------------------

import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MemberIdentity } from "@/features/admin/members/models/member.model";
import { membersMutations } from "@/features/admin/members/queries/members.mutations";

import { MemberStatusBadge } from "@/components/admin/members/primitives/member-status-badge";
import { MemberDataSection } from "@/components/admin/members/primitives/member-data-section";
import { Button } from "@/components/ui/button";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberIdentityCardProps {
  readonly member: MemberIdentity;
  readonly className?: string;
}

type LifecycleAction = "activate" | "suspend" | "close";
type ContactAction = "email" | "phone";

const LIFECYCLE_COPY: Record<
  LifecycleAction,
  { title: string; description: string; confirm: string }
> = {
  activate: {
    title: "Activate account",
    description:
      "Activate this member account? The server will validate whether the current lifecycle state permits activation.",
    confirm: "Confirm activation",
  },
  suspend: {
    title: "Suspend account",
    description:
      "Suspend this member account? Access and related consequences are governed by the backend.",
    confirm: "Confirm suspension",
  },
  close: {
    title: "Close account",
    description:
      "Close this member account? Closure is terminal and cannot be reversed through this lifecycle.",
    confirm: "Confirm closure",
  },
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatTimestamp(value?: string): string {
  if (!value?.trim()) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}

interface IdentityFieldProps {
  readonly label: string;
  readonly value: string;
  readonly valueClassName?: string;
}

function IdentityField({
  label,
  value,
  valueClassName,
}: IdentityFieldProps): ReactNode {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd
        className={cn(
          "break-words text-sm text-[var(--foreground)]",
          valueClassName,
        )}
      >
        {value}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberIdentityCard({
  member,
  className,
}: MemberIdentityCardProps): ReactNode {
  const queryClient = useQueryClient();

  const activateMutation = useMutation(
    membersMutations.activate(queryClient),
  );

  const suspendMutation = useMutation(
    membersMutations.suspend(queryClient),
  );

  const closeMutation = useMutation(
    membersMutations.close(queryClient),
  );

  const changeEmailMutation = useMutation(
    membersMutations.changeEmail(queryClient),
  );

  const changePhoneMutation = useMutation(
    membersMutations.changePhoneNumber(queryClient),
  );

  const [pendingLifecycleAction, setPendingLifecycleAction] =
    useState<LifecycleAction | null>(null);

  const [contactAction, setContactAction] =
    useState<ContactAction | null>(null);

  const [email, setEmail] = useState(member.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    member.phoneNumber ?? "",
  );

  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );

  const isClosed = member.status === "CLOSED";

  const isMutating =
    activateMutation.isPending ||
    suspendMutation.isPending ||
    closeMutation.isPending ||
    changeEmailMutation.isPending ||
    changePhoneMutation.isPending;

  function resetFeedback(): void {
    setActionError(null);
    setSuccessMessage(null);
  }

  async function confirmLifecycleAction(): Promise<void> {
    if (!pendingLifecycleAction) {
      return;
    }

    resetFeedback();

    try {
      const variables = {
        identityPublicId: member.publicId,
      };

      switch (pendingLifecycleAction) {
        case "activate":
          await activateMutation.mutateAsync(variables);
          setSuccessMessage("Account activation completed.");
          break;

        case "suspend":
          await suspendMutation.mutateAsync(variables);
          setSuccessMessage("Account suspension completed.");
          break;

        case "close":
          await closeMutation.mutateAsync(variables);
          setSuccessMessage("Account closure completed.");
          break;
      }

      setPendingLifecycleAction(null);
    } catch (error: unknown) {
      setActionError(
        getErrorMessage(
          error,
          "The account action failed. Check your permissions and try again.",
        ),
      );
    }
  }

  async function submitContactChange(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isClosed || !contactAction) {
      return;
    }

    resetFeedback();

    try {
      const identityPublicId = member.publicId;

      if (contactAction === "email") {
        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
          setActionError("Enter an email address.");
          return;
        }

        await changeEmailMutation.mutateAsync({
          identityPublicId,
          body: { email: normalizedEmail },
        });

        setEmail(normalizedEmail);
        setSuccessMessage("Email change completed.");
      } else {
        const normalizedPhoneNumber = phoneNumber.trim();

        if (!normalizedPhoneNumber) {
          setActionError("Enter a phone number.");
          return;
        }

        await changePhoneMutation.mutateAsync({
          identityPublicId,
          body: { phoneNumber: normalizedPhoneNumber },
        });

        setPhoneNumber(normalizedPhoneNumber);
        setSuccessMessage("Phone number change completed.");
      }

      setContactAction(null);
    } catch (error: unknown) {
      setActionError(
        getErrorMessage(
          error,
          "The contact detail could not be changed. Check the value and your permissions.",
        ),
      );
    }
  }

  // Offer lifecycle operations appropriate to the current status.
  // The backend remains authoritative for the actual transition.
  const lifecycleActions: LifecycleAction[] =
    member.status === "PENDING"
      ? ["activate", "suspend", "close"]
      : member.status === "ACTIVE"
        ? ["suspend", "close"]
        : member.status === "SUSPENDED"
          ? ["activate", "close"]
          : [];

  return (
    <MemberDataSection
      title="Identity"
      description="Core account information, lifecycle controls and account timeline."
      className={className}
    >
      <div className="space-y-6">
        {/* Core identity details */}
        <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <IdentityField
            label="Public ID"
            value={member.publicId || "Not available"}
            valueClassName="font-mono text-xs"
          />

          <div className="min-w-0 space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Account status
            </dt>

            <dd className="pt-1">
              <MemberStatusBadge status={member.status} size="sm" />
            </dd>
          </div>

          <IdentityField
            label="Email address"
            value={member.email || "Not recorded"}
          />

          <IdentityField
            label="Phone number"
            value={member.phoneNumber || "Not recorded"}
          />
        </dl>

        {/* Identity actions */}
        <div className="space-y-3 border-t border-[var(--border-subtle)] pt-5">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Account actions
            </h3>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Changes are submitted to the Identity service. The server
              validates authorization and account lifecycle rules.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {lifecycleActions.map((action) => (
              <Button
                key={action}
                type="button"
                variant={action === "close" ? "danger" : "primary"}
                size="sm"
                disabled={isMutating}
                onClick={() => {
                  resetFeedback();
                  setPendingLifecycleAction(action);
                  setContactAction(null);
                }}
              >
                {action === "activate"
                  ? "Activate account"
                  : action === "suspend"
                    ? "Suspend account"
                    : "Close account"}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isMutating || isClosed}
              onClick={() => {
                resetFeedback();
                setEmail(member.email ?? "");
                setContactAction("email");
                setPendingLifecycleAction(null);
              }}
            >
              Change email
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isMutating || isClosed}
              onClick={() => {
                resetFeedback();
                setPhoneNumber(member.phoneNumber ?? "");
                setContactAction("phone");
                setPendingLifecycleAction(null);
              }}
            >
              Change phone
            </Button>
          </div>

          {isClosed && (
            <p className="text-sm text-[var(--foreground-muted)]">
              This account is closed. Lifecycle actions and contact edits
              are unavailable here.
            </p>
          )}

          {/* Lifecycle confirmation */}
          {pendingLifecycleAction && (
            <div
              role="group"
              aria-labelledby="identity-lifecycle-confirmation"
              className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <h4
                id="identity-lifecycle-confirmation"
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                {LIFECYCLE_COPY[pendingLifecycleAction].title}
              </h4>

              <p className="text-sm text-[var(--foreground-secondary)]">
                {LIFECYCLE_COPY[pendingLifecycleAction].description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    pendingLifecycleAction === "close"
                      ? "danger"
                      : "primary"
                  }
                  disabled={isMutating}
                  onClick={() => void confirmLifecycleAction()}
                >
                  {isMutating
                    ? "Processing…"
                    : LIFECYCLE_COPY[pendingLifecycleAction].confirm}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isMutating}
                  onClick={() => setPendingLifecycleAction(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Contact edit form */}
          {contactAction && (
            <form
              onSubmit={(event) => void submitContactChange(event)}
              className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                {contactAction === "email"
                  ? "Change email address"
                  : "Change phone number"}
              </h4>

              <div className="space-y-1">
                <label
                  htmlFor={`member-identity-${contactAction}`}
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  {contactAction === "email"
                    ? "New email address"
                    : "New phone number"}
                </label>

                <input
                  id={`member-identity-${contactAction}`}
                  type={contactAction === "email" ? "email" : "tel"}
                  autoComplete={
                    contactAction === "email" ? "email" : "tel"
                  }
                  required
                  value={
                    contactAction === "email" ? email : phoneNumber
                  }
                  onChange={(event) => {
                    if (contactAction === "email") {
                      setEmail(event.target.value);
                    } else {
                      setPhoneNumber(event.target.value);
                    }
                  }}
                  disabled={isMutating}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isMutating}
                >
                  {isMutating ? "Saving…" : "Save changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isMutating}
                  onClick={() => setContactAction(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {actionError && (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {actionError}
            </p>
          )}

          {successMessage && (
            <p
              role="status"
              className="text-sm text-[var(--foreground-secondary)]"
            >
              {successMessage}
            </p>
          )}
        </div>

        {/* Identity timeline */}
        <div className="border-t border-[var(--border-subtle)] pt-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
            Account timeline
          </h3>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <IdentityField
              label="Account created"
              value={formatTimestamp(member.createdAt)}
            />

            <IdentityField
              label="Last updated"
              value={formatTimestamp(member.updatedAt)}
            />

            <IdentityField
              label="Activated at"
              value={formatTimestamp(member.activatedAt)}
            />

            <IdentityField
              label="Suspended at"
              value={formatTimestamp(member.suspendedAt)}
            />

            <IdentityField
              label="Closed at"
              value={formatTimestamp(member.closedAt)}
            />
          </dl>
        </div>
      </div>
    </MemberDataSection>
  );
}

export default MemberIdentityCard;
