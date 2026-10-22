
"use client";

import type { TextareaHTMLAttributes } from "react";

// -----------------------------------------------------------------------------
// sisiMove — Trust Moderation Reason Field
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Collect a clear, auditable moderation reason.
// - Support controlled and disabled states.
// - Display optional validation feedback.
// - Associate labels and error messages accessibly.
//
// Non-responsibilities:
// - Submitting moderation commands.
// - Defining backend validation rules.
// - Deciding whether a moderation action is permitted.
// -----------------------------------------------------------------------------

export interface TrustModerationReasonFieldProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
}

export function TrustModerationReasonField({
  value,
  onChange,
  label = "Reason for moderation",
  description = "Explain why this action is being taken. The reason may be retained in the trust audit history.",
  error,
  required = true,
  maxLength,
  id,
  disabled = false,
  className,
  placeholder = "Enter a clear, factual reason…",
  ...textareaProps
}: TrustModerationReasonFieldProps) {
  const generatedId = id ?? "trust-moderation-reason";
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;

  const describedBy = [
    description ? descriptionId : undefined,
    error ? errorId : undefined,
    textareaProps["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={generatedId}
        className="block text-sm font-medium text-[var(--foreground)]"
      >
        {label}
        {required && (
          <span className="ml-1 text-[var(--danger)]" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="text-sm leading-5 text-[var(--foreground-secondary)]"
        >
          {description}
        </p>
      )}

      <textarea
        {...textareaProps}
        id={generatedId}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={[
          "min-h-28 w-full resize-y rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm leading-6 text-[var(--foreground)]",
          "placeholder:text-[var(--foreground-muted)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20",
          "disabled:cursor-not-allowed disabled:bg-[var(--background-muted)] disabled:opacity-60",
          error
            ? "border-[var(--danger)] focus:border-[var(--danger)]"
            : "border-[var(--border)] focus:border-[var(--brand)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      <div className="flex flex-wrap items-start justify-between gap-2">
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            {error}
          </p>
        ) : (
          <span />
        )}

        {typeof maxLength === "number" && (
          <p
            className="ml-auto text-xs tabular-nums text-[var(--foreground-muted)]"
            aria-live="polite"
          >
            {value.length} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

export default TrustModerationReasonField;
