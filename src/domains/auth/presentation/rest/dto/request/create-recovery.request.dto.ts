// -----------------------------------------------------------------------------
// Recovery — Create Request DTO
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

const MIN_TYPE_LENGTH = 1;
const MAX_TYPE_LENGTH = 64;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

const RECOVERY_TYPES = ['PASSWORD_RESET', 'ACCOUNT_RECOVERY'] as const;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for creating a Recovery.
 *
 * IMPORTANT:
 *
 * This DTO contains transport-level primitives only.
 *
 * No domain Value Objects are used here.
 */
export class CreateRecoveryRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity associated with the Recovery.',
    minLength: MIN_IDENTITY_PUBLIC_ID_LENGTH,
    maxLength: MAX_IDENTITY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_IDENTITY_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_IDENTITY_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Recovery Type
  // ===========================================================================

  /**
   * Recovery workflow type.
   *
   * Transport type: string.
   *
   * The domain RecoveryType Value Object is created by the controller/application
   * mapping boundary after transport validation.
   */
  @ApiProperty({
    example: 'PASSWORD_RESET',
    enum: RECOVERY_TYPES,
    description:
      'Recovery workflow type. Supported values are PASSWORD_RESET and ACCOUNT_RECOVERY.',
    minLength: MIN_TYPE_LENGTH,
    maxLength: MAX_TYPE_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'type must be a string.',
  })
  @IsIn(RECOVERY_TYPES, {
    message: 'type must be one of: PASSWORD_RESET, ACCOUNT_RECOVERY.',
  })
  @MinLength(MIN_TYPE_LENGTH, {
    message: 'type must not be empty.',
  })
  @MaxLength(MAX_TYPE_LENGTH, {
    message: `type must not exceed ${MAX_TYPE_LENGTH} characters.`,
  })
  type!: string;

  // ===========================================================================
  // Expires At
  // ===========================================================================

  /**
   * Recovery expiration timestamp.
   *
   * Transport type: ISO 8601 string.
   */
  @ApiProperty({
    example: '2026-09-01T12:30:00.000Z',
    description: 'ISO 8601 timestamp at which the Recovery workflow expires.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsString({
    message: 'expiresAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'expiresAt must be a valid ISO 8601 date-time.',
    },
  )
  expiresAt!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description: 'Correlation identifier for the Recovery creation operation.',
    minLength: MIN_CORRELATION_ID_LENGTH,
    maxLength: MAX_CORRELATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'correlationId must be a string.',
  })
  @MinLength(MIN_CORRELATION_ID_LENGTH, {
    message: 'correlationId must not be empty.',
  })
  @MaxLength(MAX_CORRELATION_ID_LENGTH, {
    message: `correlationId must not exceed ${MAX_CORRELATION_ID_LENGTH} characters.`,
  })
  correlationId!: string;

  // ===========================================================================
  // Causation ID
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this Recovery creation request.',
    nullable: true,
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'causationId must be a string.',
  })
  @MinLength(MIN_CAUSATION_ID_LENGTH, {
    message: 'causationId must not be empty.',
  })
  @MaxLength(MAX_CAUSATION_ID_LENGTH, {
    message: `causationId must not exceed ${MAX_CAUSATION_ID_LENGTH} characters.`,
  })
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_IDENTITY_PUBLIC_ID_LENGTH as RECOVERY_IDENTITY_PUBLIC_ID_MIN_LENGTH,
  MAX_IDENTITY_PUBLIC_ID_LENGTH as RECOVERY_IDENTITY_PUBLIC_ID_MAX_LENGTH,
  MIN_TYPE_LENGTH as RECOVERY_TYPE_MIN_LENGTH,
  MAX_TYPE_LENGTH as RECOVERY_TYPE_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as RECOVERY_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as RECOVERY_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as RECOVERY_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as RECOVERY_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateRecoveryRequestDto;
