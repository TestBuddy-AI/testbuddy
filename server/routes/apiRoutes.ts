import express from "express";
import { generateUnitTests, helloWorld, receiveFile, unitTestsPrompt } from "../controllers/apiController";

const router = express.Router();

router.post("/unit-tests-prompt", unitTestsPrompt);
router.get("/hello-world", helloWorld);
router.post("/receiveFile", receiveFile);
router.post("/generate-unit-tests", generateUnitTests);

export default router;
