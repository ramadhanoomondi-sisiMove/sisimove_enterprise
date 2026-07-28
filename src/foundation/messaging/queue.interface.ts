// src/foundation/messaging/queue.interface.ts

import type { Message } from './message.interface';

export interface Queue {
  enqueue<T>(queueName: string, message: Message<T>): Promise<void>;

  dequeue<T>(queueName: string): Promise<Message<T> | null>;
}
