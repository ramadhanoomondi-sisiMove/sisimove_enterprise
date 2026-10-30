'use client';

// ============================================================
// Financial Payments — Directory Header
// Responsibility:
// Present the directory title, description, and optional actions.
// ============================================================

import { ListFilter } from 'lucide-react';

import { PaymentSectionHeader } from '../layout/PaymentSectionHeader';

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface PaymentDirectoryHeaderProps {
  totalPayments?: number;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export function PaymentDirectoryHeader({
  totalPayments,
  description = 'Search, filter, and review financial payments.',
  actions,
  className,
}: PaymentDirectoryHeaderProps) {
  const title =
    totalPayments === undefined
      ? 'Payment directory'
      : `Payment directory (${totalPayments.toLocaleString()})`;

  return (
    <PaymentSectionHeader
      title={title}
      description={description}
      action={
        actions ?? (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ListFilter aria-hidden="true" className="size-4" />
            Payment records
          </span>
        )
      }
      className={className}
    />
  );
}