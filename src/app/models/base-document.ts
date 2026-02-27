export interface BaseDocument<T> {
  docId: string;
  docType: string;
  data: T;
}
