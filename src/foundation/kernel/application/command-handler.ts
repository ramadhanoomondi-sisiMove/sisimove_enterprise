//src/foundation/kernel/application/command-handlers.ts
import type { Command } from './command';

export interface CommandHandler<C extends Command, R = void> {
  execute(command: C): Promise<R>;
}
