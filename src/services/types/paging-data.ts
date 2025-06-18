export default interface PagingData<T> {
  dataPag: T[];
  nextCursor: number;
  hasMore: boolean;
}
