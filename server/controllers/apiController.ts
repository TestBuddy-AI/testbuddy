import { Request, Response } from "express";
import * as codeFileService from "../services/codeFileService";
import * as openaiService from "../services/openaiService";

export const helloWorld = async (req: Request, res: Response) => {
  res.send("Hello World!");
};

export const generateUnitTests = async (req: Request, res: Response) => {
  try {
    // TODO: read from file
    const userMessage = req.body.userMessage;
    const response = await openaiService.generateUnitTests(userMessage);

    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const readTSFile = async (req: Request, res: Response) => {
  const result = codeFileService.readTypescriptFile();
  res.send(result);
}

export const readJSFile = async (req: Request, res: Response) => {
  const result = codeFileService.readJavascriptFile();
  res.send(result);
}
