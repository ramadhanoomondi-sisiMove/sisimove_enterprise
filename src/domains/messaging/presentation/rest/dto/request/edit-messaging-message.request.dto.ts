// -----------------------------------------------------------------------------
// Messaging — Edit Message Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for editing a Messaging Message.
//
// Physical-world request:
//
//   "Change this message to this content."
//
// The message public identifier belongs in the route:
//
//   PATCH /conversations/:conversationPublicId/messages/:messagePublicId
//
// The authenticated member is resolved by the application layer.
//
// The server establishes the edit timestamp.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------

export class EditMessagingMessageRequestDto {
  /**
   * New message content.
   */
  @IsString()
  @IsNotEmpty()
  public readonly content!: string;
}
