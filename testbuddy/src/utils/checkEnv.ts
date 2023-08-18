import { execShell } from "./execShell";

export const checkNpm = async () => {
  try {
    let result = await execShell("npm -v");
    return true;
  } catch (err) {
    return false;
  }
};
export const checkNpmAdd = async () => {
  try {
    let result = await execShell("");
  } catch (err) {}
};
