export interface IOpenAIServiceResponse {
  message: string;
}

export interface IParsedFunction {
  name: string;
  code: string;
}

export enum ICodeLanguage {
  typescript = "Typescript",
  javascipt = "Javascript",
  typescriptreact = "Typescript React"
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
  functions: ITestFunction[]
}

export interface IUnitTestFile {
  fileName: string;
  sessionId: string;
  conversation?: IConversation[],
  functions: ITestFunction[]
  // TODO: add values to properties on runtime
  // prompt_tokens: number;
  // completion_tokens: number;
  // requestTime: number;
  // fileLang: ICodeLanguage;
}

export interface ITestFunction {
  fileName: string;
  hash: string;
  code: string;
  unitTests?: string;
}

export interface IConversation {
  user: string;
  assistant: string;
}
