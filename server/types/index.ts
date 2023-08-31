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
  fileName: string,
  lang: ICodeLanguage,
  functions: string[]
}

export interface IUnitTestFile {
  fileName: string;
  fileHash: string;
  sessionId: string;
  unitTests: string;
  conversation?: IConversation[]
  // TODO: add values to properties on runtime
  // prompt_tokens: number;
  // completion_tokens: number;
  // requestTime: number;
  // fileLang: ICodeLanguage;
}

export interface IConversation {
  user: string;
  assistant: string;
}
