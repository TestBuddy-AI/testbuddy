import { getDbConnection } from '../connectors/dbConnector';
import { IUnitTestFile } from '../models/unitTestFileModel';

const create = async (unitTestFile: IUnitTestFile): Promise<number> => {
    const pool = await getDbConnection();
    const result = await pool.request()
        .input('fileName', unitTestFile.fileName)
        .input('fileHash', unitTestFile.fileHash)
        .input('sessionId', unitTestFile.sessionId)
        .input('unitTests', unitTestFile.unitTests)
        .input('prompt_tokens', unitTestFile.prompt_tokens)
        .input('completion_tokens', unitTestFile.completion_tokens)
        .input('requestTime', unitTestFile.requestTime)
        .input('fileLang', unitTestFile.fileLang)
        .query(`INSERT INTO UnitTestFiles 
            (fileName, fileHash, sessionId, unitTests, prompt_tokens, completion_tokens, requestTime, fileLang)
            OUTPUT INSERTED.Id 
            VALUES (@fileName, @fileHash, @sessionId, @unitTests, @prompt_tokens, @completion_tokens, @requestTime, @fileLang)`);
        
    return result.recordset[0].Id;
};

const getById = async (id: number): Promise<IUnitTestFile | null> => {
    const pool = await getDbConnection();
    const result = await pool.request()
        .input('Id', id)
        .query('SELECT * FROM UnitTestFiles WHERE Id = @Id');

    if (result.recordset.length === 0) return null;
    return result.recordset[0];
};

const update = async (id: number, unitTestFile: IUnitTestFile): Promise<void> => {
    const pool = await getDbConnection();
    await pool.request()
        .input('Id', id)
        .input('fileName', unitTestFile.fileName)
        .input('fileHash', unitTestFile.fileHash)
        .input('sessionId', unitTestFile.sessionId)
        .input('unitTests', unitTestFile.unitTests)
        .input('prompt_tokens', unitTestFile.prompt_tokens)
        .input('completion_tokens', unitTestFile.completion_tokens)
        .input('requestTime', unitTestFile.requestTime)
        .input('fileLang', unitTestFile.fileLang)
        .query(`UPDATE UnitTestFiles 
            SET fileName = @fileName, fileHash = @fileHash, sessionId = @sessionId, 
                unitTests = @unitTests, prompt_tokens = @prompt_tokens, completion_tokens = @completion_tokens, 
                requestTime = @requestTime, fileLang = @fileLang 
            WHERE Id = @Id`);
};

const deleteById = async (id: number): Promise<void> => {
    const pool = await getDbConnection();
    await pool.request()
        .input('Id', id)
        .query('DELETE FROM UnitTestFiles WHERE Id = @Id');
};

const listAll = async (): Promise<IUnitTestFile[]> => {
    const pool = await getDbConnection();
    const result = await pool.request()
        .query('SELECT * FROM UnitTestFiles');
        
    return result.recordset;
};

export const unitTestFileService = {
    create,
    getById,
    update,
    deleteById,
    listAll
};
