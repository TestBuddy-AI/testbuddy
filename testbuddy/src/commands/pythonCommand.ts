import * as vscode from "vscode";
import * as fs from "fs";
import path = require("path");
import { PYTHONSCRIPT, executionStringBuilder } from "./pythonScript";
import { execShell, execShellMultiplatform } from "../utils/execShell";

export const TESTBUDDYPYTHONFILEURL =
  vscode.workspace.workspaceFolders![0].uri.fsPath + "/testbuddy/testing.py";

export const loadPythonScriptIntoWorkspace = () => {
  fs.writeFileSync(TESTBUDDYPYTHONFILEURL, PYTHONSCRIPT);
};

export const getAllTestsInWorkspace = async (
  pythonCommand: string,
  directory: string,
  pattern: string
) => {
  let tesBuddyFolder = await execShellMultiplatform(
    `cd ${
      vscode.workspace.workspaceFolders![0].uri.fsPath
    } && mkdir -p testbuddy`,
    `cd ${
      vscode.workspace.workspaceFolders![0].uri.fsPath
    } && if not exist "testbuddy" mkdir testbuddy`
  );

  let command = executionStringBuilder(
    "discover",
    pythonCommand,
    TESTBUDDYPYTHONFILEURL,
    directory,
    pattern
  );

  await execShell(`${command} > ./testbuddy/testList.json`);

  let testsList = JSON.parse(
    fs.readFileSync(
      vscode.Uri.joinPath(
        vscode.workspace.workspaceFolders![0].uri,
        "testbuddy/testList.json"
      ).fsPath,
      "utf8"
    )
  );
};
