// -----------------------------------------------------------------------------
// Shared API Types
// -----------------------------------------------------------------------------

export interface ApiEntity {
  publicId: string;
}

export interface ApiListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ApiListResult<T> {
  items: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}