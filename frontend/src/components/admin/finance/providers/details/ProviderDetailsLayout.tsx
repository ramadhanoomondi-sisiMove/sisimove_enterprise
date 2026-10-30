
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

import type { AdminProvider } from '@/features/admin/finance/providers';

import { ProviderIdentityPanel } from './ProviderIdentityPanel';
import { ProviderInformationPanel } from './ProviderInformationPanel';
import { ProviderIntegrationPanel } from './ProviderIntegrationPanel';
import { ProviderEnvironmentPanel } from './ProviderEnvironmentPanel';
import { ProviderConfigurationPanel } from './ProviderConfigurationPanel';
import { ProviderCapabilitiesPanel } from './ProviderCapabilitiesPanel';
import { ProviderLifecyclePanel } from './ProviderLifecyclePanel';
import { ProviderAuditInformation } from './ProviderAuditInformation';

export interface ProviderDetailsLayoutProps {
  provider: AdminProvider;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
}

export function ProviderDetailsLayout({
  provider,
  onBack,
  actions,
  className,
}: ProviderDetailsLayoutProps) {
  return (
    <section className={cn('space-y-6', className)}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--brand)]">
            Finance administration
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Payment provider details
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[var(--foreground-secondary)]">
            Review provider identity, integration, environment,
            capabilities, lifecycle and audit information.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              leadingIcon={
                <ArrowLeft size={16} aria-hidden="true" />
              }
            >
              Back to payment providers
            </Button>
          )}

          {actions}
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Provider code
          </span>

          <span className="font-mono text-sm font-semibold text-foreground">
            {provider.code}
          </span>
        </div>

        <span
          className="hidden h-4 w-px bg-[var(--border)] sm:block"
          aria-hidden="true"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Public ID
          </span>

          <span className="font-mono text-xs text-foreground">
            {provider.publicId}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <ProviderIdentityPanel provider={provider} />

        <ProviderInformationPanel provider={provider} />

        <ProviderIntegrationPanel provider={provider} />

        <ProviderEnvironmentPanel provider={provider} />

        <ProviderConfigurationPanel provider={provider} />

        <ProviderCapabilitiesPanel provider={provider} />

        <ProviderLifecyclePanel provider={provider} />

        <ProviderAuditInformation provider={provider} />
      </div>
    </section>
  );
}

export default ProviderDetailsLayout;
