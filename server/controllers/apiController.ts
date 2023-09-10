import { Request, Response } from "express";
import * as codeFileService from "../services/codeFileService";
import * as openaiService from "../services/openaiService";
import { ICodeLanguage, IErrorResponse, IResponseStatus, ISuccessResponse } from "../types";

export const helloWorld = async (req: Request, res: Response) => {
  res.status(200).send({
    status: IResponseStatus.success,
    data: {},
    message: "Hello World!"
  } as ISuccessResponse);
};

export const unitTestsPrompt = async (req: Request, res: Response) => {
  try {
    const userMessage = req.body.userMessage;
    const response = await openaiService.unitTestsPrompt(userMessage, ICodeLanguage.javascipt);

    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const receiveFile = async (req: Request, res: Response) => {
  const fileName = req.headers["file-name"] as string;

  if (!fileName) {
    return res.status(400).send({
      status: IResponseStatus.error,
      data: {},
      message: "File name header missing"
    } as IErrorResponse);
  }

  if (!(req.body instanceof Buffer)) {
    return res.status(400).send({
      status: IResponseStatus.error,
      data: {},
      message: "Expected buffer data"
    } as IErrorResponse);
  }

  const error = (message: string) => {
    return res.status(500).send({
      status: IResponseStatus.error,
      data: {},
      message
    } as IErrorResponse);
  };

  const success = (message: string) => {
    res.status(200).send({
      status: IResponseStatus.success,
      data: {},
      message
    } as ISuccessResponse);
  };

  codeFileService.receiveFile(fileName, req.body, success, error);
};

export const getOrGenerateUnitTests = async (req: Request, res: Response) => {
  try {
    const { sessionId, fileName } = req.body;

    const existingTests = await codeFileService.getOrGenerateUnitTests(sessionId, fileName);

    await codeFileService.storeUnitTests(existingTests || [], sessionId, fileName);

    console.info(`These are the existing tests ${existingTests}`);

    const unitTestsArray = existingTests?.map(fn => fn.unitTests);

    const result = unitTestsArray?.join(" ");

    await codeFileService.removeFile(fileName);

    res.status(200).send({
      status: IResponseStatus.success,
      data: { result },
      message: ""
    } as ISuccessResponse);
  } catch (error) {
    res.status(500).send(
      {
        status: IResponseStatus.error,
        message: (error as unknown)?.toString(),
        data: {}
      } as IErrorResponse
    );
  }
};