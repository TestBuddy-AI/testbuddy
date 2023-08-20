import * as fs from "fs";
import path from "path";
import ts from "typescript";
import { ICodeLanguage } from "../types";
import { unitTestsPrompt } from "./openaiService";

function extractFunctionsAndVariables(sourceFile: ts.SourceFile): string[] {
  const results: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) || ts.isVariableStatement(node)) {
      let code = node.getText(sourceFile);
      // Remove newlines and extra spaces
      code = code.replace(/\s+/g, " ").trim();
      results.push(code);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return results;
}


export function readJSorTSFile(): string[] {
  const filePath = path.join(__dirname, "../uploads/operationsFunctions.ts")
  const program = ts.createProgram([filePath], { allowJs: true });
  const sourceFile = program.getSourceFile(filePath);

  if (!sourceFile) {
    throw new Error(`Cannot read the source file: ${filePath}`);
  }

  return extractFunctionsAndVariables(sourceFile);
}

export function receiveFile(fileName: string, file: Buffer, success: (message: string) => void, error: (message: string) => void) {
  const storagePath = path.join(__dirname, "../uploads");

  if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

  const filePath = path.join(storagePath, fileName);

  fs.writeFile(filePath, file, (err) => {
    if (err) error("Error saving file");

    success("File saved successfully");
  });
}

export function generateUnitTests() {
  const functionsToTest = readJSorTSFile();

  if (functionsToTest.length === 0) throw new Error("No functions found in file");

  return functionsToTest.map( async(fn) => {
    const { choices } = await unitTestsPrompt(fn, ICodeLanguage.typescript);
    return choices[0].message?.content
  });

}