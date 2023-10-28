export interface IsDocumentAuthor {
  isAuthor(userId: string, documentId: string): Promise<boolean>;
}
