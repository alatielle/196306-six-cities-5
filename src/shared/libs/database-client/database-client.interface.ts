export interface DatabaseClient {
  connect(uri: string, options?: { maxRetries?: number; retryTimeout?: number }): Promise<void>;
  disconnect(): Promise<void>;
}
