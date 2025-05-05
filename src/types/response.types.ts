export interface ResponseData<T> {
  success: boolean;
  message: string;
  data: T;
  errors: { [key: string]: string[] };
}
