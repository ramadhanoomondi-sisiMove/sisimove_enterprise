// -----------------------------------------------------------------------------
// Support — Change Support Case Priority Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for changing the priority of a Support Case.
//
// The value is represented as a string at the transport boundary and is
// converted into SupportCasePriority by the application layer.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class ChangeSupportCasePriorityRequestDto {
  // ---------------------------------------------------------------------------
  // Priority
  // ---------------------------------------------------------------------------

  /**
   * New Support Case priority.
   *
   * The domain value object is responsible for validating the supported
   * priority values.
   */
  @IsString()
  @IsNotEmpty()
  public readonly priority!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ChangeSupportCasePriorityRequestDto;
