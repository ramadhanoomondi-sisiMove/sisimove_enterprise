// -----------------------------------------------------------------------------
// Recovery — Get Recovery Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving a single Recovery aggregate by its public
// identifier.
//
// Query:
//
//     Get Recovery
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// The DTO provides the primitive Recovery identifier required to construct:
//
//     GetRecoveryQuery
//
// The corresponding presentation/application mapper is responsible for:
//
//     recoveryPublicId: string
//              ↓
//     RecoveryPublicId.create(value)
//              ↓
//     GetRecoveryQuery
//
// This DTO does NOT:
//
// - load the Recovery aggregate;
// - access RecoveryRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity state;
// - contain domain business logic;
// - contain recovery-token material;
// - map the aggregate to a response DTO.
//
// The corresponding query handler is responsible for:
//
// - loading the Recovery aggregate through RecoveryRepository;
// - handling the not-found case;
// - returning or mapping the Recovery aggregate.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// This DTO intentionally contains no:
//
// - raw recovery token;
// - recovery-token hash;
// - password;
// - password hash;
// - OTP;
// - OTP hash;
// - session credentials.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "recoveryPublicId": "REC-01K3R8Y7Q2"
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

const MIN_RECOVERY_PUBLIC_ID_LENGTH = 1;
const MAX_RECOVERY_PUBLIC_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST query DTO for retrieving a single Recovery aggregate by its public
 * identifier.
 *
 * Required transport input:
 *
 * - recoveryPublicId.
 *
 * The value remains a primitive string at the REST boundary.
 *
 * The presentation/application mapper converts this value into the
 * RecoveryPublicId value object before constructing GetRecoveryQuery.
 */
export class GetRecoveryQueryDto {
  // ===========================================================================
  // Recovery Public ID
  // ===========================================================================

  /**
   * Public identifier of the Recovery aggregate to retrieve.
   *
   * This remains a primitive transport string.
   *
   * The presentation/application mapper converts this value into:
   *
   *     RecoveryPublicId.create(recoveryPublicId)
   *
   * before constructing GetRecoveryQuery.
   *
   * Example:
   *
   * - REC-01K3R8Y7Q2
   */
  @ApiProperty({
    example: 'REC-01K3R8Y7Q2',
    description:
      'Public identifier of the Recovery to retrieve. The transport string is converted to the RecoveryPublicId value object at the application boundary.',
    minLength: MIN_RECOVERY_PUBLIC_ID_LENGTH,
    maxLength: MAX_RECOVERY_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'recoveryPublicId must be a string.',
  })
  @MinLength(MIN_RECOVERY_PUBLIC_ID_LENGTH, {
    message: 'recoveryPublicId must not be empty.',
  })
  @MaxLength(MAX_RECOVERY_PUBLIC_ID_LENGTH, {
    message: `recoveryPublicId must not exceed ${MAX_RECOVERY_PUBLIC_ID_LENGTH} characters.`,
  })
  recoveryPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_RECOVERY_PUBLIC_ID_LENGTH, MAX_RECOVERY_PUBLIC_ID_LENGTH };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetRecoveryQueryDto;
