import * as vscode from "vscode";
import * as fs from "fs";
import { generateTestsRequest } from "./useAxios";
import { showError } from "./toast";
import path = require("path");

export const commandGenerateTestHadler = async (...args: any[]) => {
  console.log("entre");
  //Caso 1, se ejecuto con el keybinding y no hay URL
  if (args.length === 0) {
    console.log("CASO1");
    try {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        let document = editor.document;
        let response = await sendTestToBack(document.uri.fsPath);
        await saveGeneratedTest(response);
      } else {
        showError("Please execute the command with an open file");
      }
    } catch (err) {}
    return;
  }
  //Caso 2, se ejecuto sobre UN solo archivo (editor/title/run, command palette)
  if (args[0] && !Array.isArray(args[1])) {
    console.log("CASO2");
    try {
      let response = await sendTestToBack(args[0].fsPath);
      await saveGeneratedTest(response);
    } catch (err) {}
    return;
  }
  //Caso 3, se ejecuto sobre un set de archivos (command palette)
  if (Array.isArray(args[1]) && args[1].length > 0) {
    console.log("CASO3");
    try {
      let fileListToGenerate = new Set();
      args.forEach((el) => {
        fileListToGenerate.add(el.fsPath);
      });
      fileListToGenerate.forEach(async (el) => {
        // TO-DO: Paralelize the requests
        let response = await sendTestToBack(args[0].fsPath);
        await saveGeneratedTest(response);
      });
    } catch (err) {}
    return;
  }
};

export const createTest = (urlFile: string) => {};

async function testGeneration() {
  try {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      let document = editor.document;
      console.log(document);
      let buffer = fs.readFileSync(document.uri.fsPath);

      let response = await generateTestsRequest(buffer, document.fileName);

      let fileContents = response.data.result;
      let encoder = new TextEncoder();

      await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(
          vscode.workspace.workspaceFolders[0].uri,
          "tests/" +
            path.basename(document.uri.fsPath).split(".")[0] +
            ".test.ts"
        ),
        encoder.encode(fileContents as string)
      );
    }
  } catch (error: any) {
    console.log(error);
  }
}

const sendTestToBack = async (fileURl: string) => {
  let buffer = fs.readFileSync(fileURl);

  let response = await generateTestsRequest(buffer, fileURl);
  return response;
};

const saveGeneratedTest = async (respnseObject: any) => {
  try {
    let fileContents = respnseObject.data.result;
    let encoder = new TextEncoder();

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(
        vscode.workspace.workspaceFolders[0].uri,
        "tests/" + path.basename(document.uri.fsPath).split(".")[0] + ".test.ts"
      ),
      encoder.encode(fileContents as string)
    );
  } catch (err) {
    showError("Error Saving the test, please try again");
  }
};
