import * as fs from "fs";
import md5 from "md5";
import path from "path";
import ts from "typescript";
import { ITestFunction, IUnitTestFile } from "../db/models/dbModels";
import { unitTestFileService } from "../db/services/unitTestFileServices";
import { unitTestFunctionService } from "../db/services/unitTestFunctionService";
import { ICodeLanguage, IGetOrGenerateUnitTestsResponse, IReadFileFunctionsResponse } from "../types";
import { generateFunctionUnitTests } from "./openaiService";

function extractFunctionsAndImports(sourceFile: ts.SourceFile): {
  imports: string[];
  functions: string[];
} {
  const imports: string[] = [];
  const functions: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
      let code = node.getText(sourceFile);
      code = code.replace(/\s+/g, " ").trim();
      functions.push(code);
    }

    if (ts.isImportDeclaration(node)) {
      const importStatement = node.getText(sourceFile);
      imports.push(importStatement);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return { imports, functions };
}

export function receiveFile(
  fileName: string,
  file: Buffer,
  success: (message: string) => void,
  error: (message: string) => void
) {
  const storagePath = path.join(__dirname, "../uploads");

  if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

  const filePath = path.join(storagePath, fileName);

  fs.writeFile(filePath, file, (err) => {
    if (err) {
      console.error(`Error saving file ${fileName}`);
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

  const { functions, imports } = extractFunctionsAndImports(sourceFile);

  const parsedFunctions = functions.map(
    (stringFn) => {
      return {
        fileName: fileName,
        code: stringFn,
        hash: md5(stringFn)
      } as ITestFunction;
    }
  );

  return { fileName, lang: codeLang, functions: parsedFunctions, imports };
}

function getFilenameLang(fileName: string) {
  const fileNameArray = fileName.split("...");
  const fileExtension = fileNameArray[fileNameArray.length - 1].split(".")[1];

  switch (fileExtension) {
    case "ts":
      return ICodeLanguage.typescript;

    case "js":
      return ICodeLanguage.javascript;

    default:
      return undefined;
  }
}

export async function storeUnitTests(
  functions: ITestFunction[],
  sessionId: string,
  fileName: string
) {
  const resultUnitTestFile =
    await unitTestFileService.getBySessionIdAndFileName(sessionId, fileName);

  if (resultUnitTestFile?.id) {
    functions.map(async fn => {
      const unitTestFunction: ITestFunction = {
        hash: fn.hash,
        code: fn.code,
        unitTests: fn.unitTests,
        unitTestFileId: resultUnitTestFile.id
      };

      const existingFunction = await unitTestFunctionService.getByHash(fn.hash);

      if (!existingFunction) {
        await unitTestFunctionService.create(unitTestFunction);
      }
    });
  } else {
    const newUnitTestFile: IUnitTestFile = {
      fileName,
      sessionId
    };
    const fileId = await unitTestFileService.create(newUnitTestFile);
    const fnPromises = functions.map((fn) => {
      const newFunction = { ...fn, unitTestFileId: fileId };

      return unitTestFunctionService.create(newFunction);
    });

    await Promise.all(fnPromises);
  }
}

export async function removeFile(fileName: string) {
  fs.unlink(path.join(__dirname, `../uploads/${fileName}`), (err) => {
    if (err) throw err;
    console.info(`File ${fileName} was unlinked`);
  });
}

export async function getOrGenerateUnitTests(
  sessionId: string,
  fileName: string
): Promise<IGetOrGenerateUnitTestsResponse> {
  const { functions, lang, imports } = readJSorTSFile(fileName);
  const unitTestFile: IUnitTestFile | null =
    await unitTestFileService.getBySessionIdAndFileName(sessionId, fileName);

  if (!!unitTestFile && unitTestFile?.id) {
    const storedFunctions = await unitTestFunctionService.listByFileId(
      unitTestFile.id
    );

    const currentFileFunctions = functions;
    const sameFunctions = storedFunctions?.filter((fn) =>
      currentFileFunctions.some((fn2) => fn.hash === fn2.hash)
    );
    const functionsStoredOnly = storedFunctions?.filter(
      (fn) => !currentFileFunctions.some((fn2) => fn2.hash === fn.hash)
    );
    const functionsFileOnly = currentFileFunctions.filter(
      (fn2) => !storedFunctions?.some((fn) => fn.hash === fn2.hash)
    );

    if (!!functionsStoredOnly && functionsStoredOnly.length > 0) {
      functionsStoredOnly.map(async (fn) => {
        if (fn?.id) {
          await unitTestFunctionService.deleteById(fn?.id);
        }
      });
    }

    const newUnitTests = functionsFileOnly.length > 0 ? await generateUnitTests(functionsFileOnly, lang) : [];

    return { imports, functions: [...newUnitTests, ...(sameFunctions ?? [])] };
  } else {
    const generatedFunctions = await generateUnitTests(functions, lang);
    return { imports, functions: generatedFunctions };
  }
}

function generateUnitTests(functions: ITestFunction[], lang: ICodeLanguage) {
  const result = functions.map(async (fn) => {
    const unitTests = await generateFunctionUnitTests(fn, lang);
    const unitTestsNoMarkdown = unitTests?.replace(
      /```\w*([\s\S]+?)```/g,
      "$1"
    );

    return {
      code: fn.code,
      hash: fn.hash,
      unitTests: unitTestsNoMarkdown
    } as ITestFunction;
  });

  return Promise.all(result);
}

export function reformatFilePath(path: string): string {
  return path.split("/").join("...");
}

export function reformatImports(imports: string[]): string {
  return imports.join("\n").concat("\n\n");
}
