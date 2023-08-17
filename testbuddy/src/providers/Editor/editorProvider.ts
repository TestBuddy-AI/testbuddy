import * as vscode from "vscode";

import { getEditorHtml } from "./editorHtml";
import { execShell } from "../../utils/execShell";

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
      ],
    };
    console.log(vscode.Uri.joinPath(this._context.extensionUri, "media"));

    webviewView.webview.html = getEditorHtml(this._view.webview, this._context);

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
          console.log("Llegue");
          //execute shell command for testing
          execShell(
            `cd ${vscode.workspace.workspaceFolders[0].uri.path} && npm run test`
          ).then(console.log);
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

  public clearColors() {
    if (this._view) {
      this._view.webview.postMessage({ type: "clearColors" });
    }
  }
}
