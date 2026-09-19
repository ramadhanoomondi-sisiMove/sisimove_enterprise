// -----------------------------------------------------------------------------
// sisiMove — My Journeys Presentation Exports
// -----------------------------------------------------------------------------
//
// Public export boundary for the authenticated My Journeys presentation layer.
//
// Consumers outside this directory should import My Journeys components from
// this barrel rather than reaching into individual implementation files.
//
// Example:
//
//     import {
//       MyJourneysPage,
//       MyJourneysResults,
//     } from '@/components/authenticated/my-journeys';
//
// -----------------------------------------------------------------------------

export { MyJourneysPage } from './my-journeys-page';

export {
  MyJourneysHeader,
} from './my-journeys-header';

export {
  MyJourneysResults,
} from './my-journeys-results';

export {
  MyJourneysEmptyState,
} from './my-journeys-empty-state';

export {
  MyJourneysLoadingState,
} from './my-journeys-loading-state';

export {
  MyJourneysErrorState,
} from './my-journeys-error-state';

export {
  MyJourneyCard,
} from './my-journey-card';

// -----------------------------------------------------------------------------
// Public prop types
// -----------------------------------------------------------------------------

export type {
  MyJourneysHeaderProps,
} from './my-journeys-header';

export type {
  MyJourneysResultsProps,
} from './my-journeys-results';

export type {
  MyJourneysEmptyStateProps,
} from './my-journeys-empty-state';

export type {
  MyJourneysErrorStateProps,
} from './my-journeys-error-state';

export type {
  MyJourneyCardProps,
} from './my-journey-card';