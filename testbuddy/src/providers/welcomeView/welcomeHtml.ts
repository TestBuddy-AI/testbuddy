import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export const getWelcomeHtml = (
  webview: vscode.Webview,
  _context: vscode.ExtensionContext
) => {
  const filePath: vscode.Uri = vscode.Uri.file(
    path.join(_context.extensionPath, "media", "welcome", "index.html")
  );
  let html = fs.readFileSync(filePath.fsPath, "utf8");
  // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "welcome", "index.js")
  );
  //@ts-ignore
  html = html.replace("{{jsSource}}", scriptUri);

  const scriptUri2 = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "bendera", "bundled.js")
  );
  //@ts-ignore
  html = html.replace("{{jsSource2}}", scriptUri2);

  const videoUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media/lottie.gif")
  );
  //@ts-ignore
  html = html.replace("{{gifURL}}", videoUri);
  // Do the same for the stylesheet.
  const styleResetUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "reset.css")
  );
  //@ts-ignore
  html = html.replace("{{cssSource1}}", styleResetUri);
  const styleVSCodeUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "vscode.css")
  );
  //@ts-ignore
  html = html.replace("{{cssSource2}}", styleVSCodeUri);
  const styleMainUri = webview.asWebviewUri(
    vscode.Uri.joinPath(_context.extensionUri, "media", "main.css")
  );
  //@ts-ignore
  html = html.replace("{{cssSource3}}", styleMainUri);
  const codiconsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      _context.extensionUri,
      "media",
      "codicons/dist",
      "codicon.css"
    )
  );
  //@ts-ignore
  html = html.replace("{{cssSource4}}", codiconsUri);

  return html;
};
