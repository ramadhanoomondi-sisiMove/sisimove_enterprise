// -----------------------------------------------------------------------------
// sisiMove — Public Journey Discovery Tabs
// -----------------------------------------------------------------------------
//
// Accessible presentation tabs for public journey discovery.
//
// Responsibilities:
// - Present All / Journeys / Demand views.
// - Expose the selected discovery view.
// - Notify the parent when selection changes.
// - Display optional result counts.
// - Provide keyboard navigation.
// - Establish tab -> tab-panel relationships.
//
// The discovery object is the journey. Published journeys are publicly
// discoverable before authentication.
//
// The Demand view remains available as part of the broader public discovery
// surface, but it is not a traveller-profile discovery view.
//
// This component does not:
// - fetch data;
// - filter data;
// - perform routing;
// - own discovery state;
// - perform authentication;
// - perform bookings;
// - contain business rules.
//
// The parent discovery section owns those responsibilities.
//
// This is a Client Component because it contains interactive button event
// handlers and keyboard navigation.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Public Journey Discovery Feature
// -----------------------------------------------------------------------------

import type {
  PublicTravellerDiscoveryActivityFilter,
} from '@/features/traveller-discovery';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerDiscoveryTab =
  PublicTravellerDiscoveryActivityFilter;

export interface TravellerDiscoveryTabItem {
  /**
   * Unique tab value.
   */
  readonly value: TravellerDiscoveryTab;

  /**
   * Visible tab label.
   */
  readonly label: ReactNode;

  /**
   * Optional tab icon.
   */
  readonly icon?: ReactNode;

  /**
   * Optional result count.
   */
  readonly count?: number | null;

  /**
   * Whether the tab is disabled.
   */
  readonly disabled?: boolean;
}

export interface TravellerDiscoveryTabsProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | 'children'
    | 'onChange'
  > {
  /**
   * Currently selected discovery view.
   */
  readonly value: TravellerDiscoveryTab;

  /**
   * Called when the selected discovery view changes.
   */
  readonly onChange: (
    value: TravellerDiscoveryTab,
  ) => void;

  /**
   * Discovery views to display.
   */
  readonly tabs?: readonly TravellerDiscoveryTabItem[];

  /**
   * ID of the associated tab panel.
   *
   * The parent discovery section owns this ID.
   */
  readonly panelId?: string;

  /**
   * Stable prefix used when generating tab IDs.
   *
   * Defaults to panelId when available.
   */
  readonly idPrefix?: string;

  /**
   * Accessible label for the tablist.
   */
  readonly ariaLabel?: string;
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function CarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M5 17h14" />
      <path d="M6 17v1.5a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 10 18.5V17" />
      <path d="M14 17v1.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5V17" />
      <path d="M4 17v-5.2a2 2 0 0 1 1.45-1.92l1.05-.3 1.4-3.08A2 2 0 0 1 9.73 5.3h4.54a2 2 0 0 1 1.83 1.2l1.4 3.08 1.05.3A2 2 0 0 1 20 11.8V17" />
      <path d="M7.2 9.5h9.6" />
      <path d="M4 13h2" />
      <path d="M18 13h2" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
      />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15 5.5a3 3 0 0 1 0 5.8" />
      <path d="M16.5 13.5a5.5 5.5 0 0 1 4 5.5" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const defaultTabs:
  readonly TravellerDiscoveryTabItem[] = [
    {
      value: 'ALL',
      label: 'All',
    },
    {
      value: 'JOURNEYS',
      label: 'Journeys',
      icon: <CarIcon />,
    },
    {
      value: 'DEMANDS',
      label: 'Demand',
      icon: <PeopleIcon />,
    },
  ];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeCount(
  count: number | null | undefined,
): number | null {
  if (
    count === null ||
    count === undefined ||
    !Number.isFinite(count)
  ) {
    return null;
  }

  const normalized =
    Math.floor(count);

  return normalized >= 0
    ? normalized
    : null;
}

function getCountLabel(
  count: number,
): string {
  return count === 1
    ? '1 result'
    : `${count} results`;
}

function normalizeIdPart(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9_-]+/g,
      '-',
    )
    .replace(
      /^-+|-+$/g,
      '',
    );
}

function getTabId(
  prefix: string,
  value: TravellerDiscoveryTab,
): string {
  const normalizedPrefix =
    normalizeIdPart(prefix) ||
    'public-journey-discovery';

  return [
    normalizedPrefix,
    'tab',
    value.toLowerCase(),
  ].join('-');
}

function getSelectableIndexes(
  tabs:
    readonly TravellerDiscoveryTabItem[],
): number[] {
  const indexes: number[] = [];

  tabs.forEach(
    (tab, index) => {
      if (!tab.disabled) {
        indexes.push(index);
      }
    },
  );

  return indexes;
}

// -----------------------------------------------------------------------------
// Tab Button
// -----------------------------------------------------------------------------

interface DiscoveryTabButtonProps {
  readonly tab: TravellerDiscoveryTabItem;
  readonly selected: boolean;
  readonly tabId: string;
  readonly panelId?: string;
  readonly buttonRef: (
    element: HTMLButtonElement | null,
  ) => void;
  readonly onSelect: (
    value: TravellerDiscoveryTab,
  ) => void;
  readonly onKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    value: TravellerDiscoveryTab,
  ) => void;
}

