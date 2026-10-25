import { AdminAccountHoldStatus } from '../models/admin-account-hold.enums';

export type AdminAccountHoldStatusPresentation = {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'neutral';
};

const STATUS_PRESENTATION: Record<
  AdminAccountHoldStatus,
  AdminAccountHoldStatusPresentation
> = {
  [AdminAccountHoldStatus.ACTIVE]: {
    label: 'Active',
    variant: 'warning',
  },
  [AdminAccountHoldStatus.RELEASED]: {
    label: 'Released',
    variant: 'success',
  },
  [AdminAccountHoldStatus.CAPTURED]: {
    label: 'Captured',
    variant: 'success',
  },
  [AdminAccountHoldStatus.CANCELLED]: {
    label: 'Cancelled',
    variant: 'neutral',
  },
};

export function getAdminAccountHoldStatusPresentation(
  status: AdminAccountHoldStatus | string,
): AdminAccountHoldStatusPresentation {
  if (status in STATUS_PRESENTATION) {
    return STATUS_PRESENTATION[
      status as AdminAccountHoldStatus
    ];
  }

  return {
    label: status || 'Unknown',
    variant: 'neutral',
  };
}

export function isAdminAccountHoldTerminalStatus(
  status: AdminAccountHoldStatus | string,
): boolean {
  return (
    status === AdminAccountHoldStatus.RELEASED ||
    status === AdminAccountHoldStatus.CAPTURED ||
    status === AdminAccountHoldStatus.CANCELLED
  );
}

export function canAdminAccountHoldPerformOperation(
  status: AdminAccountHoldStatus | string,
): boolean {
  return status === AdminAccountHoldStatus.ACTIVE;
}