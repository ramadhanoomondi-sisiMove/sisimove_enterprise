
import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProvider } from '@/features/admin/finance/providers';
import {
  ADMIN_PROVIDER_STATUSES,
  type AdminProviderStatus,
} from '@/features/admin/finance/providers';
import { ProviderStatusBadge } from '../shared';
import { ProviderSectionHeader } from '../layout';

export interface ProviderLifecyclePanelProps {
  provider: AdminProvider;
  className?: string;
}

function isAdminProviderStatus(
  status: string,
): status is AdminProviderStatus {
  return (ADMIN_PROVIDER_STATUSES as readonly string[]).includes(status);
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || 'Not available';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function ProviderLifecyclePanel({
  provider,
  className,
}: ProviderLifecyclePanelProps) {
  const isValidStatus = isAdminProviderStatus(provider.status);

  return (
    <Card padding="lg" className={cn('space-y-5', className)}>
      <ProviderSectionHeader
        title="Provider Lifecycle"
        description="Current lifecycle status and record history."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Lifecycle status
          </p>

          {isValidStatus ? (
            <ProviderStatusBadge status={provider.status} />
          ) : (
            <span className="inline-flex w-fit rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {provider.status || 'Unknown'}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Created
          </p>
          <p className="text-sm text-foreground">
            {formatDate(provider.createdAt)}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Last updated
          </p>
          <p className="text-sm text-foreground">
            {formatDate(provider.updatedAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}
