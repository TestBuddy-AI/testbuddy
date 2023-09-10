import express from "express";
import { Request, Response } from "express";
import { getOrGenerateUnitTests, helloWorld, receiveFile, unitTestsPrompt } from "../controllers/apiController";
import { IResponseStatus, ISuccessResponse } from "../types";

const router = express.Router();
const returnDirect = (req: Request, res: Response)=>{
    console.log(req.body.sessionId)
    console.log("enviando")
    res.status(200).send({
        status: IResponseStatus.success,
        data:    {
            result:`import {parse} from 'jest-editor-support'
    
            test('parse - valid path', () => {
              const path = "/Users/camilo.salinas/Documents/Personal/testproject/tests/Form.test.tsx";
              const result = parse(path);
              expect(result).toEqual({
                directory: "/Users/camilo.salinas/Documents/Personal/testproject/tests",
                filename: "Form.test.tsx",
                extension: "tsx"
              });
            });
            
            test('parse - path without extension', () => {
              const path = "/Users/camilo.salinas/Documents/Personal/testproject/tests/Form";
              const result = parse(path);
              expect(result).toEqual({
                directory: "/Users/camilo.salinas/Documents/Personal/testproject/tests",
                filename: "Form",
                extension: ""
              });
            });
            
            test('parse - path without directory', () => {
              const path = "Form.test.tsx";
              const result = parse(path);
              expect(result).toEqual({
                directory: "",
                filename: "Form.test.tsx",
                extension: "tsx"
              });
            });
            
            test('parse - empty path', () => {
              const path = "";
              const result = parse(path);
              expect(result).toEqual({
                directory: "",
                filename: "",
                extension: ""
              });
            });`
        },
        message:"message"
      } as ISuccessResponse);
 
}

router.post("/unit-tests-prompt", unitTestsPrompt);
router.get("/hello-world", helloWorld);
router.post("/receiveFile", receiveFile);
router.post("/generate-unit-tests", returnDirect);

export default router;
