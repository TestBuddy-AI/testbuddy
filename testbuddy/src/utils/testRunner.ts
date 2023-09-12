import { IRunnerOptions } from "../types/IRunnerOptions";
import { runJsTests } from "./runJsTests";

export const testRunnerUtil = async (
  engine: IRunnerOptions,
  testfile: string = "",
  testdetail: string = "all",
  runAll: boolean = false
) => {
  let results = {};
  switch (engine) {
    case "javascript": {
      results = await runJsTests(testfile, testdetail);
      break;
    }
    case "typescript": {
      results = await runJsTests(testfile, testdetail);
      break;
    }
    case "python": {
      break;
    }
  }
  return results;
};
