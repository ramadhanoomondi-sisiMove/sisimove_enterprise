// -----------------------------------------------------------------------------
// Messaging — Get Messaging Messages Query DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for querying Messaging Messages.
//
// Physical-world/API callers may request messages filtered by:
//
// - conversation;
// - sender;
// - message status;
// - message type;
// - asset.
//
// Public identifiers are represented as primitive strings at the transport
// boundary and are converted into domain value objects by the application
// layer.
//
// The DTO does NOT expose:
//
// - internal entity identifiers;
// - domain value object instances;
// - correlation identifiers;
// - causation identifiers;
// - repository concerns;
// - authorization data.
//
// Cross-domain public identifiers remain opaque:
//
// - conversationPublicId references Messaging Conversation;
// - senderPublicId references Identity/Member;
// - assetPublicId references Asset.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// Query DTO
// =============================================================================

export class GetMessagingMessagesQueryDto {
  /**
   * Optional public identifier of the conversation whose messages should
   * be queried.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly conversationPublicId?: string;

  /**
   * Optional public identifier of the member who sent the messages.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly senderPublicId?: string;

  /**
   * Optional message lifecycle status filter.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly status?: string;

  /**
   * Optional message type filter.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly type?: string;

  /**
   * Optional public identifier of an asset associated with the messages.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly assetPublicId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingMessagesQueryDto;
