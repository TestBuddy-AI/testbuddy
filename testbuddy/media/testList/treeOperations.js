export const ICONS = {
  GO_TO_FILE: "go-to-file",
  RUN: "run",
  REFRESH: "refresh",
  PASSED: "pass",
  ERROR: "error",
  DEFAULT: "circle-large",
  EDIT: "edit",
  LOADING: "loading",
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
    icon: ICONS.REFRESH,
    actionId: "regenerateTest",
    tooltip: "Regenerate tests",
  },
  {
    icon: ICONS.GO_TO_FILE,
    actionId: "goToFile",
    tooltip: "Open test",
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
  console.log(loadingIcons);
  loadingIcons.forEach((el) => {
    el.classList.add("red");
    el.setAttribute("spin", "");
    el.requestUpdate();
  });
  updateResultsIcons();
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

export const mapInitialTests = (testList) => {
  const defaultIcons = {
    branch: ICONS.DEFAULT,
    leaf: ICONS.DEFAULT,
    open: ICONS.DEFAULT,
  };

  const data = testList.map((root) => {
    root.id = root.file + "//all";
    root.label = getPath(root.file);
    root.icons = defaultIcons;
    root.status = true;
    root.actions = actions;
    // root.decorations = getDecorations(
    //   TEST_STATUS.DEFAULT,
    //   root.children.length
    // );
    root.decorations = getDecorations(
      TEST_STATUS.EXECUTED,
      root.children.length,
      10,
      20
    );
    root.value = { file: root.file, test: "all" };
    root.subItems = root.children.map((test) => {
      test.id = root.file + "//" + test.name;
      test.label = test.name;
      test.status = true;
      test.icons = icons;
      test.actions = actions;
      test.value = {
        file: root.file,
        test: test.name,
      };
      return test;
    });
    return root;
  });
};

export const mapNode = (testNode, isRoot = false) => {
  if (isRoot) {
    const node = {
      id: createId(isRoot, testNode.file),
      label: getPath(testNode.file),
      icons: getIcons(),
      status: true,
      actions: actions,
      decorations: getDecorations(
        TEST_STATUS.DEFAULT,
        testNode.children.length
      ),
      value: { file: testNode.file, test: "all" },
      subItems: testNode.children.map((node) => mapNode(node, false)),
    };
    return node;
  } else {
    const node = {
      id: createId(isRoot, testNode.file, testNode.name),
      label: testNode.name,
      icons: getIcons(),
      status: true,
      actions: actions,
      value: {
        file: testNode.file,
        test: testNode.name,
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
    }

    // Update other properties based on the result if needed
    if (result !== undefined) {
      // Update the status based on the result
      switch (result) {
        case "passed": {
          node.icons = getIcons(ICONS.PASSED);
          break;
        }
        case "failed": {
          node.icons = getIcons(ICONS.ERROR);
          break;
        }
        case "pending": {
          //   node.icons = getIcons(ICONS.DEFAULT);
          break;
        }
      }
      updateResultsIcons();

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
  setTimeout(() => updateLoadingIcons(), 0);
}

//"status": "failed" | "pending" | "passed",

export const createId = (isRoot, file, title = "") => {
  return isRoot ? file + "--all" : file + "--" + title;
};

const getPath = function (str) {
  return str.split("\\").pop().split("/").pop();
};
