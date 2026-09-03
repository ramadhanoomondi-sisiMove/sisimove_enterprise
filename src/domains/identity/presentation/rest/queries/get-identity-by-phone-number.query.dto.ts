// -----------------------------------------------------------------------------
// Identity — Get Identity By Phone Number Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving an existing Identity aggregate by its
// phone number.
//
// The DTO maps transport input into:
//
//     GetIdentityByPhoneNumberQuery
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// The DTO does NOT:
//
// - access persistence directly;
// - expose persistence or ORM models;
// - resolve internal entity identifiers;
// - mutate the Identity aggregate;
// - execute authentication;
// - manage sessions or devices;
// - perform OTP verification;
// - perform external provider operations.
//
// The query handler is responsible for resolving the complete IdentityAggregate
// through the IdentityRepository.
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

/**
 * Trims surrounding whitespace from a phone number.
 *
 * The DTO intentionally does not perform domain-specific normalization such as
 * country-code inference or canonical E.164 conversion. Those concerns remain
 * the responsibility of the IdentityPhoneNumber value object.
 */
const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PHONE_NUMBER_LENGTH = 1;
const MAX_PHONE_NUMBER_LENGTH = 32;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Transport DTO for retrieving an existing Identity aggregate by phone number.
 *
 * The raw transport value is validated as a non-empty string at the
 * presentation boundary and subsequently converted into the
 * IdentityPhoneNumber domain value object used by
 * GetIdentityByPhoneNumberQuery.
 *
 * Required transport input:
 *
 * - phoneNumber.
 *
 * Domain-specific phone-number validation and normalization remain the
 * responsibility of IdentityPhoneNumber.
 */
export class GetIdentityByPhoneNumberQueryDto {
  // ===========================================================================
  // Phone Number
  // ===========================================================================

  /**
   * Phone number associated with the Identity aggregate.
   *
   * The application mapping layer converts this transport primitive into the
   * IdentityPhoneNumber domain value object before constructing
   * GetIdentityByPhoneNumberQuery.
   */
  @ApiProperty({
    example: '+254712345678',
    description: 'Phone number associated with the Identity aggregate.',
    minLength: MIN_PHONE_NUMBER_LENGTH,
    maxLength: MAX_PHONE_NUMBER_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'phoneNumber must be a string.',
  })
  @MinLength(MIN_PHONE_NUMBER_LENGTH, {
    message: 'phoneNumber must not be empty.',
  })
  @MaxLength(MAX_PHONE_NUMBER_LENGTH, {
    message: `phoneNumber must not exceed ${MAX_PHONE_NUMBER_LENGTH} characters.`,
  })
  phoneNumber!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PHONE_NUMBER_LENGTH as IDENTITY_QUERY_PHONE_NUMBER_MIN_LENGTH,
  MAX_PHONE_NUMBER_LENGTH as IDENTITY_QUERY_PHONE_NUMBER_MAX_LENGTH,
};
