// -----------------------------------------------------------------------------
// Request Context
// -----------------------------------------------------------------------------

export interface RequestContext {
  accessToken?: string;
  correlationId?: string;
  signal?: AbortSignal;
}

export interface RequestOptions {
  headers?: HeadersInit;
  query?: Record<
    string,
    string | number | boolean | null | undefined
  >;
  context?: RequestContext;
}