export interface IUnitTestFile {
    id?: number; 
    fileName: string;
    fileHash: string;
    sessionId: string;
    unitTests: string;
    prompt_tokens?: number;
    completion_tokens?: number;
    requestTime: number;
    fileLang: string; 
}