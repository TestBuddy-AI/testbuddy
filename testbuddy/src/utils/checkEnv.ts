import { execShell } from "./execShell";

export const checkNpm = async () => {
  try {
    let result = await execShell("npm -v");
    return true;
  } catch (err) {
    return false;
  }
};

export const checkPython = async () => {
  try {
    let result = await execShell("python -–version");
    return true;
  } catch (err) {
    return false;
  }
};
export const checkPython3 = async () => {
  try {
    let result = await execShell("python3 -–version");
    return true;
  } catch (err) {
    return false;
  }
};
