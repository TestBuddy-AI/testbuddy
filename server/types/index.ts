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