import axios from "axios";
import * as FormData from "form-data";
import {
  IErrorResponse,
  IResponseStatus,
  ISuccessResponse,
} from "../types/response";
import { File, Blob } from "buffer";

export async function generateTests(buffer: Buffer, fileName: string) {
  try {
    console.log("entre a generateTests");
    let form = new FormData();

    form.append("file", buffer, {
      filename: fileName,
    });
    // 👇️ const data: GetUsersResponse
    console.log("ejecutando");
    const { data, status } = await axios.post<
      ISuccessResponse | IErrorResponse
    >("https://test-buddy-server.onrender.com/receiveFile", form, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log("Listo");
    console.log(JSON.stringify(data, null, 4));

    // 👇️ "response status is: 200"
    console.log("response status is: ", status);

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
