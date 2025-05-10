export interface CursorPaging<T, V> {
  dataPag: T[];

  nextCursor: V | null;

  hasMore: boolean;
}
