// -----------------------------------------------------------------------------
// Device — Revoke Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for revoking a Device.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-command conversion belongs at the presentation/application mapping
// boundary:
//
//     devicePublicId → DevicePublicId
//     revokedAt      → DeviceRevokedAt
//
// The Device aggregate is responsible for:
//
// - validating whether the Device can be revoked;
// - transitioning the Device lifecycle state;
// - establishing the revoked timestamp;
// - enforcing domain invariants;
// - recording the appropriate domain event.
//
// This DTO does NOT:
//
// - load the Device;
// - modify the Device directly;
// - persist the Device;
// - create domain events;
// - access Prisma;
// - validate Identity domain state;
// - revoke Sessions;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "devicePublicId": "DEV-01K3R8Y7Q2",
//       "revokedAt": "2026-08-31T08:30:00.000Z",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsDateString,
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

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for revoking a Device.
 *
 * Required transport input:
 *
 * - devicePublicId;
 * - revokedAt;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * All properties are primitive transport values.
 *
 * Domain value objects are created at the presentation/application mapping
 * boundary.
 */
export class RevokeDeviceRequestDto {
  // ===========================================================================
  // Device Public ID
  // ===========================================================================

  /**
   * Public identifier of the Device to revoke.
   *
   * Transport representation:
   *
   *     string
   *
   * Application mapping:
   *
   *     string → DevicePublicId
   */
  @ApiProperty({
    example: 'DEV-01K3R8Y7Q2',
    description:
      'Public identifier of the Device to revoke. The transport string is converted to DevicePublicId at the application boundary.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'devicePublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'devicePublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `devicePublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  devicePublicId!: string;

  // ===========================================================================
  // Revoked At
  // ===========================================================================

  /**
   * Timestamp at which the Device is revoked.
   *
   * Transport representation:
   *
   *     ISO 8601 date-time string
   *
   * Application mapping:
   *
   *     string → DeviceRevokedAt
   */
  @ApiProperty({
    example: '2026-08-31T08:30:00.000Z',
    description:
      'ISO 8601 timestamp at which the Device is revoked. The transport string is converted to DeviceRevokedAt at the application boundary.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsString({
    message: 'revokedAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'revokedAt must be a valid ISO 8601 date-time string.',
    },
  )
  revokedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the Device-revocation operation.
   *
   * This identifies the end-to-end business operation and is propagated to
   * the resulting domain event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Device-revocation operation and resulting domain event.',
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
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, domain event, or workflow that caused
   * this Device-revocation operation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or workflow that caused this Device-revocation operation.',
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
    nullable: true,
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
  MIN_PUBLIC_ID_LENGTH as DEVICE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as DEVICE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as DEVICE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as DEVICE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as DEVICE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as DEVICE_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RevokeDeviceRequestDto;
