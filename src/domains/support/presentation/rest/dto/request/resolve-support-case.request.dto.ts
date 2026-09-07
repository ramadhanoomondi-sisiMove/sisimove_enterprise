// -----------------------------------------------------------------------------
// Support — Resolve Support Case Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for resolving a Support Case.
//
// The request supplies the resolution information required to create the
// resolution and transition the Support Case into RESOLVED.
//
// It does NOT contain:
//
// - Support Case public ID;
// - Support Case status;
// - correlation ID;
// - causation ID;
// - internal IDs;
// - domain events.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString, IsISO8601 } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class ResolveSupportCaseRequestDto {
  // ---------------------------------------------------------------------------
  // Resolution
  // ---------------------------------------------------------------------------

  /**
   * Type of resolution applied to the Support Case.
   */
  @IsString()
  @IsNotEmpty()
  public readonly resolutionType!: string;

  /**
   * Summary describing how the Support Case was resolved.
   */
  @IsString()
  @IsNotEmpty()
  public readonly resolutionSummary!: string;

  // ---------------------------------------------------------------------------
  // Resolver
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member or support agent who resolved the case.
   *
   * This remains an opaque Identity reference at the transport boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly resolvedByPublicId!: string;

  // ---------------------------------------------------------------------------
  // Timestamp
  // ---------------------------------------------------------------------------

  /**
   * Optional timestamp at which the Support Case was resolved.
   *
   * When omitted, the application/domain flow uses the current time.
   */
  @IsOptional()
  @IsISO8601()
  public readonly resolvedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ResolveSupportCaseRequestDto;
