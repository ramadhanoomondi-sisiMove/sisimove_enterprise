// -----------------------------------------------------------------------------
// Device — Get Active Devices Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving all currently active Device aggregates
// belonging to an Identity.
//
// Query:
//
//     Get Active Devices
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The DTO provides the primitive Identity public identifier required to
// construct:
//
//     GetActiveDevicesQuery
//
// The corresponding presentation/application mapper is responsible for:
//
//     identityPublicId: string
//              ↓
//     DeviceIdentityPublicId.create(value)
//              ↓
//     GetActiveDevicesQuery
//
// This DTO does NOT:
//
// - load Device aggregates;
// - access DeviceRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity domain state;
// - contain domain business logic;
// - determine which Devices are active;
// - map aggregates to response DTOs.
//
// The corresponding query handler is responsible for:
//
// - retrieving active Devices through DeviceRepository;
// - using the Identity public identifier as the lookup criterion;
// - handling the result;
// - applying pagination or ordering when supported;
// - mapping aggregates to the appropriate application read model or DTO.
//
// The repository is responsible for applying the active-device persistence
// criterion.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2"
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

const MIN_IDENTITY_PUBLIC_ID_LENGTH = 1;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST query DTO for retrieving active Device aggregates belonging to an
 * Identity.
 *
 * Required transport input:
 *
 * - identityPublicId.
 *
 * The value remains a primitive string at the REST boundary.
 *
 * The presentation/application mapper converts this value into the
 * DeviceIdentityPublicId value object before constructing
 * GetActiveDevicesQuery.
 */
export class GetActiveDevicesQueryDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity whose active Devices should be
   * retrieved.
   *
   * This remains a primitive transport string.
   *
   * The presentation/application mapper converts this value into:
   *
   *     DeviceIdentityPublicId.create(identityPublicId)
   *
   * before constructing GetActiveDevicesQuery.
   *
   * Example:
   *
   * - IDN-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Public identifier of the Identity whose active Devices should be retrieved. The transport string is converted to the DeviceIdentityPublicId value object at the application boundary.',
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_IDENTITY_PUBLIC_ID_LENGTH, MAX_IDENTITY_PUBLIC_ID_LENGTH };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetActiveDevicesQueryDto;
