// -----------------------------------------------------------------------------
// sisiMove — Support Case Priority
// -----------------------------------------------------------------------------
//
// Domain-aware presentation of Support case priority.
//
// Priority is displayed as metadata. This component does not allow members to
// change priority and does not make any claim about operational handling.
//
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui/badge';

import type { SupportCasePriority as SupportCasePriorityValue } from '@/features/support-case/models';

export interface SupportCasePriorityProps {
  priority: SupportCasePriorityValue;
}

const priorityPresentation: Record<
  SupportCasePriorityValue,
  {
    label: string;
    variant: 'default' | 'brand' | 'warning' | 'danger';
  }
> = {
  LOW: {
    label: 'Low priority',
    variant: 'default',
  },
  NORMAL: {
    label: 'Normal priority',
    variant: 'brand',
  },
  HIGH: {
    label: 'High priority',
    variant: 'warning',
  },
  URGENT: {
    label: 'Urgent',
    variant: 'danger',
  },
};

export function SupportCasePriority({
  priority,
}: SupportCasePriorityProps) {
  const presentation = priorityPresentation[priority];

  return (
    <Badge
      variant={presentation.variant}
      size="sm"
    >
      {presentation.label}
    </Badge>
  );
}