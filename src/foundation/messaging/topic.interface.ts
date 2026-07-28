// src/foundation/messaging/topic.interface.ts

export interface Topic {
  readonly name: string;
  readonly partitions?: number;
  readonly replicationFactor?: number;
}
