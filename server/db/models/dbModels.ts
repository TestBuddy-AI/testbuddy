import { ICodeLanguage } from "../../types";

export interface IUnitTestFile {
  id?: number;
  fileName: string;
  sessionId: string;
  fileLang: ICodeLanguage;
  imports?: string;
  importsHash?: string;
  // TODO: add values to properties on runtime
  // fileLang: ICodeLanguage;
  // prompt_tokens: number;
  // completion_tokens: number;
  // requestTime: number;
}

export interface ITestFunction {
  id?: number;
  hash: string;
  code: string;
  unitTests?: string;
  unitTestFileId?: number;
}
