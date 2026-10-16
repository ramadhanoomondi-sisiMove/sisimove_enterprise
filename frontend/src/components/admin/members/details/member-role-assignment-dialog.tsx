
"use client";

/**
 * sisiMove — Admin Member Role Assignment Dialog
 *
 * Responsibilities:
 * - present assignable role definitions;
 * - collect an optional role-expiry date;
 * - submit assignments through the existing mutation options;
 * - display pending and error states;
 * - notify the parent after a successful assignment.
 *
 * Role discovery and authorization remain outside this component.
 * The backend remains authoritative for assignment eligibility and permissions.
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

import { membersMutations } from "@/features/admin/members/queries/members.mutations";

import type { MemberRoleDefinition } from "@/features/admin/members/models/member-roles.model";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MemberRoleAssignmentDialogProps {
  open: boolean;
  identityPublicId: string;

  /**
   * Role definitions supplied by the parent.
   * Pass only roles that are active and eligible for assignment.
   */
  availableRoles: MemberRoleDefinition[];

  onClose: () => void;
  onSuccess?: () => void;
}

// -----------------------------------------------------------------------------
// Dialog
// -----------------------------------------------------------------------------

export function MemberRoleAssignmentDialog({
  open,
  identityPublicId,
  availableRoles,
  onClose,
  onSuccess,
}: MemberRoleAssignmentDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <MemberRoleAssignmentDialogForm
      key={identityPublicId.trim()}
      identityPublicId={identityPublicId}
      availableRoles={availableRoles}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

// -----------------------------------------------------------------------------
// Form
// -----------------------------------------------------------------------------

interface MemberRoleAssignmentDialogFormProps {
  identityPublicId: string;
  availableRoles: MemberRoleDefinition[];
  onClose: () => void;
  onSuccess?: () => void;
}

function MemberRoleAssignmentDialogForm({
  identityPublicId,
  availableRoles,
  onClose,
  onSuccess,
}: MemberRoleAssignmentDialogFormProps) {
  const queryClient = useQueryClient();

  const [rolePublicId, setRolePublicId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const assignRoleMutation = useMutation(
    membersMutations.assignRole(queryClient),
  );

  const assignableRoles = availableRoles.filter(
    (role) => role.isActive && role.canBeAssigned,
  );

  const selectedRole = assignableRoles.find(
    (role) => role.publicId === rolePublicId,
  );

  const mutationError = assignRoleMutation.error;

  const errorMessage =
    mutationError instanceof Error
      ? mutationError.message
      : mutationError
        ? "The role could not be assigned. Please try again."
        : null;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedIdentityPublicId = identityPublicId.trim();

    if (
      !normalizedIdentityPublicId ||
      !selectedRole ||
      assignRoleMutation.isPending
    ) {
      return;
    }

    let expiryIso: string | undefined;

    if (expiresAt) {
      const expiryDate = new Date(expiresAt);

     const currentTime = new Date().getTime();

if (
  Number.isNaN(expiryDate.getTime()) ||
  expiryDate.getTime() <= currentTime
) {
  return;
}

      expiryIso = expiryDate.toISOString();
    }

    try {
      await assignRoleMutation.mutateAsync({
        identityPublicId: normalizedIdentityPublicId,
        body: {
          rolePublicId: selectedRole.publicId,
          ...(expiryIso ? { expiresAt: expiryIso } : {}),
        },
      });

      onSuccess?.();
      onClose();
    } catch {
      // The mutation error is displayed in the dialog.
      // Do not close the dialog when the assignment fails.
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !assignRoleMutation.isPending) {
          onClose();
        }
      }}
      title="Assign role"
      description="Grant this member a role. The server will validate whether the assignment is permitted."
      size="md"
      closeOnBackdropClick={!assignRoleMutation.isPending}
      closeOnEscape={!assignRoleMutation.isPending}
      showCloseButton={!assignRoleMutation.isPending}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={assignRoleMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="member-role-assignment-form"
            disabled={
              assignRoleMutation.isPending ||
              !selectedRole ||
              !identityPublicId.trim()
            }
          >
            {assignRoleMutation.isPending
              ? "Assigning..."
              : "Assign role"}
          </Button>
        </div>
      }
    >
      <form
        id="member-role-assignment-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label
            htmlFor="member-role-assignment-role"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Role
          </label>

          <select
            id="member-role-assignment-role"
            value={rolePublicId}
            onChange={(event) => setRolePublicId(event.target.value)}
            required
            disabled={assignRoleMutation.isPending}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
          >
            <option value="">Select a role</option>

            {assignableRoles.map((role) => (
              <option key={role.publicId} value={role.publicId}>
                {role.name} ({role.code})
              </option>
            ))}
          </select>

          {assignableRoles.length === 0 && (
            <p className="text-sm text-[var(--foreground-secondary)]">
              No assignable roles were provided. Check role availability and
              permissions before trying again.
            </p>
          )}

          {selectedRole?.description && (
            <p className="text-sm text-[var(--foreground-secondary)]">
              {selectedRole.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="member-role-assignment-expiry"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Expiry date and time
            <span className="ml-1 font-normal text-[var(--foreground-muted)]">
              (optional)
            </span>
          </label>

          <input
            id="member-role-assignment-expiry"
            type="datetime-local"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
            disabled={assignRoleMutation.isPending}
           min={undefined}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
          />

          <p className="text-xs text-[var(--foreground-secondary)]">
            Leave empty for an assignment without an expiry date. The selected
            date and time are interpreted in your browser&apos;s local time zone.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--foreground)]"
          >
            {errorMessage}
          </div>
        )}
      </form>
    </Dialog>
  );
}

export default MemberRoleAssignmentDialog;
