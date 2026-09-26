// -----------------------------------------------------------------------------
// sisiMove — Messaging Components Barrel
// -----------------------------------------------------------------------------
//
// Central export surface for the Messaging presentation layer.
//
// Responsibilities:
// - Re-export Messaging components from their feature-specific component
//   directories.
// - Provide a stable import boundary for consumers.
//
// Non-responsibilities:
// - Business logic.
// - Query or mutation ownership.
// - API access.
// - Domain orchestration.
//
// Components themselves remain responsible for their own presentation concerns
// and, where explicitly established, their own feature query/mutation hooks.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Conversation status
// -----------------------------------------------------------------------------

export {
  MessagingConversationStatusBadge,
} from './conversation-status';

export type {
  MessagingConversationStatusBadgeProps,
} from './conversation-status';

// -----------------------------------------------------------------------------
// Conversation list
// -----------------------------------------------------------------------------

export {
  MessagingConversationList,
  MessagingConversationListItem,
  MessagingConversationListEmpty,
} from './conversation-list';

export type {
  MessagingConversationListProps,
  MessagingConversationListItemProps,
  MessagingConversationListEmptyProps,
} from './conversation-list';

// -----------------------------------------------------------------------------
// Conversation header
// -----------------------------------------------------------------------------

export {
  MessagingConversationHeader,
  MessagingConversationHeaderActions,
} from './conversation-header';

export type {
  MessagingConversationHeaderProps,
  MessagingConversationHeaderActionsProps,
} from './conversation-header';

// -----------------------------------------------------------------------------
// Conversation participants
// -----------------------------------------------------------------------------

export {
  MessagingConversationParticipants,
  MessagingConversationParticipantItem,
  MessagingConversationParticipantStatus,
} from './conversation-participants';

export type {
  MessagingConversationParticipantsProps,
  MessagingConversationParticipantStatusProps,
} from './conversation-participants';

// -----------------------------------------------------------------------------
// Message list
// -----------------------------------------------------------------------------

export {
  MessagingMessageList,
  MessagingMessageListEmpty,
  MessagingMessageListLoading,
} from './message-list';

export type {
  MessagingMessageListProps,
  MessagingMessageListEmptyProps,
  MessagingMessageListLoadingProps,
} from './message-list';

// -----------------------------------------------------------------------------
// Message
// -----------------------------------------------------------------------------

export {
  MessagingMessage,
  MessagingMessageContent,
  MessagingMessageAsset,
  MessagingMessageMeta,
  MessagingMessageStatus,
} from './message';

export type {
  MessagingMessageProps,
  MessagingMessageContentProps,
  MessagingMessageAssetProps,
  MessagingMessageMetaProps,
  MessagingMessageStatusProps,
} from './message';

// -----------------------------------------------------------------------------
// Message composer
// -----------------------------------------------------------------------------

export {
  MessagingMessageComposer,
  MessagingMessageComposerInput,
  MessagingMessageComposerAttachment,
  MessagingMessageComposerActions,
} from './message-composer';

export type {
  MessagingMessageComposerProps,
  MessagingMessageComposerInputProps,
  MessagingMessageComposerAttachmentProps,
  MessagingMessageComposerActionsProps,
} from './message-composer';

// -----------------------------------------------------------------------------
// Message actions
// -----------------------------------------------------------------------------

export {
  MessagingMessageActions,
  EditMessageAction,
  DeleteMessageAction,
} from './message-actions';

export type {
  MessagingMessageActionsProps,
  EditMessageActionProps,
  DeleteMessageActionProps,
} from './message-actions';

// -----------------------------------------------------------------------------
// Conversation actions
// -----------------------------------------------------------------------------

export {
  MessagingConversationActions,
  LeaveConversationAction,
  CloseConversationAction,
} from './conversation-actions';

export type {
  MessagingConversationActionsProps,
  LeaveConversationActionProps,
  CloseConversationActionProps,
} from './conversation-actions';

// -----------------------------------------------------------------------------
// Empty state
// -----------------------------------------------------------------------------

export {
  MessagingEmptyState,
} from './empty-state';

export type {
  MessagingEmptyStateProps,
} from './empty-state';

// -----------------------------------------------------------------------------
// Conversation card
// -----------------------------------------------------------------------------

export {
  MessagingConversationCard,
} from './conversation-card';

export type {
  MessagingConversationCardProps,
} from './conversation-card';

// -----------------------------------------------------------------------------
// Message card
// -----------------------------------------------------------------------------

export {
  MessagingMessageCard,
} from './message-card';

export type {
  MessagingMessageCardProps,
} from './message-card';