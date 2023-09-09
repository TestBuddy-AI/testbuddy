import axios from "axios";
import * as FormData from "form-data";
import {
  IErrorResponse,
  IResponseStatus,
  ISuccessResponse,
} from "../types/response";
import path = require("path");
import { showError, showMessage } from "./toast";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "http://localhost:3000";
//TO-DO: Manage SESSION on file. GENERATE IT / STORE IT
const sessionID = uuidv4();

export async function generateTestsRequest(buffer: Buffer, fileName: string) {
  // 👇️ const data: GetUsersResponse
  console.log("GenerateTestsRequest");
  try {
    console.log("ejecutando");
    let rSendFile = await sendFile(buffer, fileName);

    console.log(rSendFile.status, "<---- Status Sendfile");

    const { data, status } = await getTests(fileName);
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

const getTests = (fileName: string) => {
  return axios.post(`${BASE_URL}/generate-unit-tests`, {
    sessionId: sessionID,
    fileName: fileName,
  });
};
