import * as vscode from "vscode";
import { EditorWebViewViewProvider } from "./providers/editorView/editorProvider";
import { TestListWebViewViewProvider } from "./providers/testlist/testListProvider";
import { WelcomeWebViewViewProvider } from "./providers/welcomeView/welcomeProvider";
import { error } from "console";
import { checkNpm, checkPython, checkPython3 } from "./utils/checkEnv";
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
      selectTestingLanguage(context).then(({ lang, pythonCommand }) => {
        initializeApp(context, lang!, pythonCommand!);
      });
    })
  );
  console.log("Debug3");
}

const selectTestingLanguage = async (_context: vscode.ExtensionContext) => {
  //ICONS NOT WORKING (Figure out whats happening)
  let list: vscode.QuickPickItem[] = [
    {
      label: "$(testbuddy-js) Javascript",
      description: "With Jest as testing framework",
      detail: "https://jestjs.io/",
    },
    {
      label: "$(testbuddy-ts) Typescript",
      description: "With Jest as testing framework",
      detail: "https://jestjs.io/",
      //   iconPath: vscode.Uri.joinPath(
      //     _context.extensionUri,
      //     "assets/languages/ts.svg"
      //   ),
    },
    {
      label: "$(testbuddy-python) Python",
      description: "With unittest as testing framework",
      detail: "https://docs.python.org/3/library/unittest.html",
      //   iconPath: vscode.Uri.joinPath(
      //     _context.extensionUri,
      //     "assets/languages/python.svg"
      //   ),
    },
  ];

  const input = await vscode.window.showQuickPick(list);
  let lang;
  let pythonCommand;
  if (!input) {
    throw error("Selecciona una opcion");
  }
  switch (input.label) {
    case "$(testbuddy-js) Javascript": {
      lang = "javascript";
      let npmExists = await checkNpm();
      if (!npmExists) {
        vscode.window
          .showErrorMessage(
            "Please install Node & NPM to use this test environment",
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
      break;
    }
    case "$(testbuddy-ts) Typescript": {
      lang = "typescript";
      let npmExists = await checkNpm();
      if (!npmExists) {
        vscode.window
          .showErrorMessage(
            "Please install Node & NPM to use this test environment",
            "Change test environment",
            "Cancel"
          )
          .then((el) => {
            if (el === "Change test environment") {
              vscode.commands.executeCommand("testBuddy.selectLanguage");
            }
          });
        throw error("Install the correct things");
      }
      break;
    }
    case "$(testbuddy-python) Python": {
      lang = "python";
      let pythonExists = await checkPython();
      let python3Exists = await checkPython3();

      if (!(python3Exists || pythonExists)) {
        vscode.window
          .showErrorMessage(
            "Please install python to use this test environment",
            "Change test environment",
            "Cancel"
          )
          .then((el) => {
            if (el === "Change test environment") {
              vscode.commands.executeCommand("testBuddy.selectLanguage");
            }
          });
        throw error("Install the correct things");
      }
      pythonCommand = pythonExists ? "python" : python3Exists ? "python3" : "";

      break;
    }
  }

  // vscode.window.showInformationMessage("Holaaa", input?.label || "Adios");
  setTimeout(
    () => vscode.commands.executeCommand("testBuddy.testListWebViewView.focus"),
    0
  );

  return { lang, pythonCommand };
};

const initializeApp = (
  context: vscode.ExtensionContext,
  testingLanguage: string,
  pythonCommand?: string
) => {
  vscode.commands.executeCommand(
    "setContext",
    "testBuddy.loadEditorView",
    true
  );
  //Providers for each ui
  const editorProvider = new EditorWebViewViewProvider(context);
  const testListprovider = new TestListWebViewViewProvider(
    context,
    testingLanguage,
    pythonCommand
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
