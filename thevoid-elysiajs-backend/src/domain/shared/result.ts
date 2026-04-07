export type Result<T> = {
    code: number;
    data: T;
    message: string;
    success: boolean;
};

export const success = <T>(data: T, message = "success"): Result<T> => ({
  code: 200,
  data,
  message,
  success: true,
});

export const fail = <T>(data: T, message = "fail"): Result<T> => ({
  code: 400,
  data,
  message,
  success: false,
});