import * as path from "path";
import { ExtensionConfig } from "./configuration";

/**
 * Convert a snake_case segment to CamelCase, respecting acronym mappings
 */
function segmentToConstant(segment: string, acronyms: Record<string, string>): string {
  const parts = segment.split("_");

  return parts
    .map((part) => {
      // Check if we have an acronym mapping (case-insensitive)
      const lowerPart = part.toLowerCase();
      if (acronyms[lowerPart]) {
        return acronyms[lowerPart];
      }

      // Default: capitalize first letter
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

/**
 * Infer Ruby constant name from file path using Rails-style conventions
 *
 * @param fsPath - Absolute file path
 * @param workspaceRoot - Workspace root directory
 * @param config - Extension configuration
 * @returns Inferred constant name or undefined if unable to infer
 *
 * @example
 * inferConstantFromPath(
 *   '/project/app/controllers/hub/api_controller.rb',
 *   '/project',
 *   config
 * ) // => 'Hub::ApiController'
 */
export function inferConstantFromPath(
  fsPath: string,
  workspaceRoot: string,
  config: ExtensionConfig,
): string | undefined {
  // Guard: must be a Ruby file
  if (!fsPath.endsWith(".rb")) {
    return undefined;
  }

  // Compute relative path from workspace root
  const relativePath = path.relative(workspaceRoot, fsPath);

  // Normalize path separators to forward slashes
  const normalizedPath = relativePath.replace(/\\/g, "/");

  // Find the longest matching root prefix
  const sortedPrefixes = [...config.rootPrefixes].sort((a, b) => b.length - a.length);

  let strippedPath = normalizedPath;
  for (const prefix of sortedPrefixes) {
    // Check if path starts with this prefix
    if (normalizedPath === prefix || normalizedPath.startsWith(prefix + "/")) {
      // Strip the prefix and any leading slashes
      strippedPath = normalizedPath.slice(prefix.length).replace(/^\/+/, "");
      break;
    }
  }

  // Remove .rb extension
  const withoutExtension = strippedPath.replace(/\.rb$/, "");

  // If nothing left after stripping, return undefined
  if (!withoutExtension) {
    return undefined;
  }

  // Split into segments by directory separator
  const segments = withoutExtension.split("/");

  // Convert each segment from snake_case to CamelCase
  const constantSegments = segments.map((segment) => segmentToConstant(segment, config.acronyms));

  // Join with Ruby namespace separator
  return constantSegments.join("::");
}
