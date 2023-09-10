//data-example-checkbox-2

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();

  const oldState = vscode.getState() || { tests: [] };
  const buttonElement = document.querySelector("#save-button");
  const textareaElement = document.querySelector("#text-area-user-input");
  const toggleUserInput = document.querySelector("#toggle-user-input");
  const selectorElement = document.querySelector("#test-select");

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
        console.log("EDITOR SENDTEST", testFile, testName);
        break;
      }
      case "populate": {
        let { testList } = message.content;
        console.log("EDITOR POPULATE", testList);
        populate(testList);
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

  const populate = (testList) => {
    selectorElement.innerHTML = "";
    testList.forEach((root) => {
      console.log("POPULATING ROOT:", root);
      let rootOption = document.createElement("vscode-option");
      rootOption.innerText = `[${getPath(root.file)}] TestSuite`;
      selectorElement.appendChild(rootOption);
      root.children.forEach((children) => {
        let childOption = document.createElement("vscode-option");
        childOption.innerText = `[${getPath(root.file)}] ${children.name}`;
        selectorElement.appendChild(childOption);
      });
    });
  };

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
