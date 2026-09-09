// -----------------------------------------------------------------------------
// Async State
// -----------------------------------------------------------------------------

export type AsyncStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
}

export const idleAsyncState = <T>(): AsyncState<T> => ({
  status: 'idle',
  data: null,
  error: null,
});