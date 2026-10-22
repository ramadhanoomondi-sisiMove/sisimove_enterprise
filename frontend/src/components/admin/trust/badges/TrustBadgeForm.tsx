/**
 * sisiMove — Trust Badge Form
 *
 * Responsibilities:
 * - Collect editable Trust badge fields.
 * - Support creating and editing badge definitions.
 * - Validate required fields at the UI boundary.
 * - Return a typed form payload to the parent.
 *
 * Non-responsibilities:
 * - Calling the API directly.
 * - Defining badge type enums not confirmed by the backend.
 * - Changing badge activation state.
 * - Making authorization decisions.
 */

"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { TrustBadgeModel } from "@/features/admin/trust/models";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustBadgeFormValues {
  name: string;
  type: string;
  description: string;
  assetPublicId: string;
}

export interface TrustBadgeFormPayload {
  name: string;
  type: string;
  description: string | null;
  assetPublicId: string | null;
}

export interface TrustBadgeFormProps {
  initialBadge?: TrustBadgeModel;
  onSubmit: (
    values: TrustBadgeFormPayload,
  ) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function createInitialValues(
  badge?: TrustBadgeModel,
): TrustBadgeFormValues {
  return {
    name: badge?.name ?? "",
    type: badge?.type ?? "",
    description: badge?.description ?? "",
    assetPublicId: badge?.assetPublicId ?? "",
  };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustBadgeForm({
  initialBadge,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disabled = false,
  submitLabel,
  className,
}: TrustBadgeFormProps) {
  const [values, setValues] = useState<TrustBadgeFormValues>(
    () => createInitialValues(initialBadge),
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof TrustBadgeFormValues, string>>
  >({});

  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = Boolean(initialBadge);
  const formDisabled = disabled || isSubmitting;

  function updateField<K extends keyof TrustBadgeFormValues>(
    field: K,
    value: TrustBadgeFormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError(null);
  }

  function validate(): boolean {
    const nextErrors: Partial<
      Record<keyof TrustBadgeFormValues, string>
    > = {};

    if (!values.name.trim()) {
      nextErrors.name = "Enter a badge name.";
    }

    if (!values.type.trim()) {
      nextErrors.type = "Enter a badge type.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formDisabled || !validate()) {
      return;
    }

    setSubmitError(null);

    const payload: TrustBadgeFormPayload = {
      name: values.name.trim(),
      type: values.type.trim(),
      description: values.description.trim() || null,
      assetPublicId: values.assetPublicId.trim() || null,
    };

    try {
      await onSubmit(payload);
    } catch {
      setSubmitError(
        "The badge could not be saved. Check the details and try again.",
      );
    }
  }

  const inputClassName = [
    "min-h-10 w-full rounded-lg border border-[var(--border)]",
    "bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]",
    "placeholder:text-[var(--foreground-muted)]",
    "focus:border-[var(--brand)] focus:outline-none",
    "focus:ring-2 focus:ring-[var(--brand)]/20",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" ");

  const textareaClassName = [
    "min-h-28 w-full resize-y rounded-lg",
    "border border-[var(--border)] bg-[var(--surface)]",
    "px-3 py-2.5 text-sm leading-6 text-[var(--foreground)]",
    "placeholder:text-[var(--foreground-muted)]",
    "focus:border-[var(--brand)] focus:outline-none",
    "focus:ring-2 focus:ring-[var(--brand)]/20",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" ");

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={["space-y-5", className].filter(Boolean).join(" ")}
    >
      {/* Badge name */}
      <div className="space-y-1.5">
        <label
          htmlFor="trust-badge-name"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Badge name <span className="text-[var(--danger)]">*</span>
        </label>

        <input
          id="trust-badge-name"
          name="name"
          value={values.name}
          onChange={(event) =>
            updateField("name", event.currentTarget.value)
          }
          disabled={formDisabled}
          required
          maxLength={120}
          placeholder="e.g. Trusted Provider"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={
            errors.name ? "trust-badge-name-error" : undefined
          }
          className={inputClassName}
        />

        {errors.name && (
          <p
            id="trust-badge-name-error"
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Badge type */}
      <div className="space-y-1.5">
        <label
          htmlFor="trust-badge-type"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Badge type <span className="text-[var(--danger)]">*</span>
        </label>

        <input
          id="trust-badge-type"
          name="type"
          value={values.type}
          onChange={(event) =>
            updateField("type", event.currentTarget.value)
          }
          disabled={formDisabled}
          required
          maxLength={80}
          placeholder="Enter the supported badge type"
          aria-invalid={Boolean(errors.type)}
          aria-describedby={
            errors.type ? "trust-badge-type-error" : undefined
          }
          className={inputClassName}
        />

        {errors.type && (
          <p
            id="trust-badge-type-error"
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            {errors.type}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label
          htmlFor="trust-badge-description"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Description
        </label>

        <textarea
          id="trust-badge-description"
          name="description"
          value={values.description}
          onChange={(event) =>
            updateField("description", event.currentTarget.value)
          }
          disabled={formDisabled}
          maxLength={1000}
          placeholder="Explain what this badge represents."
          className={textareaClassName}
        />

        <p className="text-right text-xs text-[var(--foreground-muted)]">
          {values.description.length}/1000
        </p>
      </div>

      {/* Asset reference */}
      <div className="space-y-1.5">
        <label
          htmlFor="trust-badge-asset"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Asset public ID
        </label>

        <input
          id="trust-badge-asset"
          name="assetPublicId"
          value={values.assetPublicId}
          onChange={(event) =>
            updateField("assetPublicId", event.currentTarget.value)
          }
          disabled={formDisabled}
          placeholder="Optional asset reference"
          className={inputClassName}
        />

        <p className="text-xs text-[var(--foreground-muted)]">
          Enter an existing asset public ID if the badge uses an asset.
        </p>
      </div>

      {/* Submission error */}
      {submitError && (
        <p
          role="alert"
          className="rounded-lg border border-[var(--danger)]/30 p-3 text-sm text-[var(--danger)]"
        >
          {submitError}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--border-subtle)] pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={formDisabled}
            className={[
              "min-h-10 rounded-md border border-[var(--border)] px-4",
              "text-sm font-medium text-[var(--foreground)]",
              "hover:bg-[var(--background-subtle)]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--brand)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            ].join(" ")}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={formDisabled}
          className={[
            "inline-flex min-h-10 items-center justify-center gap-2",
            "rounded-md border border-[var(--brand)] bg-[var(--brand)]",
            "px-4 text-sm font-medium text-[var(--brand-foreground)]",
            "hover:bg-[var(--brand-hover)]",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--brand)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          {isSubmitting && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            />
          )}

          {isSubmitting
            ? "Saving…"
            : submitLabel ??
              (isEditing ? "Save changes" : "Create badge")}
        </button>
      </div>
    </form>
  );
}

export default TrustBadgeForm;