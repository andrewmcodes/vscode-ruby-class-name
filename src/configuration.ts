import * as vscode from "vscode";

export interface ExtensionConfig {
  rootPrefixes: string[];
  useCodeInference: boolean;
  acronyms: Record<string, string>;
  inferencePreference: "path" | "code";
}

/**
 * Get the extension configuration from VS Code settings
 */
export function getConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration("rubyClassName");

  return {
    rootPrefixes: config.get<string[]>("rootPrefixes", [
      "app/models",
      "app/controllers",
      "app/jobs",
      "app/services",
      "app/mailers",
      "app/workers",
      "app/channels",
      "app/serializers",
      "app/forms",
      "app/validators",
      "lib",
    ]),
    useCodeInference: config.get<boolean>("useCodeInference", false),
    acronyms: config.get<Record<string, string>>("acronyms", {}),
    inferencePreference: config.get<"path" | "code">("inferencePreference", "path"),
  };
}
