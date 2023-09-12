import * as vscode from "vscode";

// Get the configuration with custom file name
const config = vscode.workspace.getConfiguration("myExtension");

// Access configuration values
const enableFeature = config.get("enableFeature");
const fontSize = config.get("fontSize");
