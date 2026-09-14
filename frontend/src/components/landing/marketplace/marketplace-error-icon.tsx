// -----------------------------------------------------------------------------
// sisiMove — Marketplace Error Icon
// -----------------------------------------------------------------------------
//
// Reusable visual indicator for marketplace error states.
//
// Responsibilities:
//
// - provide a consistent visual treatment for marketplace errors;
// - remain presentation-only;
// - support optional layout customization through className.
//
// This component does not:
//
// - contain marketplace logic;
// - manage error state;
// - perform requests;
// - handle retry behaviour;
// - depend on the marketplace error-state component.
//
// The icon is decorative. The surrounding error component provides the
// meaningful error title and description for both visual and assistive users.
// -----------------------------------------------------------------------------

export interface MarketplaceErrorIconProps {
  /**
   * Optional additional CSS classes.
   */
  className?: string;
}

export function MarketplaceErrorIcon({
  className,
}: MarketplaceErrorIconProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'flex size-12 shrink-0 items-center justify-center rounded-full',
        'border border-[var(--border)]',
        'bg-[var(--background-secondary)]',
        'text-[var(--foreground-muted)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M12 8v4" />
        <path d="M12 16h0.01" />
        <path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
    </div>
  );
}

