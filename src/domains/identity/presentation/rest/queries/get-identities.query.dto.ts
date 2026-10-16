// -----------------------------------------------------------------------------
// Identity — Get Identities Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving a paginated directory of Identity
// aggregates.
//
// The DTO maps HTTP query parameters into:
//
//     GetIdentitiesQuery
//
// Query handler:
//
//     GetIdentitiesHandler
//
// Repository contract:
//
//     IdentityRepository.searchDirectory()
//
// This DTO does NOT:
//
// - access persistence directly;
// - expose Prisma or ORM models;
// - construct domain value objects;
// - resolve or mutate Identity aggregates;
// - assign or revoke Identity Roles;
// - evaluate permissions;
// - persist directory results.
//
// The controller is responsible for mapping validated transport values into
// GetIdentitiesQuery. The query handler delegates directory retrieval to the
// IdentityRepository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, Type, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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

const MIN_PAGE = 1;
const DEFAULT_PAGE = 1;

const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

const MIN_SEARCH_LENGTH = 1;
const MAX_SEARCH_LENGTH = 200;

const MIN_ROLE_PUBLIC_ID_LENGTH = 1;
const MAX_ROLE_PUBLIC_ID_LENGTH = 128;

const IDENTITY_STATUSES = ['PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED'] as const;

const DIRECTORY_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'email',
  'status',
] as const;

const SORT_DIRECTIONS = ['asc', 'desc'] as const;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Transport DTO for filtering, sorting, and paging the Identity directory.
 *
 * Query parameters:
 *
 * - page: one-based page number;
 * - pageSize: number of records per page;
 * - search: optional search term;
 * - status: optional Identity lifecycle status;
 * - rolePublicId: optional role public identifier filter;
 * - createdFrom / createdTo: optional ISO 8601 creation-date boundaries;
 * - sortBy: supported directory sort field;
 * - sortDirection: ascending or descending order.
 *
 * This DTO validates transport shape. Domain status and role public identifier
 * value objects are constructed by the controller.
 */
export class GetIdentitiesQueryDto {
  // ===========================================================================
  // Pagination
  // ===========================================================================

  @ApiPropertyOptional({
    example: DEFAULT_PAGE,
    description: 'One-based page number.',
    minimum: MIN_PAGE,
    default: DEFAULT_PAGE,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'page must be an integer.',
  })
  @Min(MIN_PAGE, {
    message: `page must be at least ${MIN_PAGE}.`,
  })
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    example: DEFAULT_PAGE_SIZE,
    description: 'Maximum number of identities returned per page.',
    minimum: MIN_PAGE_SIZE,
    maximum: MAX_PAGE_SIZE,
    default: DEFAULT_PAGE_SIZE,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'pageSize must be an integer.',
  })
  @Min(MIN_PAGE_SIZE, {
    message: `pageSize must be at least ${MIN_PAGE_SIZE}.`,
  })
  @Max(MAX_PAGE_SIZE, {
    message: `pageSize must not exceed ${MAX_PAGE_SIZE}.`,
  })
  pageSize: number = DEFAULT_PAGE_SIZE;

  // ===========================================================================
  // Search
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'member@example.com',
    description: 'Search term supported by the identity directory.',
    minLength: MIN_SEARCH_LENGTH,
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'search must be a string.',
  })
  @MinLength(MIN_SEARCH_LENGTH, {
    message: 'search must not be empty.',
  })
  @MaxLength(MAX_SEARCH_LENGTH, {
    message: `search must not exceed ${MAX_SEARCH_LENGTH} characters.`,
  })
  search?: string;

  // ===========================================================================
  // Lifecycle Status Filter
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Filter by Identity lifecycle status.',
    enum: IDENTITY_STATUSES,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'status must be a string.',
  })
  @IsIn(IDENTITY_STATUSES, {
    message: `status must be one of: ${IDENTITY_STATUSES.join(', ')}.`,
  })
  status?: (typeof IDENTITY_STATUSES)[number];

  // ===========================================================================
  // Role Filter
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'ROL-01K3R8Y7Q2',
    description:
      'Public identifier of a role used to filter identities by active role assignment.',
    minLength: MIN_ROLE_PUBLIC_ID_LENGTH,
    maxLength: MAX_ROLE_PUBLIC_ID_LENGTH,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'rolePublicId must be a string.',
  })
  @MinLength(MIN_ROLE_PUBLIC_ID_LENGTH, {
    message: 'rolePublicId must not be empty.',
  })
  @MaxLength(MAX_ROLE_PUBLIC_ID_LENGTH, {
    message: `rolePublicId must not exceed ${MAX_ROLE_PUBLIC_ID_LENGTH} characters.`,
  })
  rolePublicId?: string;

  // ===========================================================================
  // Creation Date Range
  // ===========================================================================

  @ApiPropertyOptional({
    example: '2026-01-01T00:00:00.000Z',
    description:
      'Inclusive lower boundary for identity creation time, as an ISO 8601 date.',
  })
  @IsOptional()
  @Transform(trimString)
  @IsDateString(
    {},
    {
      message: 'createdFrom must be a valid ISO 8601 date string.',
    },
  )
  createdFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.999Z',
    description:
      'Inclusive upper boundary for identity creation time, as an ISO 8601 date.',
  })
  @IsOptional()
  @Transform(trimString)
  @IsDateString(
    {},
    {
      message: 'createdTo must be a valid ISO 8601 date string.',
    },
  )
  createdTo?: string;

  // ===========================================================================
  // Sorting
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Directory field used to sort results.',
    enum: DIRECTORY_SORT_FIELDS,
    default: 'createdAt',
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'sortBy must be a string.',
  })
  @IsIn(DIRECTORY_SORT_FIELDS, {
    message: `sortBy must be one of: ${DIRECTORY_SORT_FIELDS.join(', ')}.`,
  })
  sortBy: (typeof DIRECTORY_SORT_FIELDS)[number] = 'createdAt';

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort direction.',
    enum: SORT_DIRECTIONS,
    default: 'desc',
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'sortDirection must be a string.',
  })
  @IsIn(SORT_DIRECTIONS, {
    message: `sortDirection must be one of: ${SORT_DIRECTIONS.join(', ')}.`,
  })
  sortDirection: (typeof SORT_DIRECTIONS)[number] = 'desc';
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  DEFAULT_PAGE as GET_IDENTITIES_QUERY_DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE as GET_IDENTITIES_QUERY_DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE as GET_IDENTITIES_QUERY_MAX_PAGE_SIZE,
  MAX_SEARCH_LENGTH as GET_IDENTITIES_QUERY_MAX_SEARCH_LENGTH,
  MAX_ROLE_PUBLIC_ID_LENGTH as GET_IDENTITIES_QUERY_MAX_ROLE_PUBLIC_ID_LENGTH,
};
