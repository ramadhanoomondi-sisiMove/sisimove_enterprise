// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Page Container
// -----------------------------------------------------------------------------
//
// Shared page frame for the financial-payments feature.
// Reuses the existing design-system Container primitive.
// -----------------------------------------------------------------------------

import type { HTMLAttributes, ReactNode } from 'react';
import { Container } from '@/components/ui';

export interface PaymentPageContainerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padded?: boolean;
}

export function PaymentPageContainer({
  children,
  size = '2xl',
  padded = true,
  className,
  ...props
}: PaymentPageContainerProps) {
  return (
    <div
      className="min-h-full bg-[var(--background)]"
      {...props}
    >
      <Container
        size={size}
        padded={padded}
        className={className}
      >
        {children}
      </Container>
    </div>
  );
}

export default PaymentPageContainer;