// -----------------------------------------------------------------------------
// Support — Cancel Support Case Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for cancelling a Support Case.
//
// -----------------------------------------------------------------------------

import { IsISO8601, IsOptional } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CancelSupportCaseRequestDto {
  // ---------------------------------------------------------------------------
  // Timestamp
  // ---------------------------------------------------------------------------

  /**
   * Optional timestamp at which the Support Case was cancelled.
   *
   * When omitted, the application/domain flow uses the current time.
   */
  @IsOptional()
  @IsISO8601()
  public readonly cancelledAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelSupportCaseRequestDto;
