// -----------------------------------------------------------------------------
// Messaging — Add Participant Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for adding a participant to a Messaging Conversation.
//
// Physical-world request:
//
// - identify the member to add;
// - specify the participant role.
//
// The caller does NOT provide:
//
// - internal conversation ID;
// - conversation public ID in the body;
// - internal participant ID;
// - participant public ID;
// - correlation ID;
// - causation ID;
// - joined timestamp.
//
// The conversation is identified by the route and the join timestamp is
// established by the application/domain.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------

export class AddMessagingParticipantRequestDto {
  /**
   * Public identifier of the member who should become a participant.
   */
  @IsString()
  @IsNotEmpty()
  public readonly memberPublicId!: string;

  /**
   * Role the member will have in the conversation.
   */
  @IsString()
  @IsNotEmpty()
  public readonly role!: string;
}
