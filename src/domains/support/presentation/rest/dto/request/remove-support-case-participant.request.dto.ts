// -----------------------------------------------------------------------------
// Support — Remove Support Case Participant Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for removing a participant from a Support Case.
//
// Removal is represented as the participant leaving the case through the
// participant's leftAt timestamp.
//
// -----------------------------------------------------------------------------

import { IsISO8601, IsOptional } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class RemoveSupportCaseParticipantRequestDto {
  // ---------------------------------------------------------------------------
  // Leave Timestamp
  // ---------------------------------------------------------------------------

  /**
   * Optional timestamp at which the participant leaves the Support Case.
   *
   * When omitted, the application/domain flow uses the current time.
   */
  @IsOptional()
  @IsISO8601()
  public readonly leftAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RemoveSupportCaseParticipantRequestDto;
