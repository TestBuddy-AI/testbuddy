import * as vscode from "vscode";

export const showError = (errorMessage: string) => {
  vscode.window.showErrorMessage(errorMessage, "Ok");
};

export const showMessage = (message: string) => {
  vscode.window.showInformationMessage(message, "Ok");
};
