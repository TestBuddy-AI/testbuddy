import * as vscode from "vscode";
import { EditorWebViewViewProvider } from "./providers/editorView/editorProvider";
import { TestListWebViewViewProvider } from "./providers/testlist/testListProvider";
import { WelcomeWebViewViewProvider } from "./providers/welcomeView/welcomeProvider";
import { error } from "console";
import { checkNpm } from "./utils/checkEnv";
import { commandGenerateTestHandler } from "./utils/testCreator";
import { readSessionIdFile } from "./utils/useAxios";

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
  //Providers for each ui
  const editorProvider = new EditorWebViewViewProvider(context);
  const testListprovider = new TestListWebViewViewProvider(
    context,
    "typescript"
  );
  //Checks For changes on Test Files
  let watcher = vscode.workspace.createFileSystemWatcher(
    "**/__tests__/**/*.{js,jsx,ts,tsx}"
  );
  let watcher2 = vscode.workspace.createFileSystemWatcher(
    "**/*.{test,spec}.{js,jsx,ts,tsx}"
  );

  watcher.onDidChange((uri) => {
    console.log("GLOB PATTERN 1");
    testListprovider.initialize();
  });
  watcher2.onDidChange((uri) => {
    console.log("GLOB PATTERN 2");
    testListprovider.initialize();
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "testBuddy.generateTest",
      async (...args) => {
        console.log(args);
        vscode.commands.executeCommand("testBuddy.testListWebViewView.focus");
        setTimeout(() => {
          testListprovider.setLoading(true);
        }, 0);
        await commandGenerateTestHandler(args);
        testListprovider
          .initialize()
          .then(() => testListprovider.setLoading(false));
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "testBuddy.sendTestToEditor",
      async (args) => {
        vscode.commands.executeCommand("testBuddy.editorWebViewView.focus");

        editorProvider.setTestToEditor(args[0], args[1]);
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "testBuddy.populateEditor",
      async (...args) => {
        editorProvider.populateSelector(args[0]);
      }
    )
  );

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

  readSessionIdFile().then(console.log);
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
  setTimeout(
    () => vscode.commands.executeCommand("testBuddy.testListWebViewView.focus"),
    0
  );
};
