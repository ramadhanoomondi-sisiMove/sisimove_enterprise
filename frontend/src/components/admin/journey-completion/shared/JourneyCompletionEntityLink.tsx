
import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionEntityLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  href: string;
  publicId: string;
  label?: ReactNode;
  prefix?: string;
}

export function JourneyCompletionEntityLink({
  href,
  publicId,
  label,
  prefix,
  className,
  ...props
}: JourneyCompletionEntityLinkProps) {
  const normalizedId = publicId.trim();

  if (!normalizedId || !href.trim()) {
    return (
      <span className="text-sm text-[var(--foreground-muted)]">
        —
      </span>
    );
  }

  return (
    <Link
      {...props}
      href={href}
      title={normalizedId}
      className={cn(
        'inline-flex',
        'min-w-0',
        'items-center',
        'gap-1',
        'text-sm',
        'font-medium',
        'text-[var(--brand)]',
        'transition-colors',
        'hover:text-[var(--brand-hover)]',
        'hover:underline',
        'focus-visible:rounded-sm',
        className,
      )}
    >
      {prefix && (
        <span className="shrink-0 text-[var(--foreground-muted)]">
          {prefix}
        </span>
      )}

      <span className="truncate">
        {label ?? normalizedId}
      </span>
    </Link>
  );
}
