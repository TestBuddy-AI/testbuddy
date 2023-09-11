import { unitTestFileService } from "./services/unitTestFileServices";
import { unitTestFunctionService } from "./services/unitTestFunctionService";

const runCrudOperations = async () => {
  try {
    console.log("Starting CRUD operations for UnitTestFile...");

    // Create for UnitTestFile
    const newUnitTestFile = {
      fileName: "testFile.ts",
      sessionId: "session123",
    };

    const fileId = await unitTestFileService.create(newUnitTestFile);
    console.log(`New UnitTestFile record created with ID: ${fileId}`);

    // Retrieve for UnitTestFile
    const retrievedFile = await unitTestFileService.getById(fileId);
    if (!retrievedFile) {
      throw new Error(`No UnitTestFile record found with ID: ${fileId}`);
    }
    console.log("Retrieved UnitTestFile record:", retrievedFile);

    // Retrieve for UnitTestFile
    const retrievedFile2 = await unitTestFileService.getBySessionIdAndFileName(
      "session123",
      "testFile.ts"
    );
    if (!retrievedFile) {
      throw new Error(
        `No UnitTestFile record found with sessionId: session123 and fileName: testFile.ts`
      );
    }
    console.log(
      "Retrieved UnitTestFile by sessionId and fileName record:",
      retrievedFile2
    );

    // Update for UnitTestFile
    const updatedFileName = "updatedTestFile.ts";
    await unitTestFileService.update(fileId, {
      ...retrievedFile,
      fileName: updatedFileName,
    });
    console.log(`UnitTestFile record with ID ${fileId} updated.`);

    const updatedFile = await unitTestFileService.getById(fileId);
    if (!updatedFile) {
      throw new Error(
        `No UnitTestFile record found with ID: ${fileId} after update`
      );
    }
    console.log("Updated UnitTestFile record:", updatedFile);

    console.log("Starting CRUD operations for UnitTestFunction...");

    // Create for UnitTestFunction
    const newUnitTestFunction = {
      hash: "hash123456",
      code: "function test() { return true; }",
      unitTests: "unitTestsSample",
      unitTestFileId: fileId,
    };

    const functionId = await unitTestFunctionService.create(
      newUnitTestFunction
    );
    console.log(`New UnitTestFunction record created with ID: ${functionId}`);

    // Retrieve for UnitTestFunction
    const retrievedFunction = await unitTestFunctionService.getById(functionId);
    if (!retrievedFunction) {
      throw new Error(
        `No UnitTestFunction record found with ID: ${functionId}`
      );
    }
    console.log("Retrieved UnitTestFunction record:", retrievedFunction);

    // Update for UnitTestFunction
    const updatedCode = "function updatedTest() { return false; }";
    await unitTestFunctionService.update(functionId, {
      ...retrievedFunction,
      code: updatedCode,
    });
    console.log(`UnitTestFunction record with ID ${functionId} updated.`);

    const updatedFunction = await unitTestFunctionService.getById(functionId);
    if (!updatedFunction) {
      throw new Error(
        `No UnitTestFunction record found with ID: ${functionId} after update`
      );
    }
    console.log("Updated UnitTestFunction record:", updatedFunction);

    // List all records for UnitTestFunction
    const allFunctionRecords = await unitTestFunctionService.listAll();
    console.log("All UnitTestFunction records:", allFunctionRecords);

    // Delete for UnitTestFunction
    await unitTestFunctionService.deleteById(functionId);
    console.log(`UnitTestFunction record with ID ${functionId} deleted.`);

    // List all records for UnitTestFile
    const allFileRecords = await unitTestFileService.listAll();
    console.log("All UnitTestFile records:", allFileRecords);

    // Delete for UnitTestFile
    await unitTestFileService.deleteById(fileId);
    console.log(`UnitTestFile record with ID ${fileId} deleted.`);

    console.log("CRUD operations completed!");
  } catch (error) {
    console.error("Error during CRUD operations:", error);
  }
};

runCrudOperations();
