export interface IUnitTestFile {
  id?: number;
  fileName: string;
  sessionId: string;
  // TODO: add values to properties on runtime
  // prompt_tokens: number;
  // completion_tokens: number;
  // requestTime: number;
  // fileLang: ICodeLanguage;
}

export interface ITestFunction {
  id?: number;
  hash: string;
  code: string;
  unitTests?: string;
  unitTestFileId?: number;
}
