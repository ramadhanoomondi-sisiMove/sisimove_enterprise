
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Page Container
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Provide a semantic main region for asset pages.
 * - Reuse the shared design-system Container for responsive width and padding.
 * - Apply consistent vertical page spacing.
 * - Allow page-level layout customization.
 *
 * -----------------------------------------------------------------------------
 */

import type { HTMLAttributes, ReactNode } from 'react';

import { Container } from '@/components/ui/container';
import type { ContainerSize } from '@/components/ui/container';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export interface AssetPageContainerProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  readonly children: ReactNode;
  readonly width?: ContainerSize;
  readonly padded?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function AssetPageContainer({
  children,
  width = '2xl',
  padded = true,
  className,
  ...props
}: AssetPageContainerProps) {
  return (
    <main
      {...props}
      className={cn('min-h-screen py-6 sm:py-8', className)}
    >
      <Container size={width} padded={padded}>
        {children}
      </Container>
    </main>
  );
}

export default AssetPageContainer;
