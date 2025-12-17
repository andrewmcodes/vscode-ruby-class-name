import * as vscode from "vscode";
import { getConfig } from "./configuration";
import { inferConstantFromPath } from "./constantFromPath";
import { inferConstantFromCode } from "./constantFromCode";

/**
 * Infer the Ruby constant name using configured strategies
 */
function inferConstant(document: vscode.TextDocument, workspaceRoot: string): string | undefined {
  const config = getConfig();

  // Always try path-based inference
  const pathConstant = inferConstantFromPath(document.uri.fsPath, workspaceRoot, config);

  // Try code-based inference if enabled
  let codeConstant: string | undefined;
  if (config.useCodeInference) {
    const content = document.getText();
    codeConstant = inferConstantFromCode(content);
  }

  // Decide which constant to use based on preference
  if (pathConstant && codeConstant) {
    // Both available - use preference
    if (config.inferencePreference === "code") {
      return codeConstant;
    }
    return pathConstant;
  }

  // Return whichever one is available
  return codeConstant || pathConstant;
}

/**
 * Command handler: Copy class name for active file
 */
async function copyClassNameForActiveFile(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  const document = editor.document;

  // Check if it's a Ruby file
  if (document.languageId !== "ruby" && !document.uri.fsPath.endsWith(".rb")) {
    vscode.window.showErrorMessage("Active file is not a Ruby file");
    return;
  }

  // Get workspace folder
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("File is not in a workspace folder");
    return;
  }

  // Infer the constant
  const constant = inferConstant(document, workspaceFolder.uri.fsPath);

  if (!constant) {
    vscode.window.showErrorMessage("Could not infer class name from file path");
    return;
  }

  // Copy to clipboard
  await vscode.env.clipboard.writeText(constant);

  // Show success message in status bar
  vscode.window.setStatusBarMessage(`Copied: ${constant}`, 3000);
}

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext): void {
  // Register the command
  const disposable = vscode.commands.registerCommand("rubyClassName.copyForActiveFile", copyClassNameForActiveFile);

  context.subscriptions.push(disposable);
}

/**
 * Extension deactivation
 */
export function deactivate(): void {
  // No cleanup needed
}
