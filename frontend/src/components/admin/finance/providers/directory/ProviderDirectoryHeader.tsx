
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui';
import { ProviderSectionHeader } from '../layout';

export interface ProviderDirectoryHeaderProps {
  onCreate?: () => void;
  className?: string;
}

export function ProviderDirectoryHeader({
  onCreate,
  className,
}: ProviderDirectoryHeaderProps) {
  return (
    <div className={className ?? 'space-y-4'}>
      <ProviderSectionHeader
        title="Provider Directory"
        description="Manage, search, and monitor your financial payment providers."
        actions={
          onCreate ? (
            <Button onClick={onCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
