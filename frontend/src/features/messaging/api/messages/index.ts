// -----------------------------------------------------------------------------
// sisiMove — Messaging Message API Exports
// -----------------------------------------------------------------------------
//
// Public API surface for Messaging message HTTP adapters.
//
// Consumers should import message API functions and contracts from this barrel
// rather than depending on individual implementation files.
// -----------------------------------------------------------------------------

export {
  getMessagingMessage,
} from './get-messaging-message.api';

export type {
  GetMessagingMessageApiResponse,
} from './get-messaging-message.api';

export {
  getMessagingConversationMessages,
} from './get-messaging-conversation-messages.api';

export type {
  GetMessagingConversationMessagesQuery,
  GetMessagingConversationMessagesApiResponse,
} from './get-messaging-conversation-messages.api';