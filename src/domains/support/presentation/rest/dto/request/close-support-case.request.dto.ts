// -----------------------------------------------------------------------------
// Support — Close Support Case Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for closing a resolved Support Case.
//
// -----------------------------------------------------------------------------

import { IsISO8601, IsOptional } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CloseSupportCaseRequestDto {
  // ---------------------------------------------------------------------------
  // Timestamp
  // ---------------------------------------------------------------------------

  /**
   * Optional timestamp at which the Support Case was closed.
   *
   * When omitted, the application/domain flow uses the current time.
   */
  @IsOptional()
  @IsISO8601()
  public readonly closedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CloseSupportCaseRequestDto;
