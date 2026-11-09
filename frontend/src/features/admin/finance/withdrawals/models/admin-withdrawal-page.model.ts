
/**
 * SisiMove Admin — Generic Pagination Models
 */

// =============================================================================
// Pagination Metadata
// =============================================================================

export interface AdminPageMetadata {
  page: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
}

// =============================================================================
// Generic Paginated Result
// =============================================================================

export interface AdminPage<T> {
  items: T[];

  pagination: AdminPageMetadata;
}

// =============================================================================
// Pagination Parameters
// =============================================================================

export interface AdminPageParameters {
  page: number;

  pageSize: number;
}

// =============================================================================
// Default Pagination
// =============================================================================

export const DEFAULT_ADMIN_WITHDRAWAL_PAGE: AdminPageParameters = {
  page: 1,
  pageSize: 20,
};

// =============================================================================
// Pagination Utilities
// =============================================================================

export function calculateAdminPageMetadata(
  totalItems: number,
  page: number,
  pageSize: number,
): AdminPageMetadata {
  const safePageSize = Math.max(1, Math.floor(pageSize));

  const totalPages = Math.ceil(
    Math.max(0, totalItems) / safePageSize,
  );

  const safeTotalItems = Math.max(0, totalItems);

  const safePage = Math.min(
    Math.max(1, Math.floor(page)),
    Math.max(1, totalPages),
  );

  return {
    page: safePage,
    pageSize: safePageSize,
    totalItems: safeTotalItems,
    totalPages,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
  };
}
