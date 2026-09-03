// -----------------------------------------------------------------------------
// Identity — Get Permissions Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Permission aggregates.
//
// This query intentionally has no filtering semantics. Specialized queries
// such as GetActivePermissionsQuery, GetSystemPermissionsQuery, and
// GetAssignablePermissionsQuery should express specialized read intent.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetPermissionsQuery implements Query {}
