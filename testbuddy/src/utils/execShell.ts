import * as shell from "shelljs";
import { isWindows } from "./osType";

export const execShell = (cmd: string) =>
  new Promise<string>((resolve, reject) => {
    shell.exec(cmd, (code, out, err) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });

export const execShellMultiplatform = (unixCMD: string, windowsCMD?: string) =>
  new Promise<string>((resolve, reject) => {
    let useWindows = isWindows();
    if (!windowsCMD) {
      windowsCMD = unixCMD;
    }
    let command = useWindows ? windowsCMD : unixCMD;
    shell.exec(command, (code, out, err) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });
