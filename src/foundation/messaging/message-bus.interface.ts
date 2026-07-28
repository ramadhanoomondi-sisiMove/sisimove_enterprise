// src/foundation/messaging/message-bus.interface.ts

import type { Message } from './message.interface';

export interface MessageBus {
  publish<T>(topic: string, message: Message<T>): Promise<void>;

  subscribe<T>(
    topic: string,
    handler: (message: Message<T>) => Promise<void>,
  ): Promise<void>;
}
