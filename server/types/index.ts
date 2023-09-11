import { ITestFunction } from "../db/models/dbModels";

export enum ICodeLanguage {
  typescript = "Typescript",
  javascript = "Javascript",
}

export enum IResponseStatus {
  success = "success",
  error = "error",
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
  fileName: string;
  lang: ICodeLanguage;
  functions: ITestFunction[];
  imports: string[];
}

export interface IGetOrGenerateUnitTestsResponse {
  imports: string[],
  functions: ITestFunction[]
}