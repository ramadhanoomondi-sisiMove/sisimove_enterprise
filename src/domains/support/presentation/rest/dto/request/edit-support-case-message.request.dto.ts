// -----------------------------------------------------------------------------
// Support — Edit Support Case Message Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for replacing the content of an existing Support Case
// message.
//
// The message identity is supplied through the route/resource context.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class EditSupportCaseMessageRequestDto {
  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  /**
   * Replacement content for the Support Case message.
   */
  @IsString()
  @IsNotEmpty()
  public readonly content!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default EditSupportCaseMessageRequestDto;
