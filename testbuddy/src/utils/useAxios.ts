import axios from "axios";
import * as FormData from "form-data";
import {
  IErrorResponse,
  IResponseStatus,
  ISuccessResponse,
} from "../types/response";
import path = require("path");
import { showError, showMessage } from "./toast";

const BASE_URL = "http://localhost:3000";

export async function generateTestsRequest(buffer: Buffer, fileName: string) {
  // 👇️ const data: GetUsersResponse
  try {
    console.log("ejecutando");
    let rSendFile = await sendFile(buffer, fileName);

    console.log(rSendFile.status, "<---- Status Sendfile");

    const { data, status } = await getTests();
    console.log(status, "<---- Status genUnitTests");
    return data;
  } catch (error: any) {
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

const getTests = () => axios.post(`${BASE_URL}/generate-unit-tests`);
