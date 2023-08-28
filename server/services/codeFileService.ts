import * as fs from "fs";
import path from "path";
import ts from "typescript";
import { ICodeLanguage, IReadFileFunctionsResponse } from "../types";
//import * as crypto from "crypto";

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

  const filePath = path.join(storagePath, fileName);

  const filesInDirectory = fs.readdirSync(storagePath);

  if (filesInDirectory) {
    filesInDirectory.forEach((file) => {
      const filePath = path.join(storagePath, file);

      fs.unlinkSync(filePath);
      console.log(`File ${file} was unlinked`);
    });
  }

  fs.writeFile(filePath, file, (err) => {
    if (err) {
      error("Error saving file");
      return;
    }

    console.log("Writing file...");
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

  return { fileName: fileName, lang: codeLang, functions: extractFunctionsAndVariables(sourceFile) };
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
/*
function calculateFileHash(filePath: string, algorithm: string = 'sha256'): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on('data', chunk => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      const fileHash = hash.digest('hex');
      resolve(fileHash);
    });

    stream.on('error', error => {
      reject(error);
    });
  });
}*/
