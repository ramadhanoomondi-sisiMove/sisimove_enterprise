
"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { membersMutations } from "@/features/admin/members/queries/members.mutations";

type ContactField = "email" | "phoneNumber";

interface MemberContactChangeDialogProps {
  open: boolean;
  identityPublicId: string;
  field: ContactField;
  currentValue: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface MemberContactChangeDialogFormProps {
  identityPublicId: string;
  field: ContactField;
  currentValue: string;
  onClose: () => void;
  onSuccess?: () => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function MemberContactChangeDialogForm({
  identityPublicId,
  field,
  currentValue,
  onClose,
  onSuccess,
}: MemberContactChangeDialogFormProps) {
  const queryClient = useQueryClient();

  const [value, setValue] = useState(currentValue);
  const [validationError, setValidationError] = useState<string | null>(null);

  const emailMutation = useMutation(
    membersMutations.changeEmail(queryClient),
  );

  const phoneMutation = useMutation(
    membersMutations.changePhoneNumber(queryClient),
  );

  const isEmail = field === "email";
  const isPending = emailMutation.isPending || phoneMutation.isPending;

  const mutationError = isEmail
    ? emailMutation.error
    : phoneMutation.error;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedValue = value.trim();

    if (!normalizedValue) {
      setValidationError(
        isEmail ? "Enter an email address." : "Enter a phone number.",
      );
      return;
    }

    if (isEmail && !isValidEmail(normalizedValue)) {
      setValidationError("Enter a valid email address.");
      return;
    }

    if (normalizedValue === currentValue.trim()) {
      setValidationError(
        "Enter a value different from the current one.",
      );
      return;
    }

    setValidationError(null);

    const handleSuccess = () => {
      onSuccess?.();
      onClose();
    };

    if (isEmail) {
      emailMutation.mutate(
        {
          identityPublicId,
          body: { email: normalizedValue },
        },
        {
          onSuccess: handleSuccess,
        },
      );

      return;
    }

    phoneMutation.mutate(
      {
        identityPublicId,
        body: { phoneNumber: normalizedValue },
      },
      {
        onSuccess: handleSuccess,
      },
    );
  }

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPending) {
          onClose();
        }
      }}
      title={`Change ${isEmail ? "email address" : "phone number"}`}
      description="Update the contact information for this member identity."
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
            type="submit"
            form="member-contact-change-form"
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </>
      }
    >
      <form
        id="member-contact-change-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-3">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Current {isEmail ? "email address" : "phone number"}
          </p>

          <p className="mt-1 break-all text-sm text-[var(--foreground)]">
            {currentValue || "Not provided"}
          </p>
        </div>

        <div>
          <label
            htmlFor="member-contact-new-value"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
          >
            New {isEmail ? "email address" : "phone number"}
          </label>

          <input
            id="member-contact-new-value"
            type={isEmail ? "email" : "tel"}
            autoComplete={isEmail ? "email" : "tel"}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setValidationError(null);
            }}
            disabled={isPending}
            required
            autoFocus
            placeholder={
              isEmail ? "member@example.com" : "Enter phone number"
            }
            aria-invalid={Boolean(validationError)}
            aria-describedby={
              validationError
                ? "member-contact-validation-error"
                : undefined
            }
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] disabled:opacity-60"
          />

          {validationError && (
            <p
              id="member-contact-validation-error"
              className="mt-1.5 text-sm text-[var(--danger)]"
              role="alert"
            >
              {validationError}
            </p>
          )}
        </div>

        {mutationError && (
          <div
            className="rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-3 text-sm text-[var(--foreground)]"
            role="alert"
          >
            The contact information could not be changed. The server may have
            rejected the value or the request may not be authorized. Please
            review the value and try again.
          </div>
        )}
      </form>
    </Dialog>
  );
}

export function MemberContactChangeDialog(
  props: MemberContactChangeDialogProps,
) {
  if (!props.open) {
    return null;
  }

  const formKey = JSON.stringify([
    props.identityPublicId,
    props.field,
    props.currentValue,
  ]);

  return (
    <MemberContactChangeDialogForm
      key={formKey}
      identityPublicId={props.identityPublicId}
      field={props.field}
      currentValue={props.currentValue}
      onClose={props.onClose}
      onSuccess={props.onSuccess}
    />
  );
}

export default MemberContactChangeDialog;
