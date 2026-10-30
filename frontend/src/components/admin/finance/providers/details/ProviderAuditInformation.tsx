import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { AdminProvider } from '@/features/admin/finance/providers';
import { ProviderSectionHeader } from '../layout';

export interface ProviderAuditInformationProps {
  provider: AdminProvider;
  className?: string;
}

function formatAuditDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || 'Not available';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(date);
}

function AuditField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="break-all text-sm text-foreground">{value}</p>
    </div>
  );
}

export function ProviderAuditInformation({
  provider,
  className,
}: ProviderAuditInformationProps) {
  return (
    <Card padding="lg" className={cn('space-y-5', className)}>
      <ProviderSectionHeader
        title="Audit Information"
        description="Record identifiers and timestamps for administrative reference."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <AuditField
          label="Provider public ID"
          value={provider.publicId}
        />

        <AuditField
          label="Provider code"
          value={provider.code}
        />

        <AuditField
          label="Created at"
          value={formatAuditDate(provider.createdAt)}
        />

        <AuditField
          label="Last updated at"
          value={formatAuditDate(provider.updatedAt)}
        />
      </div>
    </Card>
  );
}