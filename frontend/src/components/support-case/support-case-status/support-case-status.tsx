// -----------------------------------------------------------------------------
// sisiMove — Support Case Status
// -----------------------------------------------------------------------------
//
// Domain-aware presentation of Support case lifecycle status.
//
// The component does not calculate lifecycle state. It only maps the backend
// status enum to member-facing presentation.
//
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui/badge';

import type { SupportCaseStatus as SupportCaseStatusValue } from '@/features/support-case/models';

export interface SupportCaseStatusProps {
  status: SupportCaseStatusValue;
}

const statusPresentation: Record<
  SupportCaseStatusValue,
  {
    label: string;
    variant: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  }
> = {
  OPEN: {
    label: 'Open',
    variant: 'brand',
  },
  IN_PROGRESS: {
    label: 'In progress',
    variant: 'brand',
  },
  WAITING_FOR_MEMBER: {
    label: 'Waiting for you',
    variant: 'warning',
  },
  WAITING_FOR_INTERNAL_ACTION: {
    label: 'In progress',
    variant: 'warning',
  },
  RESOLVED: {
    label: 'Resolved',
    variant: 'success',
  },
  CLOSED: {
    label: 'Closed',
    variant: 'default',
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'danger',
  },
};

export function SupportCaseStatus({
  status,
}: SupportCaseStatusProps) {
  const presentation = statusPresentation[status];

  return (
    <Badge
      variant={presentation.variant}
      size="sm"
    >
      {presentation.label}
    </Badge>
  );
}