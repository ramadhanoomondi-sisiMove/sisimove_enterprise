// -----------------------------------------------------------------------------
// sisiMove — Messaging Lifecycle API Exports
// -----------------------------------------------------------------------------
//
// Public API surface for Messaging conversation lifecycle commands.
//
// Consumers should import lifecycle functions and contracts from this barrel
// rather than depending on individual implementation files.
// -----------------------------------------------------------------------------

export {
  createMessagingConversation,
} from './create-messaging-conversation.api';

export type {
  CreateMessagingConversationCommand,
  CreateMessagingConversationApiResponse,
} from './create-messaging-conversation.api';

export {
  addMessagingConversationParticipant,
} from './add-messaging-conversation-participant.api';

export type {
  AddMessagingConversationParticipantCommand,
  AddMessagingConversationParticipantApiResponse,
} from './add-messaging-conversation-participant.api';

export {
  leaveMessagingConversation,
} from './leave-messaging-conversation.api';

export type {
  LeaveMessagingConversationApiResponse,
} from './leave-messaging-conversation.api';

export {
  removeMessagingConversationParticipant,
} from './remove-messaging-conversation-participant.api';

export type {
  RemoveMessagingConversationParticipantCommand,
  RemoveMessagingConversationParticipantApiResponse,
} from './remove-messaging-conversation-participant.api';

export {
  closeMessagingConversation,
} from './close-messaging-conversation.api';

export type {
  CloseMessagingConversationApiResponse,
} from './close-messaging-conversation.api';