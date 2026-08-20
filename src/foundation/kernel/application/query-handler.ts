//src/foundation/kernel/application/query-handler.ts
import type { Query } from './query';

export interface QueryHandler<Q extends Query, R> {
  execute(query: Q): Promise<R>;
}
