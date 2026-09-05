// -----------------------------------------------------------------------------
// Messaging — Send Message Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for sending a message to a Messaging Conversation.
//
// Physical-world request:
//
// - choose the message type;
// - optionally provide message content;
// - optionally reference an uploaded asset.
//
// The sender is the authenticated member and is NOT supplied by the request
// body.
//
// The conversation is identified by the route.
//
// The server establishes the send timestamp.
//
// The DTO does NOT contain:
//
// - internal conversation ID;
// - conversation public ID;
// - sender public ID;
// - correlation ID;
// - causation ID;
// - sent timestamp.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// -----------------------------------------------------------------------------

export class SendMessagingMessageRequestDto {
  /**
   * Type of message being sent.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  /**
   * Optional human-readable message content.
   *
   * The Messaging domain is responsible for determining whether content is
   * required or forbidden for the selected message type.
   */
  @IsOptional()
  @IsString()
  public readonly content?: string;

  /**
   * Optional public identifier of an asset associated with the message.
   *
   * The Messaging domain is responsible for determining whether the selected
   * message type permits or requires an asset.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly assetPublicId?: string;
}
