export interface IOpenAIServiceResponse {
  message: string;
}

export interface IParsedFunction {
  name: string;
  code: string;
}

export enum ICodeLanguage {
  typescript = "Typescript",
  javascipt = "Javascript"
}

export enum IResponseStatus {
  success = "success",
  error = "error"
}

export interface ISuccessResponse {
  status: IResponseStatus.success;
  data: object;
  message: string;
}

export interface IErrorResponse {
  status: IResponseStatus.error;
  data: object;
  message: string;
}

export interface IReadFileFunctionsResponse {
  lang: ICodeLanguage,
  functions: string[]
}
