//data-example-checkbox-2

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();

  const oldState = vscode.getState() || { tests: [] };
  const buttonElement = document.querySelector("#save-button");
  const textareaElement = document.querySelector("#text-area-user-input");
  const toggleUserInput = document.querySelector("#toggle-user-input");

  /** @type {Array<{ value: string }>} */
  let tests = oldState.tests;

  if (tests) {
  }

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    console.log(event);
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "sendTest": {
        let { testFile, testName } = message.content;
        break;
      }
    }
  });

  function setLoader(active) {
    if (active) document.querySelector(".loader")?.classList.add("active");
    else document.querySelector(".loader")?.classList.remove("active");
  }

  buttonElement.addEventListener("click", () => {
    console.log(form.data);
  });

  toggleUserInput.addEventListener(
    "vsc-change",
    (ev) => {
      ev.detail.checked
        ? textareaElement.removeAttribute("hidden")
        : textareaElement.setAttribute("hidden", "");
    },
    false
  );
})();

var getPath = function (str) {
  return str.split("\\").pop().split("/").pop();
};
