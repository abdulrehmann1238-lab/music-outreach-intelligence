export type FailureType =
  | 'source_403'
  | 'source_429'
  | 'local_model_timeout'
  | 'model_malformed'
  | 'gmail_429'
  | 'gmail_auth'
  | 'send_timeout'
  | 'backup_mismatch';

class FailureManager {
  private queue: Set<FailureType> = new Set();

  public inject(type: FailureType): void {
    this.queue.add(type);
  }

  public consume(type: FailureType): boolean {
    if (this.queue.has(type)) {
      this.queue.delete(type);
      return true;
    }
    return false;
  }

  public has(type: FailureType): boolean {
    return this.queue.has(type);
  }

  public clear(): void {
    this.queue.clear();
  }

  public getActiveFailures(): FailureType[] {
    return Array.from(this.queue);
  }
}

export const failureManager = new FailureManager();
