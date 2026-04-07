export interface Result<T = unknown> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}