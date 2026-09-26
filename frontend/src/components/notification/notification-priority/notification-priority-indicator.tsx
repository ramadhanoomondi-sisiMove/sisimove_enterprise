'use client';

// -----------------------------------------------------------------------------
// sisiMove — Notification Priority Indicator
// -----------------------------------------------------------------------------
//
// Compact presentation of notification priority.
//
// Priority is descriptive metadata. It does not determine notification
// lifecycle state or unread state.
//
// -----------------------------------------------------------------------------

import type { Notification } from '@/features/notification/models';

import { Badge } from '@/components/ui';

import { cn } from '@/foundation/utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationPriorityIndicatorProps {
  /**
   * Notification priority supplied by the backend.
   */
  priority: Notification['priority'];

  /**
   * Optional additional classes.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Label
// -----------------------------------------------------------------------------

function getPriorityLabel(
  priority: Notification['priority'],
): string {
  switch (priority) {
    case 'LOW':
      return 'Low priority';

    case 'NORMAL':
      return 'Normal priority';

    case 'HIGH':
      return 'High priority';

    case 'CRITICAL':
      return 'Critical priority';

    default:
      return priority;
  }
}

// -----------------------------------------------------------------------------
// Variant
// -----------------------------------------------------------------------------

function getPriorityVariant(
  priority: Notification['priority'],
): 'default' | 'brand' | 'warning' | 'danger' {
  switch (priority) {
    case 'LOW':
      return 'default';

    case 'NORMAL':
      return 'brand';

    case 'HIGH':
      return 'warning';

    case 'CRITICAL':
      return 'danger';

    default:
      return 'default';
  }
}

// -----------------------------------------------------------------------------
// Notification Priority Indicator
// -----------------------------------------------------------------------------

export function NotificationPriorityIndicator({
  priority,
  className,
}: NotificationPriorityIndicatorProps) {
  return (
    <Badge
      variant={getPriorityVariant(priority)}
      size="sm"
      className={cn(className)}
    >
      {getPriorityLabel(priority)}
    </Badge>
  );
}