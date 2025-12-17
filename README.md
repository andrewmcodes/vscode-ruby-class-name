# Ruby Class Name

A VS Code extension that copies Ruby class/module names from file paths using Rails-style conventions.

## Features

- **Quick class name copying**: Copy the inferred Ruby constant name for the active file to your clipboard
- **Rails conventions**: Automatically handles Rails directory structures (`app/models`, `app/controllers`, etc.)
- **Path-based inference**: Converts file paths to Ruby constant names following Rails naming conventions
- **Optional code-based inference**: Can parse Ruby files to find actual class/module definitions
- **Acronym support**: Configure custom acronym handling (e.g., `api_controller.rb` → `APIController`)
- **Configurable prefixes**: Customize which directory prefixes should be stripped

## Usage

### Command Palette

1. Open a Ruby file
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Ruby: Copy class name for active file"
4. The class name is copied to your clipboard

### Keyboard Shortcut

- **Mac**: `Cmd+Shift+C`
- **Windows/Linux**: `Ctrl+Shift+C`

The extension will show a notification with the copied constant name.

## Examples

Given these file paths:

| File Path                                       | Copied Constant               |
| ----------------------------------------------- | ----------------------------- |
| `app/controllers/hub/api_controller.rb`         | `Hub::ApiController`          |
| `app/models/user.rb`                            | `User`                        |
| `app/controllers/admin/users_controller.rb`     | `Admin::UsersController`      |
| `app/controllers/api/v1/accounts_controller.rb` | `Api::V1::AccountsController` |
| `app/models/hub/oauth_client.rb`                | `Hub::OauthClient`            |
| `lib/money/formatter.rb`                        | `Money::Formatter`            |
| `app/services/admin/user_sync/service.rb`       | `Admin::UserSync::Service`    |

## Configuration

### Root Prefixes

Configure which directory prefixes should be stripped when inferring class names:

```json
{
  "rubyClassName.rootPrefixes": [
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
    "lib"
  ]
}
```

### Acronyms

Map snake_case fragments to their preferred constant forms:

```json
{
  "rubyClassName.acronyms": {
    "api": "API",
    "oauth": "OAuth",
    "http": "HTTP",
    "url": "URL"
  }
}
```

With this configuration:

- `api_controller.rb` → `APIController` (instead of `ApiController`)
- `oauth_client.rb` → `OAuthClient` (instead of `OauthClient`)

### Code-Based Inference

Enable code-based inference to find actual class/module definitions:

```json
{
  "rubyClassName.useCodeInference": true,
  "rubyClassName.inferencePreference": "code"
}
```

When enabled, the extension will parse the Ruby file to find `class` or `module` definitions. The `inferencePreference` setting determines which method to prefer when both are available:

- `"path"` (default): Use path-based inference
- `"code"`: Use code-based inference (from actual class/module definitions)

## How It Works

### Path-Based Inference (Default)

1. Get the relative path from workspace root
2. Strip the configured root prefix (e.g., `app/controllers`)
3. Remove the `.rb` extension
4. Convert each path segment from snake_case to CamelCase
5. Join segments with `::`

Example: `app/controllers/hub/api_controller.rb` → `Hub::ApiController`

### Code-Based Inference (Optional)

When enabled, the extension searches for top-level `class` or `module` definitions using regex:

```ruby
class Hub::ApiController
  # ...
end
```

The extension extracts `Hub::ApiController` directly from the code.

## Requirements

- VS Code 1.85.0 or higher
- Ruby files (`.rb` extension)

## Installation

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
3. Search for "Ruby Class Name"
4. Click Install

Or install from the command line:

```bash
code --install-extension andrewmcodes.ruby-class-name
```

## Development

### Setup

```bash
# Using mise (recommended)
mise run install
mise run compile

# Or using pnpm directly
pnpm install
pnpm run compile

# Watch for changes
mise run watch
# Or: pnpm run watch
```

### Testing

See [TESTING.md](./TESTING.md) for comprehensive testing instructions, including:

- Testing in your local Ruby projects
- Testing custom configurations
- Running unit tests
- Debugging the extension

Quick test:

1. Open the extension directory in VS Code
2. Press F5 to open a new Extension Development Host window
3. Test the extension in the new window

### Running Tests

```bash
# Run unit tests
mise run test:unit
# Or: pnpm run test:unit

# Lint code
mise run lint
# Or: pnpm run lint

# Format code
mise run format
# Or: pnpm run format
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Changelog

### 0.1.0

- Initial release
- Path-based constant inference
- Optional code-based inference
- Configurable root prefixes and acronyms
- Keyboard shortcut support
