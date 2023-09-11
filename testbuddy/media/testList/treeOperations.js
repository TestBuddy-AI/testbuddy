export const ICONS = {
  GO_TO_FILE: "go-to-file",
  RUN: "run",
  REFRESH: "refresh",
  PASSED: "pass",
  ERROR: "error",
  DEFAULT: "circle-large",
  EDIT: "wand",
  LOADING: "loading",
  INFO_ERROR: "run-errors",
};
export const TEST_STATUS = {
  RUNNING: "running",
  EXECUTED: "executed",
  DEFAULT: "default",
};
export const treeHTMLElement = document.getElementById("actions-example");

export const actions = [
  {
    icon: ICONS.RUN,
    actionId: "runTest",
    tooltip: "Run all",
  },
  {
    icon: ICONS.EDIT,
    actionId: "regenerateTest",
    tooltip: "Modify tests",
  },
  {
    icon: ICONS.GO_TO_FILE,
    actionId: "goToFile",
    tooltip: "Open test",
  },
];

export const actionsError = [
  {
    icon: ICONS.RUN,
    actionId: "runTest",
    tooltip: "Run all",
  },
  {
    icon: ICONS.EDIT,
    actionId: "regenerateTest",
    tooltip: "Modify tests",
  },
  {
    icon: ICONS.GO_TO_FILE,
    actionId: "goToFile",
    tooltip: "Open test",
  },
  {
    icon: ICONS.INFO_ERROR,
    actionId: "showError",
    tooltip: "Show failure message",
  },
];
export const getDecorations = (
  status,
  numTests = -1,
  numSucced = -1,
  numErrored = -1
) => {
  let decorations = [
    {
      content: numTests,
    },
  ];

  switch (status) {
    case TEST_STATUS.RUNNING: {
      decorations = [
        {
          content: "Running",
          color: "#fff",
        },
      ];
      break;
    }
    case TEST_STATUS.EXECUTED: {
      if (numSucced !== -1 && numErrored !== -1) {
        decorations = [
          {
            content: numSucced,
            color: "#0f0",
          },
          {
            content: numErrored,
            color: "#f00",
          },
          {
            content: numTests,
          },
        ];
      }
      break;
    }
    case TEST_STATUS.DEFAULT: {
      decorations = [
        {
          content: numTests,
        },
      ];
      break;
    }
  }
  return decorations;
};

export const setLoadingIcons = () => {};

export const setResultsIcons = () => {};

export const updateLoadingIcons = () => {
  const loadingIcons = treeHTMLElement.shadowRoot.querySelectorAll(
    `vscode-icon[name="${ICONS.LOADING}"]`
  );

  loadingIcons.forEach((el) => {
    el.classList.add("red");
    el.setAttribute("spin", "");
    el.requestUpdate();
  });
};

export const updateResultsIcons = () => {
  const resultsIcons = treeHTMLElement.shadowRoot.querySelectorAll(
    `vscode-icon[name="${ICONS.ERROR}"]`
  );
  resultsIcons.forEach((el) => {
    switch (el.getAttribute("name")) {
      case ICONS.DEFAULT: {
        el.removeAttribute("spin");
        el.classList.remove("green", "red");
        break;
      }
      case ICONS.PASSED: {
        el.removeAttribute("spin");
        el.classList.add("green");
        break;
      }
      case ICONS.ERROR: {
        el.removeAttribute("spin");

        el.classList.add("red");
        break;
      }
    }
  });
};

export const mapNode = (testNode, isRoot = false) => {
  if (isRoot) {
    const node = {
      id: createId(isRoot, testNode.file),
      label: getPath(testNode.file),
      icons: getIcons(),
      status: undefined,
      isRoot: true,
      actions: actions,
      decorations: getDecorations(
        TEST_STATUS.DEFAULT,
        testNode.children.length
      ),
      value: {
        file: testNode.file,
        test: "all",
        open: { start: testNode.start, end: testNode.end, file: testNode.file },
      },
      subItems: testNode.children.map((node) => mapNode(node, false)),
    };
    return node;
  } else {
    const node = {
      id: createId(isRoot, testNode.file, testNode.name),
      label: testNode.name,
      icons: getIcons(),
      status: undefined,
      isRoot: false,
      actions: actions,
      value: {
        file: testNode.file,
        test: testNode.name,
        open: { start: testNode.start, end: testNode.end, file: testNode.file },
      },
    };
    return node;
  }
};
export const getIcons = (iconType = ICONS.DEFAULT) => {
  const icons = {
    branch: iconType,
    leaf: iconType,
    open: iconType,
  };
  return icons;
};

