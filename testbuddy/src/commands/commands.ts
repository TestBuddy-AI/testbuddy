import { ParsedNode, parse } from "jest-editor-support";
import { execShellMultiplatform, execShell } from "../utils/execShell";
import * as vscode from "vscode";
import * as fs from "fs";

export async function loadScripts() {
  let tesBuddyFolder = await execShellMultiplatform(
    `cd ${vscode.workspace.workspaceFolders[0].uri.fsPath} && mkdir -p testbuddy`,
    `cd ${vscode.workspace.workspaceFolders[0].uri.fsPath} && if not exist "testbuddy" mkdir testbuddy`
  );
  //TO-DO: Add testbuddy folder to gitignore, Define gitignore rules, add sesion id for teams/workspaces as a file. Create configuration file like .prettierrc(?)
  let testbuddyCMD = await execShell(
    `cd ${vscode.workspace.workspaceFolders[0].uri.fsPath} && npm pkg set "scripts.testbuddy"="jest --json --outputFile=./testbuddy/output.json"`
  );
  console.log("testBuddy");
  let testbuddyListCMD = await execShell(
    `cd ${vscode.workspace.workspaceFolders[0].uri.fsPath} && npm pkg set "scripts.testbuddy:list"="jest --listTests --json > ./testbuddy/testList.json"`
  );
  console.log("testBuddyList");
}
export async function loadCurrentTests(): Promise<ParsedNode[]> {
  console.log("load Current");

  await execShell(
    `cd ${vscode.workspace.workspaceFolders[0].uri.fsPath} && npm run testbuddy:list`
  );
  console.log("Run List");
  let testsList: string[] = JSON.parse(
    fs.readFileSync(
      vscode.Uri.joinPath(
        vscode.workspace.workspaceFolders[0].uri,
        "testbuddy/testList.json"
      ).fsPath,
      "utf8"
    )
  );

  let results = testsList.map((el) => {
    let parsedTests = parse(el);
    let root = parsedTests.root;
    root.children = parsedTests.itBlocks;
    return root;
  });

  return results;
}
