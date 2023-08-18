import * as vscode from "vscode";
import { EditorWebViewViewProvider } from "./providers/editor/editorProvider";
import { TestListWebViewViewProvider } from "./providers/testlist/testListProvider";
import { WelcomeWebViewViewProvider } from "./providers/welcomeView/welcomeProvider";
import { error } from "console";
import { checkNpm } from "./utils/checkEnv";

export function activate(context: vscode.ExtensionContext) {
  console.log("Debug1");
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
  console.log("Debug2");
  context.subscriptions.push(
    vscode.commands.registerCommand("testBuddy.selectLanguage", () => {
      selectTestingLanguage(context).then(() => {
        initializeApp(context);
      });
    })
  );
  console.log("Debug3");
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
      detail: "Hoalaaaa",
      description: "haasdasdas",
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
  if (!input) {
    throw error("Selecciona una opcion");
  }
  switch (input.label) {
    case "$(testbuddy-js) Javascript": {
    }
  }
  let npmExists = await checkNpm();
  if (!npmExists) {
    vscode.window
      .showErrorMessage(
        "Please install Node & NPM to use this test suite",
        "Change test environment",
        "Cancel"
      )
      .then((el) => {
        if (el === "Change test environment") {
          vscode.commands.executeCommand("testBuddy.selectLanguage");
        }
      });
    throw error("Instala lo apropiado");
  }

  vscode.window.showInformationMessage("Holaaa", input?.label || "Adios");
};
