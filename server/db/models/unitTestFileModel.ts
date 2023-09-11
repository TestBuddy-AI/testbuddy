export interface IUnitTestFile {
  fileName: string;
  sessionId: string;
  functions?: ITestFunction[];
  // TODO: add values to properties on runtime
  // prompt_tokens: number;
  // completion_tokens: number;
  // requestTime: number;
  // fileLang: ICodeLanguage;
}

export interface ITestFunction {
  hash: string;
  code: string;
  unitTests?: string;
  unitTestFileId?: number;
}
