// -----------------------------------------------------------------------------
// Support — Assign Support Case Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for assigning a Support Case to a member or support agent.
//
// The DTO contains only externally supplied assignment information.
//
// It does NOT contain:
//
// - Support Case internal ID;
// - Support Case lifecycle state;
// - correlation ID;
// - causation ID;
// - domain events.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class AssignSupportCaseRequestDto {
  // ---------------------------------------------------------------------------
  // Assignee
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member or support agent to whom the Support Case
   * should be assigned.
   *
   * This remains an opaque Identity reference at the Support transport
   * boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly assignedToPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AssignSupportCaseRequestDto;
