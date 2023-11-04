export interface DatabaseClient {
  connect(uri: string, maxRetries: number, retryTimeout: number): Promise<void>;
  disconnect(): Promise<void>;
}
