export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  invalidFields?: { [key: string]: string[] };
};
