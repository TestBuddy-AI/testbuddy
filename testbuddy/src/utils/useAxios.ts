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
    await axios.post("http://localhost:3000/receiveFile", buffer, {
      headers: {
        "Content-Type": "application/octet-stream", // Change this to send as raw binary data
        "File-Name": path.basename(fileName),
      },
    });
    console.log("Listo");
    const { data, status } = await axios.post(
      "http://localhost:3000/generate-unit-tests"
    );
    // 👇️ "response status is: 200"
    console.log(data);

    return data;
  } catch (error: any) {
    console.log("error message: ", error);
    throw new Error(error.message);
  }
}
