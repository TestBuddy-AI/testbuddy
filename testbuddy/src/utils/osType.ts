import { env } from "vscode";

export const isWindows = () => Boolean(env.appRoot && env.appRoot[0] !== "/");
