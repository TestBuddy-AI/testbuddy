import * as vscode from "vscode";

import { getEditorHtml } from "./editorHtml";
import { execShell } from "../../utils/execShell";
import { modifyTest, regenerateTest } from "../../utils/useAxios";
import * as fs from "fs";
import { saveGeneratedTest } from "../../utils/testCreator";

//https://stackoverflow.com/questions/43007267/how-to-run-a-system-command-from-vscode-extension Check answers at the end, fs.watch for file updates
export class EditorWebViewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "testBuddy.editorWebViewView";

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

    webviewView.webview.html = getEditorHtml(this._view.webview, this._context);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "modifyTests": {
          const { file, name, selects, userInput } = data.value;
          let buffer = fs.readFileSync(file);

          if (name === "all") {
            //Test Suite
            if (!userInput) {
              //Regen
              let data = await regenerateTest(buffer, file, undefined);
              await saveGeneratedTest(
                data,
                file.replace("/tests", "").replace(".test.", ".")
              );
              this._view.webview.postMessage({ type: "result" });
              await vscode.commands.executeCommand("testBuddy.reloadTests");
              return;
            } else {
              //Modif
              let data = await modifyTest(buffer, file, userInput, undefined);
              await saveGeneratedTest(
                data,
                file.replace("/tests", "").replace(".test.", ".")
              );
              this._view.webview.postMessage({ type: "result" });
              await vscode.commands.executeCommand("testBuddy.reloadTests");

              return;
            }
          } else {
            //Test Single
            if (!userInput) {
              //Regen
              let data = await regenerateTest(buffer, file, name);
              await saveGeneratedTest(
                data,
                file.replace("/tests", "").replace(".test.", ".")
              );
              this._view.webview.postMessage({ type: "result" });
              await vscode.commands.executeCommand("testBuddy.reloadTests");

              return;
            } else {
              //Modif
              let data = await modifyTest(buffer, file, userInput, name);
              await saveGeneratedTest(
                data,
                file.replace("/tests", "").replace(".test.", ".")
              );
              this._view.webview.postMessage({ type: "result" });
              await vscode.commands.executeCommand("testBuddy.reloadTests");

              return;
            }
          }

          break;
        }
      }
    });
  }

  public addColor() {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: "addColor" });
    }
  }

  public setTestToEditor(testFile: string, testName: string) {
    console.log("Llego al editor", testFile, testName);
    this._view?.show(true);
    this._view?.webview.postMessage({
      type: "sendTest",
      content: { testFile, testName },
    });
  }

  public populateSelector(testList: { testFile: string; testName: string }[]) {
    console.log("POPULATE PROVIDER", testList);
    this._view?.webview.postMessage({
      type: "populate",
      content: { testList },
    });
  }

  public clearColors() {
    if (this._view) {
      this._view.webview.postMessage({ type: "clearColors" });
    }
  }
}
