import express from "express";

import * as apiController from "../controllers/apiController";

const router = express.Router();

router.get("/hello-world", apiController.helloWorld);
router.post("/receive-file", apiController.receiveFile);
router.post("/generate-unit-tests", apiController.getOrGenerateUnitTests);
router.post("/regenerate-test-suite", apiController.regenerateTestSuite);
router.post("/regenerate-single-test", apiController.regenerateSingleUnitTest);
router.post("/modify-test-suite", apiController.modifyTestSuite);
router.post("/modify-single-test", apiController.modifySingleUnitTest);
router.post("/feedback-on-failed-test", apiController.feedbackOnFailedTest);

export default router;
