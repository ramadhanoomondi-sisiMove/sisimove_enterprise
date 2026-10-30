import { AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/foundation/utils/cn";

export interface PaymentOperationConfirmationProps {
  title: string;
  message: string;
  paymentPublicId?: string;
  consequence?: string;
  destructive?: boolean;
  className?: string;
}

export function PaymentOperationConfirmation({
  title,
  message,
  paymentPublicId,
  consequence,
  destructive = false,
  className,
}: PaymentOperationConfirmationProps) {
  const Icon = destructive ? AlertTriangle : ShieldCheck;

  return (
    <section
      className={cn(
        "rounded-[var(--radius-lg)] border p-4",
        destructive
          ? "border-[var(--danger)]/25 bg-[var(--danger-soft)]"
          : "border-[var(--border)] bg-[var(--background-subtle)]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden="true"
          className={cn(
            "mt-0.5 size-5 shrink-0",
            destructive
              ? "text-[var(--danger)]"
              : "text-[var(--foreground-secondary)]",
          )}
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            {message}
          </p>

          {paymentPublicId ? (
            <p className="mt-3 break-all text-xs text-[var(--foreground-muted)]">
              Payment ID:{" "}
              <span className="font-mono">{paymentPublicId}</span>
            </p>
          ) : null}

          {consequence ? (
            <p
              className={cn(
                "mt-3 text-sm font-medium",
                destructive
                  ? "text-[var(--danger)]"
                  : "text-[var(--foreground-secondary)]",
              )}
            >
              {consequence}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
