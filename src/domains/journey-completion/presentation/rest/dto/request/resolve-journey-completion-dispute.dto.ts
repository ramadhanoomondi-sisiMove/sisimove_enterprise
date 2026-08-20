// -----------------------------------------------------------------------------
// Journey Completion — Resolve Dispute Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for resolving a Journey Completion dispute.
 *
 * The Journey Completion and dispute public identities are supplied through
 * the route parameters.
 *
 * `resolvedByPublicId` may be supplied explicitly, but the controller may
 * fall back to the authenticated member identity.
 *
 * The DTO represents untrusted transport input and therefore contains
 * primitive values only.
 *
 * Domain value objects are constructed by the presentation/application
 * boundary before creating ResolveJourneyCompletionDisputeCommand.
 */
export class ResolveJourneyCompletionDisputeDto {
  // ===========================================================================
  // Resolver
  // ===========================================================================

  /**
   * Optional public identity of the member resolving the dispute.
   *
   * When omitted, the controller may use the authenticated member identity.
   */
  @ApiPropertyOptional({
    description:
      'Optional public identifier of the member resolving the dispute. When omitted, the authenticated member is used.',
    example: 'MEM_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  resolvedByPublicId?: string;

  // ===========================================================================
  // Resolution Summary
  // ===========================================================================

  /**
   * Explanation of the dispute resolution.
   *
   * JourneyCompletionDisputeResolutionSummary remains the authoritative
   * domain validator.
   */
  @ApiProperty({
    description: 'Explanation of the dispute resolution.',
    example:
      'The dispute was reviewed and the journey was confirmed as completed according to the recorded journey evidence.',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  resolutionSummary!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  /**
   * Application correlation identifier.
   */
  @ApiProperty({
    description:
      'Correlation identifier used for tracing the dispute resolution command.',
    example: '9f4a8f1d-6a6e-4c2f-b9e6-1a2f31a8c741',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  correlationId!: string;

  // ===========================================================================
  // Causation ID
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this operation.
   */
  @ApiPropertyOptional({
    description:
      'Optional causation identifier for the command or event chain.',
    example: '8e2e3f10-2a8f-45cc-91e8-53cf7d4b1920',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  causationId?: string;

  // ===========================================================================
  // Resolution Timestamp
  // ===========================================================================

  /**
   * Optional timestamp supplied by the caller.
   *
   * The controller/application boundary converts this ISO-8601 value into
   * a Date before constructing ResolveJourneyCompletionDisputeCommand.
   *
   * When omitted, the aggregate uses the current time.
   */
  @ApiPropertyOptional({
    description: 'Optional timestamp at which the dispute was resolved.',
    example: '2026-08-20T17:30:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  resolvedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ResolveJourneyCompletionDisputeDto;
