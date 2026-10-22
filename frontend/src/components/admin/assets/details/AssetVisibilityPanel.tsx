
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { AssetModel } from '@/features/admin/assets/models';
import { cn } from '@/foundation/utils/cn';

export interface AssetVisibilityPanelProps {
  readonly asset: AssetModel;
  readonly className?: string;
}

export function AssetVisibilityPanel({
  asset,
  className,
}: AssetVisibilityPanelProps) {
  const isPublic = asset.visibility === 'PUBLIC';

  return (
    <section
      aria-labelledby="asset-visibility-title"
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2
          id="asset-visibility-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Visibility and access
        </h2>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Current visibility setting for this asset
        </p>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl',
              'bg-[var(--background-muted)] text-[var(--muted-foreground)]',
            )}
          >
            {isPublic ? (
              <Eye aria-hidden="true" className="size-5" />
            ) : (
              <EyeOff aria-hidden="true" className="size-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {isPublic ? 'Public asset' : 'Private asset'}
              </h3>

              <Badge variant={isPublic ? 'success' : 'outline'}>
                {asset.visibility}
              </Badge>
            </div>

            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
              {isPublic
                ? 'This asset is marked as public. Actual access still depends on the application’s serving rules.'
                : 'This asset is marked as private. Access should be controlled by the application’s authorization rules.'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--muted-foreground)]"
            />

            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)]">
                Access control
              </p>

              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                This panel reports the stored visibility value. It does not
                verify public accessibility, generate access links, or change
                permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AssetVisibilityPanel;
