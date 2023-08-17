import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { IParsedFunction } from "../types";


export const readTypescriptFile = (): IParsedFunction[] => {
  const inputFilePath = path.join(__dirname, "../data/operationsFunctions.ts")
  const fileContents = fs.readFileSync(inputFilePath, "utf8");

  const sourceFile = ts.createSourceFile(
    inputFilePath,
    fileContents,
    ts.ScriptTarget.Latest,
    true
  );

  const functionObjects: IParsedFunction[] = [];

  function parseTypescriptFunctions(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)
    ) {
      const functionCode = fileContents.substring(node.pos, node.end);

      // Remove leading whitespace and newline characters
      const cleanedCode = functionCode.replace(/^\s+/gm, "");

      const functionName = (node as ts.FunctionLikeDeclaration).name?.getText() || `unnamed_${functionObjects.length}`;

      // Remove newline characters from the code
      const codeWithoutNewlines = cleanedCode.replace(/\n/g, "");

      functionObjects.push({ name: functionName, code: codeWithoutNewlines });
    }
    ts.forEachChild(node, parseTypescriptFunctions);
  }

  parseTypescriptFunctions(sourceFile);

  return functionObjects;
}

function parseFunctions(jsCode: string): IParsedFunction[] {
  const functionRegex = /function\s+(\w+)\s*\(([^)]*)\)\s*{([\s\S]*?)}/g;
  const functions: IParsedFunction[] = [];

  let match;
  while ((match = functionRegex.exec(jsCode)) !== null) {
    const [, functionName, parameters, functionCode] = match;
    const cleanedFunctionCode = functionCode.replace(/\s+/g, " ");
    const fullFunctionCode = `function ${functionName}(${parameters}) {${cleanedFunctionCode}}`;
    functions.push({
      name: functionName,
      code: fullFunctionCode
    });
  }

  return functions;
}

export const readJavascriptFile = (): IParsedFunction[] => {
  const inputFilePath = path.join(__dirname, "../data/JSOperations.js")
  const jsCode = fs.readFileSync(inputFilePath, "utf-8");

  return parseFunctions(jsCode);
}
