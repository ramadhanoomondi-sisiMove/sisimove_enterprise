
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { MemberStatusBadge } from "@/components/admin/members/primitives/member-status-badge";
import { membersMutations } from "@/features/admin/members/queries/members.mutations";
import type { MemberIdentity } from "@/features/admin/members/models/member.model";

type MemberStatusAction = "activate" | "suspend" | "close";

interface MemberStatusChangeDialogProps {
  open: boolean;
  identityPublicId: string;
  currentStatus: MemberIdentity["status"];
  action: MemberStatusAction;
  onClose: () => void;
  onSuccess?: () => void;
}

const actionCopy: Record<
  MemberStatusAction,
  { title: string; description: string; confirmLabel: string }
> = {
  activate: {
    title: "Activate member identity",
    description:
      "Activating makes this identity active, subject to the backend's lifecycle rules and permissions.",
    confirmLabel: "Activate identity",
  },
  suspend: {
    title: "Suspend member identity",
    description:
      "Suspension changes this identity's status. Review any related access and session requirements separately.",
    confirmLabel: "Suspend identity",
  },
  close: {
    title: "Close member identity",
    description:
      "Closing is terminal. A closed identity cannot be reactivated through the standard lifecycle.",
    confirmLabel: "Close identity permanently",
  },
};

export function MemberStatusChangeDialog({
  open,
  identityPublicId,
  currentStatus,
  action,
  onClose,
  onSuccess,
}: MemberStatusChangeDialogProps) {
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

  const mutation =
    action === "activate"
      ? activateMutation
      : action === "suspend"
        ? suspendMutation
        : closeMutation;

  const copy = actionCopy[action];
  const isPending =
    activateMutation.isPending ||
    suspendMutation.isPending ||
    closeMutation.isPending;

  const mutationError = mutation.error;

  function handleConfirm() {
    if (isPending) return;

    const variables = { identityPublicId };

    const handleSuccess = () => {
      onSuccess?.();
      onClose();
    };

    if (action === "activate") {
      activateMutation.mutate(variables, { onSuccess: handleSuccess });
    } else if (action === "suspend") {
      suspendMutation.mutate(variables, { onSuccess: handleSuccess });
    } else {
      closeMutation.mutate(variables, { onSuccess: handleSuccess });
    }
  }

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPending) onClose();
      }}
      title={copy.title}
      description={copy.description}
      size="md"
      closeOnBackdropClick={!isPending}
      closeOnEscape={!isPending}
      showCloseButton={!isPending}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={action === "close" ? "danger" : "primary"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Processing…" : copy.confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Identity reference
          </p>
          <p className="mt-1 break-all text-sm text-[var(--foreground)]">
            {identityPublicId}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--foreground-secondary)]">
              Current status
            </span>
            <MemberStatusBadge status={currentStatus} />
          </div>
        </div>

        {action === "close" && (
          <div
            className="rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-3"
            role="alert"
          >
            <p className="text-sm font-semibold text-[var(--foreground)]">
              This action is irreversible through the standard lifecycle.
            </p>
            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Confirm only after reviewing the member record and following your
              administrative procedures.
            </p>
          </div>
        )}

        {action === "suspend" && (
          <p className="text-sm text-[var(--foreground-secondary)]">
            Suspension does not, by itself, prove that existing sessions have
            been revoked. Follow the appropriate security workflow if required.
          </p>
        )}

        {mutationError && (
          <div
            className="rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-3 text-sm text-[var(--foreground)]"
            role="alert"
          >
            The status change failed. The identity may not be eligible for this
            transition, or the server may have rejected the request because of
            permissions or lifecycle rules.
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default MemberStatusChangeDialog;
