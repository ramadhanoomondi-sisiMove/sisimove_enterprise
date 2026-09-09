// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}