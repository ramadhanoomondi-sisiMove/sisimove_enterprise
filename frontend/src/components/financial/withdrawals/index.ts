// -----------------------------------------------------------------------------
// sisiMove — Financial Withdrawals
// -----------------------------------------------------------------------------
//
// Public presentation exports for the authenticated withdrawal experience.
//
// This barrel intentionally exports:
// - withdrawal form;
// - withdrawal summary;
// - withdrawal processing state;
// - withdrawal result state;
// - withdrawal history;
// - withdrawal history item.
//
// Withdrawal destinations are NOT exported because saved withdrawal
// destinations are no longer part of the sisiMove product model.
//
// -----------------------------------------------------------------------------

export {
  WithdrawalForm,
  type WithdrawalFormProps,
  type WithdrawalDestinationMode,
  type WithdrawalDestinationType,
  type WithdrawalDestinationTypeOption,
} from './withdrawal-form';

export {
  WithdrawalSummary,
  type WithdrawalSummaryProps,
} from './withdrawal-summary';

export {
  WithdrawalProcessing,
  type WithdrawalProcessingProps,
  type WithdrawalProcessingStatus,
} from './withdrawal-processing';

export {
  WithdrawalResult,
  type WithdrawalResultProps,
  type WithdrawalResultStatus,
} from './withdrawal-result';

export {
  WithdrawalHistory,
  type WithdrawalHistoryProps,
} from './withdrawal-history';

export {
  WithdrawalHistoryItem,
  type WithdrawalHistoryItemProps,
  type WithdrawalHistoryStatus,
  type WithdrawalHistoryDestinationType,
} from './withdrawal-history-item';