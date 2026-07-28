// src/foundation/messaging/message.interface.ts

export interface Message<T = unknown> {
  readonly messageId: string;
  readonly type: string;
  readonly payload: Readonly<T>;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly timestamp: Date;
}
