// -----------------------------------------------------------------------------
// Messaging Domain — Value Objects
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Messaging Conversation
// -----------------------------------------------------------------------------

export { MessagingConversationPublicId } from './messaging-conversation-public-id.vo';

export { MessagingConversationType } from './messaging-conversation-type.vo';

export type {
  MessagingConversationTypeValue,
  MessagingConversationTypeProps,
} from './messaging-conversation-type.vo';

export { MessagingConversationStatus } from './messaging-conversation-status.vo';

export type {
  MessagingConversationStatusValue,
  MessagingConversationStatusProps,
} from './messaging-conversation-status.vo';

// -----------------------------------------------------------------------------
// Messaging Conversation Participant
// -----------------------------------------------------------------------------

export { MessagingConversationParticipantPublicId } from './messaging-conversation-participant-public-id.vo';

export { MessagingParticipantRole } from './messaging-participant-role.vo';

export type {
  MessagingParticipantRoleValue,
  MessagingParticipantRoleProps,
} from './messaging-participant-role.vo';

export { MessagingParticipantStatus } from './messaging-participant-status.vo';

export type {
  MessagingParticipantStatusValue,
  MessagingParticipantStatusProps,
} from './messaging-participant-status.vo';

// -----------------------------------------------------------------------------
// Messaging Message
// -----------------------------------------------------------------------------

export { MessagingMessagePublicId } from './messaging-message-public-id.vo';

export { MessagingMessageType } from './messaging-message-type.vo';

export type {
  MessagingMessageTypeValue,
  MessagingMessageTypeProps,
} from './messaging-message-type.vo';

export { MessagingMessageStatus } from './messaging-message-status.vo';

export type {
  MessagingMessageStatusValue,
  MessagingMessageStatusProps,
} from './messaging-message-status.vo';

export { MessagingMessageContent } from './messaging-message-content.vo';

export type { MessagingMessageContentProps } from './messaging-message-content.vo';

// -----------------------------------------------------------------------------
// Cross-Domain References
// -----------------------------------------------------------------------------

export { MessagingJourneyPublicId } from './messaging-journey-public-id.vo';

export type { MessagingJourneyPublicIdProps } from './messaging-journey-public-id.vo';

export { MessagingBookingPublicId } from './messaging-booking-public-id.vo';

export type { MessagingBookingPublicIdProps } from './messaging-booking-public-id.vo';

export { MessagingMemberPublicId } from './messaging-member-public-id.vo';

export type { MessagingMemberPublicIdProps } from './messaging-member-public-id.vo';

export { MessagingAssetPublicId } from './messaging-asset-public-id.vo';

export type { MessagingAssetPublicIdProps } from './messaging-asset-public-id.vo';
