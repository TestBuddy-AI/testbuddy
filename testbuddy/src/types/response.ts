export enum IResponseStatus {
  success = "success",
  error = "error",
}

export interface ISuccessResponse {
  status: IResponseStatus.success;
  data: {};
  message: string;
}

export interface IErrorResponse {
  status: IResponseStatus.error;
  data: {};
  message: string;
}
