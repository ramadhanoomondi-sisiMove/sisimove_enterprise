// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversations Query DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for querying Messaging Conversations.
//
// Physical-world/API callers may request conversations filtered by:
//
// - conversation type;
// - conversation status.
//
// The DTO contains only externally meaningful query criteria.
//
// It does NOT expose:
//
// - domain value objects;
// - internal entity identifiers;
// - correlation identifiers;
// - causation identifiers;
// - repository concerns;
// - authorization data.
//
// The application layer converts the supplied primitive values into
// MessagingConversationType and MessagingConversationStatus value objects.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// Query DTO
// =============================================================================

export class GetMessagingConversationsQueryDto {
  /**
   * Optional conversation type filter.
   *
   * Examples depend on the Messaging domain's supported conversation types.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly type?: string;

  /**
   * Optional conversation lifecycle status filter.
   *
   * Examples depend on the Messaging domain's supported conversation statuses.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly status?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationsQueryDto;
