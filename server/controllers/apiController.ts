import { Request, Response } from "express";
import * as codeFileService from "../services/codeFileService";
import { IErrorResponse, IResponseStatus, ISuccessResponse } from "../types";

export const helloWorld = async (req: Request, res: Response) => {
  res.status(200).send({
    status: IResponseStatus.success,
    data: {},
    message: "Hello World!",
  } as ISuccessResponse);
};

export const receiveFile = async (req: Request, res: Response) => {
  const fileName = req.headers["file-name"] as string;
  const filePath = req.headers["file-path"] as string;
  const filePathWithSeparator = codeFileService.reformatFilePath(filePath);

  if (!fileName) {
    return res.status(400).send({
      status: IResponseStatus.error,
      data: {},
      message: "File-Name header missing",
    } as IErrorResponse);
  }

  if (!filePath) {
    return res.status(400).send({
      status: IResponseStatus.error,
      data: {},
      message: "File-Path header missing",
    } as IErrorResponse);
  }

  if (!(req.body instanceof Buffer)) {
    return res.status(400).send({
      status: IResponseStatus.error,
      data: {},
      message: "Expected buffer data",
    } as IErrorResponse);
  }

  const error = (message: string) => {
    return res.status(500).send({
      status: IResponseStatus.error,
      data: {},
      message,
    } as IErrorResponse);
  };

  const success = (message: string) => {
    res.status(200).send({
      status: IResponseStatus.success,
      data: {},
      message,
    } as ISuccessResponse);
  };

  codeFileService.receiveFile(filePathWithSeparator, req.body, success, error);
};

export const getOrGenerateUnitTests = async (req: Request, res: Response) => {
  try {
    const { sessionId, filePath } = req.body;
    const fileName = codeFileService.reformatFilePath(filePath);
    const unitTests = await codeFileService.getOrGenerateUnitTests(
      sessionId,
      fileName
    );

    await codeFileService.storeUnitTests(
      unitTests || [],
      sessionId,
      fileName
    );

    const unitTestsArray = unitTests?.map((fn) => fn.unitTests);
    const result = unitTestsArray?.join(" ");

    await codeFileService.removeFile(fileName);

    res.status(200).send({
      status: IResponseStatus.success,
      data: { result },
      message: "",
    } as ISuccessResponse);
  } catch (error) {
    res.status(500).send({
      status: IResponseStatus.error,
      message: (error as unknown)?.toString(),
      data: {},
    } as IErrorResponse);
  }
};
