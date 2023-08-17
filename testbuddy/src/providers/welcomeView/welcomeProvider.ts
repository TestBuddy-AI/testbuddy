import * as vscode from "vscode";

import { getWelcomeHtml } from "./welcomeHtml";
import { execShell } from "../../utils/execShell";

//https://stackoverflow.com/questions/43007267/how-to-run-a-system-command-from-vscode-extension Check answers at the end, fs.watch for file updates
export class WelcomeWebViewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "testBuddy.welcomeWebViewView";

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

    webviewView.webview.html = getWelcomeHtml(
      this._view.webview,
      this._context
    );

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "welcome": {
          vscode.commands.executeCommand("testBuddy.selectLanguage");

          break;
        }
      }
    });
  }
}
