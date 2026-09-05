// -----------------------------------------------------------------------------
// Messaging — Create Conversation Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for creating a Messaging Conversation.
//
// Physical-world request:
//
// - choose the conversation type;
// - identify the journey;
// - optionally associate a booking.
//
// The DTO contains ONLY information that an external caller can legitimately
// provide.
//
// It does NOT contain:
//
// - internal conversation identifiers;
// - correlation identifiers;
// - causation identifiers;
// - server-generated timestamps.
//
// Resource identifiers such as the journey public identifier are external
// identifiers and may legitimately cross the transport boundary.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// -----------------------------------------------------------------------------

export class CreateMessagingConversationRequestDto {
  /**
   * Type of conversation to create.
   *
   * Examples may include journey or direct conversation types, depending on
   * the Messaging domain's supported conversation types.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  /**
   * Public identifier of the journey the conversation belongs to.
   */
  @IsString()
  @IsNotEmpty()
  public readonly journeyPublicId!: string;

  /**
   * Optional public identifier of the booking associated with the
   * conversation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly bookingPublicId?: string;
}
