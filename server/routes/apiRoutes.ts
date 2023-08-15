import express from 'express';
import { generateUnitTests } from '../controllers/apiController';
import { helloWorld } from '../controllers/apiController';

const router = express.Router();

router.post('/generate-unit-tests', generateUnitTests);
router.get('/hello-world', helloWorld);

export default router;
