// src/foundation/kernel/application/application-result.ts

export interface ApplicationResult<T = void> {
  success: boolean;
  data?: T;
}
