import { runTests } from "./testRunner.js";
import {
  actions,
  ICONS,
  getDecorations,
  TEST_STATUS,
  updateLoadingIcons,
  updateResultsIcons,
  mapNode,
  getIcons,
  updateNodeInArray,
  createId,
  treeHTMLElement,
  updateParentStatus,
} from "./treeOperations.js";
// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const preErrorElement = document.getElementById("error-wrapper");
  const codeErrorElement = document.getElementById("error-container");
  const labelErrorTest = document.getElementById("test-label");
  const errorContainer = document.getElementById("error-container");

  const vscode = acquireVsCodeApi();

  const oldState = vscode.getState() || { tests: [] };

  /** @type {Array<{ value: string }>} */
  let tests = oldState.tests;
  const setTreeListener = (tree) => {
    if (tree?.getAttribute("listener") !== "true") {
      tree.addEventListener("vsc-run-action", (ev) => {
        console.log(ev);
        const { actionId, item, value, open } = ev.detail;
        switch (actionId) {
          case "runTest": {
            runTests(vscode, ev.detail);
            break;
          }
          case "regenerateTest": {
            console.log(item);
            console.log(item.message);
            vscode.postMessage({
              type: actionId,
              value: value,
            });
            break;
          }
          case "goToFile": {
            vscode.postMessage({
              type: actionId,
              value: { ...value },
            });
            break;
          }
          case "showError": {
            showError(value.file, value.test, item.message);
            break;
          }
        }
      });
      tree?.setAttribute("listener", "true");
      vscode.setState({ tests: treeHTMLElement.data });
    }
  };

  if (tests) {
    updateTests(tests);
  }

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    console.log(event);
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "addTests": {
        tests = [];
        addTests(message.content);
        break;
      }
      case "loading": {
        setLoader(message.content);
        break;
      }
      case "results": {
        const el = message.content;

        const resultArray = el.results.testResults;
        resultArray.forEach((resultObject) => {
          let fileName = resultObject.name;
          let assertions = resultObject.assertionResults;

          assertions.forEach((assertion) => {
            updateNodeInArray(
              createId(assertion.title === "all", fileName, assertion.title),
              false,
              assertion
            );
          });
        });
        treeHTMLElement.data.forEach((el) => {
          let nodeStatus = updateParentStatus(el);
          console.log(nodeStatus, "++++++++");
          updateNodeInArray(el.id, false, { status: nodeStatus });
        });

        vscode.setState({ tests: treeHTMLElement.data });
        break;
      }
    }
  });

  function setLoader(active) {
    if (active) document.querySelector(".loader")?.classList.add("active");
    else document.querySelector(".loader")?.classList.remove("active");
  }

  function updateTests(testList) {
    console.log(testList);
    const tree = document.getElementById("actions-example");

    tree.data = testList;
    const style = document.createElement("style");
    style.textContent = `
      .theme-icon[name="${ICONS.PASSED}"]{
        color: #0f0 !important;
      }
      .theme-icon[name="${ICONS.ERROR}"]{
        color: #f00 !important;
      }
      .theme-icon[name="${ICONS.DEFAULT}"]{
        color: var(--secondary-background) !important;
      }
      .theme-icon{
        color: var(--inactive-selection-icon-foreground) !important;
      }
      .theme-icon[name="${ICONS.LOADING}"]{
        animation-name: spin;
        animation-duration: 1000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
      }
      @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
    }
    `;
    tree?.shadowRoot?.append(style);

    setTreeListener(tree);
  }
  function addTests(testList) {
    console.log(testList, "---");
    const tree = document.getElementById("actions-example");
    const icons = {
      branch: ICONS.LOADING,
      leaf: ICONS.ERROR,
      open: ICONS.PASSED,
    };

    /**
         * {
        "type": "root",
        "file": "/Users/camilo.salinas/Documents/Personal/testproject/tests/Form.test.tsx",
         }
  {
            "type": "it",
            "file": "/Users/camilo.salinas/Documents/Personal/testproject/tests/Form.test.tsx",
            "start": {
                "line": 59,
                "column": 5,
                "index": 1552
            },
            "end": {
                "line": 63,
                "column": 7,
                "index": 1773
            },
            "name": "renders its children",
            "nameType": "StringLiteral",
            "nameRange": {
                "start": {
                    "column": 9,
                    "line": 59
                },
                "end": {
                    "column": 28,
                    "line": 59
                }
            }
        },
         */
    const data = testList.map((root) => mapNode(root, true));

    tree.data = data;

    console.log(data);
    setTreeListener(tree);
    // updateLoadingIcons();
    const style = document.createElement("style");
    style.textContent = `
      .theme-icon[name="${ICONS.PASSED}"]{
        color: #0f0 !important;
      }
      .theme-icon[name="${ICONS.ERROR}"]{
        color: #f00 !important;
      }
      .theme-icon[name="${ICONS.DEFAULT}"]{
        color: var(--secondary-background) !important;
      }
      .theme-icon{
        color: var(--inactive-selection-icon-foreground) !important;
      }
    `;
    tree?.shadowRoot?.append(style);
    console.log(tree);
    updateResultsIcons();
    vscode.setState({ tests: data });
  }

  document.getElementById("btn-test").addEventListener("vsc-click", (ev) => {
    console.log("Hacer Algo");
    runTests(vscode);
  });
  document.getElementById("btn-refresh").addEventListener("vsc-click", () => {
    vscode.postMessage({ type: "reload" });
  });

  const showError = (testName, testTitle, error) => {
    labelErrorTest.innerText =
      testName + testTitle === "all" ? "all" : testTitle;
    preErrorElement.removeAttribute("hidden");
    labelErrorTest.removeAttribute("hidden");
    codeErrorElement.innerText = error;
  };
})();

var getPath = function (str) {
  return str.split("\\").pop().split("/").pop();
};
