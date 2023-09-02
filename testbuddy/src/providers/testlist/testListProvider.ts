import * as vscode from "vscode";

import { getTestListHtml } from "./testListHtml";
import { ParsedNode } from "jest-editor-support/index";
import * as fs from "fs";
import { generateTests } from "../../utils/useAxios";
import path = require("path");
import { loadCurrentTests, loadScripts } from "../../commands/commands";

//https://stackoverflow.com/questions/43007267/how-to-run-a-system-command-from-vscode-extension Check answers at the end, fs.watch for file updates
export class TestListWebViewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "testBuddy.testListWebViewView";

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _context: vscode.ExtensionContext,
    platform: string
  ) {}

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

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "runTest": {
          let fileURL = data.value;
          console.log(fileURL);
          //execute shell command for testing
          // execShell(
          //   `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm run test`
          // ).then(console.log);
          break;
        }
        case "regenerate": {
          console.log("Llegue");
          this.test().then(console.log);
          //execute shell command for testing
          // execShell(
          //   `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm run test`
          // ).then(console.log);
          break;
        }
        case "generate": {
          console.log(data.value);
          this.setLoading(true);
          await this.testGeneration();
          this.setLoading(false);
          break;
        }
      }
    });

    this.initialize().then(console.log);
  }

  async test(testUrl: string, itBlock?: string) {}

  public addTests(testList: ParsedNode[]) {
    console.log(testList);
    this._view?.webview.postMessage({ type: "addTests", content: testList });
  }

  public async initialize() {
    return loadScripts()
      .then(() => {
        console.log("LOADED");
        return loadCurrentTests();
      })
      .then((tests) => {
        console.log("TESTS", tests);
        this.addTests(tests);
      });
  }
  setLoading(active: boolean) {
    this._view?.webview.postMessage({ type: "loading", content: active });
  }
  public async testGeneration() {
    try {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        let document = editor.document;
        console.log(document);
        let buffer = fs.readFileSync(document.uri.fsPath);

        let response = await generateTests(buffer, document.fileName);
        let fileContents = response.data.result;
        let encoder = new TextEncoder();

        await vscode.workspace.fs.writeFile(
          vscode.Uri.joinPath(
            vscode.workspace.workspaceFolders[0].uri,
            "tests/" +
              path.basename(document.uri.fsPath).split(".")[0] +
              ".test.ts"
          ),
          encoder.encode(fileContents as string)
        );

        await this.initialize();
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(
        error,
        "Oops an error has happened. Please try again"
      );
    }
  }
}
