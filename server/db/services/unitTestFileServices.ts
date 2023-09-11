import { getDbConnection } from "../connectors/dbConnector";
import { IUnitTestFile } from "../models/dbModels";

const create = async (unitTestFile: IUnitTestFile): Promise<number> => {
  const pool = await getDbConnection();
  const result = await pool
    .request()
    .input("fileName", unitTestFile.fileName)
    .input("sessionId", unitTestFile.sessionId)
    .input("fileLang", unitTestFile.fileLang)
    .input("imports", unitTestFile.imports)
    .input("importsHash", unitTestFile.importsHash)
    .query(`INSERT INTO UnitTestFile 
            (fileName, sessionId, fileLang, imports, importsHash)
            OUTPUT INSERTED.Id 
            VALUES (@fileName, @sessionId, @fileLang, @imports, @importsHash)`);

  return result.recordset[0].Id;
};

const getById = async (id: number): Promise<IUnitTestFile | null> => {
  const pool = await getDbConnection();
  const result = await pool
    .request()
    .input("Id", id)
    .query("SELECT * FROM UnitTestFile WHERE Id = @Id");

  if (result.recordset.length === 0) return null;
  return result.recordset[0];
};

const getBySessionIdAndFileName = async (
  sessionId: string,
  fileName: string
): Promise<IUnitTestFile | null> => {
  const pool = await getDbConnection();
  const result = await pool
    .request()
    .input("sessionId", sessionId)
    .input("fileName", fileName)
    .query(
      "SELECT * FROM UnitTestFile WHERE sessionId = @sessionId AND fileName = @fileName"
    );

  if (result.recordset.length === 0) return null;
  return result.recordset[0];
};

const update = async (
  id: number,
  unitTestFile: IUnitTestFile
): Promise<void> => {
  console.log("⚠️ This is the unit test file to be saved");
  console.log(unitTestFile);

  const pool = await getDbConnection();
  await pool
    .request()
    .input("Id", id)
    .input("fileName", unitTestFile.fileName)
    .input("sessionId", unitTestFile.sessionId)
    .input("fileLang", unitTestFile.fileLang)
    .input("imports", unitTestFile.imports)
    .input("importsHash", unitTestFile.importsHash)
    .query(`UPDATE UnitTestFile 
            SET fileName = @fileName, sessionId = @sessionId, fileLang = @fileLang, imports = @imports, importsHash = @importsHash
            WHERE Id = @Id`);
};

const deleteById = async (id: number): Promise<void> => {
  const pool = await getDbConnection();
  await pool
    .request()
    .input("Id", id)
    .query("DELETE FROM UnitTestFile WHERE Id = @Id");
};

const listAll = async (): Promise<IUnitTestFile[]> => {
  const pool = await getDbConnection();
  const result = await pool.request().query("SELECT * FROM UnitTestFile");

  return result.recordset;
};

export const unitTestFileService = {
  create,
  getById,
  getBySessionIdAndFileName,
  update,
  deleteById,
  listAll,
};
