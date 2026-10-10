
 // -----------------------------------------------------------------------------
 // sisiMove — Journey Get Support Action
 // -----------------------------------------------------------------------------

import { LifeBuoy } from 'lucide-react';

import { Button } from '@/components/ui';

// =============================================================================
// Props
// =============================================================================

export interface JourneyGetSupportActionProps {
  /** Public identifier of the Journey requiring support. */
  journeyPublicId: string;

  /** Called when the member selects Get support. */
  onGetSupport: (journeyPublicId: string) => void;

  /** Optional styling hook for the action. */
  className?: string;

  /** Whether the action is currently unavailable. */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyGetSupportAction({
  journeyPublicId,
  onGetSupport,
  className,
  disabled = false,
}: JourneyGetSupportActionProps) {
  const isUnavailable = disabled || !journeyPublicId.trim();

  return (
    <span
      className="group relative inline-flex"
      title={
        isUnavailable
          ? 'Support is unavailable for this Journey'
          : 'Get help with this Journey'
      }
    >
      <Button
        type="button"
        variant="outline"
        size="md"
        disabled={isUnavailable}
        className={[
          'transition-all duration-200 ease-out',
          'hover:-translate-y-0.5',
          'hover:shadow-md',
          'active:translate-y-0',
          'active:scale-[0.98]',
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--brand)]',
          'focus-visible:ring-offset-2',
          'disabled:translate-y-0',
          'disabled:scale-100',
          'disabled:cursor-not-allowed',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        leadingIcon={
          <LifeBuoy
            aria-hidden="true"
            size={16}
            className="transition-transform duration-200 group-hover:rotate-[-8deg]"
          />
        }
        onClick={() => {
          if (!isUnavailable) {
            onGetSupport(journeyPublicId);
          }
        }}
      >
        Get support
      </Button>

      {/* Custom tooltip on hover and keyboard focus */}
      {!isUnavailable && (
        <span
          role="tooltip"
          className={[
            'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2',
            '-translate-x-1/2 translate-y-1 opacity-0',
            'whitespace-nowrap rounded-md',
            'bg-[var(--foreground)] px-3 py-1.5',
            'text-xs font-medium text-[var(--surface)]',
            'shadow-lg',
            'transition-all duration-200 ease-out',
            'group-hover:translate-y-0 group-hover:opacity-100',
            'group-focus-within:translate-y-0',
            'group-focus-within:opacity-100',
          ].join(' ')}
        >
          Get help with this Journey
          <span
            aria-hidden="true"
            className={[
              'absolute left-1/2 top-full -translate-x-1/2',
              'border-[5px] border-transparent',
              'border-t-[var(--foreground)]',
            ].join(' ')}
          />
        </span>
      )}
    </span>
  );
}

export default JourneyGetSupportAction;
