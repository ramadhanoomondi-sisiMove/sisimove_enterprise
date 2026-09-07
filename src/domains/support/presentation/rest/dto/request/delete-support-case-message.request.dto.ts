// -----------------------------------------------------------------------------
// Support — Delete Support Case Message Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for soft-deleting a Support Case message.
//
// Deletion is represented by setting deletedAt on the message entity.
//
// The message identity is supplied through the route/resource context.
//
// -----------------------------------------------------------------------------

import { IsISO8601, IsOptional } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class DeleteSupportCaseMessageRequestDto {
  // ---------------------------------------------------------------------------
  // Timestamp
  // ---------------------------------------------------------------------------

  /**
   * Optional timestamp at which the message was deleted.
   *
   * When omitted, the application/domain flow uses the current time.
   */
  @IsOptional()
  @IsISO8601()
  public readonly deletedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DeleteSupportCaseMessageRequestDto;
