export default interface PagingData<T> {
  data: T[];
  nextCursor: number;
  hasNext: boolean;
}
