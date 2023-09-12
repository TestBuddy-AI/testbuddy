import * as vscode from "vscode";
import * as fs from "fs";
import { generateTestsRequest } from "./useAxios";
import { showError } from "./toast";
import path = require("path");

export const commandGenerateTestHandler = async (args: any[]) => {
  console.log("entre");
  console.log(args);
  //Caso 1, se ejecuto con el keybinding y no hay URL
  if (args.length === 0) {
    console.log("CASO1");
    try {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        let document = editor.document;
        let response = await sendTestToBack(document.uri.fsPath);
        await saveGeneratedTest(response, document.uri.fsPath);
      } else {
        showError("Please execute the command with an open file");
      }
    } catch (err) {
      console.log(err);
    }
    return;
  }
  //Caso 2, se ejecuto sobre UN solo archivo (editor/title/run, command palette)
  if (args[0] && !Array.isArray(args[1])) {
    console.log("CASO2");

    try {
      let response = await sendTestToBack(args[0].fsPath);
      await saveGeneratedTest(response, args[0].fsPath);
    } catch (err) {
      console.log(err);
    }
    return;
  }
  //Caso 3, se ejecuto sobre un set de archivos (command palette)
  if (Array.isArray(args[1]) && args[1].length > 0) {
    console.log("CASO3");
    try {
      let fileListToGenerate = new Set<string>();
      args[1].forEach((el) => {
        fileListToGenerate.add(el.fsPath);
      });
      fileListToGenerate.forEach(async (el) => {
        console.log(el);
        // TO-DO: Paralelize the requests
        let response = await sendTestToBack(el);
        await saveGeneratedTest(response, el);
      });
    } catch (err) {
      console.log(err);
    }
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
          vscode.workspace.workspaceFolders![0].uri,
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
  console.log("Send TestToBack");
  let buffer = fs.readFileSync(fileURl);

  let response = await generateTestsRequest(buffer, fileURl);
  return response;
};

export const saveGeneratedTest = async (
  respnseObject: any,
  documentUri: string
) => {
  try {
    console.log("saving");
    let fileContents = respnseObject.data.result;
    console.log("fileContents");
    let encoder = new TextEncoder();

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(
        vscode.workspace.workspaceFolders![0].uri,
        (
          "tests/" +
          path.dirname(documentUri) +
          "/" +
          path.basename(documentUri).split(".")[0] +
          ".test.ts"
        ).replace(vscode.workspace.workspaceFolders![0].uri.fsPath, "")
      ),
      encoder.encode(fileContents as string)
    );
  } catch (err) {
    console.log(err);
    showError("Error Saving the test, please try again");
  }
};
