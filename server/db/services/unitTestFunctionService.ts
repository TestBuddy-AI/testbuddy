import { getDbConnection } from "../connectors/dbConnector";
import { ITestFunction } from "../models/dbModels";

const create = async (unitTestFunction: ITestFunction): Promise<number> => {
  const pool = await getDbConnection();
  const result = await pool
    .request()
    .input("hash", unitTestFunction.hash)
    .input("code", unitTestFunction.code)
    .input("unitTests", unitTestFunction.unitTests)
    .input("unitTestFileId", unitTestFunction.unitTestFileId).query(`
      INSERT INTO UnitTestFunction (hash, code, unitTests, unitTestFileId)
      OUTPUT INSERTED.Id 
      VALUES (@hash, @code, @unitTests, @unitTestFileId)
    `);

  return result.recordset[0].Id;
};

const getById = async (id: number): Promise<ITestFunction | null> => {
  const pool = await getDbConnection();
  const result = await pool
    .request()
    .input("Id", id)
    .query("SELECT * FROM UnitTestFunction WHERE Id = @Id");

  if (result.recordset.length === 0) return null;
  return result.recordset[0];
};

const getByHash = async (hash: string): Promise<ITestFunction | null> => {
  const pool = await getDbConnection();
  const result = await pool
  .request()
  .input("hash", hash)
  .query("SELECT * FROM UnitTestFunction WHERE hash = @hash");

  if (result.recordset.length === 0) return null;
  return result.recordset[0];
};

const update = async (
  id: number,
  unitTestFunction: ITestFunction
): Promise<void> => {
  const pool = await getDbConnection();
  await pool
    .request()
    .input("Id", id)
    .input("hash", unitTestFunction.hash)
    .input("code", unitTestFunction.code)
    .input("unitTests", unitTestFunction.unitTests)
    .input("unitTestFileId", unitTestFunction.unitTestFileId).query(`
      UPDATE UnitTestFunction 
      SET hash = @hash, code = @code, unitTests = @unitTests, unitTestFileId = @unitTestFileId
      WHERE Id = @Id
    `);
};

const deleteById = async (id: number): Promise<void> => {
  const pool = await getDbConnection();
  await pool
    .request()
    .input("Id", id)
    .query("DELETE FROM UnitTestFunction WHERE Id = @Id");
};

const listAll = async (): Promise<ITestFunction[]> => {
  const pool = await getDbConnection();
  const result = await pool.request().query("SELECT * FROM UnitTestFunction");

  return result.recordset;
};

const listByFileId = async (
  unitTestFileId: number
): Promise<ITestFunction[] | null> => {
  const pool = await getDbConnection();
  const result = await pool
    .request()
    .input("unitTestFileId", unitTestFileId)
    .query(
      "SELECT * FROM UnitTestFunction WHERE unitTestFileId = @unitTestFileId"
    );

  return result.recordset;
};

export const unitTestFunctionService = {
  create,
  getById,
  getByHash,
  update,
  deleteById,
  listAll,
  listByFileId,
};
