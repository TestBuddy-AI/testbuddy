import { execShell, execShellMultiplatform } from "./execShell";
import * as vscode from "vscode";
import * as fs from "fs";
const path = require("path");

export const runJsTests = async (
  testfile: string,
  testdetail: string,
  runAll: boolean = false
) => {
  //CASE: Run all tests in the project
  if (runAll) {
    const outputFile = "output";
    try {
      await execShell(
        `cd ${
          vscode.workspace.workspaceFolders![0].uri.fsPath
        } && npm run testbuddy -- --outputFile=./testbuddy/${outputFile}.json"`
      );
    } catch (err) {
    } finally {
      let buffer = fs.readFileSync(
        vscode.workspace.workspaceFolders![0].uri.fsPath +
          `/testbuddy/${outputFile}.json`
      );

      return JSON.parse(buffer.toString());
    }
  } else {
    //Creates Output file url by concatenating testFile and test result
    const outputFile = createOuptuFileUrl(
      testdetail === "all",
      testfile,
      testdetail
    ).replace(vscode.workspace.workspaceFolders![0].uri.fsPath, "");
    //Creates the directory if not exists, Windows && Mac versions working
    let tesBuddyFolder = await execShellMultiplatform(
      `cd ${
        vscode.workspace.workspaceFolders![0].uri.fsPath
      } && mkdir -p testbuddy/${path.parse(outputFile).dir}`,
      `cd ${
        vscode.workspace.workspaceFolders![0].uri.fsPath
      } && if not exist "testbuddy/${
        path.parse(outputFile).dir
      }" mkdir testbuddy/${path.parse(outputFile).dir}`
    );
    try {
      //Runs tests and outputs the results file to the directory prevously created
      if (testdetail === "all") {
        await execShell(
          `cd ${
            vscode.workspace.workspaceFolders![0].uri.fsPath
          } && npm run testbuddy -- --outputFile=./testbuddy/${outputFile}.json -i ${testfile}`
        );
      } else {
        await execShell(
          `cd ${
            vscode.workspace.workspaceFolders![0].uri.fsPath
          } && npm run testbuddy -- --outputFile=./testbuddy/${outputFile}.json -i ${testfile} -t "${testdetail}"`
        );
      }
    } catch (err) {
    } finally {
      //Reads the results from the file prevously generated
      let buffer = fs.readFileSync(
        vscode.workspace.workspaceFolders![0].uri.fsPath +
          `/testbuddy/${outputFile}.json`
      );
      return JSON.parse(buffer.toString());
    }
  }
};

export const createOuptuFileUrl = (
  isRoot: boolean,
  file: string,
  title: string
) => {
  return isRoot
    ? file + "--all"
    : file + "--" + title.replace(/[^a-z0-9]/gi, "_").toLowerCase(); //Making everything filesystem safe
};
