// -----------------------------------------------------------------------------
// sisiMove — Public Journey Discovery Section
// -----------------------------------------------------------------------------
//
// Top-level presentation component for public journey discovery.
//
// The journey is the primary discovery object.
//
// Visitors can discover published journeys before authentication. The journey
// establishes the public traveller, vehicle, route, availability, pricing, and
// other information that may be displayed.
//
// Journey Demand remains a secondary public discovery stream and is presented
// through the existing discovery tabs. It does not establish a separate
// discovery system.
//
// Responsibilities:
// - Compose the public journey discovery header.
// - Compose the discovery tabs.
// - Establish the tab -> tab-panel relationship.
// - Render loading, error, empty, and successful states.
// - Delegate result rendering to TravellerActivityList.
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
// Component names and existing feature boundaries are intentionally retained
// to avoid unnecessary file churn while public discovery terminology is being
// aligned around journeys.
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
   * Current public discovery presentation state.
   */
  readonly status?: TravellerDiscoveryStatus;

  /**
   * Already-resolved public discovery results currently visible.
   *
   * The existing TravellerActivityList item contract is retained so this
   * section remains a presentation boundary and does not require additional
   * result-specific component files.
   */
  readonly items?: readonly TravellerActivityListItem[];

  /**
   * Currently selected public discovery tab.
   */
  readonly tab?: TravellerDiscoveryTab;

  /**
   * Called when the selected public discovery tab changes.
   */
  readonly onTabChange?: (
    tab: TravellerDiscoveryTab,
  ) => void;

  /**
   * Optional public discovery tab definitions.
   *
   * When omitted, TravellerDiscoveryTabs supplies its own default tabs.
   */
  readonly tabs?: readonly TravellerDiscoveryTabItem[];

  /**
   * Optional complete replacement for the discovery header.
   */
  readonly headerContent?: ReactNode;

  /**
   * Optional content rendered between the header and result panel.
   *
   * Useful for search summaries or filters when those concerns are introduced
   * by a parent composition boundary.
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
   * ID of the public journey discovery section.
   *
   * Used by public navigation such as:
   *
   * /#journeys
   */
  readonly sectionId?: string;

  /**
   * ID of the discovery result panel.
   */
  readonly panelId?: string;

  /**
   * Number of columns used by the discovery result list.
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
   * Whether the result list should display its empty state.
   */
  readonly showEmptyState?: boolean;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_SECTION_ID =
  'journeys';

const DEFAULT_HEADING_ID =
  'public-journey-discovery-heading';

const DEFAULT_PANEL_ID =
  'public-journey-discovery-panel';

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
  const selectedTab =
    tabs?.find(
      (item) => item.value === tab,
    );

  /*
   * TravellerDiscoveryTabs has default tab definitions when `tabs` is not
   * supplied. Therefore the panel relationship must not depend on `tabs`
   * being explicitly provided to this component.
   */
  const selectedTabId =
    showTabs
      ? getTabId(
          panelId,
          selectedTab?.value ?? tab,
        )
      : undefined;

  const panelRole =
    showTabs
      ? 'tabpanel'
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
      {/* Public journey discovery header                                    */}
      {/* ------------------------------------------------------------------- */}

      {headerContent ?? (
        <TravellerDiscoveryHeader
          eyebrow="PUBLISHED JOURNEYS"
          title="Find a journey that matches your plans."
          description={
            description ??
            'Explore published journeys, see the public journey details, and choose the one that works for you.'
          }
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
      {/* Public discovery results                                            */}
      {/* ------------------------------------------------------------------- */}

   <div id={panelId} role={panelRole} tabIndex={ showTabs ? 0 : undefined } aria-labelledby={ selectedTabId ?? undefined } aria-busy={ status === 'loading' ? true : undefined } className={cn( 'mt-8', 'rounded-[var(--radius-lg)]', 'outline-none', showTabs ? 'focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30 focus-visible:ring-offset-2' : false, )}
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