function DiscoveryTabButton({
  tab,
  selected,
  tabId,
  panelId,
  buttonRef,
  onSelect,
  onKeyDown,
}: DiscoveryTabButtonProps) {
  const count =
    normalizeCount(tab.count);

  const countLabel =
    count !== null
      ? getCountLabel(count)
      : null;

  const countId =
    count !== null
      ? `${tabId}-count`
      : undefined;

  return (
    <button
      ref={buttonRef}
      id={tabId}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={panelId}
      aria-describedby={countId}
      disabled={tab.disabled}
      tabIndex={selected ? 0 : -1}
      onClick={() => {
        onSelect(tab.value);
      }}
      onKeyDown={(event) => {
        onKeyDown(
          event,
          tab.value,
        );
      }}
      className={cn(
        'relative',
        'inline-flex',
        'min-h-11',
        'shrink-0',
        'items-center',
        'justify-center',
        'gap-2',
        'px-3',
        'text-sm',
        'font-medium',
        'outline-none',
        'transition-colors',
        'duration-150',
        'ease-out',

        selected
          ? 'text-[var(--brand)]'
          : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]',

        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]/30',
        'focus-visible:ring-offset-2',

        'disabled:cursor-not-allowed',
        'disabled:opacity-50',

        'after:absolute',
        'after:inset-x-2',
        'after:bottom-[-1px]',
        'after:h-0.5',
        'after:rounded-full',
        'after:transition-colors',
        'after:duration-150',

        selected
          ? 'after:bg-[var(--brand)]'
          : 'after:bg-transparent',
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Icon                                                                */}
      {/* ------------------------------------------------------------------- */}

      {tab.icon && (
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex',
            'size-7',
            'shrink-0',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-sm)]',

            selected
              ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
              : 'bg-[var(--background-muted)] text-[var(--foreground-muted)]',
          )}
        >
          {tab.icon}
        </span>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Label                                                               */}
      {/* ------------------------------------------------------------------- */}

      <span className="whitespace-nowrap">
        {tab.label}
      </span>

      {/* ------------------------------------------------------------------- */}
      {/* Result Count                                                        */}
      {/* ------------------------------------------------------------------- */}

      {count !== null && (
        <span
          id={countId}
          className={cn(
            'inline-flex',
            'min-w-5',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-full)]',
            'px-1.5',
            'text-xs',
            'font-medium',

            selected
              ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
              : 'bg-[var(--background-muted)] text-[var(--foreground-muted)]',
          )}
        >
          <span aria-hidden="true">
            {count}
          </span>

          <span className="sr-only">
            {countLabel}
          </span>
        </span>
      )}
    </button>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerDiscoveryTabs({
  value,
  onChange,
  tabs = defaultTabs,
  panelId,
  idPrefix,
  ariaLabel = 'Public journey discovery',
  className,
  ...props
}: TravellerDiscoveryTabsProps) {
  const resolvedTabs =
    tabs.length > 0
      ? tabs
      : defaultTabs;

  const resolvedIdPrefix =
    idPrefix?.trim() ||
    panelId?.trim() ||
    'public-journey-discovery';

  const selectableIndexes =
    getSelectableIndexes(
      resolvedTabs,
    );

  const selectedIndex =
    resolvedTabs.findIndex(
      (tab) => tab.value === value,
    );

  const resolvedSelectedIndex =
    selectedIndex >= 0 &&
    !resolvedTabs[selectedIndex]?.disabled
      ? selectedIndex
      : selectableIndexes[0] ?? -1;

  const buttonRefs = useRef<
    Record<
      string,
      HTMLButtonElement | null
    >
  >({});

  function selectTab(
    nextIndex: number,
    shouldFocus = false,
  ): void {
    const nextTab =
      resolvedTabs[nextIndex];

    if (
      !nextTab ||
      nextTab.disabled
    ) {
      return;
    }

    onChange(nextTab.value);

    if (shouldFocus) {
      const nextTabId =
        getTabId(
          resolvedIdPrefix,
          nextTab.value,
        );

      requestAnimationFrame(() => {
        buttonRefs.current[
          nextTabId
        ]?.focus();
      });
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentValue: TravellerDiscoveryTab,
  ): void {
    if (
      selectableIndexes.length === 0
    ) {
      return;
    }

    const currentIndex =
      resolvedTabs.findIndex(
        (tab) =>
          tab.value === currentValue,
      );

    if (currentIndex < 0) {
      return;
    }

    const currentPosition =
      selectableIndexes.indexOf(
        currentIndex,
      );

    if (currentPosition < 0) {
      return;
    }

    let targetPosition:
      number | null = null;

    switch (event.key) {
      case 'ArrowRight':
        targetPosition =
          (
            currentPosition + 1
          ) %
          selectableIndexes.length;
        break;

      case 'ArrowLeft':
        targetPosition =
          (
            currentPosition - 1 +
            selectableIndexes.length
          ) %
          selectableIndexes.length;
        break;

      case 'Home':
        targetPosition = 0;
        break;

      case 'End':
        targetPosition =
          selectableIndexes.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    const targetIndex =
      selectableIndexes[
        targetPosition
      ];

    if (
      targetIndex === undefined
    ) {
      return;
    }

    selectTab(
      targetIndex,
      true,
    );
  }

  return (
    <div
      {...props}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex',
        'w-full',
        'items-center',
        'gap-1',
        'overflow-x-auto',
        'border-b',
        'border-[var(--border)]',
        className,
      )}
    >
      {resolvedTabs.map(
        (tab) => {
          const tabId =
            getTabId(
              resolvedIdPrefix,
              tab.value,
            );

          const selected =
            tab.value ===
            resolvedTabs[
              resolvedSelectedIndex
            ]?.value;

          return (
            <DiscoveryTabButton
              key={tab.value}
              tab={tab}
              selected={selected}
              tabId={tabId}
              panelId={panelId}
              buttonRef={(element) => {
                buttonRefs.current[
                  tabId
                ] = element;
              }}
              onSelect={onChange}
              onKeyDown={
                handleKeyDown
              }
            />
          );
        },
      )}
    </div>
  );
}