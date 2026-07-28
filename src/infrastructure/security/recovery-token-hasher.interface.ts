export interface RecoveryTokenHasher {
  hash(value: string): string;

  verify(value: string, hash: string): boolean;
}
