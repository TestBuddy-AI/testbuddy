import express from "express";
import {
  getOrGenerateUnitTests,
  helloWorld,
  receiveFile,
  regenerateSingleUnitTest,
  regenerateTestSuite
} from "../controllers/apiController";

const router = express.Router();

router.get("/hello-world", helloWorld);
router.post("/receive-file", receiveFile);
router.post("/generate-unit-tests", getOrGenerateUnitTests);
router.post("/regenerate-test-suite", regenerateTestSuite);
router.post("/regenerate-single-test", regenerateSingleUnitTest);
// router.post("/modify-test-suite")
// router.post("/modify-test")
// router.post("/feedback-on-failed-test")

export default router;
