
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Page Container
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Provide consistent page width and responsive horizontal padding.
 * - Maintain consistent vertical spacing between page sections.
 * - Reuse the shared design-system Container.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { Container } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodPageContainerProps {
  children: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodPageContainer({
  children,
  className,
}: PaymentMethodPageContainerProps) {
  return (
    <Container
      size="full"
      className={cn('space-y-6 py-6', className)}
    >
      {children}
    </Container>
  );
}

export default PaymentMethodPageContainer;
