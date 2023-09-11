import * as vscode from "vscode";

import { getTestListHtml } from "./testListHtml";
import { ParsedNode } from "jest-editor-support/index";
import * as fs from "fs";
import path = require("path");
import { loadCurrentTests, loadScripts } from "../../commands/commands";
import { showError } from "../../utils/toast";
import { generateTestsRequest } from "../../utils/useAxios";
import { testRunnerUtil } from "../../utils/testRunner";
import { IRunnerOptions } from "../../types/IRunnerOptions";
import { showSource } from "../../utils/showSource";

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

    webviewView.webview.onDidReceiveMessage(this.messageHandler);

    this.initialize().then(console.log);
  }

  async test(testUrl: string, itBlock?: string) {}

  public addTests(testList: ParsedNode[]) {
    console.log(testList);
    vscode.commands.executeCommand("testBuddy.populateEditor", testList);
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

  public setLoading(active: boolean) {
    this._view?.webview.postMessage({ type: "loading", content: active });
  }

  public async testGeneration() {
    try {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        let document = editor.document;
        console.log(document);
        let buffer = fs.readFileSync(document.uri.fsPath);

        let response = await generateTestsRequest(buffer, document.fileName);

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
      console.log(error);
    }
  }

  private messageHandler = async (data: { type: string; value: any }) => {
    switch (data.type) {
      case "runTest": {
        let testValue: { file: string; test: string } = data.value;
        const results = await testRunnerUtil(
          IRunnerOptions.javascript,
          testValue.file,
          testValue.test
        );

        this._view?.webview.postMessage({
          type: "results",
          content: { results, ...testValue },
        });
        //execute shell command for testing
        // execShell(
        //   `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm run test`
        // ).then(console.log);
        break;
      }
      case "regenerateTest": {
        console.log("Llegue");
        let testValue: { file: string; test: string } = data.value;
        vscode.commands.executeCommand("testBuddy.sendTestToEditor", [
          testValue.file,
          testValue.test,
        ]);
        console.log("REGEN");
        //execute shell command for testing
        // execShell(
        //   `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm run test`
        // ).then(console.log);
        break;
      }
      case "generate": {
        await this.generateTests();
        break;
      }
      case "reload": {
        await this.initialize();
        break;
      }
      case "goToFile": {
        console.log(data.value);
        if (!data.value.open.start) {
          showSource(data.value.file, 0);
        } else {
          showSource(data.value.file, data.value.open.start.line - 1);
        }
        break;
      }
    }
  };

  private async generateTests() {
    console.info("Generating ");
    this.setLoading(true);
    await this.testGeneration();
    this.setLoading(false);
  }

  private async runTests() {}
}
