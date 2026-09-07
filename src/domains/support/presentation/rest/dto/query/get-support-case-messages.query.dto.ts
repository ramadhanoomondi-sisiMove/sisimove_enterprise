// -----------------------------------------------------------------------------
// Support Case — Get Messages Query DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for retrieving all messages belonging to a Support Case.
//
// The Support Case public identity identifies the aggregate whose messages
// are requested.
//
// The DTO does NOT contain:
//
// - internal database identifiers;
// - domain entities;
// - domain value objects;
// - pagination parameters;
// - authorization data;
// - repository information.
//
// The transport value is converted into SupportCasePublicId by the
// application boundary before constructing GetSupportCaseMessagesQuery.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class GetSupportCaseMessagesQueryDto {
  // ---------------------------------------------------------------------------
  // Support Case
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Support Case whose messages are requested.
   *
   * This is an opaque Support Case reference at the transport boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly supportCasePublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCaseMessagesQueryDto;
