import * as vscode from "vscode";
import { EditorWebViewViewProvider } from "./providers/editor/editorProvider";
import { TestListWebViewViewProvider } from "./providers/testlist/testListProvider";
import { WelcomeWebViewViewProvider } from "./providers/welcomeView/welcomeProvider";

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.executeCommand(
    "setContext",
    "testBuddy.loadEditorView",
    false
  );
  const welcomeProvider = new WelcomeWebViewViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      WelcomeWebViewViewProvider.viewType,
      welcomeProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("testBuddy.selectLanguage", () => {
      selectTestingLanguage().then(() => {
        initializeApp(context);
      });
    })
  );
}

const initializeApp = (context: vscode.ExtensionContext) => {
  vscode.commands.executeCommand(
    "setContext",
    "testBuddy.loadEditorView",
    true
  );
  const editorProvider = new EditorWebViewViewProvider(context);
  const testListprovider = new TestListWebViewViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      EditorWebViewViewProvider.viewType,
      editorProvider
    )
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      TestListWebViewViewProvider.viewType,
      testListprovider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("calicoColors.addColor", () => {
      provider.addColor();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("calicoColors.clearColors", () => {
      provider.clearColors();
    })
  );
};

const selectTestingLanguage = async () => {
  const input = await vscode.window.showQuickPick([
    "Javascript",
    "Typescript",
    "Python",
  ]);
  vscode.window.showInformationMessage("Holaaa", input || "Adios");
};
