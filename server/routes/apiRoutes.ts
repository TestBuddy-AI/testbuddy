import express from "express";
import { generateUnitTests, readJSFile, readTSFile } from "../controllers/apiController";
import { helloWorld } from "../controllers/apiController";

const router = express.Router();

router.post("/generate-unit-tests", generateUnitTests);
router.get("/hello-world", helloWorld);
router.post("/read-ts-file", readTSFile);
router.post("/read-js-file", readJSFile);

export default router;
