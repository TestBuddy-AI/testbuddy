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
      selectTestingLanguage(context).then(() => {
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
      editorProvider.addColor();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("calicoColors.clearColors", () => {
      editorProvider.clearColors();
    })
  );
};

const selectTestingLanguage = async (_context: vscode.ExtensionContext) => {
  //ICONS NOT WORKING (Figure out whats happening)
  let list: vscode.QuickPickItem[] = [
    {
      label: "$(testbuddy-js) Javascript",
    },
    {
      label: "$(testbuddy-ts) Typescript",
      //   iconPath: vscode.Uri.joinPath(
      //     _context.extensionUri,
      //     "assets/languages/ts.svg"
      //   ),
    },
    {
      label: "$(testbuddy-python) Python",
      //   iconPath: vscode.Uri.joinPath(
      //     _context.extensionUri,
      //     "assets/languages/python.svg"
      //   ),
    },
  ];

  const input = await vscode.window.showQuickPick(list);

  vscode.window.showInformationMessage("Holaaa", input?.label || "Adios");
};
