import {
  createId,
  treeHTMLElement,
  updateNodeInArray,
} from "./treeOperations.js";

export const runTests = (vscode, eventDetail = {}) => {
  if (!eventDetail.value) {
    console.log("eventDetail Vacio", eventDetail);
    vscode.postMessage({
      type: "runTest",
      value: "all",
    });
    treeHTMLElement.data.forEach((el) => {
      console.log(el);
      updateNodeInArray(el.id, true, undefined);
    });
    return;
  }
  console.log("eventDetail lleno", eventDetail);
  const { actionId, value } = eventDetail;
  updateNodeInArray(
    createId(value.test === "all", value.file, value.test),
    true,
    undefined
  );

  vscode.postMessage({
    type: actionId,
    value: value,
  });
};
