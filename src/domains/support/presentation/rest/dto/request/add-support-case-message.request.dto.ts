// -----------------------------------------------------------------------------
// Support — Add Support Case Message Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for adding a message to a Support Case.
//
// A message may contain textual content, an asset, or both depending on the
// message type and domain rules.
//
// -----------------------------------------------------------------------------

import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class AddSupportCaseMessageRequestDto {
  // ---------------------------------------------------------------------------
  // Sender
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member sending the message.
   *
   * This remains an opaque Identity reference at the transport boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly senderPublicId!: string;

  // ---------------------------------------------------------------------------
  // Message Type
  // ---------------------------------------------------------------------------

  /**
   * Type of Support Case message.
   *
   * The domain value object is responsible for validating supported message
   * types.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  /**
   * Optional textual content of the message.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly content?: string;

  // ---------------------------------------------------------------------------
  // Asset
  // ---------------------------------------------------------------------------

  /**
   * Optional asset identifier associated with the message.
   *
   * This remains an opaque asset reference at the transport boundary.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly assetId?: string;

  // ---------------------------------------------------------------------------
  // Timestamp
  // ---------------------------------------------------------------------------

  /**
   * Optional timestamp at which the message was sent.
   *
   * When omitted, the application/domain flow uses the current time.
   */
  @IsOptional()
  @IsISO8601()
  public readonly sentAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AddSupportCaseMessageRequestDto;
