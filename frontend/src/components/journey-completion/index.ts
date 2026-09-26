// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Components
// -----------------------------------------------------------------------------
//
// Feature-level component barrel.
//
// This file exposes the public component surface of the Journey Completion
// feature while keeping individual component-directory structure internal.
//
// Pages and other feature consumers should import from this barrel rather
// than reaching into individual component implementation paths.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Completion status
// -----------------------------------------------------------------------------

export {
  JourneyCompletionStatusBadge,
  type JourneyCompletionStatusBadgeProps,
} from './completion-status';

// -----------------------------------------------------------------------------
// Completion header
// -----------------------------------------------------------------------------

export {
  JourneyCompletionHeader,
  type JourneyCompletionHeaderProps,
} from './completion-header';

// -----------------------------------------------------------------------------
// Completion progress
// -----------------------------------------------------------------------------

export {
  JourneyCompletionProgress,
  type JourneyCompletionProgressProps,
} from './completion-progress';

// -----------------------------------------------------------------------------
// Completion confirmations
// -----------------------------------------------------------------------------

export {
  JourneyCompletionConfirmations,
  type JourneyCompletionConfirmationsProps,
} from './completion-confirmations';

export {
  JourneyCompletionConfirmation,
  type JourneyCompletionConfirmationProps,
} from './completion-confirmation';

// -----------------------------------------------------------------------------
// Completion actions
// -----------------------------------------------------------------------------

export {
  JourneyCompletionActions,
  type JourneyCompletionActionsProps,
  RequestCompletionAction,
  type RequestCompletionActionProps,
  ConfirmCompletionAction,
  type ConfirmCompletionActionProps,
  CancelCompletionAction,
  type CancelCompletionActionProps,
} from './completion-actions';

// -----------------------------------------------------------------------------
// Confirmation actions
// -----------------------------------------------------------------------------

export {
  WithdrawConfirmationAction,
  type WithdrawConfirmationActionProps,
} from './completion-confirmation-actions';

// -----------------------------------------------------------------------------
// Completion disputes
// -----------------------------------------------------------------------------

export {
  JourneyCompletionDisputes,
  type JourneyCompletionDisputesProps,
  JourneyCompletionDispute,
  type JourneyCompletionDisputeProps,
} from './completion-disputes';

// -----------------------------------------------------------------------------
// Completion dispute actions
// -----------------------------------------------------------------------------

export {
  ReportCompletionProblemAction,
  type ReportCompletionProblemActionProps,
  WithdrawCompletionDisputeAction,
  type WithdrawCompletionDisputeActionProps,
} from './completion-dispute-actions';

// -----------------------------------------------------------------------------
// Report-problem dialog
// -----------------------------------------------------------------------------

export {
  ReportCompletionProblemDialog,
  type ReportCompletionProblemDialogProps,
} from './report-problem';

// -----------------------------------------------------------------------------
// Completion settlement
// -----------------------------------------------------------------------------

export {
  JourneyCompletionSettlement,
  type JourneyCompletionSettlementProps,
  JourneyCompletionSettlementStatus,
  type JourneyCompletionSettlementStatusProps,
} from './completion-settlement';

// -----------------------------------------------------------------------------
// Completion card
// -----------------------------------------------------------------------------

export {
  JourneyCompletionCard,
  type JourneyCompletionCardProps,
} from './completion-card';