import express from "express";
import {
  getOrGenerateUnitTests,
  helloWorld,
  receiveFile,
} from "../controllers/apiController";

const router = express.Router();

router.get("/hello-world", helloWorld);
router.post("/receive-file", receiveFile);
router.post("/generate-unit-tests", getOrGenerateUnitTests);

export default router;
