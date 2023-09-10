import axios from "axios";
import * as vscode from "vscode";
import {
  IErrorResponse,
  IResponseStatus,
  ISuccessResponse,
} from "../types/response";
import path = require("path");
import { showError, showMessage } from "./toast";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "https://testbuddyapi.azurewebsites.net/";
//TO-DO: Manage SESSION on file. GENERATE IT / STORE IT

export const createSessionIdFile = async (): Promise<{ shared: string }> => {
  let encoder = new TextEncoder();
  let sessionObject = {
    shared: uuidv4(),
  };
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders[0].uri,
      "testbuddy/session.json"
    ),
    encoder.encode(JSON.stringify(sessionObject))
  );
  return sessionObject;
};

export const readSessionIdFile = async (): Promise<{ shared: string }> => {
  try {
    let session = (
      await vscode.workspace.fs.readFile(
        vscode.Uri.joinPath(
          vscode.workspace.workspaceFolders[0].uri,
          "testbuddy/session.json"
        )
      )
    ).toString();
    return JSON.parse(session);
  } catch (err) {
    let session = await createSessionIdFile();
    return session;
  }
};

export async function generateTestsRequest(buffer: Buffer, fileName: string) {
  // 👇️ const data: GetUsersResponse
  console.log("GenerateTestsRequest");
  try {
    let { shared } = await readSessionIdFile();

    console.log("ejecutando");
    let rSendFile = await sendFile(buffer, fileName);

    console.log(rSendFile.status, "<---- Status Sendfile");

    const { data, status } = await getTests(fileName, shared);
    console.log(status, "<---- Status genUnitTests");
    return data;
  } catch (error: any) {
    console.log(error);
    showError(
      "Oops something went wrong when trying to generate the tests, Please try again"
    );
  }
}

export async function regenerateTest(buffer: Buffer, fileName: string) {
  // 👇️ const data: GetUsersResponse
  console.log("RegenerateTestsRequest");
  try {
    let { shared } = await readSessionIdFile();

    console.log("ejecutando");
    let rSendFile = await sendFile(buffer, fileName);

    console.log(rSendFile.status, "<---- Status Sendfile");

    const { data, status } = await getTests(fileName, shared);
    console.log(status, "<---- Status genUnitTests");
    return data;
  } catch (error: any) {
    console.log(error);
    showError(
      "Oops something went wrong when trying to generate the tests, Please try again"
    );
  }
}

const sendFile = (buffer: Buffer, fileName: string) =>
  axios.post(`${BASE_URL}/receiveFile`, buffer, {
    headers: {
      "Content-Type": "application/octet-stream", // Change this to send as raw binary data
      "File-Name": path.basename(fileName),
    },
  });

const getTests = (fileName: string, session: string) => {
  return axios.post(`${BASE_URL}/generate-unit-tests`, {
    sessionId: session,
    fileName: path.basename(fileName),
  });
};
const getRegeneratedTestSuite = (fileName: string, session: string) => {
  return axios.post(`${BASE_URL}/regenerate-test-suite`, {
    sessionId: session,
    fileName: path.basename(fileName),
  });
};
const getRegeneratedTestSingle = (
  fileName: string,
  session: string,
  testName: string
) => {
  return axios.post(`${BASE_URL}/regenerate-test`, {
    sessionId: session,
    fileName: path.basename(fileName),
    test: testName,
  });
};
const getModifiedTestSuite = (
  fileName: string,
  session: string,
  userInput: string
) => {
  return axios.post(`${BASE_URL}/modify-test-suite`, {
    sessionId: session,
    fileName: path.basename(fileName),
    userInput: userInput,
  });
};

const getModifiedTestSingle = (
  fileName: string,
  session: string,
  testName: string,
  userInput: string
) => {
  return axios.post(`${BASE_URL}/modify-test`, {
    sessionId: session,
    fileName: path.basename(fileName),
    test: testName,
    userInput: userInput,
  });
};

const getFeedbackOnFailedTest = (
  fileName: string,
  session: string,
  error: string
) => {
  return axios.post(`${BASE_URL}/modify-test`, {
    sessionId: session,
    fileName: path.basename(fileName),
    error: error,
  });
};
