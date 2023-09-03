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
const getIcons = (iconType = ICONS.DEFAULT) => {
  const icons = {
    branch: iconType,
    leaf: iconType,
    open: iconType,
  };
  return icons;
};

//"status": "failed" | "pending" | "passed",
const updateNodeInTree = (
  file,
  loading = false,
  isRoot = false,
  testResultNode = {}
) => {
  if (testResultNode.status === "pending") {
    return;
  }
  const nodeId = createId(isRoot, file, testResultNode.title);
  root = treeHTMLElement.data.find((el) => (el.id = createId(true, file)));
  if (loading) {
    const changes = {
      icons: getIcons(ICONS.LOADING),
      decorations: getDecorations(TEST_STATUS.RUNNING),
    };
    updatePropertyById(nodeId, root, changes);
  }
  if (!isRoot) {
    const changes = {
      icons:
        testResultNode.status === "passed"
          ? getIcons(ICONS.PASSED)
          : getIcons(ICONS.ERROR),
    };
    updatePropertyById(nodeId, root, changes);
  } else {
  }
};

const createId = (isRoot, file, title = "") => {
  return isRoot ? file + "--all" : file + "--" + title;
};

const replaceOrAdd = (arr, el, key = "id") => {
  const existingIndex = arr.findIndex((e) => e[key] === el[key]);

  if (existingIndex >= 0) {
    arr[existingIndex] = el;
  } else {
    arr.push(el);
  }
};

const getPath = function (str) {
  return str.split("\\").pop().split("/").pop();
};

const findNodeById = (tree, id) => {
  let result = null;
  if (tree.id === id) {
    return tree;
  }

  if (Array.isArray(tree.children) && tree.children.length > 0) {
    tree.children.some((node) => {
      result = findNodeById(node, id);
      return result;
    });
  }
  return result;
};

function updatePropertyById(id, data, properties) {
  if (data.id === id) {
    data = { ...data, ...properties };
  }
  if (data.children !== undefined && data.children.length > 0) {
    for (i = 0; i < data.children.length; i++) {
      data.children[i] = updatePropertyById(id, data.children[i], properties);
    }
  }

  return data;
}
