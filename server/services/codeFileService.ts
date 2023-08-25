import * as fs from "fs";
import path from "path";
import ts from "typescript";
import { ICodeLanguage, IReadFileFunctionsResponse } from "../types";
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

export function receiveFile(fileName: string, file: Buffer, success: (message: string) => void, error: (message: string) => void) {
  const storagePath = path.join(__dirname, "../uploads");

  if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

  const fileExtension = fileName.split(".")[1];
  const filePath = path.join(storagePath, `file.${fileExtension}`);

  fs.readdir(storagePath, (err, files) => {
    if (err) {
      error(`$Error reading directory:, ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(storagePath, file);

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          error(`$Error reading directory:, ${unlinkErr}`);
          return;
        }
      });
    });
  });

  fs.writeFile(filePath, file, (err) => {
    if (err) {
      error("Error saving file");
      return;
    }

    success("File saved successfully");
  });
}

export function readJSorTSFile(): IReadFileFunctionsResponse {
  let fileName = "";

  fs.readdirSync(path.join(__dirname, "../uploads")).forEach(file => {
    fileName = file;
  });

  const filePath = path.join(__dirname, `../uploads/${fileName}`);
  const program = ts.createProgram([filePath], { allowJs: true });
  const sourceFile = program.getSourceFile(filePath);
  const codeLang = getFilenameLang(fileName);

  if (!sourceFile) {
    throw new Error(`Cannot read the source file: ${filePath}`);
  }

  if (!codeLang) {
    console.error(`Could not infer code language of file ${fileName}`);
    throw new Error(`Could not infer code language of file ${fileName}`);
  }

  return { lang: codeLang, functions: extractFunctionsAndVariables(sourceFile) };
}

export function generateUnitTests() {
  const functionsToTest = readJSorTSFile().functions;

  if (functionsToTest.length === 0) throw new Error("No functions found in file");

  console.log(functionsToTest);

  return functionsToTest.map( async(fn) => {
    const { choices } = await unitTestsPrompt(fn, ICodeLanguage.typescript);
    return choices[0].message?.content
  });
}

function getFilenameLang(fileName: string) {
  const fileExtension = fileName.split(".")[1];

  switch (fileExtension) {
    case "ts":
      return ICodeLanguage.typescript;

    case "js":
      return ICodeLanguage.javascipt;

    default:
      return undefined;
  }
}