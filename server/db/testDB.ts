import { unitTestFileService } from "./services/unitTestFileServices";

const runCrudOperations = async () => {
    try {
        console.log("Starting CRUD operations...");

        // Create
        const newUnitTestFile = {
            fileName: "testFile.ts",
            fileHash: "abcdef123456",
            sessionId: "session123",
            unitTests: "unitTestsSample",
            prompt_tokens: 123,
            completion_tokens: 456,
            requestTime: 100,
            fileLang: "typescript"
        };

        const id = await unitTestFileService.create(newUnitTestFile);
        console.log(`New record created with ID: ${id}`);

        // Retrieve
        const retrieved = await unitTestFileService.getById(id);
        if (!retrieved) {
            throw new Error(`No record found with ID: ${id}`);
        }
        console.log("Retrieved record:", retrieved);

        // Update
        const updatedName = "updatedTestFile.ts";
        await unitTestFileService.update(id, {
            ...retrieved,
            fileName: updatedName
        });
        console.log(`Record with ID ${id} updated.`);

        const updated = await unitTestFileService.getById(id);
        if (!updated) {
            throw new Error(`No record found with ID: ${id} after update`);
        }
        console.log("Updated record:", updated);


        // List all records
        const allRecords = await unitTestFileService.listAll();
        console.log("All records:", allRecords);

        // Delete
        await unitTestFileService.deleteById(id);
        console.log(`Record with ID ${id} deleted.`);

        console.log("CRUD operations completed!");
    } catch (error) {
        console.error("Error during CRUD operations:", error);
    }
};

runCrudOperations();