
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

  /**
   * Controls how a successful HTTP response is read.
   *
   * Defaults to the existing JSON/text parsing behavior.
   * Use "blob" for private binary content such as evidence images.
   */
  responseType?: 'json' | 'blob';
}
