import * as vscode from "vscode";
export const showSource = async (file: string, line: number): Promise<void> => {
  const fileUri = file;
  if (fileUri) {
    const document = await vscode.workspace.openTextDocument(
      vscode.Uri.parse(fileUri)
    );

    const range =
      line !== undefined ? new vscode.Range(line, 0, line, 0) : undefined;
    const editor = await vscode.window.showTextDocument(document, {
      selection: range,
    });
    if (range !== undefined) {
      editor.revealRange(
        range.with(new vscode.Position(Math.max(line! - 1, 0), 0)),
        vscode.TextEditorRevealType.AtTop
      );
    }
  }
};
