// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
const createOuptuFileUrl = (isRoot, file, title) => {
  return btoa(file + title);

  //   return isRoot
  //     ? file + "--all"
  //     : file + "--" + title.replace(/[^a-z0-9]/gi, "_").toLowerCase(); //Making everything filesystem safe
};
var getPath = function (str) {
  return str.split("\\").pop().split("/").pop();
};
(function () {
  const vscode = acquireVsCodeApi();

  const form = document.querySelector("#form-data");
  const buttonElement = document.querySelector("#save-button");
  const textareaElement = document.querySelector("#text-area-user-input");
  const toggleUserInput = document.querySelector("#toggle-user-input");
  const selectorElement = document.querySelector("#test-select");

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    console.log(event);
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "sendTest": {
        let { testFile, testName } = message.content;

        console.log("EDITOR SENDTEST", testFile);

        select(testFile, testName);
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
    let file = atob(
      selectorElement
        .querySelector("vscode-option[selected]")
        .getAttribute("data-file")
    );
    let name = atob(
      selectorElement
        .querySelector("vscode-option[selected]")
        .getAttribute("data-name")
    );

    console.log(file, name);
    if (form.data["data-example-checkbox"].includes("tell")) {
      console.log(textareaElement.value);
    }
  });

  const populate = (testList) => {
    vscode.setState({ tests: testList });
    selectorElement.innerHTML = "";
    testList.forEach((root, index) => {
      let rootOption = document.createElement("vscode-option");
      rootOption.setAttribute(
        "data-id",
        `${createOuptuFileUrl(true, root.file, "all")}`
      );
      if (index === 0) {
        rootOption.setAttribute("selected", "");
      }
      rootOption.setAttribute("data-file", `${btoa(root.file)}`);
      rootOption.setAttribute("data-name", `${btoa("all")}`);
      rootOption.innerText = `[${getPath(root.file)}] TestSuite`;
      selectorElement.appendChild(rootOption);
      root.children.forEach((child) => {
        let childOption = document.createElement("vscode-option");
        childOption.innerText = `[${getPath(root.file)}] ${child.name}`;
        childOption.setAttribute(
          "data-id",
          `${createOuptuFileUrl(false, root.file, child.name)}`
        );
        childOption.setAttribute("data-file", `${btoa(root.file)}`);
        childOption.setAttribute("data-name", `${btoa(child.name)}`);
        selectorElement.appendChild(childOption);
      });
    });
  };

  const select = (testFile, testName) => {
    let dataId = btoa(testFile + testName);

    selectorElement.querySelectorAll("vscode-option").forEach((el, pos) => {
      console.log(el.getAttribute("selected"));
      if (el.getAttribute("selected")) {
        el.removeAttribute("selected");
        selectorElement.removeAttribute("selected-index");
      }
      if (el.getAttribute("data-id") === dataId) {
        el.setAttribute("selected", "");
        selectorElement.setAttribute("selected-index", pos);
      }
    });
    selectorElement.requestUpdate();
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

  const oldState = vscode.getState() || { tests: [] };
  /** @type {Array<{ value: string }>} */
  let tests = oldState.tests;

  if (tests) {
    populate(tests);
  }
})();
