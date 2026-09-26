// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Header Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the conversation-header presentation components.
//
// Responsibilities:
// - expose conversation header components;
// - expose their public prop contracts.
//
// Non-responsibilities:
// - data fetching;
// - mutations;
// - authorization;
// - route composition.
//
// -----------------------------------------------------------------------------

export {
  MessagingConversationHeader,
} from './messaging-conversation-header';

export type {
  MessagingConversationHeaderProps,
} from './messaging-conversation-header';

export {
  MessagingConversationHeaderActions,
} from './messaging-conversation-header-actions';

export type {
  MessagingConversationHeaderActionsProps,
} from './messaging-conversation-header-actions';