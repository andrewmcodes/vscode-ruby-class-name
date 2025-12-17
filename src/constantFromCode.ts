/**
 * Infer Ruby constant name from code content using regex
 *
 * Searches for top-level class or module definitions in the Ruby file
 *
 * @param content - File content to search
 * @returns Inferred constant name or undefined if not found
 *
 * @example
 * inferConstantFromCode('class Hub::ApiController\nend') // => 'Hub::ApiController'
 * inferConstantFromCode('module API\n  class Client\n  end\nend') // => 'API'
 */
export function inferConstantFromCode(content: string): string | undefined {
  // Regex to match top-level class or module definitions
  // Matches: class ClassName, module ModuleName, class Foo::Bar::Baz
  const pattern = /^\s*(class|module)\s+([A-Za-z0-9_:]+)/m;

  const match = pattern.exec(content);

  if (match && match[2]) {
    return match[2];
  }

  return undefined;
}

/**
 * Find all class/module definitions in the content
 * Useful for detecting multiple definitions or nested structures
 *
 * @param content - File content to search
 * @returns Array of constant names found
 */
export function findAllConstants(content: string): string[] {
  const pattern = /^\s*(class|module)\s+([A-Za-z0-9_:]+)/gm;
  const constants: string[] = [];

  let match;
  while ((match = pattern.exec(content)) !== null) {
    if (match[2]) {
      constants.push(match[2]);
    }
  }

  return constants;
}
