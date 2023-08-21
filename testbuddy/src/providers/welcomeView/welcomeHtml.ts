import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export const getWelcomeHtml = (
  webview: vscode.Webview,
  _context: vscode.ExtensionContext
) => {
  const filePath: vscode.Uri = vscode.Uri.file(
    path.join(
      _context.extensionPath,
      "src",
      "providers",
      "welcomeView",
      "index.html"
    )
  );
  let html = fs.readFileSync(filePath.fsPath, "utf8");
  // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "welcome", "index.js")
  );
  html = html.replace("{{jsSource}}", scriptUri);

  const scriptUri2 = webview.asWebviewUri(
    vscode.Uri.joinPath(
      _context.extensionUri,
      "node_modules/@bendera/vscode-webview-elements/dist/bundled.js"
    )
  );
  html = html.replace("{{jsSource2}}", scriptUri2);

  const videoUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media/lottie.gif")
  );
  html = html.replace("{{gifURL}}", videoUri);
  // Do the same for the stylesheet.
  const styleResetUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "reset.css")
  );
  html = html.replace("{{cssSource1}}", styleResetUri);
  const styleVSCodeUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "vscode.css")
  );
  html = html.replace("{{cssSource2}}", styleVSCodeUri);
  const styleMainUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "main.css")
  );
  html = html.replace("{{cssSource3}}", styleMainUri);
  const codiconsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      _context.extensionUri,
      "node_modules",
      "@vscode/codicons",
      "dist",
      "codicon.css"
    )
  );
  html = html.replace("{{cssSource4}}", codiconsUri);

  return html;
};
