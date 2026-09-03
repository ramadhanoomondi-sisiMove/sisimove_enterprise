// -----------------------------------------------------------------------------
// Device — Get Device Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving a single Device by its public identifier.
//
// Query:
//
//     Get Device
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The DTO provides the primitive Device identifier required to construct:
//
//     GetDeviceQuery
//
// The corresponding presentation/application mapper is responsible for:
//
//     devicePublicId: string
//              ↓
//     DevicePublicId.create(value)
//              ↓
//     GetDeviceQuery
//
// This DTO does NOT:
//
// - load the Device aggregate;
// - access DeviceRepository;
// - access Prisma;
// - perform authorization;
// - contain domain business logic;
// - map the aggregate to a response DTO.
//
// The corresponding query handler is responsible for:
//
// - loading the Device aggregate through DeviceRepository;
// - handling the not-found case;
// - returning or mapping the Device aggregate.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "devicePublicId": "DEV-01K3R8Y7Q2"
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_DEVICE_PUBLIC_ID_LENGTH = 1;
const MAX_DEVICE_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST query DTO for retrieving a single Device aggregate by its public
 * identifier.
 *
 * Required transport input:
 *
 * - devicePublicId.
 *
 * The value remains a primitive string at the REST boundary.
 *
 * The presentation/application mapper converts this value into the
 * DevicePublicId value object before constructing GetDeviceQuery.
 */
export class GetDeviceQueryDto {
  // ===========================================================================
  // Device Public ID
  // ===========================================================================

  /**
   * Public identifier of the Device aggregate to retrieve.
   *
   * This remains a primitive transport string.
   *
   * The presentation/application mapper converts this value into:
   *
   *     DevicePublicId.create(devicePublicId)
   *
   * before constructing GetDeviceQuery.
   *
   * Example:
   *
   * - DEV-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'DEV-01K3R8Y7Q2',
    description:
      'Public identifier of the Device to retrieve. The transport string is converted to the DevicePublicId value object at the application boundary.',
    minLength: MIN_DEVICE_PUBLIC_ID_LENGTH,
    maxLength: MAX_DEVICE_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'devicePublicId must be a string.',
  })
  @MinLength(MIN_DEVICE_PUBLIC_ID_LENGTH, {
    message: 'devicePublicId must not be empty.',
  })
  @MaxLength(MAX_DEVICE_PUBLIC_ID_LENGTH, {
    message: `devicePublicId must not exceed ${MAX_DEVICE_PUBLIC_ID_LENGTH} characters.`,
  })
  devicePublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_DEVICE_PUBLIC_ID_LENGTH, MAX_DEVICE_PUBLIC_ID_LENGTH };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetDeviceQueryDto;
