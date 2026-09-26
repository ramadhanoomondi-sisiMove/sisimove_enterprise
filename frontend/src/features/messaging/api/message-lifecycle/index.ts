// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Lifecycle API Exports
// -----------------------------------------------------------------------------
//
// Public API surface for Messaging message lifecycle commands.
//
// Consumers should import lifecycle functions and contracts from this barrel
// rather than depending on individual implementation files.
// -----------------------------------------------------------------------------

export {
  sendMessagingMessage,
} from './send-messaging-message.api';

export type {
  SendMessagingMessageCommand,
  SendMessagingMessageApiResponse,
} from './send-messaging-message.api';

export {
  editMessagingMessage,
} from './edit-messaging-message.api';

export type {
  EditMessagingMessageCommand,
  EditMessagingMessageApiResponse,
} from './edit-messaging-message.api';

export {
  deleteMessagingMessage,
} from './delete-messaging-message.api';

export type {
  DeleteMessagingMessageApiResponse,
} from './delete-messaging-message.api';

export {
  moderateMessagingMessage,
} from './moderate-messaging-message.api';

export type {
  ModerateMessagingMessageCommand,
  ModerateMessagingMessageApiResponse,
} from './moderate-messaging-message.api';