// -----------------------------------------------------------------------------
// sisiMove — Messaging API
// -----------------------------------------------------------------------------
//
// Public API surface for the Messaging feature's HTTP adapters.
//
// This barrel intentionally exposes:
// - Conversation queries
// - Participant queries
// - Message queries
// - Conversation lifecycle commands
// - Message lifecycle commands
//
// Consumers should import Messaging API contracts and functions from this
// module rather than reaching into individual API implementation files.
//
// Non-responsibilities:
// - Domain/model mapping.
// - React Query.
// - Presentation logic.
// - Authentication/session management.
// - Business rules.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Conversations
// -----------------------------------------------------------------------------

export {
  getMessagingConversation,
  listMessagingConversations,
} from './conversations';

export type {
  GetMessagingConversationApiResponse,
  ListMessagingConversationsApiResponse,
  ListMessagingConversationsQuery,
} from './conversations';

// -----------------------------------------------------------------------------
// Participants
// -----------------------------------------------------------------------------

export {
  getMessagingConversationParticipants,
  getMessagingConversationParticipant,
} from './participants';

export type {
  GetMessagingConversationParticipantsApiResponse,
  GetMessagingConversationParticipantApiResponse,
} from './participants';

// -----------------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------------

export {
  getMessagingMessage,
  getMessagingConversationMessages,
} from './messages';

export type {
  GetMessagingMessageApiResponse,
  GetMessagingConversationMessagesApiResponse,
  GetMessagingConversationMessagesQuery,
} from './messages';

// -----------------------------------------------------------------------------
// Conversation lifecycle
// -----------------------------------------------------------------------------

export {
  createMessagingConversation,
  addMessagingConversationParticipant,
  leaveMessagingConversation,
  removeMessagingConversationParticipant,
  closeMessagingConversation,
} from './lifecycle';

export type {
  CreateMessagingConversationCommand,
  CreateMessagingConversationApiResponse,
  AddMessagingConversationParticipantCommand,
  AddMessagingConversationParticipantApiResponse,
  LeaveMessagingConversationApiResponse,
  RemoveMessagingConversationParticipantCommand,
  RemoveMessagingConversationParticipantApiResponse,
  CloseMessagingConversationApiResponse,
} from './lifecycle';

// -----------------------------------------------------------------------------
// Message lifecycle
// -----------------------------------------------------------------------------

export {
  sendMessagingMessage,
  editMessagingMessage,
  deleteMessagingMessage,
  moderateMessagingMessage,
} from './message-lifecycle';

export type {
  SendMessagingMessageCommand,
  SendMessagingMessageApiResponse,
  EditMessagingMessageCommand,
  EditMessagingMessageApiResponse,
  DeleteMessagingMessageApiResponse,
  ModerateMessagingMessageCommand,
  ModerateMessagingMessageApiResponse,
} from './message-lifecycle';