export function updateNodeInArray(idToUpdate, isLoading, result) {
  // Iterate through each tree in the array
  for (let i = 0; i < treeHTMLElement.data.length; i++) {
    const tree = treeHTMLElement.data[i];

    // Call the updateNode function for each tree in the array
    updateNode(tree, idToUpdate, isLoading, result);
  }
}

export function updateNode(node, idToUpdate, isLoading, result) {
  // Base case: If the current node's id matches the idToUpdate, update it
  if (node.id === idToUpdate) {
    if (isLoading) {
      node.icons = getIcons(ICONS.LOADING);
      node.decorations = getDecorations(TEST_STATUS.RUNNING);
      node.status = "loading";

      if (node.subItems && node.subItems.length > 0) {
        node.subItems.forEach((children) => {
          updateNode(children, children.id, isLoading, result);
        });
      }
    }

    // Update other properties based on the result if needed
    if (result && result.status !== undefined) {
      // Update the status based on the result
      // TODO - ACTUALIZAR DECORATIONS PARA INCLUIR LOS TESTS PASADOS, ACTUALIZAR HIJOS PARA INCLUIR RUNNING en el LOAD
      switch (result.status) {
        case "passed": {
          node.icons = getIcons(ICONS.PASSED);
          const index = node.actions.findIndex(
            (object) => object.icon === ICONS.INFO_ERROR
          );
          if (index === -1) {
            node.actions = actions;
          }
          node.status = "passed";
          break;
        }
        case "failed": {
          node.icons = getIcons(ICONS.ERROR);
          node.status = "failed";
          console.log(node.actions);
          if (result.failureMessages) {
            node.message = result.failureMessages.join(" ");
            node.failureMeesages = result.failureMessages;
            node.actions = actionsError;
          }

          break;
        }
        case "pending": {
          //   node.icons = getIcons(ICONS.DEFAULT);
          const index = node.actions.findIndex(
            (object) => object.icon === ICONS.INFO_ERROR
          );
          if (index === -1) {
            node.actions = actions;
          }
          node.status = "pending";
          break;
        }
      }
      node.decorations = [];
      // updateResultsIcons();

      // You can add more updates here based on the result if needed
    }
  }

  // Recursive case: If the current node has subItems, traverse them
  if (node.subItems && node.subItems.length > 0) {
    for (let i = 0; i < node.subItems.length; i++) {
      updateNode(node.subItems[i], idToUpdate, isLoading, result);
    }
  }
  treeHTMLElement.requestUpdate();
}

//"status": "failed" | "pending" | "passed",
export const updateParentStatus = (node) => {
  if (!node.subItems || node.subItems.length === 0) {
    // Leaf node
    return node.status;
  }

  let failed = false;
  let passed = false;
  let pending = false;

  for (const child of node.subItems) {
    const childStatus = updateParentStatus(child);

    if (childStatus === "failed") {
      failed = true;
      passed = false;
      pending = false;
      break; // No need to check other children if one has failed
    } else if (childStatus === "passed") {
      passed = true;
    } else if (childStatus === "pending") {
      pending = true;
      passed = false;
      failed = false;
    } else {
      // Handle undefined status
      passed = false;
      failed = false;
      pending = true;
    }
  }

  if (failed) {
    node.status = "failed";
  } else if (passed) {
    node.status = "passed";
  } else if (pending) {
    node.status = "pending";
  } else {
    node.status = undefined;
  }

  return node.status;
};

export const createId = (isRoot, file, title = "") => {
  return isRoot ? file + "--all" : file + "--" + title;
};

const getPath = function (str) {
  return str.split("\\").pop().split("/").pop();
};
