import * as crypto from "crypto";
import * as fs from "fs";
import path from "path";
import ts from "typescript";
import { ICodeLanguage, IReadFileFunctionsResponse, IUnitTestFile } from "../types";

function extractFunctionsAndVariables(sourceFile: ts.SourceFile): string[] {
  const results: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) || ts.isVariableStatement(node)) {
      let code = node.getText(sourceFile);
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

  fs.writeFile(filePath, file, (err) => {
    if (err) {
      error("Error saving file");
      return;
    }

    console.info("File saved!");
    success("File saved successfully");
  });
}

export function readJSorTSFile(fileName: string): IReadFileFunctionsResponse {
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

function calculateFileHash(filePath: string, algorithm: string = "sha256"): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on("data", chunk => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      const fileHash = hash.digest("hex");
      resolve(fileHash);
    });

    stream.on("error", error => {
      reject(error);
    });
  });
}

export async function storeUnitTests(unitTests: string, sessionId: string, fileName: string) {
  const hash = await calculateFileHash(path.join(__dirname, `../uploads/${fileName}`));

  const unitTestFile: IUnitTestFile = {
    fileName,
    fileHash: hash,
    sessionId,
    unitTests
  };

  fs.readFile(path.join(__dirname, "../data/unitTestFiles.json"), "utf8", (error, data) => {
    if (error) {
      console.error(error);
      throw error;
    }

    const unitTestFiles = JSON.parse(data);
    const newUnitTestFiles = addOrUpdateUnitTestFile(unitTestFiles, unitTestFile);
    const newJSON = JSON.stringify(newUnitTestFiles);

    fs.writeFileSync(path.join(__dirname, "../data/unitTestFiles.json"), newJSON);
  });
}

function addOrUpdateUnitTestFile(unitTestFiles: IUnitTestFile[], unitTestFile: IUnitTestFile) {
  const index = unitTestFiles.findIndex(item => item.sessionId === unitTestFile.sessionId && item.fileName === unitTestFile.fileName);

  if (index !== -1) {
    const newUnitTestFiles = [...unitTestFiles];
    newUnitTestFiles[index] = unitTestFile;

    return newUnitTestFiles;
  } else {
    return [...unitTestFiles, unitTestFile];
  }
}

export async function getUnitTests(sessionId: string, fileName: string) {
  const data = fs.readFileSync(path.join(__dirname, "../data/unitTestFiles.json"), "utf8");

  const unitTestFiles: IUnitTestFile[] = JSON.parse(data);
  const foundTests = unitTestFiles.find(test => test.sessionId === sessionId && test.fileName === fileName);

  if (foundTests) {
    const hash = await calculateFileHash(path.join(__dirname, `../uploads/${fileName}`));

    if (hash === foundTests.fileHash) {
      return foundTests.unitTests;
    }

    return undefined;
  }

  return undefined;
}

export async function removeFile(fileName: string) {
  fs.unlink(path.join(__dirname, `../uploads/${fileName}`), (err) => {
    if (err) throw err;
    console.info(`File ${fileName} was unlinked`);
  });
}