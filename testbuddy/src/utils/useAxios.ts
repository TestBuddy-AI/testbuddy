import axios from "axios";
import * as FormData from "form-data";
import {
  IErrorResponse,
  IResponseStatus,
  ISuccessResponse,
} from "../types/response";
import path = require("path");

export async function generateTests(buffer: Buffer, fileName: string) {
  try {
    // 👇️ const data: GetUsersResponse
    console.log("ejecutando");
    await axios.post(
      "https://test-buddy-server.onrender.com/receiveFile",
      buffer,
      {
        headers: {
          "Content-Type": "application/octet-stream", // Change this to send as raw binary data
          "File-Name": path.basename(fileName),
        },
      }
    );
    console.log("Listo");
    const { data, status } = await axios.post(
      "https://test-buddy-server.onrender.com/generate-unit-tests"
    );
    // 👇️ "response status is: 200"
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
}
