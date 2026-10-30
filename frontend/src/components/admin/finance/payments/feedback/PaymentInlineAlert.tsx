"use client";

import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/foundation/utils/cn";

export type PaymentInlineAlertVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

export interface PaymentInlineAlertProps {
  variant: PaymentInlineAlertVariant;
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const alertStyles: Record<
  PaymentInlineAlertVariant,
  {
    container: string;
    icon: typeof Info;
  }
> = {
  success: {
    container: "border-[var(--success)]/25 bg-[var(--success-soft)] text-[var(--success)]",
    icon: CheckCircle2,
  },
  error: {
    container: "border-[var(--danger)]/25 bg-[var(--danger-soft)] text-[var(--danger)]",
    icon: AlertCircle,
  },
  warning: {
    container: "border-[var(--warning)]/25 bg-[var(--warning-soft)] text-[var(--warning)]",
    icon: TriangleAlert,
  },
  info: {
    container: "border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]",
    icon: Info,
  },
};

export function PaymentInlineAlert({
  variant,
  title,
  message,
  onDismiss,
  className,
}: PaymentInlineAlertProps) {
  const style = alertStyles[variant];
  const Icon = style.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius-lg)] border p-4",
        style.container,
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />

      <div className="min-w-0 flex-1">
        {title ? (
          <p className="text-sm font-semibold">{title}</p>
        ) : null}

        <p className={cn("text-sm", title && "mt-1")}>{message}</p>
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="rounded-md p-1 transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
