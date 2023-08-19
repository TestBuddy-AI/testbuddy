import * as shell from "shelljs";

export const execShell = (cmd: string) =>
  new Promise<string>((resolve, reject) => {
    shell.exec(cmd, (code, out, err) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });
