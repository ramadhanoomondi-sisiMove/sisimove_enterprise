// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Page Container
// -----------------------------------------------------------------------------
//
// Shared page frame for the financial-account control center.
// Uses the existing design tokens and Container primitive.
// -----------------------------------------------------------------------------

import type { HTMLAttributes, ReactNode } from 'react';
import { Container } from '@/components/ui';

export interface FinancialAccountPageContainerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padded?: boolean;
}

export function FinancialAccountPageContainer({
  children,
  size = '2xl',
  padded = true,
  className,
  ...props
}: FinancialAccountPageContainerProps) {
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

export default FinancialAccountPageContainer;
