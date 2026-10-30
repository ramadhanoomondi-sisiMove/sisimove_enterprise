"use client";

import { PaymentInlineAlert } from "../feedback/PaymentInlineAlert";
import type { PaymentInlineAlertVariant } from "../feedback/PaymentInlineAlert";
import { cn } from "@/foundation/utils/cn";

export interface PaymentOperationFeedbackProps {
  status: PaymentInlineAlertVariant;
  message: string;
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

export function PaymentOperationFeedback({
  status,
  message,
  title,
  onDismiss,
  className,
}: PaymentOperationFeedbackProps) {
  return (
    <PaymentInlineAlert
      variant={status}
      title={title}
      message={message}
      onDismiss={onDismiss}
      className={cn("w-full", className)}
    />
  );
}