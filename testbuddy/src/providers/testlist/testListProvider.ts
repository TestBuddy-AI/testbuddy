import * as vscode from "vscode";

import { getTestListHtml } from "./testListHtml";
import { execShell } from "../../utils/execShell";
import { checkNpm } from "../../utils/checkEnv";
import { parse } from "jest-editor-support";
import { ParsedNode } from "jest-editor-support/index";
import * as fs from "fs";
import { generateTests } from "../../utils/useAxios";
import { Blob } from "buffer";
import { ISuccessResponse } from "../../types/response";
import path = require("path");

//https://stackoverflow.com/questions/43007267/how-to-run-a-system-command-from-vscode-extension Check answers at the end, fs.watch for file updates
export class TestListWebViewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "testBuddy.testListWebViewView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [
        vscode.Uri.joinPath(this._context.extensionUri, "media"),
        vscode.Uri.joinPath(this._context.extensionUri, "node_modules"),
      ],
    };

    webviewView.webview.html = getTestListHtml(
      this._view.webview,
      this._context
    );

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "colorSelected": {
          vscode.workspace.fs
            .writeFile(
              vscode.Uri.joinPath(
                vscode.workspace.workspaceFolders[0].uri,
                "results/test" + data.value + ".txt"
              ),
              data.value
            )
            .then(console.log);
          vscode.window.activeTextEditor?.insertSnippet(
            new vscode.SnippetString(`#${data.value}`)
          );
          break;
        }
        case "test": {
          console.log(data.value);
          this.test().then(console.log);
          //execute shell command for testing
          // execShell(
          //   `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm run test`
          // ).then(console.log);
          break;
        }
        case "generate": {
          console.log(data.value);

          const editor = vscode.window.activeTextEditor;

          if (editor) {
            let document = editor.document;

            // Get the document text

            console.log(document);

            let buffer = fs.readFileSync(document.uri.fsPath);

            generateTests(buffer, document.fileName)
              .then((response) => {
                let fileContents = response.data.result;
                let encoder = new TextEncoder();
                return vscode.workspace.fs.writeFile(
                  vscode.Uri.joinPath(
                    vscode.workspace.workspaceFolders[0].uri,
                    "tests/" +
                      path.basename(document.uri.fsPath).split(".")[0] +
                      ".test.ts"
                  ),
                  encoder.encode(fileContents as string)
                );
              })
              .then(() => {
                return this.initialize();
              })
              .then(console.log);
            // DO SOMETHING WITH `documentText`
          }
          //execute shell command for testing
          // execShell(
          //   `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm run test`
          // ).then(console.log);
          break;
        }
      }
    });

    this.initialize().then(console.log);
  }

  async test(testUrl: string, itBlock?: string) {}

  async loadScripts() {
    let testbuddyCMD = await execShell(
      `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm pkg set 'scripts.testbuddy'='jest --json --outputFile=output.json'`
    );
    console.log("testBuddy");
    let testbuddyListCMD = await execShell(
      `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm pkg set 'scripts.testbuddy:list'='jest --listTests --json > testList.json'`
    );
    console.log("testBuddyList");
  }
  async loadCurrentTests(): Promise<ParsedNode[]> {
    console.log("load Current");

    await execShell(
      `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm run testbuddy:list`
    );

    let testsList: string[] = JSON.parse(
      fs.readFileSync(
        vscode.Uri.joinPath(
          vscode.workspace.workspaceFolders[0].uri,
          "testList.json"
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
  public addTests(testList: ParsedNode[]) {
    console.log(testList);
    this._view?.webview.postMessage({ type: "addTests", content: testList });
  }

  public async initialize() {
    return this.loadScripts()
      .then(() => {
        console.log("LOADED");
        return this.loadCurrentTests();
      })
      .then((tests) => {
        console.log("TESTS", tests);
        this.addTests(tests);
      });
  }

  public addColor() {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: "addColor" });
    }
  }

  public clearColors() {
    if (this._view) {
      this._view.webview.postMessage({ type: "clearColors" });
    }
  }
}
