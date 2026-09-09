// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Section
// -----------------------------------------------------------------------------
//
// Top-level presentation component for public traveller discovery.
//
// Responsibilities:
// - Compose the discovery header.
// - Compose the discovery tabs.
// - Establish the tab -> tab-panel relationship.
// - Render loading, error, empty, and successful states.
// - Delegate activity rendering to TravellerActivityList.
//
// This component does NOT:
// - fetch data;
// - own API clients;
// - perform routing;
// - apply business rules;
// - manage authentication;
// - own discovery request state.
//
// The parent/container owns discovery data and state.
//
// Although this component is presentation-only, it is a Client Component
// because it composes the interactive TravellerDiscoveryTabs component and
// accepts its callback from the client-side discovery composition boundary.
//
// -----------------------------------------------------------------------------

'use client';

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../../foundation/utils/cn';

import { DiscoveryErrorState } from './discovery-error-state';
import { DiscoveryLoadingState } from './discovery-loading-state';

import {
  TravellerActivityList,
  type TravellerActivityListItem,
} from './traveller-activity-list';

import {
  TravellerDiscoveryHeader,
} from './traveller-discovery-header';

import {
  TravellerDiscoveryTabs,
  type TravellerDiscoveryTab,
  type TravellerDiscoveryTabItem,
} from './traveller-discovery-tabs';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerDiscoveryStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export interface TravellerDiscoverySectionProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'children'
  > {
  /**
   * Current discovery presentation state.
   */
  readonly status?: TravellerDiscoveryStatus;

  /**
   * Activities currently visible in discovery.
   */
  readonly items?: readonly TravellerActivityListItem[];

  /**
   * Currently selected discovery tab.
   */
  readonly tab?: TravellerDiscoveryTab;

  /**
   * Called when the selected discovery tab changes.
   */
  readonly onTabChange?: (
    tab: TravellerDiscoveryTab,
  ) => void;

  /**
   * Optional tab definitions.
   */
  readonly tabs?: readonly TravellerDiscoveryTabItem[];

  /**
   * Optional complete replacement for the discovery header.
   */
  readonly headerContent?: ReactNode;

  /**
   * Optional content rendered between the header and result panel.
   *
   * Useful for search summaries or filters.
   */
  readonly topContent?: ReactNode;

  /**
   * Optional custom loading content.
   */
  readonly loadingContent?: ReactNode;

  /**
   * Optional custom error content.
   */
  readonly errorContent?: ReactNode;

  /**
   * Optional custom empty content.
   */
  readonly emptyContent?: ReactNode;

  /**
   * Optional content displayed alongside the header.
   */
  readonly headerTrailingContent?: ReactNode;

  /**
   * Optional description for the default header.
   */
  readonly description?: ReactNode;

  /**
   * ID of the section heading.
   */
  readonly headingId?: string;

  /**
   * ID of the discovery section.
   *
   * Used by public navigation such as:
   * /#travellers
   */
  readonly sectionId?: string;

  /**
   * ID of the tab panel.
   */
  readonly panelId?: string;

  /**
   * Number of columns used by the activity list.
   */
  readonly columns?: 1 | 2 | 3;

  /**
   * Number of cards displayed during loading.
   */
  readonly loadingCount?: number;

  /**
   * Whether discovery tabs should be rendered.
   */
  readonly showTabs?: boolean;

  /**
   * Whether the activity list should display its empty state.
   */
  readonly showEmptyState?: boolean;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_SECTION_ID =
  'travellers';

const DEFAULT_HEADING_ID =
  'traveller-discovery-heading';

const DEFAULT_PANEL_ID =
  'traveller-discovery-panel';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getTabId(
  panelId: string,
  value: TravellerDiscoveryTab,
): string {
  return `${panelId}-tab-${value.toLowerCase()}`;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerDiscoverySection({
  status = 'success',
  items = [],
  tab = 'ALL',
  onTabChange,
  tabs,
  headerContent,
  topContent,
  loadingContent,
  errorContent,
  emptyContent,
  headerTrailingContent,
  description,
  sectionId = DEFAULT_SECTION_ID,
  headingId = DEFAULT_HEADING_ID,
  panelId = DEFAULT_PANEL_ID,
  columns = 3,
  loadingCount = 3,
  showTabs = true,
  showEmptyState = true,
  className,
  ...props
}: TravellerDiscoverySectionProps) {
  const resolvedTabs =
    tabs && tabs.length > 0
      ? tabs
      : undefined;

  const selectedTab =
    resolvedTabs?.find(
      (item) => item.value === tab,
    );

  const selectedTabId =
    showTabs && selectedTab
      ? getTabId(
          panelId,
          selectedTab.value,
        )
      : undefined;

  return (
    <section
      id={sectionId}
      {...props}
      aria-labelledby={headingId}
      className={cn(
        'section',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Discovery header                                                    */}
      {/* ------------------------------------------------------------------- */}

      {headerContent ?? (
        <TravellerDiscoveryHeader
          eyebrow="PEOPLE TRAVELLING YOUR WAY"
          title="Discover people sharing journeys and looking for one."
          description={description}
          trailingContent={
            headerTrailingContent
          }
          headingId={headingId}
          bottomContent={
            showTabs ? (
              <TravellerDiscoveryTabs
                value={tab}
                onChange={
                  onTabChange ??
                  (() => undefined)
                }
                tabs={tabs}
                panelId={panelId}
                idPrefix={panelId}
              />
            ) : undefined
          }
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Supporting content                                                  */}
      {/* ------------------------------------------------------------------- */}

      {topContent && (
        <div className="mt-6">
          {topContent}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Tab panel / discovery results                                       */}
      {/* ------------------------------------------------------------------- */}

      <div
        id={panelId}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={
          selectedTabId ??
          headingId
        }
        aria-busy={
          status === 'loading'
            ? true
            : undefined
        }
        className={cn(
          'mt-8',
          'rounded-[var(--radius-lg)]',
          'outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--brand)]/30',
          'focus-visible:ring-offset-2',
        )}
      >
        {status === 'loading' && (
          loadingContent ?? (
            <DiscoveryLoadingState
              count={loadingCount}
            />
          )
        )}

        {status === 'error' && (
          errorContent ?? (
            <DiscoveryErrorState />
          )
        )}

        {(status === 'idle' ||
          status === 'success') && (
          <TravellerActivityList
            items={items}
            emptyState={emptyContent}
            showEmptyState={
              showEmptyState
            }
            columns={columns}
          />
        )}
      </div>
    </section>
  );
}