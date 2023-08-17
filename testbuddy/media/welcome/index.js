//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();

  document.getElementById("welcome").addEventListener("click", () => {
    console.log("Ejecute");
    vscode.postMessage({ type: "welcome", value: "all" });
  });

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "addColor": {
        //addColor();
        break;
      }
    }
  });
})();
