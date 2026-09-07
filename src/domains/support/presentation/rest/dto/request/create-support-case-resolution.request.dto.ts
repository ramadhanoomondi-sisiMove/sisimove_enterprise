// -----------------------------------------------------------------------------
// Support — Create Support Case Resolution Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for creating a resolution record for a Support Case.
//
// IMPORTANT:
//
// Creating a resolution does NOT itself transition the Support Case into
// RESOLVED.
//
// Resolution creation and Support Case resolution are separate aggregate
// operations.
//
// This DTO therefore carries resolution data only.
//
// -----------------------------------------------------------------------------

import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CreateSupportCaseResolutionRequestDto {
  // ---------------------------------------------------------------------------
  // Resolution Type
  // ---------------------------------------------------------------------------

  /**
   * Type of resolution recorded for the Support Case.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  // ---------------------------------------------------------------------------
  // Resolution Summary
  // ---------------------------------------------------------------------------

  /**
   * Summary describing the resolution.
   */
  @IsString()
  @IsNotEmpty()
  public readonly summary!: string;

  // ---------------------------------------------------------------------------
  // Resolver
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member or support agent responsible for creating
   * the resolution.
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
   * Optional timestamp associated with the resolution.
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

export default CreateSupportCaseResolutionRequestDto;
