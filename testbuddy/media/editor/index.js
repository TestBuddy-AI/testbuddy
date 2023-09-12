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

function pop(element) {
  const bbox = element.getBoundingClientRect();
  const x = bbox.left + bbox.width / 2;
  const y = bbox.top + bbox.height / 2;

  for (let i = 0; i < 30; i++) {
    createParticle(x, y);
  }
}

function createParticle(x, y) {
  const particle = document.createElement("particle");
  document.body.appendChild(particle);

  // Calculate a random size from 5px to 25px
  const size = Math.floor(Math.random() * 20 + 5);
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  // Generate a random color in a blue/purple palette
  particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;

  // Generate a random x & y destination within a distance of 75px from the specified position
  const destinationX = x + (Math.random() - 0.5) * 2 * 75;
  const destinationY = y + (Math.random() - 0.5) * 2 * 75;

  // Store the animation in a variable as we will need it later
  const animation = particle.animate(
    [
      {
        // Set the origin position of the particle
        // We offset the particle with half its size to center it around the specified position
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        opacity: 1,
      },
      {
        // We define the final coordinates as the second keyframe
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 0,
      },
    ],
    {
      // Set a random duration from 500 to 1500ms
      duration: Math.random() * 1000 + 500,
      easing: "cubic-bezier(0, .9, .57, 1)",
      // Delay every particle with a random value of 200ms
      delay: Math.random() * 200,
    }
  );

  // When the animation is complete, remove the element from the DOM
  animation.onfinish = () => {
    particle.remove();
  };
}

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
        pop(selectorElement);
        break;
      }
      case "populate": {
        let { testList } = message.content;
        console.log("EDITOR POPULATE", testList);
        populate(testList);
        break;
      }
      case "result": {
        resetButton();
      }
    }
  });

  function setLoader(active) {
    if (active) document.querySelector(".loader")?.classList.add("active");
    else document.querySelector(".loader")?.classList.remove("active");
  }

  buttonElement.addEventListener("click", (e) => {
    // pop(buttonElement);
    buttonElement.innerHTML = `<vscode-icon name="loading" spin spin-duration="1"></vscode-icon> Modifying your test`;
    buttonElement.setAttribute("disabled", "");
    setTimeout(() => {
      resetButton();
    }, 40000);
    let currTestPos = Number(selectorElement.getAttribute("selected-index"));
    let selectedTest =
      selectorElement.querySelectorAll("vscode-option")[currTestPos];
    let file = atob(selectedTest.getAttribute("data-file"));
    let name = atob(selectedTest.getAttribute("data-name"));
    let value = {
      file: file,
      name: name,
      userInput: "",
      selects: form.data["data-example-checkbox"],
    };

    if (form.data["data-example-checkbox"].includes("tell")) {
      value.userInput = textareaElement.value;
    }

    vscode.postMessage({ type: "modifyTests", value: value });
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

    selectorElement.setAttribute("selected-index", 0);
  };

  const select = (testFile, testName) => {
    let dataId = btoa(testFile + testName);

    selectorElement.querySelectorAll("vscode-option").forEach((el, pos) => {
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
  const resetButton = () => {
    buttonElement.removeAttribute("disabled");
    buttonElement.innerHTML = "Modify your test";
  };

  selectorElement.addEventListener("vsc-change", (ev) => {
    resetButton();
    selectorElement.setAttribute("selected-index", ev.detail.selectedIndex);
  });

  const oldState = vscode.getState() || { tests: [] };
  /** @type {Array<{ value: string }>} */
  let tests = oldState.tests;

  if (tests) {
    populate(tests);
  }
})();
